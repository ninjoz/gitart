import babel from 'rollup-plugin-babel';

export default {
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
  ],
  entry: 'src/node.js',
  format: 'umd',
  moduleName: 'h'
};
