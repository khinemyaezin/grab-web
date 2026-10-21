import { Link } from "react-router";
import { routes } from "@khinemyaezin/seller-contracts";

export default function NotFoundPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Page not found</h1>
      <Link className="underline" to="dashboard">Return to dashboard</Link>
    </main>);
}
