const routes = require('express').Router();
const carService = require('./car.service');

routes.get('/', carService.getCar);
routes.post('/', carService.createCar);
routes.put('/out/:plat', carService.outCar);

module.exports = routes;
