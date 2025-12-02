"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function SessionExpiredDialog() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const sessionExpired = searchParams.get("session_expired");
    if (sessionExpired === "true") {
      setOpen(true);
    }
  }, [searchParams]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetch("/api/session");

      // Close dialog and remove search param
      handleClose();
      // Reload the page to reflect the refreshed session
      // window.location.reload();
    } catch (error) {
      console.error("Failed to refresh session:", error);
      setIsRefreshing(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    // Remove the session_expired param from URL
    const params = new URLSearchParams(searchParams.toString());
    params.delete("session_expired");
    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;
    router.replace(newUrl);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Session Expired</DialogTitle>
          <DialogDescription>
            Your Yahoo Fantasy session has expired. Please refresh your session
            to continue using the app.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isRefreshing}
          >
            Cancel
          </Button>
          <Button onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? "Refreshing..." : "Refresh Session"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
