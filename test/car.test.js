const chai = require('chai');
const chaiHttp = require('chai-http');
const config = require('../knexfile');
const knex = require('knex')(config);

const slotConstant = require('../src/slot/slot.constant');
const carConstant = require('../src/car/car.constant');
const http = require('../src/common/http');
const {
  CreateError,
  ERROR_CODE,
} = require('../src/common/error');

chai.use(chaiHttp);

const server = require('../src/server');
const { expect } = require('chai');
const { request } = chai;

let createdSlot;

before(async () => {
  const resp = await knex(slotConstant.SLOT_TABLE)
    .insert({
      status: slotConstant.STATUS_DEACTICE,
    })
    .returning('*');
  createdSlot = resp[0];
});

after(async () => {
  await knex
    .raw(`TRUNCATE TABLE ${slotConstant.SLOT_TABLE}, ${carConstant.CAR_TABLE} CASCADE`);
});

describe('Car API Tests', () => {
  const createdCar = {
    plat: 'B-999-ABC',
    color: 'RED',
  };

  describe('POST /car', () => {
    it('should return 201 when create/parking car', (done) => {
      request(server)
        .post('/car')
        .send(createdCar)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(http.statusCode.CREATED);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property(slotConstant.ID_COLUMN);
          expect(res.body).to.have.property(slotConstant.STATUS_COLUMN);
          expect(res.body).to.have.property(slotConstant.CAR_COLUMN);
          expect(res.body.car).to.deep.contains(createdCar);
          expect(res.body.id).to.have.equal(createdSlot.id);
          expect(res.body.status).to.have.equal(slotConstant.STATUS_ACTIVE);
          done();
        });
    });

    it('should return 400 when create/parking car because parking slot is full', (done) => {
      const carData = {
        plat: 'B-123-ABC',
        color: 'WHITE',
      };
      request(server)
        .post('/car')
        .send(carData)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(http.statusCode.BAD_REQUEST);
          expect(res.body).to.be.an('object');
          expect(res.body).to.deep.equal(CreateError(ERROR_CODE.PARKING_SLOT_FULL));
          done();
        });
    });

    it('should return 400 when create/parking car because plat no is required', (done) => {
      const carData = {
        color: 'WHITE',
      };
      request(server)
        .post('/car')
        .send(carData)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(http.statusCode.BAD_REQUEST);
          expect(res.body).to.be.an('object');
          expect(res.body).to.deep.equal(CreateError(ERROR_CODE.PLAT_NO_REQUIRED));
          done();
        });
    });

    it('should return 400 when create/parking car because color is required', (done) => {
      const carData = {
        plat: 'B-123-ABC',
      };
      request(server)
        .post('/car')
        .send(carData)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(http.statusCode.BAD_REQUEST);
          expect(res.body).to.be.an('object');
          expect(res.body).to.deep.equal(CreateError(ERROR_CODE.COLOR_REQUIRED));
          done();
        });
    });
  });

  describe('GET /car', () => {
    it('should return 200 when get car by color', (done) => {
      request(server)
        .get(`/car?color=${createdCar.color}`)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(http.statusCode.SUCCESS);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('total');
          expect(res.body).to.have.property('limit');
          expect(res.body).to.have.property('offset');
          expect(res.body.total).to.has.equal(1);
          expect(res.body.data.length).to.has.equal(1);
          expect(res.body.data[0]).to.deep.contains(createdCar);
          done();
        });
    });
    
    it('should return 200 when get car by plat', (done) => {
      request(server)
        .get(`/car?plat=${createdCar.plat}`)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(http.statusCode.SUCCESS);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('total');
          expect(res.body).to.have.property('limit');
          expect(res.body).to.have.property('offset');
          expect(res.body.total).to.has.equal(1);
          expect(res.body.data.length).to.has.equal(1);
          expect(res.body.data[0]).to.deep.contains(createdCar);
          done();
        });
    });

    it('should return 200 but empty when get car by invalid plat', (done) => {
      request(server)
        .get('/car?plat=B-888-WRG')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(http.statusCode.SUCCESS);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('total');
          expect(res.body).to.have.property('limit');
          expect(res.body).to.have.property('offset');
          expect(res.body.total).to.has.equal(0);
          expect(res.body.data.length).to.has.equal(0);
          done();
        });
    });

    it('should return 200 but empty when get car by invalid color', (done) => {
      request(server)
        .get('/car?color=PURPLE')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(http.statusCode.SUCCESS);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('total');
          expect(res.body).to.have.property('limit');
          expect(res.body).to.have.property('offset');
          expect(res.body.total).to.has.equal(0);
          expect(res.body.data.length).to.has.equal(0);
          done();
        });
    });
  });

  describe('PUT /car/out/:plat', () => {
    it('should return 200 when update/out car', (done) => {
      request(server)
        .put(`/car/out/${createdCar.plat}`)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(http.statusCode.SUCCESS);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property(slotConstant.ID_COLUMN);
          expect(res.body).to.have.property(slotConstant.STATUS_COLUMN);
          expect(res.body).to.have.property(slotConstant.CAR_COLUMN);
          expect(res.body.id).to.have.equal(createdSlot.id);
          expect(res.body.car_id).to.be.null;
          expect(res.body.status).to.have.equal(slotConstant.STATUS_DEACTICE);
          done();
        });
    });

    it('should return 404 when update/out car because car is not found', (done) => {
      request(server)
        .put('/car/out/AA-123-BB')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(http.statusCode.NOT_FOUND);
          expect(res.body).to.be.an('object');
          expect(res.body).to.deep.equal(CreateError(ERROR_CODE.PLAT_NOT_FOUND));
          done();
        });
    });
  });
});
