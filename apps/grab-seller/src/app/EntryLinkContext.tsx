import { createContext, useContext } from "react";
import type { HateoasLink, ModuleName } from "@khinemyaezin/seller-api";

export type ModuleLinksValue = Partial<Record<ModuleName, HateoasLink>>;

export const EntryLinkContext = createContext<ModuleLinksValue | null | undefined>(undefined);

export function useEntryLinks(): ModuleLinksValue | null {
  const value = useContext(EntryLinkContext);
  if (value === undefined) {
    throw new Error("useEntryLinks must be used within EntryLinkProvider");
  }
  return value;
}

export function useEntryLink(module: ModuleName): HateoasLink | null {
  return useEntryLinks()?.[module] ?? null;
}
