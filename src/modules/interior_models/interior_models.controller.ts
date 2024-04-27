import { NextFunction, Request, Response } from "express";
import InteriorModelsService from './interior_models.service';
import { reqT } from '../shared/utils/language';
import { CustomRequest } from "../shared/interface/routes.interface";
import extractQuery from "../shared/utils/extractQuery";

export default class InteriorModelsController {
  private service = new InteriorModelsService()

  public create = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.create(req.body)

      res.status(201).json({
        success: true,
        data: {
          tag: data
        },
        message: reqT('created_successfully')
      })
    } catch (error) {
      next(error)
    }
  }

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params
      const data = await this.service.update(id, req.body)

      res.status(200).json({
        success: true,
        data: {
          tag: data
        },
        message: reqT('saved_successfully')
      })
    } catch (error) {
      next(error)
    }
  }

  public getAll = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { filters, sorts } = extractQuery(req.query)
      const data = await this.service.findAll(filters, sorts)

      res.status(200).json({
        success: true,
        data: {
          tags: data
        }
      })
    } catch (error) {
      next(error)
    }
  }

  public getByInterior = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.findBy({ interior_id: req.params.id })

      res.status(200).json({
        success: true,
        data: {
          tags: data
        }
      })
    } catch (error) {
      next(error)
    }
  }


  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.service.deleteBy({ id: req.params.id })

      res.status(200).json({
        success: true,
        message: reqT('deleted_successfully')
      })
    } catch (error) {
      next(error)
    }
  }

  public deleteByInterior = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.service.deleteBy({
        interior_id: req.params.interior_id
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