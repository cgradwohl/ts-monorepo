// import { createCdkStack, createComplianceTags } from '@services/cdk';
import { App } from 'aws-cdk-lib';
// import { MyCdkAppStack } from '../cdk/stacks/my-cdk-app';

const app = new App();

// const tags = {
//   'tags.courier.com/service': 'my-cdk-app',
//   ...createComplianceTags({
//     description: 'PLEASE WRITE A DESCRIPTION ...',
//   }),
// };

// createCdkStack(app, 'api', MyCdkAppStack, {
//   tags,
// });

app.synth();
