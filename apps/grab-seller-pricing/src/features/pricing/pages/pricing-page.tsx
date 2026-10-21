import type { HateoasLink } from "@khinemyaezin/seller-api";

export type PricingPageProps = {
  rootLink?: HateoasLink;
};

export default function PricingPage({ rootLink }: PricingPageProps) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Pricing Module</h1>
      <p>This is the pricing micro-frontend.</p>
    </div>
  );
}
