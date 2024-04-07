export interface ICreateUser {
  user_id: string;
  full_name: string;
  email: string;
  username: string;
  birth_date?: Date;
  address?: string;
  phone?: string;
  telegram?: string;
  portfolio_link?: string;
}

export interface IUpdateUser {
  full_name?: string;
  language_id?: number;
  username?: string;
  birth_date?: Date;
  address?: string;
  phone?: string;
  telegram?: string;
  portfolio_link?: string;
}
export interface IUserMetadata {
  full_name: string;
  username: string;
  birth_date: Date;
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
  birth_date: Date;
  address: string;
  phone: string;
  telegram: string;
  portfolio_link: string;
  image_id?: string;
  image_src?: string;
  created_at: Date;
  updated_at: Date;
  designs_count?: number | string;
}

export interface IGetUsersQuery {
  full_name: string;
  role_id: string | number;
}