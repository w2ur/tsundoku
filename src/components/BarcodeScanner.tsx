"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTranslation } from "@/lib/preferences";

interface Props {
  onScan: (isbn: string) => void;
  onError?: (error: string) => void;
}

export default function BarcodeScanner({ onScan, onError }: Props) {
  const { t } = useTranslation();
  const scannerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"init" | "scanning" | "needs-gesture" | "error">("init");
  const html5QrCodeRef = useRef<import("html5-qrcode").Html5Qrcode | null>(null);
  const stoppedRef = useRef(false);
  const onScanRef = useRef(onScan);
  const onErrorRef = useRef(onError);
  onScanRef.current = onScan;
  onErrorRef.current = onError;

  const tRef = useRef(t);
  tRef.current = t;

  const startScanner = useCallback(async () => {
    if (!scannerRef.current) return;

    // Check if camera API is available
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("error");
      onErrorRef.current?.(tRef.current("scanner_notAvailable"));
      return;
    }

    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      if (stoppedRef.current) return;

      const scanner = new Html5Qrcode("barcode-reader");
      html5QrCodeRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 150 } },
        (decodedText) => {
          const cleaned = decodedText.replace(/[^0-9X]/gi, "");
          if (cleaned.length === 10 || cleaned.length === 13) {
            if (stoppedRef.current) return;
            stoppedRef.current = true;
            scanner.stop()
              .then(() => onScanRef.current(cleaned))
              .catch(() => onScanRef.current(cleaned));
          }
        },
        () => {}
      );
      setStatus("scanning");
    } catch {
      // Camera failed — could be PWA needing user gesture, or denied permission
      setStatus("needs-gesture");
    }
  }, []);

  useEffect(() => {
    // Try auto-start (works when permission already granted or in browser context)
    startScanner();

    return () => {
      stoppedRef.current = true;
      if (html5QrCodeRef.current) {
        try { html5QrCodeRef.current.stop().catch(() => {}); } catch {}
      }
    };
  }, [startScanner]);

  async function handleManualStart() {
    setStatus("init");
    // Clean up previous failed scanner instance
    if (html5QrCodeRef.current) {
      try { await html5QrCodeRef.current.stop().catch(() => {}); } catch {}
      html5QrCodeRef.current = null;
    }
    stoppedRef.current = false;

    try {
      // Request camera with user gesture first
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      // Permission granted — stop this stream and let html5-qrcode take over
      stream.getTracks().forEach((t) => t.stop());
      await startScanner();
    } catch {
      setStatus("error");
      onErrorRef.current?.(tRef.current("scanner_accessError"));
    }
  }

  return (
    <div className="relative">
      <div
        id="barcode-reader"
        ref={scannerRef}
        className="w-full rounded-xl overflow-hidden bg-black"
      />
      {status === "init" && (
        <div className="flex items-center justify-center h-48 bg-cream rounded-xl">
          <p className="text-sm text-forest/30">{t("scanner_init")}</p>
        </div>
      )}
      {status === "needs-gesture" && (
        <div className="flex flex-col items-center justify-center h-48 bg-cream rounded-xl gap-3">
          <p className="text-sm text-forest/50">{t("scanner_permissionRequired")}</p>
          <button
            onClick={handleManualStart}
            className="px-5 py-2.5 bg-forest text-paper rounded-lg text-sm font-medium hover:bg-forest/90 transition-colors"
          >
            {t("scanner_activate")}
          </button>
        </div>
      )}
      {status === "error" && (
        <div className="flex items-center justify-center h-48 bg-cream rounded-xl">
          <p className="text-sm text-forest/40">{t("scanner_unavailable")}</p>
        </div>
      )}
    </div>
  );
}
