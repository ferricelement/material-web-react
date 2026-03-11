import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      tsconfigPath: './tsconfig.json',
      rollupTypes: false,
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'components/button/index': resolve(__dirname, 'src/components/button/index.ts'),
        'components/text-field/index': resolve(__dirname, 'src/components/text-field/index.ts'),
        'components/checkbox/index': resolve(__dirname, 'src/components/checkbox/index.ts'),
        'components/radio/index': resolve(__dirname, 'src/components/radio/index.ts'),
        'components/switch/index': resolve(__dirname, 'src/components/switch/index.ts'),
        'components/select/index': resolve(__dirname, 'src/components/select/index.ts'),
        'components/card/index': resolve(__dirname, 'src/components/card/index.ts'),
        'components/dialog/index': resolve(__dirname, 'src/components/dialog/index.ts'),
        'components/snackbar/index': resolve(__dirname, 'src/components/snackbar/index.ts'),
        'components/icon/index': resolve(__dirname, 'src/components/icon/index.ts'),
        'components/icon-button/index': resolve(__dirname, 'src/components/icon-button/index.ts'),
        'components/fab/index': resolve(__dirname, 'src/components/fab/index.ts'),
        'components/chips/index': resolve(__dirname, 'src/components/chips/index.ts'),
        'components/menu/index': resolve(__dirname, 'src/components/menu/index.ts'),
        'components/tabs/index': resolve(__dirname, 'src/components/tabs/index.ts'),
        'components/progress/index': resolve(__dirname, 'src/components/progress/index.ts'),
        'components/list/index': resolve(__dirname, 'src/components/list/index.ts'),
        'components/slider/index': resolve(__dirname, 'src/components/slider/index.ts'),
        'components/divider/index': resolve(__dirname, 'src/components/divider/index.ts'),
        'components/ripple/index': resolve(__dirname, 'src/components/ripple/index.ts'),
        'components/elevation/index': resolve(__dirname, 'src/components/elevation/index.ts'),
        'components/focus-ring/index': resolve(__dirname, 'src/components/focus-ring/index.ts'),
        'components/badge/index': resolve(__dirname, 'src/components/badge/index.ts'),
        'components/segmented-button/index': resolve(__dirname, 'src/components/segmented-button/index.ts'),
        'components/navigation-bar/index': resolve(__dirname, 'src/components/navigation-bar/index.ts'),
        'components/tooltip/index': resolve(__dirname, 'src/components/tooltip/index.ts'),
        'components/top-app-bar/index': resolve(__dirname, 'src/components/top-app-bar/index.ts'),
        'components/bottom-app-bar/index': resolve(__dirname, 'src/components/bottom-app-bar/index.ts'),
        'components/navigation-rail/index': resolve(__dirname, 'src/components/navigation-rail/index.ts'),
        'components/search-bar/index': resolve(__dirname, 'src/components/search-bar/index.ts'),
        'components/navigation-drawer/index': resolve(__dirname, 'src/components/navigation-drawer/index.ts'),
        'components/bottom-sheet/index': resolve(__dirname, 'src/components/bottom-sheet/index.ts'),
        'theme/index': resolve(__dirname, 'src/theme/index.ts'),
      },
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
    sourcemap: true,
    minify: false,
    copyPublicDir: false,
  },
});
