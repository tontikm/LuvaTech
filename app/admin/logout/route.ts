import { adminLogoutAction } from "@/app/admin/actions";

export async function POST() {
  await adminLogoutAction();
}
