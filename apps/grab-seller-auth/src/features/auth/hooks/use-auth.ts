import { useMutation, useQuery } from "@tanstack/react-query";
import { HateoasLink } from "@khinemyaezin/seller-api";
import { LoginRequest, RegisterUserRequest } from "../types/auth.request";
import { LoginResponse, RegisterUserReponse } from "../types/auth.response";
import { authService } from "../api/auth";

export const useLoginMutation = () => {
  return useMutation<LoginResponse, Error, { link: HateoasLink, request: LoginRequest }>({
    mutationFn: ({ link, request }) =>
      authService.login(link, request)
  });
};

export const useRegisterMutation = () => {
  return useMutation<RegisterUserReponse, Error, { link: HateoasLink, request: RegisterUserRequest }>({
    mutationFn: ({ link, request }) => authService.registerUser(link, request)
  });
}

export const useProfileGet = (link?: HateoasLink) => {
  return useQuery({
    queryKey: ["profile", link?.href],
    queryFn: () => authService.readProfile(link!),
    enabled: !!link
  })
}