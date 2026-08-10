interface PagePlaceholderProps {
  title: string;
  description?: string;
}

export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">{title}</h1>
      {description && (
        <p className="mt-3 text-neutral-600">{description}</p>
      )}
      <p className="mt-6 text-sm text-neutral-400">This page is under construction.</p>
    </div>
  );
}
