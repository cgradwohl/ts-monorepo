/* eslint-disable @typescript-eslint/no-explicit-any */
export interface CdkEnvironment {
  accountId: string;
  stage: "dev" | "staging" | "production";
  regions: string[];
}

export interface CdkContextAppFile {
  appName: string;
  environments: Record<"dev" | "staging" | "production", any>;
}
export interface CdkContext extends CdkEnvironment {
  appName: string;
  [key: string]: any;
}
