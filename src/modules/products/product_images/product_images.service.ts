import ModelImagesDAO from "./dao/model_images.dao";
import { ICreateModelImage, IModelImage } from "./interface/model_images.interface";

export default class ModelImageService {
    private modelImagesDao = new ModelImagesDAO()
    async create({ product_id, image_id, is_main }: ICreateModelImage) {
        const data = await this.modelImagesDao.create({
            product_id,
            image_id,
            is_main
        })
        return data
    }
    async findOne(id: string) {
        return await this.modelImagesDao.getById(id)
    }
    async findProductCover(product_id: string) {
        return await this.modelImagesDao.getProductCover(product_id)
    }
    async findByProduct(product_id: string): Promise<IModelImage[]> {
        return await this.modelImagesDao.getByProduct(product_id)
    }
    async delete(id: string) {
        await this.modelImagesDao.deleteById(id)
    }
    async deleteByProduct(id: string) {
        await this.modelImagesDao.deleteByProductId(id)
    }
    async deleteByImage(image_id: string) {
        await this.modelImagesDao.deleteByImageId(image_id)
    }

    async deleteCoverImage(product_id: string) {
        await this.modelImagesDao.deleteCoverImageByProductId(product_id)
    }
}