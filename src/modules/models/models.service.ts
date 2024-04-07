import { deleteFile, uploadFile } from '../shared/utils/fileUpload';
import ErrorResponse from '../shared/utils/errorResponse';
import { defaults, fileDefaults } from '../shared/defaults/defaults';
import { IDefaultQuery } from './../shared/interface/query.interface';
import ModelsDAO from "./dao/models.dao";
import { IAddImageResult, ICreateModel, ICreateModelBody, IGetModelsQuery, IModel, IUpdateModel } from "./interface/models.interface";
import generateSlug, { indexSlug } from '../shared/utils/generateSlug';
import FileService from '../shared/modules/files/files.service';
import { isEmpty } from 'lodash';
import { s3Vars } from '../../config/conf';
import { IFile, IFilePublic, IImage, IRequestFile } from '../shared/interface/files.interface';
import ModelMaterialService from './model_materials/model_materials.service';
import ModelColorService from './model_colors/model_colors.service';
import ImageService from '../shared/modules/images/images.service';
import ModelImageService from './model_images/model_images.service';
import flat from 'flat'
import { IModelColor } from './model_colors/interface/model_colors.interface';
import { checkObject, generatePresignedUrl } from '../shared/utils/s3';
import { IModelMaterial } from './model_materials/interface/model_materials.interface';
import DownloadsService from '../downloads/downloads.service';
import InteractionService from '../interactions/interactions.service';
import BrandsDAO from '../brands/dao/brands.dao';
import SavedModelsService from '../saved_models/saved_models.service';
import { IUser } from '../users/interface/users.interface';

export default class ModelService {
    private modelsDao = new ModelsDAO()
    private fileService = new FileService()
    private modelMaterialService = new ModelMaterialService()
    private modelColorService = new ModelColorService()
    private modelImageService = new ModelImageService()
    private imageService = new ImageService()
    private downloadService = new DownloadsService()
    private interactionService = new InteractionService()
    private savedModelsService = new SavedModelsService()
    private brandsDao = new BrandsDAO()

    async create(
        data: ICreateModelBody,
        cover: IRequestFile,
        images: IRequestFile[],
        file: IRequestFile
    ): Promise<IModel> {
        // const yamoIdExist = await this.findByFilters({yamo_id});
        // if (yamoIdExist) throw new ErrorResponse(400, 'Bu Yamo Id allaqachon mavjud!')

        const { materials, colors, ...modelValues } = data

        const brand = await this.brandsDao.getById(modelValues.brand_id)

        if (!brand) throw new ErrorResponse(404, 'Brand was not found')

        // upload and create file
        const uploadedFile = await uploadFile(file, "files/products", s3Vars.filesBucket)
        const newFile = await this.fileService.create({ ...uploadedFile[0] })

        // generate unique slug
        modelValues['slug'] = generateSlug(modelValues.name)
        const foundSlugs = await this.modelsDao.getSimilarSlugs(modelValues['slug'])
        if (foundSlugs && !isEmpty(foundSlugs)) modelValues['slug'] = indexSlug(modelValues['slug'], foundSlugs.map(model => model.slug))

        const interactions = await this.interactionService.create();

        // create model
        const model = await this.modelsDao.create({
            ...modelValues,
            interaction_id: interactions.id,
            file_id: newFile.id
        })

        // create materials
        if (materials && materials.length > 0) {
            Promise.all(materials.map(async material_id => {
                const exist = await this.modelMaterialService.findByModelAndMaterial(model.id, material_id)
                if (!exist) await this.modelMaterialService.create({ model_id: model.id, material_id })
            }))
        }

        // create colors
        if (colors && colors.length > 0) {
            Promise.all(colors.map(async color_id => {
                const exist = await this.modelColorService.findByModelAndColor(model.id, color_id)
                if (!exist) await this.modelColorService.create({ model_id: model.id, color_id })
            }))
        }

        // upload and create cover image
        const uploadedCover = await uploadFile(cover, "images/products", s3Vars.imagesBucket, /*fileDefaults.model_cover*/)
        const cover_image = await this.imageService.create({ ...uploadedCover[0] })
        await this.modelImageService.create({
            model_id: model.id,
            image_id: cover_image.id,
            is_main: true
        })

        // upload and create other images
        const uploadedImages = await uploadFile(images, "images/products", s3Vars.imagesBucket, /*fileDefaults.model*/)
        Promise.all(uploadedImages.map(async i => {
            const image = await this.imageService.create(i)
            await this.modelImageService.create({
                model_id: model.id,
                image_id: image.id,
                is_main: false
            })
        }))

        return model
    }

