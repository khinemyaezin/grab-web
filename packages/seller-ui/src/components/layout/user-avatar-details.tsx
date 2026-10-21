import { UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function UserAvatarDetails({
  avatar,
  email,
}: {
  avatar?: string;
  email: string;
}) {
  return (
    <>
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarImage src={avatar} alt={email} />
        <AvatarFallback className="rounded-lg"><UserIcon/></AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate">{email}</span>
      </div>
    </>
  );
}
