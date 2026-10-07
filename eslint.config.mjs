import tseslint from "typescript-eslint";
import obsidianmd from "eslint-plugin-obsidianmd";
export default tseslint.config(...obsidianmd.configs.recommended, { files: ["**/*.ts"], languageOptions: { parser: tseslint.parser, parserOptions: { project: "./tsconfig.json" } } });
