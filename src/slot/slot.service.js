const slotRepository = require('./slot.repository');
const http = require('../common/http');
const {
	ERROR_CODE,
	CreateError,
} = require('../common/error');
const slotConstant = require('./slot.constant');
const carConstant = require('../car/car.constant');
const logger = require('../common/logger');

const getSlots = async (req, res) => {
	const query = req.query;
	if (query.car_color) {
		query[`${carConstant.CAR_TABLE}.${carConstant.COLOR_COLUMN}`] = query.car_color;
		delete query.car_color;
	}
	if (query.car_plat) {
		query[`${carConstant.CAR_TABLE}.${carConstant.PLAT_COLUMN}`] = query.car_plat;
		delete query.car_plat;
	}
	const limit = query.limit || 10;
	const offset = query.offset || 0;
	try {
		const slots = await slotRepository.getSlot(query, limit, offset);
		res.status(http.statusCode.SUCCESS).json({
			total: slots.length,
			limit,
			offset,
			data: slots,
		});
	} catch (err) {
		logger.error(err);
		res.status(http.statusCode.INTERNAL_SERVER_ERROR).json(CreateError(ERROR_CODE.INTERNAL_SERVER_ERROR));
	};
};

const createSlot = async (req, res) => {
	let trx;
	try {
		trx = await slotRepository.createTransaction();
		const resp = await slotRepository.createSlot({
			status: slotConstant.STATUS_DEACTICE,
		}, trx);
		trx.commit();
		res.status(http.statusCode.CREATED).json(resp);
	} catch (err) {
		logger.error(err);
		if (trx) trx.rollback();
		res.status(http.statusCode.INTERNAL_SERVER_ERROR).json(CreateError(ERROR_CODE.INTERNAL_SERVER_ERROR));
	};
};

module.exports = {
	getSlots,
	createSlot,
};
