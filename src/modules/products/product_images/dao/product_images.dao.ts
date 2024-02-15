import { getFirst } from "../../../shared/utils/utils";
import KnexService from '../../../../database/connection';
import { ICreateModelImage } from "../interface/model_images.interface";

export default class ModelImagesDAO {
    async create({ product_id, image_id, is_main }: ICreateModelImage) {
        return getFirst(
            await KnexService("model_images")
                .insert({
                    product_id,
                    image_id,
                    is_main
                })
                .returning("*")
        )
    }

    async deleteById(id: string) {
        return await KnexService('model_images')
            .where({ id: id })
            .delete()
    }

    async getById(id: string) {
        return getFirst(
            await KnexService('model_images')
                .where({ id: id })
        )
    }

    async getByProduct(product_id: string) {
        return await KnexService('model_images')
            .where({ product_id })
    }

    async getProductCover(product_id: string) {
        return getFirst(
            await KnexService('model_images')
                .where({
                    product_id,
                    is_main: true
                })
        )
    }

    async deleteByProductId(id: string) {
        return await KnexService('model_images')
            .where({ product_id: id })
            .delete()
    }

    async deleteByImageId(image_id: string) {
        return await KnexService('model_images')
            .where({ image_id })
            .delete()
    }

    async deleteCoverImageByProductId(product_id: string) {
        return await KnexService('model_images')
            .where({
                product_id,
                is_main: true
            })
            .delete()
    }
}