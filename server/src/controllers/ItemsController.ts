import { Request, Response } from 'express';
import knex from '../database/connection';

class ItemsController {
    async index (request: Request, response: Response) {
        // SELECT * FROM items
        const items  = await knex('items').select('*');
    
        const serializedItems = items.map(item => {
            return {
                id: item.id,
                tilte: item.title,
                image_url: `http://localhost:3333/uploads/${item.img}`,
            }
        });
    
        return response.json(serializedItems)
    }
}

export default ItemsController;