import Header from "@/components/Header";
import KanbanBoard from "@/components/KanbanBoard";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <KanbanBoard />
      </main>
    </div>
  );
}
