module.exports = {
  apps: [{
    name: 'app',
    script: 'app.js',
    watch: [
      'dist',
      'app.js',
      'scripts',
      'modules/index.js',
      'modules/*/index.js',
      'modules/*/reset.js'
    ],
    ignore_watch: [
      "dist/img"
    ],
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    },
    error_file: 'logs/err.log',
    out_file: 'logs/out.log'
  }]
};
