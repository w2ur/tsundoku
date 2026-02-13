"use client";

import { useRef, useState, useCallback } from "react";

interface Props {
  onCapture: (dataUrl: string) => void;
}

export default function CameraCapture({ onCapture }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState("");

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 800 }, height: { ideal: 1200 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreaming(true);
      }
    } catch {
      setError("Impossible d'accéder à la caméra.");
    }
  }, []);

  function capture() {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    const maxSize = 400;
    const ratio = Math.min(maxSize / video.videoWidth, maxSize / video.videoHeight);
    canvas.width = video.videoWidth * ratio;
    canvas.height = video.videoHeight * ratio;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.7);

    // Stop camera
    const stream = video.srcObject as MediaStream;
    stream?.getTracks().forEach((t) => t.stop());
    setStreaming(false);

    onCapture(dataUrl);
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxSize = 400;
        const ratio = Math.min(maxSize / img.width, maxSize / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        onCapture(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  if (error) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-red-500 text-center">{error}</p>
        <label className="block w-full py-3 bg-forest text-paper rounded-lg font-medium text-sm text-center cursor-pointer hover:bg-forest/90 transition-colors">
          Choisir une image
          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative rounded-xl overflow-hidden bg-black aspect-[3/4]">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        {!streaming && (
          <div className="absolute inset-0 flex items-center justify-center bg-cream">
            <button
              onClick={startCamera}
              className="px-6 py-3 bg-forest text-paper rounded-lg text-sm font-medium"
            >
              Activer la caméra
            </button>
          </div>
        )}
      </div>

      {streaming && (
        <button
          onClick={capture}
          className="w-full py-3 bg-forest text-paper rounded-lg font-medium text-sm hover:bg-forest/90 transition-colors"
        >
          Capturer
        </button>
      )}

      <div className="text-center">
        <label className="text-sm text-forest/40 underline cursor-pointer hover:text-forest/60 transition-colors">
          Ou choisir un fichier
          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>
    </div>
  );
}
