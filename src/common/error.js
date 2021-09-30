const http = require('./http');

const ERROR_CODE = {
	COLOR_REQUIRED: 'COLOR_REQUIRED',
	PLAT_NO_REQUIRED: 'PLAT_NO_REQUIRED',
	PARKING_SLOT_FULL: 'PARKING_SLOT_FULL',
	PLAT_NOT_FOUND: 'PLAT_NOT_FOUND',
	PARKING_SLOT_NOT_FOUND: 'PARKING_SLOT_NOT_FOUND',
	INVALID_PARKING_SLOT_STATUS: 'INVALID_PARKING_SLOT_STATUS',
	INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
};

const ERROR_RESPONSE = {
	[ERROR_CODE.COLOR_REQUIRED]: {
		statusCode: http.statusCode.BAD_REQUEST,
		message: 'Color is Required',
	},
	[ERROR_CODE.PLAT_NO_REQUIRED]: {
		statusCode: http.statusCode.BAD_REQUEST,
		message: 'Plat Number is Required',
	},
	[ERROR_CODE.PARKING_SLOT_FULL]: {
		statusCode: http.statusCode.BAD_REQUEST,
		message: 'Parking Slot is Full',
	},
	[ERROR_CODE.PLAT_NOT_FOUND]: {
		statusCode: http.statusCode.NOT_FOUND,
		message: 'Plat Not Found',
	},
	[ERROR_CODE.PARKING_SLOT_NOT_FOUND]: {
		statusCode: http.statusCode.NOT_FOUND,
		message: 'Parking Slot Not Found',
	},
	[ERROR_CODE.INVALID_PARKING_SLOT_STATUS]: {
		statusCode: http.statusCode.BAD_REQUEST,
		message: 'Invalid Parking Slot Status',
	},
	[ERROR_CODE.INTERNAL_SERVER_ERROR]: {
		statusCode: http.statusCode.INTERNAL_SERVER_ERROR,
		message: 'Internal Server Error',
	},
};

CreateError = (CODE) => ERROR_RESPONSE[CODE];

module.exports = {
	ERROR_CODE,
	CreateError,
}
