import { Request, Response } from 'express';
import { getCustomRepository } from "typeorm";
import { AppError } from '../errors/AppErrors';
import { UserRepository } from '../repositories/UsersRepository';

class UserController {
    async create(request: Request, response: Response)
    {
        const {name, email} = request.body;
        
        const usersRepository = getCustomRepository(UserRepository); 

        //.findOne() substitui a SQL query: SELECT * FROM USERS WHERE EMAIL = "EMAIL"
        const userAlreadyExists = await usersRepository.findOne({email});

        if (userAlreadyExists) {
            throw new AppError("User already exists!");
        }

        const user = usersRepository.create({
            name,
            email
        }); 

        await usersRepository.save(user);

        return response.status(201).json(user);
    }
}

export { UserController };

