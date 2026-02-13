export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-paper">
      <h1 className="font-serif text-3xl text-forest mb-4">Hors ligne</h1>
      <p className="text-forest/50 text-center max-w-sm">
        Vous êtes actuellement hors ligne. Vos livres sont toujours accessibles,
        mais certaines fonctionnalités nécessitent une connexion internet.
      </p>
      <a
        href="/"
        className="mt-6 px-5 py-2.5 bg-forest text-paper rounded-full text-sm font-medium hover:bg-forest/90 transition-colors"
      >
        Retour à mes livres
      </a>
    </div>
  );
}
