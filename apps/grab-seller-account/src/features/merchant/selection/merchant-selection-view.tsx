import { FieldLegend, FieldSet, Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@khinemyaezin/seller-ui/components/index"
import { ChevronRightIcon } from "lucide-react"
import { Link } from "react-router"
import { routes } from "@khinemyaezin/seller-contracts"
import { useId } from "react"

export type MerchantTypeSelectionViewProps = {
}

export default function MerchantTypeSelectionView({ }: MerchantTypeSelectionViewProps) {
    const id = useId();
    const items = [
        {
            title: "Individual Seller (C2C)",
            description: "For individuals and small independent sellers.",
            route: routes.individualOnboarding
        },
        {
            title: "Retailer & Business",
            description: "For registered businesses and enterprise retailers.",
            route: routes.retailerOnboarding
        }
    ]
    return (
        <FieldSet>
            <FieldLegend>What type of business do you have?</FieldLegend>
            <div className="flex w-full max-w-md flex-col gap-3">
                {items.map((value,index) => (
                    <Item variant="outline" key={`${id}-${index}`} asChild>
                        <Link to={value.route}>
                            <ItemContent>
                                <ItemTitle>{value.title}</ItemTitle>
                                <ItemDescription>
                                    {value.description}
                                </ItemDescription>
                            </ItemContent>
                            <ItemActions>
                                <ChevronRightIcon className="size-4" />
                            </ItemActions>
                        </Link>
                    </Item>
                ))}

            </div>
        </FieldSet>
    )
}