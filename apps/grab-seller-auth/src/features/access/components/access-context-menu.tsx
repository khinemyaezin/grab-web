import { DropdownMenuGroup, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, Skeleton } from "@khinemyaezin/seller-ui/components/index";
import { useAccessContextList, useAccessContextSelection } from "../hooks/use-access-context";
import { useIdentityGet } from "@/features/shared/hook/use-identity";
import { usePlatform } from "@khinemyaezin/seller-ui";
import { useEffect, useState } from "react";

export default function AccessContextMenu() {
    const { data: identity } = useIdentityGet();
    const platform = usePlatform();
    const { data: accessContext, isPending } = useAccessContextList(identity?.listAccessContext);
    const selectAccessContext = useAccessContextSelection();
    const contextList = accessContext ?? [];

    const currentSession = platform?.session.getSnapshot();
    const currentAssignmentId = currentSession?.status === 'authenticated'
        ? currentSession.user.currentAccessContext?.assignmentId
        : undefined;

    const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>(currentAssignmentId ?? "");

    useEffect(() => {
        if (currentAssignmentId) {
            setSelectedAssignmentId(currentAssignmentId);
        }
    }, [currentAssignmentId]);

    const handleValueChange = (newAssignmentId: string) => {
        setSelectedAssignmentId(newAssignmentId);

        const selectedContext = contextList.find(c => c.assignmentId === newAssignmentId);
        if (!selectedContext?.accessLink) {
            if (currentAssignmentId) {
                setSelectedAssignmentId(currentAssignmentId);
            }
            return;
        }

        selectAccessContext.mutate(
            { link: selectedContext.accessLink },
            {
                onSuccess: () => {
                    (platform?.events)?.emit("auth:context-selected:v1", { assignmentId: newAssignmentId });
                },
                onError: () => {
                    if (currentAssignmentId) {
                        setSelectedAssignmentId(currentAssignmentId);
                    }
                }
            }
        );
    }

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
    )
}
