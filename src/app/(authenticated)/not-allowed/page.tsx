import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotAllowedPage() {
  return (
    <div className="h-screen flex flex-col gap-8 justify-center items-center">
      <p className="text-5xl text-center text-muted-foreground">
        Subscribe for the Pro plan to view this page.
      </p>
      <Link href="/account">
        <Button variant={"secondary"}>See Plans</Button>
      </Link>
    </div>
  );
}
