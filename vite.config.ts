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
