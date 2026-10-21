import { useEffect } from "react";
import { useNavigate } from "react-router";
import { routes } from "@khinemyaezin/seller-contracts";
import { useAuth } from "../app/AuthContext";

export function useMerchantOnboardingEffect() {
  const navigate = useNavigate();
  const { platform } = useAuth();

  useEffect(() => {
    const unsubRegSuccess = platform.events.subscribe(
      "seller-merchant:registration-success:v1",
      () => {
        navigate(routes.home, { replace: true });
      },
    );

    return () => {
      unsubRegSuccess();
    };
  }, [navigate, platform.events]);
}