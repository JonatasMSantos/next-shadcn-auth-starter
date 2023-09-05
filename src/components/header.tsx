import Link from "next/link";
import { Logo } from "./logo";
import { Separator } from "./ui/separator";
import { TeamSwitcher } from "./team-switcher";
import { UserNav } from "./user-nav";
import { Suspense } from "react";
import { Skeleton } from "./ui/skeleton";
import { Notifications } from "./notifications";

export function Header() {
  return (
    <div className="flex h-16 items-center justify-between border-b px-6">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Logo className="h-8 w-8" />
        </Link>

        <Separator orientation="vertical" className="h-5" />

        <TeamSwitcher />
      </div>

      <div className="flex items-center gap-4">
        <Separator orientation="vertical" className="h-5" />

        <Notifications />

        <Suspense fallback={<Skeleton className="h-8 w-8 rounded-full" />}>
          <UserNav />
        </Suspense>
      </div>
    </div>
  );
}
