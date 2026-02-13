"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-paper">
      <h1 className="font-serif text-3xl text-forest mb-2">Oups</h1>
      <p className="text-forest/50 text-center max-w-sm mb-6">
        Une erreur inattendue s&apos;est produite.
      </p>
      <button
        onClick={reset}
        className="px-5 py-2.5 bg-forest text-paper rounded-full text-sm font-medium hover:bg-forest/90 transition-colors"
      >
        Réessayer
      </button>
    </div>
  );
}
