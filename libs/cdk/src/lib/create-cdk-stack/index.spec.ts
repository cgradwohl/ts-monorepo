import { App, Stack, RemovalPolicy, StackProps } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import {
  BlockPublicAccess,
  Bucket,
  BucketEncryption,
} from "aws-cdk-lib/aws-s3";
import { createCdkStack } from "../create-cdk-stack";

describe("createCdkStack", () => {
  it("should return a new stack", () => {
    const app = new App();

    class MockStack extends Stack {
      constructor(app: App, id: string, props: StackProps) {
        super(app, id, props);

        new Bucket(this, "MockBucket", {
          blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
          encryption: BucketEncryption.S3_MANAGED,
          enforceSSL: true,
          versioned: true,
          removalPolicy: RemovalPolicy.RETAIN,
        });
      }
    }

    const stack = createCdkStack(app, "MainStack", MockStack);
    const template = Template.fromStack(stack);

    template.hasResourceProperties("AWS::S3::Bucket", {
      BucketEncryption: {
        ServerSideEncryptionConfiguration: [
          {
            ServerSideEncryptionByDefault: {
              SSEAlgorithm: "AES256",
            },
          },
        ],
      },
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: true,
        BlockPublicPolicy: true,
        IgnorePublicAcls: true,
        RestrictPublicBuckets: true,
      },
      VersioningConfiguration: {
        Status: "Enabled",
      },
    });
    expect(template.toJSON()).toMatchSnapshot();
  });
});
