import { Router } from 'express';
import { Routes } from '../shared/interface/routes.interface';
import validate from '../shared/middlewares/validate';
import AuthController from './auth.controller';
import { ConfirmOtpDTO, ResendOtpDTO, SigninDTO, SignupDTO } from './auth.dto';
import protect from '../shared/middlewares/auth/protect';

export default class AuthRoute implements Routes {
  public path = '/auth/';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}signup`, validate(SignupDTO, "body"), this.authController.signUp);
    this.router.post(`${this.path}signin/:role`, validate(SigninDTO, "body"), this.authController.signIn);
    this.router.post(`${this.path}signin`, validate(SigninDTO, "body"), this.authController.signIn);
    this.router.get(`${this.path}verify`, protect, this.authController.verified);
    this.router.post(`${this.path}resendcode`, validate(ResendOtpDTO, "body"), this.authController.resendOtp);
    this.router.post(`${this.path}refreshToken`, this.authController.refreshToken);
    this.router.post(`${this.path}deleteAccount`, protect, this.authController.deleteAccount);
  }
}
