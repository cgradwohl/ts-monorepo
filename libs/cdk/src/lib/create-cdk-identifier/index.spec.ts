/* eslint-disable @typescript-eslint/no-explicit-any */
import { createCdkIdentifier } from "../create-cdk-identifier";
import { App, Stack } from "aws-cdk-lib";

describe("createCdkIdentifier", () => {
  const stackName = "stack";
  const resourceName = "resource";
  let identifier: string;

  beforeEach(() => {
    const app = new App();
    const scope = new Stack(app, stackName);
    identifier = createCdkIdentifier(scope, resourceName);
  });

  it("should set the stack name as the first segment of the identifier", () => {
    expect(identifier.split("-")[0]).toBe(stackName);
  });

  it("should set the resource name as the third segment of the identifier", () => {
    expect(identifier.split("-")[1]).toBe(resourceName);
  });
});
