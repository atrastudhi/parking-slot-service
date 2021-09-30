exports.up = function(knex) {
	return knex.schema
		.createTable('cars', (table) => {
			table
				.increments('car_id')
				.primary()
				.unsigned();
			table
				.string('plat', 10)
				.notNullable();
			table
				.string('color', 10)
				.notNullable();
			table
				.timestamp('created_at')
				.defaultTo(knex.fn.now())
    	table
				.timestamp('updated_at')
				.defaultTo(knex.fn.now())
	});
};
  
exports.down = function(knex) {
	return knex.schema.dropTable('cars');
};
  