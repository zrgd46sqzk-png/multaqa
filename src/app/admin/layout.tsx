import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin } = await requireAdmin();

  if (!user) redirect("/admin/login");
  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md p-10 text-center">
        <p>This account does not have admin access.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-5xl items-center gap-6 px-4 py-4 text-sm">
          <span className="font-semibold text-brassDark">Multaqa Admin</span>
          <Link href="/admin" className="hover:underline">
            Dashboard
          </Link>
          <Link href="/admin/orders" className="hover:underline">
            Orders
          </Link>
          <Link href="/admin/products" className="hover:underline">
            Products
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
