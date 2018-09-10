import filesize from 'rollup-plugin-filesize'
import resolve from 'rollup-plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import cleanup from 'rollup-plugin-cleanup'
import commonjs from 'rollup-plugin-commonjs'

const tsConfigEs2015 = {
  tsconfigOverride: {
    compilerOptions: {
      target: 'es2015',
      downlevelIteration: false,
    },
  },
}

const tsConfigEsNext = {
  tsconfigOverride: {
    compilerOptions: {
      target: 'esnext',
      downlevelIteration: false,
    },
  },
}

const tsConfigDeclaration = {
  useTsconfigDeclarationDir: true,
  tsconfigOverride: {
    compilerOptions: {
      declarationDir: 'dist/types',
      declaration: true,
    },
  },
  include: ['src/**/*.ts'],
}

const filesizeConfig = { format: { round: 0 } }

export default [
  {
    input: 'src/index.node.ts',
    output: [
      {
        file: 'dist/mute-core.node.es5.cjs.js',
        format: 'cjs',
        sourcemap: true,
      },
    ],
    external: ['crypto'],
    plugins: [typescript(), resolve(), commonjs(), filesize(filesizeConfig), cleanup()],
  },
  {
    input: 'src/index.node.ts',
    output: {
      file: 'dist/mute-core.node.es5.esm.js',
      format: 'es',
      sourcemap: true,
    },
    external: ['crypto', 'rxjs', 'rxjs/operators'],
    plugins: [
      typescript(tsConfigDeclaration),
      resolve(),
      commonjs(),
      filesize(filesizeConfig),
      cleanup(),
    ],
  },
  {
    input: 'src/index.browser.ts',
    output: {
      file: 'dist/mute-core.browser.es5.esm.js',
      format: 'es',
      sourcemap: true,
    },
    external: ['rxjs', 'rxjs/operators'],
    plugins: [
      typescript(),
      resolve({ browser: true }),
      commonjs(),
      filesize(filesizeConfig),
      cleanup(),
    ],
  },
  {
    input: 'src/index.browser.ts',
    output: {
      file: 'dist/mute-core.browser.es2015.esm.js',
      format: 'es',
      sourcemap: true,
    },
    external: ['rxjs', 'rxjs/operators'],
    plugins: [
      typescript(tsConfigEs2015),
      resolve({ browser: true }),
      commonjs(),
      filesize(filesizeConfig),
      cleanup(),
    ],
  },
  {
    input: 'src/index.browser.ts',
    output: {
      file: 'dist/mute-core.browser.esnext.esm.js',
      format: 'es',
      sourcemap: true,
    },
    external: ['rxjs', 'rxjs/operators'],
    plugins: [
      typescript(tsConfigEsNext),
      resolve({ browser: true }),
      commonjs(),
      filesize(filesizeConfig),
      cleanup(),
    ],
  },
]
