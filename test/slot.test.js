const chai = require('chai');
const chaiHttp = require('chai-http');
const config = require('../knexfile');
const knex = require('knex')(config);

const slotConstant = require('../src/slot/slot.constant');
const carConstant = require('../src/car/car.constant');
const http = require('../src/common/http');

chai.use(chaiHttp);

const server = require('../src/server');
const { expect } = require('chai');
const { request } = chai;

after(async () => {
  await knex
    .raw(`TRUNCATE TABLE ${slotConstant.SLOT_TABLE}, ${carConstant.CAR_TABLE} CASCADE`);
});

describe('Slot API Tests', () => {
  describe('POST /slot', () => {
    it('should return 201 when create slot', (done) => {
      request(server)
        .post('/slot')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(http.statusCode.CREATED);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property(slotConstant.ID_COLUMN);
          expect(res.body).to.have.property(slotConstant.STATUS_COLUMN);
          expect(res.body).to.have.property(slotConstant.CAR_COLUMN);
          expect(res.body.car_id).to.be.null;
          expect(res.body.status).to.have.equal(slotConstant.STATUS_DEACTICE);
          done();
        });
    });
  });

  describe('GET /slot', () => {
    it('should return 200 when get slot', (done) => {
      request(server)
        .get('/slot')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(http.statusCode.SUCCESS);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('total');
          expect(res.body).to.have.property('limit');
          expect(res.body).to.have.property('offset');
          expect(res.body).to.have.property('data');
          expect(res.body.total).to.has.equal(2);
          expect(res.body.data.length).to.has.equal(2);
          done();
        });
    });
  });
});
