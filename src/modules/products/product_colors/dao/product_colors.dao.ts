import { getFirst } from "../../../shared/utils/utils";
import KnexService from '../../../../database/connection';
import { ICreateModelColor } from "../interface/model_colors.interface";

export default class ModelColorsDAO {
    async create({ product_id, color_id }: ICreateModelColor) {
        return getFirst(
            await KnexService("model_colors")
                .insert({
                    product_id,
                    color_id
                })
                .returning("*")
        )
    }

    async getByProductAndColor(product_id: string, color_id: number) {
        return getFirst(
            await KnexService('model_colors')
                .where({
                    product_id,
                    color_id
                })
        )
    }


    async deleteById(id: string) {
        return await KnexService('model_colors')
            .where({ id: id })
            .delete()
    }

    async deleteByProductId(id: string) {
        return await KnexService('model_colors')
            .where({ product_id: id })
            .delete()
    }

    async deleteByColorAndProduct(product_id: string, color_id: number) {
        return await KnexService('model_colors')
            .where({
                product_id,
                color_id
            })
            .delete()
    }
}