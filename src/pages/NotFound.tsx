import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
        Page not found
      </h1>
      <p className="mt-3 text-neutral-600">
        The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
      >
        Back to homepage
      </Link>
    </div>
  );
}
