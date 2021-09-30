const config = require('../../knexfile');
const knex = require('knex')(config);
const slotConstant = require('./slot.constant');
const carConstant = require('../car/car.constant');

const createTransaction = () => {
	return new Promise((resolve, reject) => {
		knex.transaction()
			.then((trx) => resolve(trx))
			.catch((err) => reject(err))
	});
};

const createSlot = (data, trx) => {
	return new Promise((resolve, reject) => {
			knex(slotConstant.SLOT_TABLE)
				.transacting(trx)
				.insert(data)
				.returning('*')
				.then((data) => resolve(data[0]))
				.catch((err) => reject(err));
	});
};

const getSlot = (query = {}, limit = 1, offset = 0, orderBy = []) => {
	return new Promise((resolve, reject) => {
		knex(slotConstant.SLOT_TABLE)
			.select(
				`${slotConstant.SLOT_TABLE}.${slotConstant.ID_COLUMN}`,
				`${slotConstant.SLOT_TABLE}.${slotConstant.STATUS_COLUMN}`,
				`${slotConstant.SLOT_TABLE}.${slotConstant.CREATED_AT_COLUMN}`,
				`${slotConstant.SLOT_TABLE}.${slotConstant.UPDATED_AT_COLUMN}`,
				`${carConstant.CAR_TABLE}.${carConstant.ID_COLUMN}`,
				`${carConstant.CAR_TABLE}.${carConstant.PLAT_COLUMN}`,
				`${carConstant.CAR_TABLE}.${carConstant.COLOR_COLUMN}`,
			)
			.leftJoin(carConstant.CAR_TABLE, `${slotConstant.SLOT_TABLE}.${slotConstant.CAR_COLUMN}`, `${carConstant.CAR_TABLE}.${carConstant.ID_COLUMN}`)
			.where(query)
			.limit(limit)
			.offset(offset)
			.orderBy(orderBy)
			.then((data) => resolve(data))
			.catch((err) => reject(err));
	});
};

const updateSlot = (slotId, update, trx) => {
	return new Promise((resolve, reject) => {
		update.updated_at = knex.fn.now();
		knex(slotConstant.SLOT_TABLE)
			.transacting(trx)
			.where(slotConstant.ID_COLUMN, slotId)
			.update(update)
			.returning('*')
			.then((data) => {
				resolve(data[0]);
			})
			.catch((err) => {
				reject(err)
			})
	});
};

module.exports = {
	createTransaction,
	createSlot,
	getSlot,
	updateSlot,
};
