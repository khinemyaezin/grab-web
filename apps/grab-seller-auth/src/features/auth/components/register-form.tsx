import { FormProvider, useForm } from "react-hook-form";
import { useRegisterMutation } from "../hooks/use-auth";
import { RegisterFormValues } from "../types/auth.form";
import { HateoasLink } from "@khinemyaezin/seller-api";
import { RegisterUserRequest } from "../types/auth.request";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@khinemyaezin/seller-ui/components/field";
import { Input } from "@khinemyaezin/seller-ui/components/input";
import { Button } from "@khinemyaezin/seller-ui/components/button";
import { ButtonStatus } from "@khinemyaezin/seller-ui/components/index";
import { Link } from "react-router";
import { routes } from "@khinemyaezin/seller-contracts";


export type RegisterFormProps = {
  link: HateoasLink;
  onRegisterSuccess: () => void;
  onRegisterError: ({ title, description }: { title: string, description: string }) => void;
}

export function RegisterForm({ link, onRegisterSuccess, onRegisterError }: RegisterFormProps) {
  const form = useForm<RegisterFormValues>();
  const registerMutation = useRegisterMutation();
  const { register, handleSubmit, getValues, formState: { errors } } = form;

  const onSubmit = (formValues: RegisterFormValues) => {

    const payload: RegisterUserRequest = {
      email: formValues.email,
      password: formValues.password,
    }

    registerMutation.mutate({ link: link, request: payload }, {
      onSuccess: () => {
        window.setTimeout(onRegisterSuccess, 700);
      },
      onError: (err) => {
        onRegisterError({ title: "There was a problem" , description: "Unable to create your account."})
      }
    });
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="auth-form" noValidate>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-xl font-bold">Create your Seller Central account.</h1>
            <FieldDescription>
              Already have an account? <Link to={`/${routes.login}`} className="mx-3">
                Sign in
              </Link>
            </FieldDescription>
          </div>
          <Field data-invalid={Boolean(errors.email)}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
              aria-invalid={Boolean(errors.email)}
              placeholder="seller@example.com"
            />
            {errors.email && <FieldError errors={[errors.email]} />}
          </Field>

          <Field data-invalid={Boolean(errors.password)}>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "Password must be at least 8 characters" },
              })}
              aria-invalid={Boolean(errors.password)}
            />
            {errors.password && <FieldError errors={[errors.password]} />}
          </Field>

          <Field data-invalid={Boolean(errors.confirmPassword)}>
            <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) => value === getValues("password") || "Passwords don't match",
              })}
              aria-invalid={Boolean(errors.confirmPassword)}
            />
            {errors.confirmPassword && <FieldError errors={[errors.confirmPassword]} />}
          </Field>

        </FieldGroup>
        <div className="flex items-center justify-center">
          <Button
            type="submit"
            disabled={registerMutation.isPending || registerMutation.isSuccess}
            className="w-full mt-6"
            size="lg"
          >
            <ButtonStatus
              status={
                registerMutation.isPending
                  ? "pending"
                  : registerMutation.isSuccess
                    ? "success"
                    : "idle"
              }
              pendingLabel="Registering..."
              successLabel="Register"
            >
              Save & Continue
            </ButtonStatus>
          </Button>

        </div>
      </form>
    </FormProvider>
  );
}
