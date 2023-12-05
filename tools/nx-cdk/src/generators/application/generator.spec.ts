import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration } from '@nrwl/devkit';

import generator from './generator';
import { ApplicationGeneratorSchema } from './schema';

describe('application generator', () => {
  let appTree: Tree;

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    const options: ApplicationGeneratorSchema = { name: 'test' };
    await generator(appTree, options);
    const config = readProjectConfiguration(appTree, 'test');
    expect(config).toBeDefined();
  });

  it('should use respect className as CamelCase and fileName as snake-case', async () => {
    const options: ApplicationGeneratorSchema = {
      name: 'MyTest',
    };

    await generator(appTree, options);
    const config = readProjectConfiguration(appTree, 'my-test');
    expect(config).toBeDefined();
  });
});
