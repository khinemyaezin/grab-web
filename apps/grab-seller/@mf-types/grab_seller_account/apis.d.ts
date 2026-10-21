
    export type RemoteKeys = 'grab_seller_account/Routes' | 'grab_seller_account/Service' | 'grab_seller_account/StorefrontRoutes';
    type PackageType<T> = T extends 'grab_seller_account/Service' ? typeof import('grab_seller_account/Service') :T extends 'grab_seller_account/StorefrontRoutes' ? typeof import('grab_seller_account/StorefrontRoutes') :T extends 'grab_seller_account/Routes' ? typeof import('grab_seller_account/Routes') :any;
