import { LogOutIcon } from "lucide-react";
import { UserAvatarDetails } from "@khinemyaezin/seller-ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@khinemyaezin/seller-ui/components/dropdown-menu";
import type { User } from "@khinemyaezin/seller-contracts";

export type UserMenuProps = {
  user: User;
  onLogout: () => void;
  trigger: React.ReactNode;
};

export function UserMenu({ user, onLogout, trigger }: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
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
        <DropdownMenuItem onClick={onLogout} variant="destructive">
          <LogOutIcon className="mr-2 size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
