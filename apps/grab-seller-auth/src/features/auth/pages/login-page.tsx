import { LoginForm } from "../components/login-form";
import AuthAlert from "@/features/shared/components/auth-alert";
import { useState } from "react";
import { usePlatform } from "@khinemyaezin/seller-ui";
import { useIdentityGet } from "@/features/shared/hook/use-identity";

export default function LoginPage() {
  const { data } = useIdentityGet();
  const platform = usePlatform();
  const [error, setError] = useState<{ title: string, description: string } | undefined>(undefined)

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm grid gap-6">
        {error && <AuthAlert title={error.title} description={error.description} />}

        {data?.login && (
          <LoginForm
            link={data.login}
            onLoginSuccess={() => {
              platform?.events.emit("auth:login-success:v1", {});
            }}
            onLoginError={({ title, description }) => {
              setError({ title, description })
            }}
          />
        )}
      </div>
    </div>
  );
}
