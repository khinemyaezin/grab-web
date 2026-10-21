import { MerchantStatus, MerchantType } from "../../types/account-model";
export type AccountOnboardingStatusProps = {
    accountStatus: MerchantStatus;
    merchantType?: MerchantType;
};
export default function AccountOnboardingStatus({ accountStatus, merchantType }: AccountOnboardingStatusProps): import("react").JSX.Element;
