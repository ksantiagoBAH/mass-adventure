import js from '@eslint/js';
import ts from 'typescript-eslint';
import globals from 'globals';
export default ts.config({ ignores: ['apps/**','node_modules/**','dist/**','site-dist/**'] }, js.configs.recommended, ...ts.configs.recommended, { languageOptions: { globals: { ...globals.browser, ...globals.node } }, rules: { '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], '@typescript-eslint/no-explicit-any': 'warn' } });
