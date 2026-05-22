export function AuthField({
  label,
  type = "text",
  name,
}: {
  label: string;
  type?: string;
  name: string;
}) {
  return (
    <label className="block">
      <span className="text-lg font-medium leading-tight text-[#111827] sm:text-xl">{label}</span>
      <input
        name={name}
        type={type}
        className="mt-2 h-11 w-full rounded-lg border border-[#d9dde4] bg-white px-4 text-base text-[#111827] outline-none transition focus:border-[#0f8276] focus:ring-2 focus:ring-[#0f8276]/20 sm:h-12"
      />
    </label>
  );
}
