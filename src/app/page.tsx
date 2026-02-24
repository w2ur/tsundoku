"use client";

import { useState } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import KanbanBoard from "@/components/KanbanBoard";
import WelcomeGuide from "@/components/WelcomeGuide";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrollToBookId, setScrollToBookId] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isSearchOpen={isSearchOpen}
        onSearchOpenChange={setIsSearchOpen}
      />
      <main className="flex-1">
        <KanbanBoard
          searchQuery={searchQuery}
          scrollToBookId={scrollToBookId}
          onScrollToBook={setScrollToBookId}
          onClearSearch={() => { setSearchQuery(""); setIsSearchOpen(false); }}
        />
      </main>
      <WelcomeGuide />
      <Footer />
    </div>
  );
}
