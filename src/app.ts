import express, { NextFunction, Request, Response } from 'express';
import "express-async-errors";
import 'reflect-metadata';
import createConection from './database';
import { router } from './routes';
import * as yup from 'yup';
import { AppError } from './errors/AppErrors';

createConection();

const app = express();

/**
 * GET => BUSCAR
 * POST => SALVAR
 * PUT => ALTERAR 
 * DELETE => DELETAR
 * PATCH => ALTERAÇÃO ESPECÍFICA 
 */

// app.get("/Users", (request, response) => {
//     return response.send("Hello World - NLW04");
// });

app.get("/Users", (request, response) => {
    return response.json({message: "Hello World - NLW04"});
});

// 1 PARAM => ROTA(RECURSO API)
// 2 PARAM => REQUEST, RESPONSE

app.post("/", (request, response) => {
    //recebeu os dados para salvar 
    return response.json({message: "Os dados foram salvos com sucesso!"});
});

app.use(express.json());
app.use(router);

app.use((err: Error, request: Request, response: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
        return response.status(err.statusCode).json({
            message: err.message
        });
    };
    return response.status(500).json({
        status: "Error",
        message: `Internal server error ${err.message}`,
    });
} );

export { app };