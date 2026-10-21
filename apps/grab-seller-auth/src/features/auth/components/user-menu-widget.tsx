import AccessContextMenu from "../../access/components/access-context-menu";
import { LogOutIcon } from "lucide-react";
import { usePlatform, UserAvatarDetails } from "@khinemyaezin/seller-ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@khinemyaezin/seller-ui/components/dropdown-menu";

export type UserMenuWidgetProps = {
  onLogout: () => void;
  trigger: React.ReactNode;
}

export default function UserMenuWidget({
  onLogout,
  trigger
}: UserMenuWidgetProps) {
  const platform = usePlatform();
  const currentSession = platform?.session.getSnapshot();
  const user = currentSession?.status === 'authenticated' ? currentSession.user : null;

  if (!user) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <UserAvatarDetails avatar={user.avatar} email={user.email} />
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <AccessContextMenu />
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} variant="destructive">
          <LogOutIcon className="mr-2 size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
