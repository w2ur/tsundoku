import Header from "@/components/Header";
import KanbanBoard from "@/components/KanbanBoard";
import WelcomeGuide from "@/components/WelcomeGuide";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <KanbanBoard />
      </main>
      <WelcomeGuide />
      <footer className="py-4 text-center text-xs text-forest/30">
        Made with care by{" "}
        <a
          href="https://william.revah.paris"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-forest/50 transition-colors"
        >
          William
        </a>
      </footer>
    </div>
  );
}
