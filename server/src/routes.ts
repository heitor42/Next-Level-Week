import express from 'express';

import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';

const routes = express.Router();

const pointsController = new PointsController();
const itemsController = new ItemsController();

/**
 * Metodos padroes dos Controllers
 * Index: listagem
 * Show: esibir um unico registro
 * Create ou store:
 * Update
 * Delete ou destry
 */
routes.get('/items', itemsController.index);
routes.post('/points', pointsController.create);
routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);

export default routes;

/**
 * Possivel usar
 * Server Pattern
 * Repository Pattern ( data Mapper)
 */