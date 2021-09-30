exports.up = function(knex) {
	return knex.schema
		.createTable('slots', (table) => {
			table
				.increments('id')
				.primary()
				.unsigned();
			table.string('status', 9).notNullable();
			table
				.integer('car_id')
				.references('car_id')
				.inTable('cars')
				.onDelete('SET NULL');
			table
				.timestamp('created_at')
				.defaultTo(knex.fn.now())
			table
				.timestamp('updated_at')
				.defaultTo(knex.fn.now())
		});
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('slots');
  };
  