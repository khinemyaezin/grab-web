import { HateoasLink } from "@khinemyaezin/seller-api";
import { useApi } from "@khinemyaezin/seller-ui";
import { useQuery } from "@tanstack/react-query";

type RegionCountryResponse = { countryCode: string };
type RegionCountriesResponse = {
    _embedded?: {
        regionCountryResponseList?: RegionCountryResponse[];
        regionCountryResponses?: RegionCountryResponse[];
    };
};

export function useRegionCountries(link?: HateoasLink) {
    const api = useApi();
    return useQuery<string[]>({
        queryKey: ["region-countries", link?.href],
        queryFn: async () => {
            const response = await api.followLink<RegionCountriesResponse>(link!, "GET");
            const countries = response._embedded?.regionCountryResponseList
                ?? response._embedded?.regionCountryResponses
                ?? [];
            return countries.map((country) => country.countryCode);
        },
        enabled: !!link,
        staleTime: 5 * 60 * 1000,
    });
}
