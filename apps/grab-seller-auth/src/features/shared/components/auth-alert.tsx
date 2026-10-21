import { Alert, AlertTitle, AlertDescription } from "@khinemyaezin/seller-ui/components/alert"
import { AlertTriangleIcon } from "lucide-react"

export type AuthAlertProps = {
    title:string,
    description: string
}

export default function AuthAlert({title, description}:AuthAlertProps) {
    return (
        <Alert className="max-w-md border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
            <AlertTriangleIcon />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>
               {description}
            </AlertDescription>
        </Alert>
    )
}