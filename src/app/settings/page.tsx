"use client";

import { useState } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ExportButton from "@/components/ExportButton";
import ImportButton from "@/components/ImportButton";
import { useBooksByStage } from "@/hooks/useBooks";
import { STAGES, STAGE_CONFIG } from "@/lib/constants";
import { roadmap } from "@/lib/roadmap";
import { changelog } from "@/lib/changelog";
import { useTranslation, useTheme } from "@/lib/preferences";
import { plural } from "@/lib/i18n";

export default function SettingsPage() {
  const booksByStage = useBooksByStage();
  const totalBooks = booksByStage
    ? STAGES.reduce((sum, s) => sum + booksByStage[s].length, 0)
    : 0;
  const { t, locale, setLocale } = useTranslation();
  const { theme, setTheme } = useTheme();

  const [showPreferences, setShowPreferences] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(
    () => new Set()
  );

  const toggleVersion = (version: string) => {
    setExpandedVersions((prev) => {
      const next = new Set(prev);
      if (next.has(version)) {
        next.delete(version);
      } else {
        next.add(version);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 px-4 py-8 max-w-lg mx-auto w-full">
        <h1 className="font-serif text-2xl text-forest mb-8">{t("settings_title")}</h1>

        {booksByStage && (
          <section className="mb-8">
            <h2 className="text-sm font-semibold tracking-widest uppercase text-forest/60 mb-3">
              {t("settings_library")}
            </h2>
            <div className="bg-surface border border-forest/8 rounded-xl p-4 space-y-2">
              <p className="text-sm text-ink font-medium">
                {plural(totalBooks, t("settings_bookCount_one"), t("settings_bookCount_other"))}
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {STAGES.map((stage) => (
                  <div key={stage} className="flex items-center gap-1.5 text-xs text-forest/50">
                    <span>{STAGE_CONFIG[stage].emoji}</span>
                    <span>{t(STAGE_CONFIG[stage].labelKey)}</span>
                    <span className="ml-auto font-medium text-forest/70">
                      {booksByStage[stage].length}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="space-y-4">
          <h2 className="text-sm font-semibold tracking-widest uppercase text-forest/60">
            {t("settings_backup")}
          </h2>
          <p className="text-xs text-forest/40">
            {t("settings_backupDesc")}
          </p>
          <ExportButton />
          <ImportButton />
        </section>

        <section className="mt-8">
          <button
            onClick={() => setShowPreferences((prev) => !prev)}
            className="flex items-center gap-2 mb-3 group"
          >
            <h2 className="text-sm font-semibold tracking-widest uppercase text-forest/60">
              {t("preferences_title")}
            </h2>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`text-forest/30 transition-transform ${
                showPreferences ? "rotate-180" : ""
              }`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {showPreferences && (
            <div className="bg-surface border border-forest/8 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-forest/70">{t("preferences_language")}</span>
                <div className="flex rounded-lg overflow-hidden border border-forest/15">
                  <button
                    onClick={() => setLocale("fr")}
                    className={`w-10 py-1.5 text-xs font-medium transition-colors ${
                      locale === "fr"
                        ? "bg-amber text-white"
                        : "bg-transparent text-forest/60 hover:bg-forest/5"
                    }`}
                  >
                    FR
                  </button>
                  <button
                    onClick={() => setLocale("en")}
                    className={`w-10 py-1.5 text-xs font-medium transition-colors ${
                      locale === "en"
                        ? "bg-amber text-white"
                        : "bg-transparent text-forest/60 hover:bg-forest/5"
                    }`}
                  >
                    EN
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-forest/70">{t("preferences_appearance")}</span>
                <div className="flex rounded-lg overflow-hidden border border-forest/15">
                  <button
                    onClick={() => setTheme("light")}
                    className={`w-10 py-1.5 text-sm transition-colors ${
                      theme === "light"
                        ? "bg-amber text-white"
                        : "bg-transparent text-forest/60 hover:bg-forest/5"
                    }`}
                  >
                    ☀️
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={`w-10 py-1.5 text-sm transition-colors ${
                      theme === "dark"
                        ? "bg-amber text-white"
                        : "bg-transparent text-forest/60 hover:bg-forest/5"
                    }`}
                  >
                    🌙
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="mt-8">
          <button
            onClick={() => setShowRoadmap((prev) => !prev)}
            className="flex items-center gap-2 mb-3 group"
          >
            <h2 className="text-sm font-semibold tracking-widest uppercase text-forest/60">
              {t("settings_roadmap")}
            </h2>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`text-forest/30 transition-transform ${
                showRoadmap ? "rotate-180" : ""
              }`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {showRoadmap && <>
            <div className="bg-surface border border-forest/8 rounded-xl p-4 space-y-3">
              {roadmap[locale].map((item) => (
                <div key={item.title} className="flex gap-3">
                  <span className="text-base leading-relaxed">{item.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-ink">{item.title}</p>
                    <p className="text-xs text-forest/40">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-forest/30 mt-2 italic">
              {t("settings_roadmapDisclaimer")}{" "}
              <a
                href={`mailto:contact@my-tsundoku.app?subject=${encodeURIComponent("[Tsundoku] " + t("settings_mailtoSubject"))}`}
                className="underline hover:text-forest/50 transition-colors"
              >
                {t("contactMe")}
              </a>
            </p>
          </>}
        </section>

        <section className="mt-8">
          <button
            onClick={() => setShowChangelog((prev) => !prev)}
            className="flex items-center gap-2 mb-3 group"
          >
            <h2 className="text-sm font-semibold tracking-widest uppercase text-forest/60">
              {t("settings_changelog")}
            </h2>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`text-forest/30 transition-transform ${
                showChangelog ? "rotate-180" : ""
              }`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {showChangelog && <div className="space-y-2">
            {changelog.map((entry) => {
              const isExpanded = expandedVersions.has(entry.version);
              return (
                <div
                  key={entry.version}
                  className="bg-surface border border-forest/8 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => toggleVersion(entry.version)}
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <span className="text-sm font-medium text-ink">
                      v{entry.version}{" "}
                      <span className="text-forest/40 font-normal">
                        ·{" "}
                        {new Date(
                          entry.date + "T00:00:00"
                        ).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`text-forest/30 transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {isExpanded && (
                    <ul className="px-4 pb-4 space-y-1">
                      {entry.changes[locale].map((change, i) => (
                        <li
                          key={i}
                          className="text-xs text-forest/50 flex gap-2"
                        >
                          <span className="text-forest/20">•</span>
                          {change}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>}
        </section>

        <section className="mt-12 pt-8 border-t border-forest/10">
          <h2 className="text-sm font-semibold tracking-widest uppercase text-forest/60 mb-2">
            {t("settings_about")}
          </h2>
          <p className="text-xs text-forest/40 leading-relaxed">
            {t("settings_aboutDesc")}
          </p>
          <div className="flex items-center gap-3 mt-3">
            <a
              href="https://github.com/w2ur/tsundoku"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-forest/40 hover:text-forest/60 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
