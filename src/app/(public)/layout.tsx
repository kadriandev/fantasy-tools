import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { auth, login } from "@/lib/auth/actions";
import Link from "next/link";
import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  const subject = await auth();
  return (
    <>
      <header className="w-full p-3">
        <nav className="w-full flex items-center justify-between">
          <span className="flex items-center gap-3">
            <h1 className="text-xl font-bold align-middle">FantasyTools</h1>
            <ul className="text-lg flex gap-3">
              <li>Home</li>
              <li>Pricing</li>
            </ul>
          </span>
          <span className="flex gap-3 items-center">
            <ThemeSwitcher />
            {!subject ? (
              <Button onClick={login}>Sign In With Yahoo</Button>
            ) : (
              <Button variant="outline">
                <Link href="/fantasy">Go to App</Link>
              </Button>
            )}
          </span>
        </nav>
      </header>

      <main className="flex flex-col min-h-screen">{children}</main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 FantasyTools. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </>
  );
}
