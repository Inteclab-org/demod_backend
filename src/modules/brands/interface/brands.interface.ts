import { IUser } from "../../users/interface/users.interface";

export interface IBrand {
    id: string;
    name: string;
    description: string;
    site_link: string;
    image_id: string;
    created_at: Date;
    updated_at: Date;
}

export interface ICreateBrand {
    name: string;
    description: string;
    site_link: string;
    image_id?: string;
}

export interface IBrandAuth {
    username: string;
    password: string;
}

export interface IBrandAdmin {
    id: string;
    profile_id: string;
    brand_id: string;
    created_at: Date;
    updated_at: Date;
    profile?: IUser;
    brand?: IBrand;
}


export interface ICreateBrandAdmin {
    profile_id: string;
    brand_id: string;
}

export interface IUpdateBrand {
    name?: string;
    description?: string;
    site_link?: string;
    image_id?: string;
} 