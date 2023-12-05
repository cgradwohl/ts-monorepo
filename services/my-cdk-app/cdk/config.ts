// import { getContext } from '@services/cdk';
import { Construct } from 'constructs';

type DeepPartial<T> = {
  [K in keyof T]?: DeepPartial<T[K]>;
};

type Config = {};

export const getConfig = (scope: Construct): Config => {
  // const context = getContext<DeepPartial<Config>>(scope);

  return {};
};
