import { CustomRequest } from "../../interface/routes.interface";
import { NextFunction, Request, Response } from "express";
import ErrorResponse from "../../utils/errorResponse";
import RolesService from "../../../auth/roles/roles.service";


const check_access = (module_name: string) => {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const {
        user
      } = req

      const rolesservice = new RolesService()

      let all_modules = await rolesservice.getUserRolesAndModels(user.profile.id)

      const existance = all_modules.find(e => e["access_module_name"] == module_name);

      if (!existance) throw new ErrorResponse(403, "Access denied!")

      next()

    } catch (error) {
      next(error)
    }
  }
}

export default check_access;