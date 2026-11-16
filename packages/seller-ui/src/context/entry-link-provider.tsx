import { createContext, ReactNode, useContext } from "react";
import { HateoasLink } from "@khinemyaezin/seller-api";

const ENTRY_LINK_CONTEXT_KEY = Symbol.for("@khinemyaezin/seller-ui/EntryLinkContext");

const EntryLinkContext: React.Context<HateoasLink | null> =
  (globalThis as any)[ENTRY_LINK_CONTEXT_KEY] ??
  ((globalThis as any)[ENTRY_LINK_CONTEXT_KEY] = createContext<HateoasLink | null>(null));

function EntryLinkProvider({ link, children }: { link: HateoasLink, children: ReactNode }) {
  return (
    <EntryLinkContext.Provider value={link}>
      {children}
    </EntryLinkContext.Provider>
  );
}

function useEntryLink() {
  const context = useContext(EntryLinkContext);
  if (!context) {
    throw new Error("Entry link must be used within an LinkProvider");
  }
  return context;
}
export { EntryLinkProvider, useEntryLink };
