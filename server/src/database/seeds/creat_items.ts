import Knex from 'knex';

export async function seed(knex: Knex) {
    await knex('items').insert([
        { title: 'Lâmpadas', img: 'lampadas.svg' },
        { title: 'Pilhas e Baterias', img: 'baterias.svg' },
        { title: 'Papéis e Papelões', img: 'papeis-papelao.svg' },
        { title: 'Resíduos Eletrônicos', img: 'eletronicos.svg' },
        { title: 'Resíduos Orgânicos', img: 'organicos.svg' },
        { title: 'Óleo de cosinha', img: 'oleo.svg' },
    ])
}