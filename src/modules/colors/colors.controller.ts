import { NextFunction, Request, Response } from "express";

import ColorService from "./colors.service";

import { CreateColorDTO, UpdateColorDTO } from "./dto/colors.dto";
import { ISearchQuery } from "../shared/interface/query.interface";
 
export default class ColorsController {
    private colorsService = new ColorService()

    public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const colorData: CreateColorDTO = req.body
            const data = await this.colorsService.create(colorData)

            res.status(201).json({
                success: true,
                data,
                message: "Color created successfully"
            })
        } catch (error) {
            next(error)
        }
    }

    public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const colorData: UpdateColorDTO = req.body
            const id: number = Number(req.params.id)
            const data = await this.colorsService.update(id, colorData)

            res.status(200).json({
                success: true,
                data,
                message: "Color updated successfully"
            })
        } catch (error) {
            next(error)
        }
    }

    public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { query } = req
            const { keyword }: ISearchQuery = query
            const data = await this.colorsService.findAll(keyword)

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
            const data = await this.colorsService.findOne(id)

            res.status(200).json({
                success: true,
                data
            })
        } catch (error) {
            next(error)
        }
    }

    public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id: number = Number(req.params.id)
            await this.colorsService.delete(id)
            
            res.status(200).json({
                success: true,
                message: "Color deleted successfully"
            })
        } catch (error) {
            next(error)
        }
    }
}