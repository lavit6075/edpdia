export function NotPublished({ label = "Not published" }: { label?: string }) {
  return <span className="text-neutral-400 italic">{label}</span>;
}

export function formatHKD(amount: number | null): React.ReactNode {
  if (amount === null) return <NotPublished />;
  return `HK$${amount.toLocaleString("en-HK")}`;
}
