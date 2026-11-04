// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    rules: {
      // Règle pensée pour le HTML ; sans objet en React Native (textes en français avec apostrophes).
      'react/no-unescaped-entities': 'off',
      // Faux positif : AndroidImportance est bien exporté (enum ré-exporté), vérifié par tsc.
      'import/namespace': 'off',
    },
  },
]);
