import { describe, it, expect } from 'vitest';
import { createStubBuilder } from '@/stub';
import { PluginProgress } from '@/plugins/progress';

describe('plugins/progress', () => {
  it('should register webpackbar by default', async () => {
    const builder = await createStubBuilder({
      plugins: [PluginProgress()],
    });

    const matched = await builder.matchWebpackPlugin('ProgressPlugin');
    expect(matched).toBeTruthy();
  });

  it('should not register webpackbar if dev.progressBar is false', async () => {
    const builder = await createStubBuilder({
      plugins: [PluginProgress()],
      builderConfig: {
        dev: {
          progressBar: false,
        },
      },
    });

    const matched = await builder.matchWebpackPlugin('ProgressPlugin');
    expect(matched).toBeFalsy();
  });
});
