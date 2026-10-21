import { HateoasLink } from "@khinemyaezin/seller-api";
export type RegisterFormProps = {
    link: HateoasLink;
    onRegisterSuccess: () => void;
    onRegisterError: ({ title, description }: {
        title: string;
        description: string;
    }) => void;
};
export declare function RegisterForm({ link, onRegisterSuccess, onRegisterError }: RegisterFormProps): import("react").JSX.Element;
