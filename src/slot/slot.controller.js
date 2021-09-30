const routes = require('express').Router();
const slotService = require('./slot.service');

routes.get('/', slotService.getSlots);
routes.post('/', slotService.createSlot);

module.exports = routes;
