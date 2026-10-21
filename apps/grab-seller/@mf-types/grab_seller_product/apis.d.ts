
    export type RemoteKeys = 'grab_seller_product/Routes';
    type PackageType<T> = T extends 'grab_seller_product/Routes' ? typeof import('grab_seller_product/Routes') :any;