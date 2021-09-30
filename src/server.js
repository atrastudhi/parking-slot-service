const express = require('express');
const cors = require('cors');

const car = require('./car/car.controller');
const slot = require('./slot/slot.controller');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/car', car);
app.use('/slot', slot);

app.listen(PORT, () => {
	console.log(`server start on port : ${PORT}`)
});

module.exports = app;