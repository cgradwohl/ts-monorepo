import { Construct } from "constructs";
import { getStageName } from "../get-stage-name";

export const getContext = <T = unknown>(scope: Construct): T | undefined => {
  const stage = getStageName();
  const context = scope.node.tryGetContext(stage);
  return context as T;
};
