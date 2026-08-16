"use client";

export default function ReposError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 lg:px-6 text-center space-y-3">
      <p className="text-sm text-red-500">Failed to load repositories.</p>
      <p className="text-xs text-gray-400">{error.message}</p>
      <button
        onClick={reset}
        className="text-xs underline text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
      >
        Try again
      </button>
    </div>
  );
}
