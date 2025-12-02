import { SessionExpiredDialog } from "./session-expired-dialog";

export default async function AuthWrapper({
  children,
  session_expired,
}: {
  children: React.ReactNode;
  session_expired: boolean;
}) {
  if (session_expired) {
    return (
      <>
        <SessionExpiredDialog />
      </>
    );
  }

  return <>{children}</>;
}
