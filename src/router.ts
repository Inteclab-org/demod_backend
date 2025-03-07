
import { Router } from 'express';

import AuthRoute from './modules/auth/auth.route';
import UsersRoute from './modules/users/users.route';
import CategoriesRoute from './modules/categories/categories.route';
import BrandsRoute from './modules/brands/brands.route';
import ModelsRoute from './modules/models/models.route';
import ColorsRoute from './modules/colors/colors.route';
import MaterialsRoute from './modules/materials/materials.route';
import CostsRoute from './modules/costs/costs.route';
import StylesRoute from './modules/styles/styles.route';
import UserProductViewsRoute from './modules/views/user_views/user_product_views.route';
import InteriorsRoute from './modules/interiors/interiors.route';
import SavedInteriorsRoute from './modules/saved_interiors/saved_interiors.route';
import SavedModelsRoute from './modules/saved_models/saved_models.route';
import CommentsRoute from './modules/comments/comments.route';
import PlatformsRoute from './modules/platforms/platforms.route';
import NotificationsRoute from './modules/notifications/notifications.route';
import InteriorModelsRoute from './modules/interior_models/interior_models.route';
import ChatRoute from './modules/chat/chat.route';
import ProjectsRoute from './modules/projects/projects.route';
import StatsRoute from './modules/stats/stats.route';
import DownloadsRoute from './modules/downloads/downloads.route';
import ProductsRoute from './modules/products/products.route';

const router = Router()

const routes = [
  new AuthRoute(),
  new UsersRoute(),
  new CategoriesRoute(),
  new BrandsRoute(),
  new ModelsRoute(),
  new ColorsRoute(),
  new MaterialsRoute(),
  new CostsRoute(),
  new StylesRoute(),
  new UserProductViewsRoute(),
  new InteriorsRoute(),
  new SavedInteriorsRoute(),
  new SavedModelsRoute(),
  new CommentsRoute(),
  new PlatformsRoute(),
  new NotificationsRoute(),
  new InteriorModelsRoute(),
  new ChatRoute(),
  new ProjectsRoute(),
  new StatsRoute(),
  new DownloadsRoute(),
  new ProductsRoute(),
]

routes.forEach(route => router.use('/', route.router))

export default router
