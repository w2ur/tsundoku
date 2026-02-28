"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { onSyncStatusChange, getSyncStatus, type SyncStatus } from "@/lib/sync";
import { useTranslation } from "@/lib/preferences";

export default function SyncIndicator() {
  const { isSignedIn } = useAuth();
  const { t } = useTranslation();
  const [status, setStatus] = useState<SyncStatus>(getSyncStatus());
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    return onSyncStatusChange(setStatus);
  }, []);

  if (!isSignedIn) return null;

  const label =
    status === "syncing"
      ? t("sync_syncing")
      : status === "unsynced"
        ? t("sync_pending").replace("{count}", "")
        : t("sync_synced");

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={() => setShowTooltip((v) => !v)}
    >
      <div
        className={`relative p-2 rounded-lg transition-colors ${
          status === "syncing" ? "animate-pulse" : ""
        }`}
        aria-label={label}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-forest/40"
        >
          <path d="M2 6h4" />
          <path d="M2 10h4" />
          <path d="M2 14h4" />
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <path d="M12 2v20" />
        </svg>
        {status === "unsynced" && (
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber rounded-full" />
        )}
      </div>
      {showTooltip && (
        <div className="absolute top-full right-0 mt-1 px-2 py-1 bg-surface border border-forest/10 rounded-lg shadow-lg text-xs text-forest whitespace-nowrap z-50">
          {label}
        </div>
      )}
    </div>
  );
}
