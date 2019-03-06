const { sass } = require('@stencil/sass');

exports.config = {
  namespace: 'data-store',
  globalStyle: 'src/global/index.scss',
  globalScript: 'src/global/global.ts',
  plugins: [
    sass({
        includePaths: ['./node_modules']
      }),
  ],
  outputTargets:[
    { type: 'dist' },
    { type: 'docs' },
    {
      type: 'www',
      serviceWorker: null // disable service workers
    }
  ]
};
