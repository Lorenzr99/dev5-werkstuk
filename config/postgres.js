const dotenv = require('dotenv').config();
const dotenvExpand = require('dotenv-expand');
dotenvExpand(dotenv);

const pg = require('knex')({
    client: 'pg',
    connection: process.env.PG_CONNECTION_STRING,
    searchPath: ['knex', 'public'],
});

const dropTablesIfExists = async () => {
    await pg.schema.withSchema('public').dropTableIfExists('festivals');
    await pg.schema.withSchema('public').dropTableIfExists('requests');
    await pg.schema.withSchema('public').dropTableIfExists('users');
}

const schemaBuilder = async () => {
    await pg.schema.withSchema('public').createTable('users', table => {
        table.increments();
        table.string('username').notNullable();
        table.string('email').notNullable();
        table.string('password').notNullable();
        table.date('date_birth');
        table.timestamps();
    });

    const festivalsAndRequestsTable = table => {
        table.increments();
        table.string('name').unique().notNullable();
        table.date('date_begin').notNullable();
        table.date('date_end').notNullable();
        table.text('description');
        table.integer('user_id').unsigned().references('id').inTable('users');
        table.timestamps();
    }

    await pg.schema.withSchema('public').createTable('festivals', festivalsAndRequestsTable);
    await pg.schema.withSchema('public').createTable('requests', festivalsAndRequestsTable);
}

(async () => {
    await dropTablesIfExists();
    await schemaBuilder();
    console.log("Migrations executed");
})();

module.exports = { pg };