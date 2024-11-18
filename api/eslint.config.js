// Import global variables and ESLint JavaScript plugin
import globals from "globals";
import pluginJs from "@eslint/js";

// Export the ESLint configuration
export default [
  // Base configuration
  {
    languageOptions: {
      // Set the JavaScript environment globals (e.g., Node.js)
      globals: globals.node, // Provides global variables for Node.js
      parserOptions: {
        ecmaVersion: "latest", // Use the latest ECMAScript version
        sourceType: "module", // Use ES modules
      },
    },
    rules: {
      // Example: Customize rules or override recommended settings
      "no-console": "warn", // Warn on console.log statements
      semi: ["error", "always"], // Enforce semicolons
      quotes: ["error", "double"], // Enforce double quotes
    },
  },

  // Include recommended rules from the @eslint/js plugin
  pluginJs.configs.recommended,
];
