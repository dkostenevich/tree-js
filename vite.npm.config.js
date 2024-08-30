// Config file for the npm build
/**
 * @type {import('vite').UserConfig}
 */
export default {
  build: {
    outDir: './build',
    lib: {
      entry: 'src/index.js', // Entry point of your library
      name: '@dkostenevich-tree-js', // Global variable name for your UMD build
      fileName: (format) => `@dkostenevich-tree-js.${format}.js`, // Output file name format
    },
    rollupOptions: {
      // Ensure to externalize dependencies you don't want to bundle into your library
      external: ['three'], // Add your dependencies here
      output: {
        globals: {
          three: 'THREE', // Global variable for externalized dependencies
        },
      },
    },
    sourcemap: 'true',
  }
};
