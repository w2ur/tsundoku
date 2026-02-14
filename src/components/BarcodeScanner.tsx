"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  onScan: (isbn: string) => void;
  onError?: (error: string) => void;
}

export default function BarcodeScanner({ onScan, onError }: Props) {
  const scannerRef = useRef<HTMLDivElement>(null);
  const [scanning, setScanning] = useState(false);
  const html5QrCodeRef = useRef<import("html5-qrcode").Html5Qrcode | null>(null);
  const stoppedRef = useRef(false);
  const onScanRef = useRef(onScan);
  const onErrorRef = useRef(onError);
  onScanRef.current = onScan;
  onErrorRef.current = onError;

  useEffect(() => {
    let mounted = true;

    async function startScanner() {
      const { Html5Qrcode } = await import("html5-qrcode");
      if (!mounted || !scannerRef.current) return;

      try {
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
        if (mounted) setScanning(true);
      } catch {
        if (mounted) {
          onErrorRef.current?.("Impossible d'accéder à la caméra. Vérifiez les permissions.");
        }
      }
    }

    startScanner();

    return () => {
      mounted = false;
      if (html5QrCodeRef.current && !stoppedRef.current) {
        stoppedRef.current = true;
        try { html5QrCodeRef.current.stop().catch(() => {}); } catch {}
      }
    };
  }, []);

  return (
    <div className="relative">
      <div
        id="barcode-reader"
        ref={scannerRef}
        className="w-full rounded-xl overflow-hidden bg-black"
      />
      {!scanning && (
        <div className="flex items-center justify-center h-48 bg-cream rounded-xl">
          <p className="text-sm text-forest/30">Initialisation de la caméra...</p>
        </div>
      )}
    </div>
  );
}
