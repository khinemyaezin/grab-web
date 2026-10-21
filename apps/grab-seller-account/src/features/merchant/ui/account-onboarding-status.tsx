import { Badge } from "@khinemyaezin/seller-ui/components/badge";
import { Card, CardContent } from "@khinemyaezin/seller-ui/components/card";
import { Clock, CheckCircle2, AlertCircle, XCircle, AlertTriangle } from "lucide-react";
import { MerchantStatus, MerchantType } from "@/features/merchant/types";
import { Button } from "@khinemyaezin/seller-ui/components/button";
import { Link } from "react-router";
import { routes } from "@khinemyaezin/seller-contracts";
import { FieldDescription } from "@khinemyaezin/seller-ui/components/field";

export type AccountOnboardingStatusProps = {
    accountStatus: MerchantStatus;
    merchantType?: MerchantType;
}

const merchantTypeLabels: Record<MerchantType, string> = {
    FIRST_PARTY_RETAILER: "First-Party Retailer",
    THIRD_PARTY: "Third-Party",
    C2C_SELLER: "C2C Seller"
};

const statusConfig: Record<MerchantStatus, { icon: React.ReactNode; badge: string; badgeVariant: "default" | "secondary" | "destructive" | "outline"; title: string; description: string; }> = {
    PENDING_REVIEW: {
        icon: <Clock className="size-5" aria-hidden="true" />,
        badge: "In review",
        badgeVariant: "secondary",
        title: "Application under review",
        description: "Thanks for submitting your account details. We’ll notify you when the review is complete."
    },
    CHANGES_REQUESTED: {
        icon: <AlertCircle className="size-5" aria-hidden="true" />,
        badge: "Action required",
        badgeVariant: "destructive",
        title: "Changes requested",
        description: "Please review and update the requested changes to proceed with your application."
    },
    REJECTED: {
        icon: <XCircle className="size-5" aria-hidden="true" />,
        badge: "Rejected",
        badgeVariant: "destructive",
        title: "Application rejected",
        description: "Your application has been rejected. Please contact support for more information."
    },
    ACTIVE: {
        icon: <CheckCircle2 className="size-5" aria-hidden="true" />,
        badge: "Active",
        badgeVariant: "default",
        title: "Account active",
        description: "Your account is now active and ready to use."
    },
    SUSPENDED: {
        icon: <AlertTriangle className="size-5" aria-hidden="true" />,
        badge: "Suspended",
        badgeVariant: "destructive",
        title: "Account suspended",
        description: "Your account is currently suspended. Please contact support."
    },
    CLOSED: {
        icon: <XCircle className="size-5" aria-hidden="true" />,
        badge: "Closed",
        badgeVariant: "secondary",
        title: "Account closed",
        description: "Your account has been closed."
    },
    DRAFT: {
        icon: <Clock className="size-5" aria-hidden="true" />,
        badge: "Draft",
        badgeVariant: "outline",
        title: "Application in progress",
        description: "Your application is currently a draft. Please complete it to proceed."
    }
};

export default function AccountOnboardingStatus({ accountStatus, merchantType }: AccountOnboardingStatusProps) {
    const config = statusConfig[accountStatus] || statusConfig.PENDING_REVIEW;

    return (
        <Card
            role="status"
            aria-labelledby="application-review-title"
            className="gap-0 py-0 shadow-none"
        >
            <CardContent className="p-5 sm:p-6">
                <div className="flex items-start gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        {config.icon}
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex gap-2 mb-3">
                            {merchantType && (
                                <Badge variant="outline">
                                    {merchantTypeLabels[merchantType]}
                                </Badge>
                            )}
                            <Badge variant={config.badgeVariant}>
                                {config.badge}
                            </Badge>
                        </div>
                        <h2
                            id="application-review-title"
                            className="text-lg font-semibold tracking-tight"
                        >
                            {config.title}
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            {config.description}
                        </p>
                        <div className="flex justify-end mt-6">
                            <Link to={`/${routes.home}`} className="mx-3">
                                OK
                            </Link>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
