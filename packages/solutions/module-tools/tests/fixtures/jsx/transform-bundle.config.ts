import { defineConfig } from '@modern-js/self/defineConfig';

export default defineConfig({
  buildConfig: {
    buildType: 'bundle',
    jsx: 'transform',
    outDir: './dist/transform/bundle',
  },
});
