export function AuthField({
  label,
  type = "text",
  name,
  options,
}: {
  label: string;
  type?: string;
  name: string;
  options?: { label: string; value: string }[];
}) {
  return (
    <label className="block">
      <span className="text-lg font-medium leading-tight text-[#111827] sm:text-xl">{label}</span>
      {type === "select" ? (
        <select
          name={name}
          className="mt-2 h-11 w-full rounded-lg border border-[#d9dde4] bg-white px-4 text-base text-[#111827] outline-none transition focus:border-[#0f8276] focus:ring-2 focus:ring-[#0f8276]/20 sm:h-12 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%208l5%205%205-5%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_12px_center] bg-no-repeat"
        >
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.value === ""}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          name={name}
          type={type}
          className="mt-2 h-11 w-full rounded-lg border border-[#d9dde4] bg-white px-4 text-base text-[#111827] outline-none transition focus:border-[#0f8276] focus:ring-2 focus:ring-[#0f8276]/20 sm:h-12"
        />
      )}
    </label>
  );
}
