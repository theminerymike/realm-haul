import { withPolyfills, makeConfig } from "@haul-bundler/preset-0.60";

const removeRuleByTest = (moduleConfig, test) => {
  const index = moduleConfig.findIndex(rule => {
    if (rule.test) {
      return rule.test.toString() === test.toString();
    }
    return false;
  });
  moduleConfig.splice(index, 1);
};

export default makeConfig({
  bundles: {
    index: {
      entry: withPolyfills('./index'),
      transform({ config }) {
        config.resolve.alias = {
          ...config.resolve.alias,
          '@app': '/Users/mikeletellier/Documents/Git/hr4mobile/app',
          '@components': '/Users/mikeletellier/Documents/Git/hr4mobile/app/components',
          '@lang': '/Users/mikeletellier/Documents/Git/hr4mobile/app/lang',
          '@schema': '/Users/mikeletellier/Documents/Git/hr4mobile/app/realm',
          '@data': '/Users/mikeletellier/Documents/Git/hr4mobile/app/data',
          '@lib': '/Users/mikeletellier/Documents/Git/hr4mobile/app/lib',
          '@images': '/Users/mikeletellier/Documents/Git/hr4mobile/app/assets/images',
          '@common-styles': '/Users/mikeletellier/Documents/Git/hr4mobile/app/components/common-styles'
        }

        // Remove babel-loader, as it handles both .ts(x) and .js(x) files
//        removeRuleByTest(config.module.rules, /\.[jt]sx?$/);

        config.module.rules = [
          ...config.module.rules,
          {
            test: /\.tsx?$/,
            use: [
              {
                loader: 'babel-loader'
              },
              {
                loader: 'ts-loader'
              }
            ]
          },
        
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
      }
    },
  },
});