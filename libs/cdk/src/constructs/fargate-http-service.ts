import { Duration, RemovalPolicy, Fn } from "aws-cdk-lib";
import {
  AdjustmentType,
  ScalingInterval,
} from "aws-cdk-lib/aws-applicationautoscaling";
import { IVpc } from "aws-cdk-lib/aws-ec2";
import { Platform } from "aws-cdk-lib/aws-ecr-assets";
import {
  Cluster,
  ContainerImage,
  CpuArchitecture,
  LogDriver,
  OperatingSystemFamily,
  DeploymentControllerType,
} from "aws-cdk-lib/aws-ecs";
import { ApplicationLoadBalancedFargateService } from "aws-cdk-lib/aws-ecs-patterns";
import { IRole } from "aws-cdk-lib/aws-iam";
import { LogGroup } from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";
import { createCdkIdentifier } from "../lib/create-cdk-identifier";

export interface HttpApiDockerProps {
  imagePath: string;
}

export interface HttpApiFargateProps {
  autoscaling: {
    minCapacity: number;
    maxCapacity: number;
    cpu: {
      scalingSteps: ScalingInterval[];
    };
    memory: {
      scalingSteps: ScalingInterval[];
    };
  };
  cpu: number;
  memoryLimit: number;
}

export interface HttpApiLogProps {
  retentionDays: number;
  retentionPolicy: RemovalPolicy;
}

export interface HttpApiProps {
  /**
   * The Docker configuration for the Http API. This, currently, only
   * allows for configuration of the Docker image path.
   */
  docker: HttpApiDockerProps;
  /**
   * The Fargate configuration for the Http API. This allows for configuration
   * of autoscaling, cluster capacity, cpu, and memory.
   */
  fargate: HttpApiFargateProps;
  /**
   * The log configuration for the Http API. This allows for configuration of
   * log retention and log removal policy.
   */
  logs: HttpApiLogProps;
  /**
   * The stage for the Http API. This is used to set the NODE_ENV and STAGE
   * environment variables for the Http API.
   */
  stageName: string;
  /**
   * The VPC to use for the Http API. If not provided, the default VPC will be used.
   */
  vpc: IVpc;
}

const createIdentifier = (scope: Construct, id: string) =>
  createCdkIdentifier(scope, `HttpApi-${id}`);

export class FargateHttpService extends Construct {
  public readonly loadBalancerDnsName: string;
  public readonly taskRole: IRole;

  constructor(scope: Construct, id: string, props: HttpApiProps) {
    super(scope, id);

    const logGroupId = createIdentifier(this, "LogGroup");
    const logGroup = new LogGroup(this, logGroupId, {
      logGroupName: `/courier/fargate/${logGroupId}`,
      retention: props.logs.retentionDays,
      removalPolicy: props.logs.retentionPolicy,
    });

    /**
     * Create the cluster for the fargate service. This is where the fargate
     * service will be deployed.
     */
    const clusterId = createIdentifier(this, "Cluster");
    const cluster = new Cluster(this, clusterId, {
      vpc: props.vpc,
    });

    const fargateId = createIdentifier(this, "Fargate");
    const loadBalancerId = createIdentifier(this, "alb");
    const fargate = new ApplicationLoadBalancedFargateService(this, fargateId, {
      assignPublicIp: true,
      cluster,
      cpu: props.fargate.cpu,
      desiredCount: 1,
      healthCheckGracePeriod: Duration.seconds(30),
      idleTimeout: Duration.seconds(60),
      loadBalancerName: loadBalancerId,
      memoryLimitMiB: props.fargate.memoryLimit,
      publicLoadBalancer: true,
      runtimePlatform: {
        cpuArchitecture: CpuArchitecture.X86_64,
        operatingSystemFamily: OperatingSystemFamily.LINUX,
      },
      deploymentController: {
        type: DeploymentControllerType.ECS,
      },
      circuitBreaker: {
        rollback: true,
      },
      maxHealthyPercent: 200,
      minHealthyPercent: 100,
      taskImageOptions: {
        containerPort: 8080,
        environment: {
          NODE_ENV: props.stageName === "dev" ? "development" : props.stageName,
          STAGE: props.stageName,
          WORKSPACE_GATEWAY_URL: Fn.importValue(
            `workspace-${props.stageName}-httpApi-ApiGatewayUrlExport`
          ),
        },
        logDriver: LogDriver.awsLogs({
          streamPrefix: "httpApi",
          logGroup,
        }),
        image: ContainerImage.fromAsset(props.docker.imagePath, {
          platform: Platform.LINUX_AMD64,
        }),
      },
    });

    /**
     * Configure the health check for the target group. This is required for
     * the load balancer to know if the service is healthy or not. The health
     * check path is the same as the health check path in the express app.
     */
    fargate.targetGroup.configureHealthCheck({
      enabled: true,
      path: "/healthz",
      healthyHttpCodes: "204",
      interval: Duration.seconds(15),
      timeout: Duration.seconds(5),
    });

    fargate.targetGroup.setAttribute(
      "deregistration_delay.timeout_seconds",
      "30"
    );

    /**
     * Configure autoscaling for the fargate service. This allows for
     * configuration of autoscaling based on cpu and memory utilization.
     * The scaling steps are configured in the cdk.json file.
     */
    const autoScalingPolicy = fargate.service.autoScaleTaskCount({
      minCapacity: props.fargate.autoscaling.minCapacity,
      maxCapacity: props.fargate.autoscaling.maxCapacity,
    });

    const cpuUtilization = fargate.service.metricCpuUtilization();
    const memoryUtilization = fargate.service.metricMemoryUtilization();

    const cpuAutoscalingId = createIdentifier(this, "CpuAutoScaling");
    autoScalingPolicy.scaleOnMetric(cpuAutoscalingId, {
      adjustmentType: AdjustmentType.CHANGE_IN_CAPACITY,
      metric: cpuUtilization,
      scalingSteps: props.fargate.autoscaling.cpu.scalingSteps,
    });

    const memoryAutoscalingId = createIdentifier(this, "MemoryAutoScaling");
    autoScalingPolicy.scaleOnMetric(memoryAutoscalingId, {
      adjustmentType: AdjustmentType.PERCENT_CHANGE_IN_CAPACITY,
      metric: memoryUtilization,
      scalingSteps: props.fargate.autoscaling.memory.scalingSteps,
    });

    // apiSigningSecret.secret.grantRead(httpApi.service.taskDefinition.taskRole);

    this.loadBalancerDnsName = fargate.loadBalancer.loadBalancerDnsName;
    this.taskRole = fargate.service.taskDefinition.taskRole;
  }
}
