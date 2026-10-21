import type { PackageType as PackageType_0,RemoteKeys as RemoteKeys_0 } from './grab_seller_account/apis.d.ts';
import type { PackageType as PackageType_1,RemoteKeys as RemoteKeys_1 } from './grab_seller_auth/apis.d.ts';
import type { PackageType as PackageType_2,RemoteKeys as RemoteKeys_2 } from './grab_seller_inventory/apis.d.ts';
import type { PackageType as PackageType_3,RemoteKeys as RemoteKeys_3 } from './grab_seller_pricing/apis.d.ts';
import type { PackageType as PackageType_4,RemoteKeys as RemoteKeys_4 } from './grab_seller_product/apis.d.ts';
    declare module "@module-federation/runtime" {
      type RemoteKeys = RemoteKeys_0 | RemoteKeys_1 | RemoteKeys_2 | RemoteKeys_3 | RemoteKeys_4;
      type PackageType<T, Y=any> = T extends RemoteKeys_0 ? PackageType_0<T> :
T extends RemoteKeys_1 ? PackageType_1<T> :
T extends RemoteKeys_2 ? PackageType_2<T> :
T extends RemoteKeys_3 ? PackageType_3<T> :
T extends RemoteKeys_4 ? PackageType_4<T> :
Y ;
      export function loadRemote<T extends RemoteKeys,Y>(packageName: T): Promise<PackageType<T, Y>>;
      export function loadRemote<T extends string,Y>(packageName: T): Promise<PackageType<T, Y>>;
    }
declare module "@module-federation/enhanced/runtime" {
      type RemoteKeys = RemoteKeys_0 | RemoteKeys_1 | RemoteKeys_2 | RemoteKeys_3 | RemoteKeys_4;
      type PackageType<T, Y=any> = T extends RemoteKeys_0 ? PackageType_0<T> :
T extends RemoteKeys_1 ? PackageType_1<T> :
T extends RemoteKeys_2 ? PackageType_2<T> :
T extends RemoteKeys_3 ? PackageType_3<T> :
T extends RemoteKeys_4 ? PackageType_4<T> :
Y ;
      export function loadRemote<T extends RemoteKeys,Y>(packageName: T): Promise<PackageType<T, Y>>;
      export function loadRemote<T extends string,Y>(packageName: T): Promise<PackageType<T, Y>>;
    }
declare module "@module-federation/runtime-tools" {
      type RemoteKeys = RemoteKeys_0 | RemoteKeys_1 | RemoteKeys_2 | RemoteKeys_3 | RemoteKeys_4;
      type PackageType<T, Y=any> = T extends RemoteKeys_0 ? PackageType_0<T> :
T extends RemoteKeys_1 ? PackageType_1<T> :
T extends RemoteKeys_2 ? PackageType_2<T> :
T extends RemoteKeys_3 ? PackageType_3<T> :
T extends RemoteKeys_4 ? PackageType_4<T> :
Y ;
      export function loadRemote<T extends RemoteKeys,Y>(packageName: T): Promise<PackageType<T, Y>>;
      export function loadRemote<T extends string,Y>(packageName: T): Promise<PackageType<T, Y>>;
    }
    