export default function Footer() {
  const version = process.env.NEXT_PUBLIC_APP_VERSION;

  return (
    <footer className="py-4 text-center text-xs text-forest/30 space-y-1">
      <div>
        Made with care by{" "}
        <a
          href="https://william.revah.paris"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-forest/50 transition-colors"
        >
          William
        </a>
        {version && (
          <>
            {" · "}
            <span>v{version}</span>
          </>
        )}
      </div>
      <div>
        <a
          href="mailto:contact@my-tsundoku.app?subject=%5BTsundoku%5D%20Retour%20utilisateur"
          className="underline hover:text-forest/50 transition-colors"
        >
          Me contacter
        </a>
      </div>
    </footer>
  );
}
