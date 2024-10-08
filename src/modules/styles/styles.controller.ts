import { NextFunction, Request, Response } from "express";

import StyleService from "./styles.service";

import { CreateStyleDTO, UpdateStyleDTO } from "./styles.dto";
import { ISearchQuery } from "../shared/interface/query.interface";
import { CustomRequest } from "../shared/interface/routes.interface";

export default class StylesController {
  private stylesService = new StyleService()

  public create = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const styleData: CreateStyleDTO = req.body
      const data = await this.stylesService.create(styleData)

      res.status(201).json({
        success: true,
        data,
        message: req.t.created_successfully()
      })
    } catch (error) {
      next(error)
    }
  }

  public update = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const styleData: UpdateStyleDTO = req.body
      const id: number = Number(req.params.id)
      const data = await this.stylesService.update(id, styleData)

      res.status(200).json({
        success: true,
        data,
        message: req.t.saved_successfully()
      })
    } catch (error) {
      next(error)
    }
  }

  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { query } = req
      const { keyword }: ISearchQuery = query
      const data = await this.stylesService.findAll(keyword)

      res.status(200).json({
        success: true,
        data
      })
    } catch (error) {
      next(error)
    }
  }

  public getOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id: number = Number(req.params.id)
      const data = await this.stylesService.findOne(id)

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
      const id: number = Number(req.params.id)
      await this.stylesService.delete(id)

      res.status(200).json({
        success: true,
        message: req.t.deleted_successfully()
      })
    } catch (error) {
      next(error)
    }
  }
}