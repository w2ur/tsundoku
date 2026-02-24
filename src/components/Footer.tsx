"use client";

import { useTranslation } from "@/lib/preferences";

export default function Footer() {
  const { t } = useTranslation();
  const version = process.env.NEXT_PUBLIC_APP_VERSION;

  return (
    <footer className="py-1.5 md:py-3 flex-shrink-0 text-center text-[11px] text-forest/30">
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
      {" · "}
      <a
        href={`mailto:contact@my-tsundoku.app?subject=${encodeURIComponent("[Tsundoku] " + t("footer_mailtoSubject"))}`}
        className="underline hover:text-forest/50 transition-colors"
      >
        {t("contactMe")}
      </a>
    </footer>
  );
}
