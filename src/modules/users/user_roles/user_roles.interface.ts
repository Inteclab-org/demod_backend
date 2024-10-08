export interface IUserRole {
  id: number;
  user_id: string;
  role_id: number;
  role_name?: number;
  created_at: Date;
  updated_at: Date;
}
export interface ICreateUserRole {
  user_id?: string;
  role_id: number;
}
