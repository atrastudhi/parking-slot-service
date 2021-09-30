const carRepository = require('./car.repository');
const slotRepository = require('../slot/slot.repository');
const carConstant = require('./car.constant');
const slotConstant = require('../slot/slot.constant');
const http = require('../common/http');
const { 
	ERROR_CODE,
	CreateError,
} = require('../common/error');
const logger = require('../common/logger');

const getCar = async (req, res) => {
	const query = req.query;
	const limit = query.limit || 10;
	const offset = query.offset || 0;
	try {
		const cars = await carRepository.getCars(query, [], limit, offset);
		res.status(http.statusCode.SUCCESS).json({
			total: cars.length,
			limit,
			offset,
			data: cars,
		});
	} catch (err) {
		logger.error(err);
		res.status(http.statusCode.INTERNAL_SERVER_ERROR).json(CreateError(ERROR_CODE.INTERNAL_SERVER_ERROR));
	};
};

const createCar = async (req, res) => {
	const body = req.body;
	let trx;
	try {
		if (!body.plat) throw CreateError(ERROR_CODE.PLAT_NO_REQUIRED);
		if (!body.color) throw CreateError(ERROR_CODE.COLOR_REQUIRED);

		const [slot] = await slotRepository.getSlot({
			status: slotConstant.STATUS_DEACTICE,
		}, undefined, undefined, [{
			order: slotConstant.ORDER_ASC,
			column: slotConstant.ID_COLUMN,
		}]);
		if (!slot) throw CreateError(ERROR_CODE.PARKING_SLOT_FULL);

		trx = await carRepository.createTransaction();

		const car = await carRepository.createCar({
			plat: body.plat,
			color: body.color,
		}, trx);

		const updateSlot = await slotRepository.updateSlot(slot.id, {
			status: slotConstant.STATUS_ACTIVE,
			car_id: car.car_id,
		}, trx);
		updateSlot.car = car;

		trx.commit();
		res.status(http.statusCode.CREATED).json(updateSlot);
	} catch (err) {
		console.log(err)
		logger.error(err);
		if (trx) trx.rollback();
		if (err.statusCode && err.message) res.status(err.statusCode).json(err);
		else res.status(http.statusCode.INTERNAL_SERVER_ERROR).json(CreateError(ERROR_CODE.INTERNAL_SERVER_ERROR));
	};
};

const outCar = async (req, res) => {
	const params = req.params;
	let trx;
	try {
		if (!params.plat) throw CreateError(ERROR_CODE.PLAT_NO_REQUIRED);

		const [car] = await carRepository.getCars({
			plat: params.plat,
		}, [{
			order: carConstant.ORDER_DESC,
			column: carConstant.CREATED_AT_COLUMN
		}]);
		if (!car) throw CreateError(ERROR_CODE.PLAT_NOT_FOUND);

		const query = `${slotConstant.SLOT_TABLE}.${slotConstant.CAR_COLUMN}`;
		const [slot] = await slotRepository.getSlot({
			[query]: car.car_id,
		});
		if (!slot) throw CreateError(ERROR_CODE.PARKING_SLOT_NOT_FOUND);
		if (slot.status === slotConstant.STATUS_DEACTICE) CreateError(ERROR_CODE.INVALID_PARKING_SLOT_STATUS);

		trx = await carRepository.createTransaction();

		const updateSlot = await slotRepository.updateSlot(slot.id, {
			status: slotConstant.STATUS_DEACTICE,
			car_id: null,
		}, trx);
		updateSlot.car = car;

		trx.commit();
		res.status(http.statusCode.SUCCESS).json(updateSlot);
	} catch (err) {
		console.log(err)
		logger.error(err);
		if (trx) trx.rollback();
		if (err.statusCode && err.message) res.status(err.statusCode).json(err);
		else res.status(http.statusCode.INTERNAL_SERVER_ERROR).json(CreateError(ERROR_CODE.INTERNAL_SERVER_ERROR));
	}
};

module.exports = {
	getCar,
	createCar,
	outCar,
};
