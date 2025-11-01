import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest"
  ],
  "framework": {
    "name": "@storybook/react-vite",
    "options": {}
  },
  async viteFinal(config) {
    // Ensure React is in development mode for Storybook
    if (config.define) {
      config.define['process.env.NODE_ENV'] = JSON.stringify('development');
    } else {
      config.define = {
        'process.env.NODE_ENV': JSON.stringify('development'),
      };
    }
    return config;
  }
};
export default config;