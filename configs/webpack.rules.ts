import type { ModuleOptions } from 'webpack';

import { isDevelopment } from './webpack.env';

export const rules: Required<ModuleOptions>['rules'] = [
  // Add support for native node modules
  {
    // We're specifying native_modules in the test because the asset relocator loader generates a
    // "fake" .node file which is really a cjs file.
    test: /native_modules[/\\].+\.node$/,
    use: 'node-loader',
  },
  {
    test: /[/\\]node_modules[/\\].+\.(m?js|node)$/,
    parser: { amd: false },
    use: {
      loader: '@vercel/webpack-asset-relocator-loader',
      options: {
        outputAssetBase: 'native_modules',
      },
    },
  },
  {
    test: /\.tsx?$/,
    exclude: /(node_modules|\.webpack)/,
    use: {
      loader: 'swc-loader',
      options: {
        module: {
          type: 'es6',
          ignoreDynamic: true,
        },
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true,
            dynamicImport: true,
            decorators: true,
          },
          target: 'es2022',
          loose: false,
          externalHelpers: true,
          transform: {
            legacyDecorator: true,
            react: {
              runtime: 'automatic',
              pragma: 'React.createElement',
              pragmaFrag: 'React.Fragment',
              throwIfNamespace: true,
              development: isDevelopment,
              useBuiltins: true,
              refresh: isDevelopment,
            },
          },
        },
      },
    },
  },
];
