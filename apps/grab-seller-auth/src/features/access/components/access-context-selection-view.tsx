import { useAccessContextList, useAccessContextSelection } from "@/features/access/hooks/use-access-context";
import { HateoasLink } from "@khinemyaezin/seller-api";
import { Item, ItemContent, ItemTitle, ItemActions } from "@khinemyaezin/seller-ui/components/item";
import { ChevronRight} from "lucide-react";
import { AccessContext, AccessContextSelectionResponse } from "../types";
import { ButtonStatus } from "@khinemyaezin/seller-ui/components/index";
import { useEffect, useRef, useState } from "react";

type AccessContextItemProps = {
    selectionLink: HateoasLink,
    value: AccessContext,
    onSelect?: (assignemntId: string) => void,
    disabled?: boolean,
    onPendingChange?: (isPending: boolean) => void
}

function AccessContextItem({ selectionLink, value, onSelect, disabled, onPendingChange }: AccessContextItemProps) {
    const selectAccessContext = useAccessContextSelection();
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (timerRef.current !== null) {
                clearTimeout(timerRef.current); 
            }
        };
    }, []);

    const handleOnSelect = () => {
        onPendingChange?.(true);
        selectAccessContext.mutate(
            { link: selectionLink },
            {
                onSuccess: (resp: AccessContextSelectionResponse) => {
                    timerRef.current = window.setTimeout(() => {
                        onPendingChange?.(false);
                        onSelect?.(value.assignmentId);
                    }, 900)
                },
                onError: () => {
                    onPendingChange?.(false);
                }
            });
    }

    return (
        <Item variant="outline" size="sm" asChild>
            <button onClick={handleOnSelect} disabled={disabled} className="cursor-pointer hover:bg-muted text-left disabled:opacity-50 disabled:pointer-events-none">
                <ItemContent>
                    <ItemTitle>{value.title}</ItemTitle>
                </ItemContent>
                <ItemActions>
                    <ButtonStatus
                        status={
                            selectAccessContext.isPending
                                ? "pending"
                                : selectAccessContext.isSuccess
                                    ? "success"
                                    : "idle"
                        }
                        pendingLabel=""
                        successLabel=""
                        failedLabel="" >
                        <ChevronRight />
                    </ButtonStatus>
                </ItemActions>
            </button>
        </Item>
    )
}

export type AccessContextSelectionViewProps = {
    link: HateoasLink,
    onSuccess?: (assignemntId: string) => void
}

export default function AccessContextSelectionView({ link, onSuccess }: AccessContextSelectionViewProps) {
    const { data: contexts } = useAccessContextList(link);
    const [isSelecting, setIsSelecting] = useState(false);

    return (
        <div className="flex w-full max-w-md flex-col gap-3 ">
            {(contexts ?? [])
                .filter((value) => value.accessLink)
                .map((value) => (
                    <AccessContextItem 
                        key={value.assignmentId}
                        selectionLink={value.accessLink!} 
                        value={value} 
                        onSelect={onSuccess} 
                        disabled={isSelecting} 
                        onPendingChange={setIsSelecting} 
                    />
                ))}
        </div>
    )
}
