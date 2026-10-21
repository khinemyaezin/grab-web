import { RegisterForm } from "../components/register-form";
import { useIdentityGet } from "@/features/shared/hook/use-identity";
import { useState } from "react";
import AuthAlert from "@/features/shared/components/auth-alert";
import { usePlatform } from "@khinemyaezin/seller-ui";

export default function RegisterPage() {
  const { data } = useIdentityGet();
  const platform = usePlatform();
  const [error, setError] = useState<{ title: string, description: string } | undefined>(undefined)

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm grid gap-6">
        {error && <AuthAlert title={error.title} description={error.description} />}

        {data?.register && (
          <RegisterForm
            link={data.register}
            onRegisterSuccess={() => {
              (platform?.events)?.emit("auth:registration-success:v1", {});
            }}
            onRegisterError={({ title, description }: { title: string; description: string; }) => {
              setError({ title, description })
            }} />
        )}
      </div>
    </div>
  );
}
