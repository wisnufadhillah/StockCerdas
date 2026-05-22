import Link from "next/link";

export function ButtonLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "light";
}) {
  const className = {
    primary:
      "inline-flex h-9 items-center justify-center rounded-lg bg-[#0f8276] px-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#0b6f66] focus:outline-none focus:ring-2 focus:ring-[#0f8276] focus:ring-offset-2 sm:h-10 sm:px-5 sm:text-sm",
    secondary:
      "inline-flex h-9 items-center justify-center rounded-lg border-2 border-[#4b5563] px-3 text-xs font-bold text-[#1f2937] transition hover:border-[#0f8276] hover:text-[#0f8276] focus:outline-none focus:ring-2 focus:ring-[#0f8276] focus:ring-offset-2 sm:h-10 sm:px-5 sm:text-sm",
    light:
      "inline-flex h-10 items-center justify-center rounded-lg bg-white px-5 text-sm font-bold text-[#0f8276] shadow-sm transition hover:bg-[#eef7f5] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0f8276] sm:h-12 sm:px-6 sm:text-base",
  }[variant];

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
