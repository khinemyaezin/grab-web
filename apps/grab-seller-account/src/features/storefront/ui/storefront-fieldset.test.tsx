import { describe, expect, it } from "vitest";
import { FormProvider, useForm } from "react-hook-form";
import { render, screen } from "@testing-library/react";
import { StorefrontFieldset } from "./storefront-fieldset";
import type { StorefrontFormValues } from "@/features/storefront/types";

function Harness({ salesChannelId }: { salesChannelId?: string }) {
  const form = useForm<StorefrontFormValues>({
    defaultValues: { name: "Main Shop", slug: "main-shop" },
  });
  return (
    <FormProvider {...form}>
      <StorefrontFieldset salesChannelId={salesChannelId} />
    </FormProvider>
  );
}

describe("StorefrontFieldset", () => {
  it("describes the storefront as website-channel branding", () => {
    render(<Harness />);
    expect(
      screen.getByText(/brands your website channel/i),
    ).toBeInTheDocument();
  });

  it("shows a read-only website channel id when present", () => {
    render(<Harness salesChannelId="c0000000-0000-4000-8000-000000000002" />);
    expect(screen.getByLabelText("Website channel")).toHaveValue(
      "c0000000-0000-4000-8000-000000000002",
    );
  });
});
