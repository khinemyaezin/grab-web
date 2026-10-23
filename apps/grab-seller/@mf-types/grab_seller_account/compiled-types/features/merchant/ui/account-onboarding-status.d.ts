import { MerchantStatus, MerchantType } from "@/features/merchant/types";
export type AccountOnboardingStatusProps = {
    accountStatus: MerchantStatus;
    merchantType?: MerchantType;
};
export default function AccountOnboardingStatus({ accountStatus, merchantType }: AccountOnboardingStatusProps): import("react").JSX.Element;
