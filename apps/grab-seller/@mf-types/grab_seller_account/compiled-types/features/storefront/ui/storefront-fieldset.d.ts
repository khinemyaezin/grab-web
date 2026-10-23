export type StorefrontFieldsetProps = {
    onNameChange?: (name: string) => void;
    onSlugEdit?: () => void;
    disabled?: boolean;
    salesChannelId?: string | null;
};
export declare function StorefrontFieldset({ onNameChange, onSlugEdit, disabled, salesChannelId }: StorefrontFieldsetProps): import("react").JSX.Element;
