const { json } = require("express");

let common = {
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
  out_file: 'logs/out.log',
  // exec_mode: "cluster",
  // instances: 8,
  shutdown_with_message: true
};

let dev = common;
dev.name = "dev";

let prod = JSON.parse(JSON.stringify(common));
prod.name = "prod";
prod.exec_mode = "cluster";
prod.instances = 8;

module.exports = {
  apps: [dev, prod]
};
