import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return <div className="m-10">{children}</div>;
}
