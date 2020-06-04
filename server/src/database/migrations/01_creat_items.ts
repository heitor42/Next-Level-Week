import Knex from 'knex';

export async function up(knex: Knex) {
    // Realisa as alterações necessaris no banco de dados
    // cria um novo campo na tabela

    // Cria tabela points
    return knex.schema.createTable("items", table => {
        table.increments('id').primary();
        table.string('img').notNullable();
        table.string('title').notNullable();
    });
}

export async function down(knex: Knex) {
    // faz o contrio da função up
    // deleta uma tabela

    // Dleta tabela points
    return knex.schema.dropTable('point');
}
