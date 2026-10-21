export type SellerRuntimeConfig = {
  readonly appName: string;
  readonly apiBaseUrl: string;
};

export const defaultRuntimeConfig: Readonly<SellerRuntimeConfig> = {
  appName: "Grab Store",
  apiBaseUrl: "/api"
};
