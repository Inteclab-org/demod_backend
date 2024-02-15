export interface ICreateModelImage {
    product_id: string;
    image_id: string;
    is_main: boolean;
}

export interface IModelImage {
    id: string;
    product_id: string;
    image_id: string;
    is_main: boolean;
    created_at: Date;
    updated_at: Date;
}