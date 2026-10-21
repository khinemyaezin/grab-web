import { HateoasLink } from "@khinemyaezin/seller-api";
export type LoginFormProps = {
    link: HateoasLink;
    onLoginSuccess: () => void;
    onLoginError: ({ title, description }: {
        title: string;
        description: string;
    }) => void;
};
export declare function LoginForm({ link, onLoginSuccess, onLoginError }: LoginFormProps): import("react").JSX.Element;
