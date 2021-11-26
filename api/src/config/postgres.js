/**
 * Establish connection with the database.
 */

const pg = require('knex')({
    client: 'pg',
    connection: process.env.PG_CONNECTION_STRING ? process.env.PG_CONNECTION_STRING : "postgres://test:test@localhost:5432/festivalwijzer",
    searchPath: ['knex', 'public'],
});

/**
 * Checks if the tables already exist, if not creates them and adds all necessary columns.
 */

const schemaBuilder = async () => {
    await pg.schema.hasTable('users').then(async (exists) => {
        if (!exists) {
            return await pg.schema.withSchema('public').createTable('users', table => {
                table.increments();
                table.string('username').notNullable();
                table.string('email').notNullable();
                table.string('password').notNullable();
                table.date('date_birth');
                table.timestamps();
            });
        }
    })

    const festivalsAndRequestsTable = table => {
        table.increments();
        table.string('name').unique().notNullable();
        table.date('date_begin').notNullable();
        table.date('date_end').notNullable();
        table.text('description');
        table.integer('user_id').unsigned().references('id').inTable('users');
        table.timestamps();
    }

    await pg.schema.hasTable('festivals').then(async (exists) => {
        if (!exists) {
            return await pg.schema.withSchema('public').createTable('festivals', festivalsAndRequestsTable);
        }
    });

    await pg.schema.hasTable('requests').then(async (exists) => {
        if (!exists) {
            return await pg.schema.withSchema('public').createTable('requests', festivalsAndRequestsTable);
        }
    });
}

(async () => {
    console.log("Building schema now")
    await schemaBuilder();
    console.log("Migrations executed");
})();

module.exports = {
    pg
};