    async update(id: string, values: IUpdateModel): Promise<IModel> {

        const foundModel: IModel = await this.modelsDao.getByIdMinimal(id);
        if (isEmpty(foundModel)) throw new ErrorResponse(400, "Model was not found");

        const model: IModel = Object.keys(values).length ? await this.modelsDao.update(id, values) : foundModel

        return model
    }

    async updateByBrand(brand_id: string, values): Promise<IModel> {
        return await this.modelsDao.updateByBrand(brand_id, values)
    }

    async findAll(
        filters: IGetModelsQuery,
        sorts: IDefaultQuery
    ): Promise<IModel[]> {

        const models = await this.modelsDao.getAll(filters, sorts);

        models.forEach((m, i) =>
            models[i] = flat.unflatten(m)
        )

        return models
    }

    async count(filters: IGetModelsQuery): Promise<number> {
        return await this.modelsDao.count(filters);
    }

    async findOne(identifier: string, currentUser?: IUser): Promise<IModel> {
        const model = await this.modelsDao.getByIdOrSlug(identifier);

        if (!model) throw new ErrorResponse(400, "Model was not found");

        model.is_saved = false;

        if (currentUser) {
            const saved = await this.savedModelsService.findAll({
                user_id: currentUser.id,
                model_id: model.id
            })

            model.is_saved = saved.length > 0;
        }

        if (model.used_interiors?.length && !model.used_interiors[0]) {
            model.used_interiors = [];
        }
        if (model.images?.length && !model.images[0]) {
            model.images = [];
        }

        const file = await this.fileService.findOne(model.file_id)

        const filePublicData: IFilePublic = {
            name: file.name,
            size: file.size,
            ext: file.ext,
            mimetype: file.mimetype,
        }

        model.file = filePublicData

        model.images.sort((a, b) => new Date(a['created_at']).valueOf() - new Date(b['created_at']).valueOf())

        return flat.unflatten(model)
    }

    async findById(id: string): Promise<IModel> {
        const data = await this.modelsDao.getByIdMinimal(id);

        if (!data) throw new ErrorResponse(404, "Model was not found");

        return data
    }

    async findByBrand(brand_id): Promise<IModel> {
        const model = await this.modelsDao.getByBrandId(brand_id);
        return model
    }

    async findByFilters(filters: IGetModelsQuery): Promise<IModel[]> {
        if (Object.keys(filters).length == 0) throw new ErrorResponse(400, "Filters required!")

        const model = await this.modelsDao.getByFilters(filters.name, filters);

        return model
    }

    async deleteImage(image_id: string): Promise<number> {
        const image = await this.imageService.findOne(image_id);
        if (isEmpty(image)) throw new ErrorResponse(404, "Image was not found");

        await deleteFile(s3Vars.imagesBucket, image.src)

        await this.modelImageService.deleteByImage(image_id)
        const deleted = await this.imageService.delete(image_id)

        return deleted
    }

    async addColors(model_id: string, colors: number[]): Promise<IModelColor[]> {

        const model: IModel = await this.modelsDao.getByIdMinimal(model_id);
        if (!model) throw new ErrorResponse(400, "Model was not found");

        const addedColors = []

        if (colors.length > 1) {
            Promise.all(colors.map(async color_id => {
                // const found_model_color = await this.modelColorService.findByModelAndColor(model_id, color_id)
                // if (!found_model_color) await this.modelColorService.create({ model_id: model_id, color_id })
                const newColor = await this.modelColorService.create({ model_id: model_id, color_id })
                if (newColor) addedColors.push(newColor)
            }))
        } else {
            // const found_model_color = await this.modelColorService.findByModelAndColor(model_id, color_id: colors[0])
            // if (!found_model_color) await this.modelColorService.create({ model_id: model_id, color_id: colors[0] })
            const newColor = await this.modelColorService.create({ model_id: model_id, color_id: colors[0] })
            if (newColor) addedColors.push(newColor)
        }

        return addedColors
    }

    async addImages(model_id: string, cover: IRequestFile, images: IRequestFile[]): Promise<IAddImageResult> {

        const result: IAddImageResult = {};

        if (cover) {
            const uploadedCover = await uploadFile(cover, "images/products", s3Vars.imagesBucket)
            const cover_image = await this.imageService.create({ ...uploadedCover[0] })
            await this.modelImageService.create({
                model_id,
                image_id: cover_image.id,
                is_main: true
            })

            result.cover = cover_image
        }

        if (images) {
            const uploadedImages = await uploadFile(images, "images/products", s3Vars.imagesBucket)
            if (uploadedImages.length > 1) {
                Promise.all(uploadedImages.map(async i => {
                    const image = await this.imageService.create(i)
                    await this.modelImageService.create({
                        model_id,
                        image_id: image.id,
                        is_main: false
                    })
                    result.images.push(image)
                }))
            } else {
                const image = await this.imageService.create(uploadedImages[0])
                await this.modelImageService.create({
                    model_id,
                    image_id: image.id,
                    is_main: false
                })
                result.images.push(image)
            }
        }

        return result
    }

