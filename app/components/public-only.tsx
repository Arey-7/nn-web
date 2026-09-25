"use client";

import { usePathname } from "next/navigation";

/**
 * Keeps site chrome off the internal tools.
 *
 * The footer is a pitch: "Let's make something that matters", the public nav
 * and the social links. That belongs in front of someone deciding whether to
 * hire the agency, not underneath a costing tool being used by the people who
 * work there — and least of all under its password screen.
 *
 * Its children stay server components; this only decides whether to render
 * them. usePathname resolves during the server render too, so nothing flashes
 * in and out on hydration.
 */
const INTERNAL = ["/quote-calculator"];

export default function PublicOnly({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const internal = INTERNAL.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  return internal ? null : <>{children}</>;
}
