const env = process.env.NODE_ENV || 'development';
const config = env === 'development' || env === 'test' ? require('./config.json') : null;

if (config) {
  const envConfig = config[env];

  Object.keys(envConfig).forEach(key => {
    process.env[key] = envConfig[key];
  });
}
