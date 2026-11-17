export type SellerRuntimeConfig = {
  readonly appName: string;
  readonly apiBaseUrl: string;
  readonly eventStreamUrl?: string;
};

export const defaultRuntimeConfig: Readonly<SellerRuntimeConfig> = {
  appName: "Grab Store",
  apiBaseUrl: "/api",
};
