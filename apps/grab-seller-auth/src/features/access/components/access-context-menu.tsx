import {
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  Skeleton,
} from "@khinemyaezin/seller-ui/components/index";
import { useAccessContextList, useAccessContextSelection } from "../hooks/use-access-context";
import { useIdentityGet } from "@/features/shared/hook/use-identity";
import { usePlatform, useSessionSnapshot } from "@khinemyaezin/seller-ui";
import { useState } from "react";

export default function AccessContextMenu() {
  const { data: identity } = useIdentityGet();
  const platform = usePlatform();
  const { data: accessContext, isPending } = useAccessContextList(identity?.listAccessContext);
  const selectAccessContext = useAccessContextSelection();
  const contextList = accessContext ?? [];

  const currentSession = useSessionSnapshot();
  const currentAssignmentId =
    currentSession.status === "authenticated"
      ? currentSession.user.currentAccessContext?.assignmentId
      : undefined;

  const [overrideAssignmentId, setOverrideAssignmentId] = useState<string | null>(null);
  const selectedAssignmentId = overrideAssignmentId ?? currentAssignmentId ?? "";

  const handleValueChange = (newAssignmentId: string) => {
    setOverrideAssignmentId(newAssignmentId);

    const selectedContext = contextList.find((c) => c.assignmentId === newAssignmentId);
    if (!selectedContext?.accessLink) {
      setOverrideAssignmentId(null);
      return;
    }

    selectAccessContext.mutate(
      { link: selectedContext.accessLink },
      {
        onSuccess: () => {
          setOverrideAssignmentId(null);
          platform?.events?.emit("auth:context-selected:v1", { assignmentId: newAssignmentId });
        },
        onError: () => {
          setOverrideAssignmentId(null);
        },
      },
    );
  };

  return (
    <DropdownMenuGroup>
      <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
      {isPending ? (
        <div className="flex w-full max-w-xs flex-col gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ) : (
        <DropdownMenuRadioGroup value={selectedAssignmentId} onValueChange={handleValueChange}>
          {contextList.map((context) => (
            <DropdownMenuRadioItem key={context.assignmentId} value={context.assignmentId}>
              <span className="flex flex-col">
                <span>{context.title}</span>
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      )}
    </DropdownMenuGroup>
  );
}
