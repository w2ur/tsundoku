"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/preferences";

export default function AddButton() {
  const { t } = useTranslation();
  const [stage, setStage] = useState("tsundoku");

  useEffect(() => {
    const syncStage = () => {
      const params = new URLSearchParams(window.location.search);
      setStage(params.get("stage") || "tsundoku");
    };
    syncStage();
    window.addEventListener("popstate", syncStage);
    return () => window.removeEventListener("popstate", syncStage);
  }, []);

  const href = `/add?stage=${stage}`;

  return (
    <Link
      href={href}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-forest text-paper shadow-lg hover:bg-forest/90 active:scale-95 transition-all"
      aria-label={t("addButton_label")}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" />
        <path d="M12 5v14" />
      </svg>
    </Link>
  );
}
