// app/business/register/page.tsx
import { redirect } from "next/navigation";
import { getCurrentUser, getSanityUserByFirebaseId } from "@/lib/firebase-admin";
import { BusinessWizard } from "./wizard";

export default async function Page() {
  const user = await getCurrentUser();

  if (!user) redirect("/sign-in");

  const sanityUser = await getSanityUserByFirebaseId(user.uid);

  if (!sanityUser) {
    throw new Error("Sanity user not found");
  }

  return (
    <BusinessWizard />
  );
}