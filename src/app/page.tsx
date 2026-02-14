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
    </div>
  );
}
