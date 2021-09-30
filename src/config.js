const env = process.env.NODE_ENV;
const defaultConfig = require('../config/default.json');
const envConfig = env ? require(`../config/${env}.json`) : {};

module.exports = {
	...defaultConfig,
	...envConfig,
};
