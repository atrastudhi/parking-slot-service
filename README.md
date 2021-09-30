# ms-parking-slot

## Environment variables to be passed (REQUIRED)

```
PG_PASSWORD
```
env above will set automaticaly after run `setup.sh` or run test. for details please check `bin/setup.sh` and `package.json`.

## Version specification
- node: v14.9.0

## Dev setup
For development setup run `setup.sh` on `/bin`. This bash will set env variable (default), docker compose setup (see the detail docker compose setup on the `docker-compose.yml` file), package installment, migration & seeds, run coverage test, and running app `npm run start`.  
  
  
Or run it separately :
- To build docker image only : `docker build -t ${your image name} .`
- Install all the dependencies using `npm install`
- Migrate database & seeds `npm run migrate:up && npm run seed:run`
- To run the server with watch use `npm run dev:watch`
- To run the test cases with coverage `npm run test:cov`
- To run docker compose `docker-compose up -d`

## Test

- Unit Test: We are using Mocha, Chai, and Nyc

## Vault keys used by ms-parking-lot
- PG_PASSWORD

## Example Request
if application running well, you can try with this example request :
```
curl --location --request GET 'localhost:8080/slot' \
--data-raw ''
```
notes: make sure application running on local on port 8080 (default)
