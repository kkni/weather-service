import { Router, Request, Response, NextFunction } from 'express';
import { getCache, setCache } from "../CacheConnector"
import { catchAsync, validateRequestQuery } from '../util/utils';
import { z } from 'zod';
import apiClient from '../util/api.client';
import { HttpStatus } from 'http-status';
import { HttpStatusCode } from 'axios';

const router = Router();

const squadScheme = z.object({
    city: z.string().min(1, { message: 'city is required' }),
    country: z.string().min(1, { message: 'country is required' }),
    today: z.string().min(1, { message: 'today is required' }),
});

router.get('/', (req, res) => {
    res.status(HttpStatusCode.Ok).json("OK")
})

router.get('/by-city',  /*validateRequestQuery(squadScheme), */async (req: Request, res: Response) => {

    const { country, city, today } = req.query;

    const key = `weather:${country}:${city}`
    const isCache = await getCache(key)

    if (isCache) {
        res.status(HttpStatusCode.Ok).send(isCache)
    } else {
        const date = new Date();
        const formattedDate = today ? today : date.toISOString().split("T")[0];
        const result = await apiClient.get(`/timeline/${country},${city}/${formattedDate}/${formattedDate}`)
        if(result.data){
            res.status(HttpStatusCode.Ok).send(result.data)
        }else{

        }
    }
})


export default router