import { App, Stack, StackProps } from "aws-cdk-lib";
import { getStageName } from "../get-stage-name";

type CdkStack = new (scope: App, id: string, props: StackProps) => Stack;

type CreateCdkStack = (
  app: App,
  stackName: string,
  stack: CdkStack,
  props?: StackProps
) => Stack;

const account = process.env.CDK_DEFAULT_ACCOUNT;
const region = process.env.CDK_DEFAULT_REGION ?? "us-east-1";
const stageName = getStageName();

const createCdkStack: CreateCdkStack = (app, stackName, stack, props) => {
  const id = `${stackName}-${stageName}`;

  const tags: StackProps["tags"] = {
    ...(props?.tags ?? {}),
    Stage: stageName,
  };

  return new stack(app, id, {
    ...props,
    env: { account, region },
    tags,
    terminationProtection: props?.terminationProtection ?? true,
  });
};

export { createCdkStack };