    async updateFile(model_id: string, file: IRequestFile): Promise<IFile> {
        // find model and check existance
        const foundModel: IModel = await this.modelsDao.getByIdMinimal(model_id);
        if (!foundModel) throw new ErrorResponse(404, "Model was not found");
        // find current file of model
        const oldFile = await this.fileService.findOne(foundModel.file_id);

        // check if it exists in storage and delete if yes
        const fileExists = await checkObject(s3Vars.filesBucket, oldFile.key)
        if (fileExists) await deleteFile(s3Vars.filesBucket, oldFile.key)

        // upload new file and create add to db
        const uploadedFile = await uploadFile(file, "files/product-files", s3Vars.filesBucket)
        const newFile = await this.fileService.update(foundModel.file_id, { ...uploadedFile[0] })

        // connect model to new file
        await this.modelsDao.update(model_id, { file_id: newFile.id })

        return newFile
    }

    async addMaterials(model_id: string, materials: number[]): Promise<IModelMaterial[]> {
        const model: IModel = await this.modelsDao.getByIdMinimal(model_id);
        if (!model) throw new ErrorResponse(400, "Model was not found");

        const addedMaterials = []

        if (materials.length > 1) {
            Promise.all(materials.map(async material_id => {
                // const found_model_material = await this.modelMaterialService.findByModelAndMaterial(model_id, material_id)
                // if (!found_model_material) await this.modelMaterialService.create({ model_id: model_id, material_id })
                const newMaterial = await this.modelMaterialService.create({ model_id: model_id, material_id })
                if (newMaterial) addedMaterials.push(newMaterial)
            }))
        } else {
            // const found_model_material = await this.modelMaterialService.findByModelAndMaterial(model_id, material_id: materials[0])
            // if (!found_model_material) await this.modelMaterialService.create({ model_id: model_id, material_id: materials[0] })
            const newMaterial = await this.modelMaterialService.create({ model_id: model_id, material_id: materials[0] })
            if (newMaterial) addedMaterials.push(newMaterial)
        }

        return addedMaterials
    }

    async removeMaterial(model_id: string, material_id: number): Promise<number> {
        const foundModel: IModel = await this.modelsDao.getByIdMinimal(model_id);
        if (!foundModel) throw new ErrorResponse(400, "Model was not found");

        return await this.modelMaterialService.deleteByMaterialAndModel(foundModel.id, material_id)
    }

    async removeColor(model_id: string, color_id: number): Promise<number> {
        const foundModel: IModel = await this.modelsDao.getByIdMinimal(model_id);
        if (!foundModel) throw new ErrorResponse(400, "Model was not found");

        return await this.modelColorService.deleteByColorAndModel(foundModel.id, color_id)
    }

    async deleteById(model_id: string): Promise<number> {
        const model = await this.modelsDao.getByIdMinimal(model_id)

        if (!model) throw new ErrorResponse(404, "Model was not found");


        const modelImages = await this.modelImageService.findByModel(model_id)

        for await (const model_image of modelImages) {
            const image = await this.imageService.findOne(model_image.image_id)
            await deleteFile(s3Vars.imagesBucket, image.src)
            await this.imageService.delete(model_image.image_id)
        }

        const deleted = await this.modelsDao.deleteById(model_id)

        await this.interactionService.delete(model.interaction_id)

        const file = await this.fileService.findOne(model.file_id)
        await deleteFile(s3Vars.filesBucket, file.src)
        await this.fileService.delete(file.id)

        return deleted
    }

    async download(model_id: string, profile_id: string): Promise<string> {
        const model = await this.modelsDao.getByIdMinimal(model_id)
        if (!model) throw new ErrorResponse(400, "Model was not found");

        const file = await this.fileService.findOne(model.file_id)
        if (!file) throw new ErrorResponse(400, "File was not found");

        const presignedUrl = generatePresignedUrl(file.key)

        await this.downloadService.create({
            model_id: model.id,
            user_id: profile_id
        })

        return presignedUrl
    }

    async deleteByBrandId(brand_id: string): Promise<number> {
        return await this.modelsDao.deleteByBrandId(brand_id);
    }
}