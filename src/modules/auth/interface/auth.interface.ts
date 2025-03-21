import { Request } from "express";

export interface ICreateUser {
  full_name: string;
  email: string;
  username: string;
  company_name: string;
  password: string;
}

export interface ISignin {
  email?: string;
  username?: string;
  password: string;
  role_name?: string;
  company?: string;
}

export interface ISignup {
  full_name: string;
  email: string;
  username?: string;
  company_name: string;
  password: string;
}

export interface ITokenPayload {
  user_id: string;
}

export interface IDecodedToken {
  user_id: string;
  token_type: string;
}

export interface IResendOtp {
  email: string;
}

export interface IRefreshToken {
  token: string;
}