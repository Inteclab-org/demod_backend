import { IUserBan } from "./user_bans/user_bans.interface";

export interface ICreateUser {
  user_id: string;
  full_name: string;
  email: string;
  username: string;
  company_name: string;
  image_src?: Date;
  address?: string;
  phone?: string;
  telegram?: string;
  instagram?: string;
  linkedin?: string;
  portfolio_link?: string;
}

export interface IUpdateUser {
  full_name?: string;
  image_src?: string;
  username?: string;
  company_name?: string;
  address?: string;
  phone?: string;
  telegram?: string;
  instagram?: string;
  linkedin?: string;
  portfolio_link?: string;
}

export interface IUpdateUserPassword_admin {
  password: string;
}
export interface IUserMetadata {
  full_name: string;
  username: string;
}
export interface IUpdateUserEmail {
  email: string;
}
export interface IUpdateUserPassword {
  old_password: string;
  new_password: string;
}

export interface IUser {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  username: string;
  company_name: string;
  address: string;
  phone: string;
  telegram: string;
  instagram: string;
  linkedin: string;
  portfolio_link: string;
  image_id?: string;
  image_src?: string;
  created_at: Date;
  updated_at: Date;
  role?: { id: number, name: string };
  is_banned?: boolean;
  bans?: IUserBan[];
  role_id: number;
  designs_count?: number | string;
  tags_count?: number | string;
  downloads_count?: number | string;
}

export interface IGetUsersQuery {
  full_name?: string;
  role_id?: string | number;
}
