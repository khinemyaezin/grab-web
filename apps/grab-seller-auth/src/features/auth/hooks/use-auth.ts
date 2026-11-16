import { useMutation, useQuery } from "@tanstack/react-query";
import { HateoasLink } from "@khinemyaezin/seller-api";
import { useApi } from "@khinemyaezin/seller-ui";
import { LoginRequest, RegisterUserRequest } from "../types/auth.request";
import { LoginResponse, RegisterUserReponse } from "../types/auth.response";
import { authService } from "../api/auth";

export const useLoginMutation = () => {
  const api = useApi();
  return useMutation<LoginResponse, Error, { link: HateoasLink; request: LoginRequest }>({
    mutationFn: ({ link, request }) => authService.login(api, link, request),
  });
};

export const useRegisterMutation = () => {
  const api = useApi();
  return useMutation<
    RegisterUserReponse,
    Error,
    { link: HateoasLink; request: RegisterUserRequest }
  >({
    mutationFn: ({ link, request }) => authService.registerUser(api, link, request),
  });
};

export const useProfileGet = (link?: HateoasLink) => {
  const api = useApi();
  return useQuery({
    queryKey: ["profile", link?.href],
    queryFn: () => authService.readProfile(api, link!),
    enabled: !!link,
  });
};
