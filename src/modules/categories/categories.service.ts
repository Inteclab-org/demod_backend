import { isEmpty } from "lodash";
import ErrorResponse from "../shared/utils/errorResponse";
import CategoriesDAO from "./categories.dao";
import { UpdateCategoryDTO } from "./categories.dto";
import { ICategory, ICreateCategory, IGetCategoriesQuery, IUpdateCategory } from "./categories.interface";
import { IDefaultQuery } from '../shared/interface/query.interface';
import { IRequestFile } from "../shared/interface/files.interface";
import { uploadFile } from "../shared/utils/fileUpload";
import { s3Vars } from "../../config";
import { fileDefaults } from "../shared/defaults/defaults";
import { v4 as uuid } from 'uuid';

export default class CategoryService {
  private categoriesDao = new CategoriesDAO()

  async create(values: ICreateCategory, image?: IRequestFile) {
    const { name, parent_id } = values
    const foundCategory = await this.categoriesDao.getByNameAndParent(name, parent_id || null);
    if (foundCategory) {
      throw new ErrorResponse(400, "This category already exists");
    }

    if (image) {
      const uploadedImage = (await uploadFile({
        files: image,
        folder: `images/categories`,
        bucketName: s3Vars.imagesBucket,
        fileName: uuid(),
        dimensions: fileDefaults.category_image
      }))[0];
      values.image = uploadedImage?.src;
    }

    return await this.categoriesDao.create(values)
  }

  async update(id: string | number, values: IUpdateCategory, image?: IRequestFile) {
    const foundCategory = await this.categoriesDao.getById(id);
    if (isEmpty(foundCategory)) {
      throw new ErrorResponse(400, "Category was not found");
    }

    if (image) {
      const uploadedImage = (await uploadFile({
        files: image,
        folder: `images/categories`,
        bucketName: s3Vars.imagesBucket,
        fileName: foundCategory.image,
        dimensions: fileDefaults.category_image
      }))[0];
      values.image = uploadedImage.src;
    }

    return Object.keys(values).length ? await this.categoriesDao.update(id, values) : foundCategory;
  }

  async findAll(filters?) {
    const categories = await this.categoriesDao.getAll(filters);
    return categories
  }

  async findAllParents(filters?, sorts?: IDefaultQuery) {
    const categories = await this.categoriesDao.getParents(filters, sorts);
    for (let i = 0; i < categories.length; i++) {
      if (categories[i]?.children && (!categories[i]?.children[0] || categories[i]?.children[0] == null)) {
        categories[i].children = []
      }
    }
    return categories
  }

  async findAllNonParents(filters?, sorts?: IDefaultQuery) {
    const categories = await this.categoriesDao.getNonParents(filters, sorts);
    for (let i = 0; i < categories.length; i++) {
      if (categories[i]?.children && (!categories[i]?.children[0] || categories[i]?.children[0] == null)) {
        categories[i].children = []
      }
    }
    return categories
  }

  async findAllChildren() {
    const categories = await this.categoriesDao.getChildren();
    return categories
  }


  async findChildren(parent_id: string | number) {
    const categories = await this.categoriesDao.getByParent(parent_id);
    return categories
  }

  async findOne(id: string | number) {
    const category: ICategory = await this.categoriesDao.getById(id);
    return category
  }

  async findByName(name: string) {
    const category: ICategory = await this.categoriesDao.getByName(name);
    return category
  }

  async findByBrand(brand_id: string, filters?): Promise<ICategory[]> {
    const categories = await this.categoriesDao.getByBrand(brand_id, filters);
    return categories
  }

  async findByUserDownloads(user_id: string, filters?: any): Promise<ICategory[]> {
    const categories = await this.categoriesDao.getByUserDownloads(user_id, filters);
    return categories
  }

  async findByDownloadsCount(filters?: any): Promise<ICategory[]> {
    const categories = await this.categoriesDao.getByDownloadsCount(filters);
    return categories
  }

  async findByUserInteriors(user_id: string): Promise<ICategory[]> {
    const categories = await this.categoriesDao.getByUserInteriors(user_id);
    return categories
  }

  async findByModelInteriors(model_id: string): Promise<ICategory[]> {
    const categories = await this.categoriesDao.getByModelInteriors(model_id);
    return categories
  }

  async delete(id: string | number, cascade?: boolean) {

    if (cascade) {
      await this.categoriesDao.deleteByParent(id)
    } else {
      await this.categoriesDao.updateByParent(id, { parent_id: null })
    }

    await this.categoriesDao.deleteById(id);
  }
}