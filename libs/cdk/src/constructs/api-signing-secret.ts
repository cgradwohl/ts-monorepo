import { IGrantable } from "aws-cdk-lib/aws-iam";
import { ISecret, Secret } from "aws-cdk-lib/aws-secretsmanager";
import { Construct } from "constructs";
import { getStageName } from "../lib/get-stage-name";

export class ApiSigningSecret extends Construct {
  protected readonly secret: ISecret;

  constructor(scope: Construct, id: string) {
    super(scope, id);
    const stageName = getStageName();

    const secretName = `courier/${stageName}/config/signing-secret`;
    const secret = Secret.fromSecretNameV2(
      this,
      "ApiSigningSecret",
      secretName
    );

    this.secret = secret;
  }

  public grantRead(grantee: IGrantable, versionStages?: string[] | undefined) {
    this.secret.grantRead(grantee, versionStages);
  }
}
