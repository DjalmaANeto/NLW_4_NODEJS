import { Request, Response } from "express";
import { getCustomRepository, IsNull, Not } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveyUserRepository } from "../repositories/SurveysUsersRepository";
import * as yup from 'yup';
import { AppError } from "../errors/AppErrors";

class NpsController {
    /**
     * Calculo do NPS
     * 1 - 2 - 3 - 4 - 5 - 6 - 7 - 8 - 9 - 10
     * Detratores => 0 - 6
     * Passivos => 7 - 8
     * Promotores => 9 - 10 
     * 
     * (Número de promotores - número de detratores) / (número de respondentes) * 100
     */

    async execute(request: Request, response: Response) {
        const { name, email } = request.body;

        const schema = yup.object().shape({
            name: yup.string().required("Nome é obrigatório"),
            email: yup.string().email().required("Email incorreto")
        });

        try {
            await schema.validate(request.body, { abortEarly: false });
        } catch (err) {
            throw new AppError(err);
        }
  
        const { survey_id } = request.params;

        const surveysUsersRepository = getCustomRepository(SurveyUserRepository);

        const surveysUsers = await surveysUsersRepository.find({
            survey_id,
            value: Not(IsNull()),
        });

        const detractor = surveysUsers.filter(
            (survey) => survey.value >= 0 && survey.value <= 6
        ).length;

        const promoters = surveysUsers.filter(
            (survey) => survey.value >= 9 && survey.value <= 10
        ).length;

        const passive = surveysUsers.filter(
            (survey) => survey.value >= 7 && survey.value <= 8
        ).length;

        const totalAnswers = surveysUsers.length;

        const calculate = Number(
            (((promoters - detractor) / totalAnswers) * 100).toFixed(2)
        );

        return response.json({
            detractor,
            promoters,
            passive,
            totalAnswers,
            nps: calculate
        });
    }
};

export { NpsController };