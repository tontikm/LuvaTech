import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const initialError =
    params.error === "unauthorized"
      ? "You do not have admin access."
      : undefined;

  return <AdminLoginForm initialError={initialError} />;
}
