import { Header } from "@khinemyaezin/seller-ui";

export default function DashboardPage() {
  return (
    <div className="container mx-auto max-w-5xl p-6">
      <Header title="Seller dashboard" description="Manage your catalog and physical inventory." />
      <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
        Choose Products or Locations from the sidebar.
      </div>
    </div>
  );
}
