import { resolveLink, SellerApiLinks } from "@khinemyaezin/seller-api";
import { useInventoryLink } from "@/features/inventory/api/use-root";
import { useLocation } from "@/features/inventory/api/use-locations";
import { useZone } from "@/features/inventory/api/use-zones";

/**
 * Nested capability discovery for location → zone → bin routes.
 * Pages may use this for child collection/create/get links and breadcrumb names,
 * not for rendering location/zone domain UI.
 */
export function useLocationZoneLinks(locationId?: string, zoneId?: string) {
    const locationLink = useInventoryLink("location");
    const locationQuery = useLocation(locationLink, locationId);
    const location = locationQuery.data;

    const searchZones = resolveLink(location?._links, SellerApiLinks.pending.searchZones);
    const createZone = resolveLink(location?._links, SellerApiLinks.pending.createZone);
    const zoneGetLink = resolveLink(location?._links, SellerApiLinks.pending.zone);

    const zoneQuery = useZone(zoneGetLink, zoneId);
    const zone = zoneQuery.data;

    return {
        location,
        zone,
        locationName: location?.name,
        zoneName: zone?.name,
        searchZones,
        createZone,
        zoneGetLink,
        createBin: resolveLink(zone?._links, SellerApiLinks.pending.createBin),
        binGetLink: resolveLink(zone?._links, SellerApiLinks.pending.bin),
        isLocationLoading: locationQuery.isLoading,
        isZoneLoading: zoneQuery.isLoading,
    };
}
