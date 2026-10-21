/**
 * Nested capability discovery for location → zone → bin routes.
 * Pages may use this for child collection/create/get links and breadcrumb names,
 * not for rendering location/zone domain UI.
 */
export declare function useLocationZoneLinks(locationId?: string, zoneId?: string): {
    location: import("./types").LocationResponse | undefined;
    zone: import("./types").ZoneResponse | undefined;
    locationName: string | undefined;
    zoneName: string | undefined;
    searchZones: import("@khinemyaezin/seller-api").HateoasLink | undefined;
    createZone: import("@khinemyaezin/seller-api").HateoasLink | undefined;
    zoneGetLink: import("@khinemyaezin/seller-api").HateoasLink | undefined;
    createBin: import("@khinemyaezin/seller-api").HateoasLink | undefined;
    binGetLink: import("@khinemyaezin/seller-api").HateoasLink | undefined;
    isLocationLoading: boolean;
    isZoneLoading: boolean;
};
