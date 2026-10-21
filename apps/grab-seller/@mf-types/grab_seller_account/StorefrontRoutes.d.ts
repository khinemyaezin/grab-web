import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { SellerPlatform } from "@khinemyaezin/seller-contracts";
import type { JSX } from "react";

export default function StorefrontRoutes(props: {
  link: HateoasLink;
  platform?: SellerPlatform;
}): JSX.Element;
