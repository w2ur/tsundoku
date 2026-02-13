import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-paper">
      <h1 className="font-serif text-5xl text-forest mb-2">404</h1>
      <p className="text-forest/50 text-center max-w-sm mb-6">
        Cette page n&apos;existe pas — comme un livre perdu dans les rayonnages.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 bg-forest text-paper rounded-full text-sm font-medium hover:bg-forest/90 transition-colors"
      >
        Retour à la bibliothèque
      </Link>
    </div>
  );
}
