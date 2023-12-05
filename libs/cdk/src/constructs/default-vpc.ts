import { IVpc, Vpc } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

export class DefaultVpc extends Construct {
  public readonly vpc: IVpc;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.vpc = Vpc.fromLookup(scope, "Vpc", {
      isDefault: true,
    });
  }
}
