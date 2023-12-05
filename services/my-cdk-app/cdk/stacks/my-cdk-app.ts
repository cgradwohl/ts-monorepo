// import { createCdkIdentifier, getStageName } from '@services/cdk';
import { App, Stack, StackProps } from 'aws-cdk-lib';
import { getConfig } from '../config';

export class MyCdkAppStack extends Stack {
  constructor(app: App, id: string, props: StackProps) {
    super(app, id, props);
    const config = getConfig(this);
    // const stageName = getStageName();

    // const myConstructId = createCdkIdentifier(this, "myConstructId");
    // instantiate new constructs ...
  }
}
