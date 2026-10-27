import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/auth";
import { TopNav } from "@/components/layout/top-nav";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { PrivacyProvider } from "@/components/privacy/privacy-provider";
import { PRIVACY_COOKIE } from "@/lib/privacy";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const privacyHidden =
    (await cookies()).get(PRIVACY_COOKIE)?.value === "1";

  return (
    <PrivacyProvider initialHidden={privacyHidden}>
    <div className="flex min-h-screen flex-col">
      <TopNav email={user.email} />
      <main className="mx-auto w-full max-w-[1320px] flex-1 px-4 pt-6 pb-24 md:px-8 md:pt-8 lg:pb-12">
        {children}
      </main>
      <MobileBottomNav />
    </div>
    </PrivacyProvider>
  );
}
