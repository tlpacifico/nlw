import { Request, Response } from 'express';
import knex from '../database/connection';

class PointsController {

    async index (request: Request, response: Response) {
        const { city, uf, items } = request.query;
        const parsedItem = String(items)
            .split(',')
            .map(item => Number(item.trim()));

        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.pointId')
            .whereIn('point_items.itemId', parsedItem)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*')

            const serializedPoints = points.map(point => {
                return {
                    ...point,
                    image: `http://192.168.1.27:3333/uploads/${point.image}`
                }
            })
            return response.json(serializedPoints);
    }

    async create(request: Request, response: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body;
    
        const trx = await knex.transaction();
        const point = {
            image: request.file.filename,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        };
        
        const ids = await trx('points').insert(point);
    
        const pointItems = items
            .split(',')
            .map((item: string) => Number(item.trim()))
            .map((itemId: number) => {
            return {
                itemId,
                pointId: ids[0]
            }
    
        });
    
        await trx('point_items').insert(pointItems);

        await trx.commit();

        return response.json({
            ...point,
            id: ids[0]
        })
    }

    async show(request: Request, response: Response) {
        const { id } = request.params;

        const point = await knex('points').where('id', id).first();

        if(!point) {
            return response.status(400).json({message: 'Point not found' })
        }
        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.itemId')
            .where('point_items.pointId', id)
            .select('items.title');

       const searializedPoint = {
            ...point,
            image: `http://192.168.1.27:3333/uploads/${point.image}`
        }
        
        return response.json({point, items});
    }
}

export default PointsController;