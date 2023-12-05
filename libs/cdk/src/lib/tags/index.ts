import { Stages, getStageName } from "../get-stage-name";

type CreateResourceTagsOpts = {
  owner?: string;
  nonProd?: boolean;
  description: string;
  containsUserData?: boolean;
};

type Tags = Record<string, string>;

const DEFAULT_OWNER = "seth@courier.com";

export const createComplianceTags = (opts: CreateResourceTagsOpts): Tags => {
  const stageName = getStageName();

  return {
    VantaContainsUserData: `${opts.containsUserData ?? false}`,
    VantaDescription: opts.description,
    VantaNonProd: `${opts.nonProd ?? stageName !== Stages.Production}`,
    VantaOwner: opts.owner ?? DEFAULT_OWNER,
  };
};
