import resolve from '@rollup/plugin-node-resolve';
import commonJs from '@rollup/plugin-commonjs';
import postCss from 'rollup-plugin-postcss';
import babel from '@rollup/plugin-babel';
import { terser } from "rollup-plugin-terser";
import dts from 'rollup-plugin-dts';

import pkg from './package.json' assert { type: 'json' };
const { name, homepage, version, dependencies } = pkg;

const umdConf = {
  globals: { three: 'THREE' }, // a-frame exposes three as global
  strict: false, // a-frame 0.7 not 'strict' compatible
  format: 'umd',
  name: 'ForceGraphVR',
  banner: `// Version ${version} ${name} - ${homepage}`
};

export default [
  {
    external: ['three'],
    input: 'src/index.js',
    output: [
      {
        ...umdConf,
        file: `dist/${name}.js`,
        sourcemap: true
      },
      { // minify
        ...umdConf,
        file: `dist/${name}.min.js`,
        plugins: [terser({
          output: { comments: '/Version/' }
        })]
      }
    ],
    plugins: [
      postCss(),
      babel({ exclude: 'node_modules/**' }),
      resolve(),
      commonJs()
    ]
  },
  { // commonJs and ES modules
    input: 'src/index.js',
    output: [
      {
        format: 'cjs',
        file: `dist/${name}.common.js`,
        exports: 'auto'
      },
      {
        format: 'es',
        file: `dist/${name}.module.js`
      }
    ],
    external: Object.keys(dependencies),
    plugins: [
      postCss(),
      babel()
    ]
  },
  { // expose TS declarations
    input: 'src/index.d.ts',
    output: [{
      file: `dist/${name}.d.ts`,
      format: 'es'
    }],
    plugins: [dts()]
  }
];