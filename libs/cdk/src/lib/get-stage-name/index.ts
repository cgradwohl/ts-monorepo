export enum Stages {
  Development = "dev",
  Production = "production",
  Staging = "staging",
}

export const getStageName = () => process.env.STAGE ?? Stages.Development;
