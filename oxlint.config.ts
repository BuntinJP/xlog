import { defineConfig } from 'oxlint';

export default defineConfig({
  plugins: ['typescript', 'unicorn', 'oxc', 'react', 'import', 'jsx-a11y', 'nextjs', 'promise'],
  categories: {
    correctness: 'error',
    suspicious: 'error',
    perf: 'warn',
  },
  options: {
    typeAware: true,
    denyWarnings: true,
    reportUnusedDisableDirectives: 'error',
  },
  rules: {
    'import/no-unassigned-import': 'error',
    'react/react-in-jsx-scope': 'off',
    'typescript/ban-ts-comment': 'error',
    'typescript/consistent-type-assertions': 'error',
    'typescript/no-explicit-any': 'error',
    'typescript/no-non-null-assertion': 'error',
  },
  env: {
    builtin: true,
  },
  settings: {
    react: {
      version: '19.2.8',
    },
  },
  ignorePatterns: ['node_modules/', 'dist/', '.next/', '.source/'],
});
