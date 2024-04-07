import { CustomRequest, RequestWithUser } from "../../interface/routes.interface";
import UsersDAO from "../../../users/dao/users.dao";
import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { server } from "../../../../config/conf";
import ErrorResponse from "../../utils/errorResponse";
import { IDecodedToken } from "../../../auth/interface/auth.interface";
import supabase from "../../../../database/supabase/supabase";
import { getFirst } from "../../../shared/utils/utils";
import knexInstance from "../../../../database/connection";
import L from '../../../../i18n/i18n-node';

const accessToken = server.accessToken

const protect = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const authorization = req.headers.authorization

    if (
      !authorization ||
      !authorization.startsWith("Bearer ") ||
      !authorization.split(" ")[1]
    ) throw new ErrorResponse(401, req.t.unauthorized());

    const authToken = authorization.split(" ")[1];

    if (!authToken || !authToken.length) throw new ErrorResponse(401, req.t.unauthorized())

    const decodedToken = verify(authToken, accessToken.secret) as IDecodedToken;
    if (!decodedToken) throw new ErrorResponse(401, req.t.unauthorized())

    const usersDao = new UsersDAO();

    const { data: { user }, error } = await supabase.auth.getUser(authToken)

    if (!user) throw new ErrorResponse(404, req.t.user_404())
    if (error) throw new ErrorResponse(500, error.message)

    const profile = await usersDao.getByUserId(user.id)

    req.user = { ...user, profile }

    next()

  } catch (error) {
    next(error)
  }
}

export default protect


