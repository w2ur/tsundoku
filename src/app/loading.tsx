export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-paper">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-forest/20 border-t-forest/60 rounded-full animate-spin" />
        <p className="text-sm text-forest/30">Chargement...</p>
      </div>
    </div>
  );
}
