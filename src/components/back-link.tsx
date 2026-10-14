import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="back-link">
      <ChevronLeft className="size-5" aria-hidden />
      {children}
    </Link>
  );
}
