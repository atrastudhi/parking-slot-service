module.exports = {
	error: (message) => {
		console.error(`[${new Date().toString()}]: ${JSON.stringify(message)}`);
	},
};
