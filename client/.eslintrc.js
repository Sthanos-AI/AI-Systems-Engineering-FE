module.exports = {
  // Use the root directory as the base configuration scope
  root: true, 
  
  // Specifies the ESLint parser for TypeScript
  parser: '@typescript-eslint/parser', 
  
  // Define environment variables
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  
  // Define the files ESLint should ignore
  ignorePatterns: ['dist', 'node_modules', '*.js'],

  // Define global rules and extensions
  extends: [
    // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'plugin:@typescript-eslint/recommended', 
    
    // Uses eslint-config-airbnb for standard JS/React best practices
    'airbnb', 
    
    // Uses the recommended rules for React
    'plugin:react/recommended',
    
    // Extends the ESLint stylistic rules with Prettier, disabling conflicting rules
    'eslint-config-prettier', 
  ],
  
  // Add plugins for React, TypeScript, and React Hooks
  plugins: [
    'react', 
    'react-hooks', 
    '@typescript-eslint',
  ],

  // Override or add specific rules
  rules: {
    // Requires a file extension for imports (necessary for ESM)
    'import/extensions': ['error', 'ignorePackages', {
      js: 'never',
      jsx: 'never',
      ts: 'never',
      tsx: 'never',
    }],
    
    // Allows default exports (common in React for components)
    'import/prefer-default-export': 'off', 
    
    // Allow named exports in a single file
    'import/no-named-as-default': 'off', 

    // TypeScript handles prop-types checking
    'react/prop-types': 'off', 
    
    // Allow usage of JSX in files with .jsx or .tsx extension
    'react/jsx-filename-extension': ['warn', { extensions: ['.jsx', '.tsx'] }],
    
    // Relax destructuring requirement for arrow functions (often cleaner without it)
    'react/function-component-definition': ['error', {
      namedComponents: 'arrow-function',
      unnamedComponents: 'arrow-function',
    }],

    // ESLint-Airbnb default rules that conflict with common TS/React practices
    'no-shadow': 'off', // The TS one is better
    '@typescript-eslint/no-shadow': ['error'],

    // Allow usage of `any` only where necessary (a common trade-off)
    '@typescript-eslint/no-explicit-any': 'warn', 

    // Required by Airbnb, but often disabled for simplicity in smaller projects
    'no-param-reassign': ['error', { props: true, ignorePropertyModificationsFor: ['state'] }], 
    
    // Allows for non-default exports in files
    'import/prefer-default-export': 'off',
    
    // Allow required dependencies to be in the `devDependencies` for utility scripts
    'import/no-extraneous-dependencies': ['error', {
      devDependencies: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx', '**/setupTests.ts'],
    }],
  },
  
  // Settings specific to React configuration
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
    react: {
      version: 'detect', // Automatically detect the React version
    },
  },
};