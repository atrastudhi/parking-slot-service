const config = require('../../knexfile');
const knex = require('knex')(config);
const carConstant = require('./car.constant');

const createTransaction = () => {
	return new Promise((resolve, reject) => {
		knex.transaction()
			.then((trx) => resolve(trx))
			.catch((err) => reject(err))
	});
};

const getCars = (query, orderBy = [], limit = 1, offset = 0) => {
	return new Promise((resolve, reject) => {
		knex(carConstant.CAR_TABLE)
			.select()
			.where(query)
			.limit(limit)
			.offset(offset)
			.orderBy(orderBy)
			.then((data) => resolve(data))
			.catch((err) => reject(err));
	});
};

const createCar = (data, trx) => {
	return new Promise((resolve, reject) => {
		knex(carConstant.CAR_TABLE)
			.transacting(trx)
			.insert(data)
			.returning('*')
			.then((data) => resolve(data[0]))
			.catch((err) => reject(err));
	});
};

module.exports = {
	createTransaction,
	getCars,
	createCar,
};
