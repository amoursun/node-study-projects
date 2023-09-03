module.exports = {
    parser: 'vue-eslint-parser',
    root: true,
    env: {
      node: true,
    },
    extends: [
      'plugin:vue/vue3-recommended',
      'plugin:@typescript-eslint/recommended',
      'prettier',
      'plugin:prettier/recommended',
    ],
    parserOptions: {
      parser: '@typescript-eslint/parser', // Specifies the ESLint parser
      ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
      sourceType: 'module', // Allows for the use of imports
      ecmaFeatures: {
        jsx: true,
      },
    },
    rules: {
      'import/extensions': ['.ts', '.js', '.vue', '.json'],
      // allow optionalDependencies
      // 'import/no-extraneous-dependencies': [
      //   'error',
      //   {
      //     optionalDependencies: ['test/unit/index.js'],
      //     sourceType: 'module',
      //     allowImportExportEverywhere: true,
      //   },
      // ],
      'import/extensions': ['error', 'always', { ignorePackages: false }],
      'implicit-arrow-linebreak': ['error', 'beside'],
      'no-shadow': 0,
      // 禁止覆盖受限制的标识符
      'no-shadow-restricted-names': 2,
      // "no-shadow": ["error", { "allow": ["done"] }],
      'no-unused-expressions': [
        'off',
        { allowShortCircuit: true, allowTernary: true },
      ],
      // allow debugger during development
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      // https://eslint.org/docs/rules/arrow-parens
      'arrow-parens': ['warn', 'as-needed'],
      // https://eslint.org/docs/rules/arrow-body-style
      'arrow-body-style': ['off', 'as-needed'],
      // https://eslint.org/docs/rules/arrow-spacing
      'arrow-spacing': 'error',
      // https://eslint.org/docs/rules/class-methods-use-this
      'class-methods-use-this': ['off'],
      // https://eslint.org/docs/rules/no-param-reassign
      'no-param-reassign': ['off'],
      'no-mixed-operators': ['off', { allowSamePrecedence: false }],
      // https://eslint.org/docs/rules/no-console
      'no-console': ['warn', { allow: ['warn', 'error', 'log'] }],
      'prefer-template': 'off',
      'linebreak-style': [2, 'unix'],
  
      // vue lint
      // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/html-self-closing.md
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always',
            normal: 'never',
            component: 'never',
          },
          svg: 'any',
          math: 'always',
        },
      ],
      // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/max-attributes-per-line.md
      'vue/max-attributes-per-line': [
        0,
        {
          singleline: 2,
          multiline: {
            max: 1,
            allowFirstLine: true,
          },
        },
      ],
      'object-curly-newline': ['off'],
      'function-paren-newline': ['off'],
      camelcase: ['off'],
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    },
    overrides: [
      {
        files: [
          '**/__tests__/*.{j,t}s?(x)',
          '**/tests/unit/**/*.spec.{j,t}s?(x)',
        ],
        env: {
          mocha: true,
        },
      },
    ],
};
  