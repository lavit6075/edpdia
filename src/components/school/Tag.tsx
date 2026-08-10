interface TagProps {
  children: React.ReactNode;
  variant?: "brand" | "accent" | "neutral";
}

const variantClasses: Record<NonNullable<TagProps["variant"]>, string> = {
  brand: "bg-brand-50 text-brand-700",
  accent: "bg-accent-50 text-accent-700",
  neutral: "bg-neutral-100 text-neutral-700",
};

export function Tag({ children, variant = "neutral" }: TagProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
}
