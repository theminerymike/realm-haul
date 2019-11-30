import { withPolyfills, makeConfig } from "@haul-bundler/preset-0.60";

export default makeConfig({
  bundles: {
    index: {
      entry: withPolyfills('./index'),
      transform({ config }) {

        // Remove babel-loader, as it handles both .ts(x) and .js(x) files
        removeRuleByTest(config.module.rules, /\.[jt]sx?$/);

        config.module.rules = [
          {
            test: /\.tsx?$/,
            loader: 'ts-loader',
          },
          ...config.module.rules,

          // Re-add the babel-loader, now only for .js(x)
          {
            test: /\.jsx?$/,
            loader: require.resolve('babel-loader'),
            options: {
              plugins: [
                require.resolve(
                  '@haul-bundler/core/build/utils/fixRequireIssues',
                ),
              ],
            },
          },
        ];
      },
    },
  },
});