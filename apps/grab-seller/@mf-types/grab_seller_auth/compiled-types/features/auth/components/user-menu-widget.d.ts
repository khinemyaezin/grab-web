export type UserMenuWidgetProps = {
    onLogout: () => void;
    trigger: React.ReactNode;
};
export default function UserMenuWidget({ onLogout, trigger }: UserMenuWidgetProps): import("react").JSX.Element | null;
