import { AssertionError } from "assert";
import { Stack } from "aws-cdk-lib";
import { Construct } from "constructs";

type CdkIdentifier = `${string}-${string}`;

function assertString(item: string, name: string): asserts item is string {
  const message = `The property '${name}' must be a valid string.`;
  if (typeof item !== "string") {
    throw new AssertionError({
      message,
      actual: item,
      expected: "string",
    });
  }

  if (!item.trim().length) {
    throw new AssertionError({
      message,
      actual: "",
      expected: "string",
    });
  }
}

export const createCdkIdentifier = (
  scope: Construct,
  id: string
): CdkIdentifier => {
  const stack = Stack.of(scope);
  const app = stack.stackName;

  assertString(app, "app");
  assertString(id, "id");
  return `${app}-${id}`;
};
