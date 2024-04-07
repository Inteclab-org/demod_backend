import { NextFunction, Request, Response } from "express";
import SavedModelsService from './saved_models.service';
import { CustomRequest } from '../shared/interface/routes.interface';
import { reqT } from '../shared/utils/language';

export default class SavedModelsController {
    private service = new SavedModelsService()

    public create = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
        try {

            const data = await this.service.create({
                user_id: req.user.profile.id,
                model_id: req.body.model_id
            })

            res.status(201).json({
                success: true,
                data,
                message: reqT('saved_successfully')
            })
        } catch (error) {
            next(error)
        }
    }

    public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {

            const data = await this.service.findAll(req.query)

            res.status(200).json({
                success: true,
                data
            })
        } catch (error) {
            next(error)
        }
    }

    public delete = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { model_id } = req.params
            await this.service.delete({
                user_id: req.user.profile.id,
                model_id: model_id
            })

            res.status(200).json({
                success: true,
                message: reqT('deleted_successfully')
            })
        } catch (error) {
            next(error)
        }
    }
}