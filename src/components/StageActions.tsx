"use client";

import { STAGE_TRANSITIONS } from "@/lib/constants";
import { moveBookToPosition } from "@/lib/books";
import type { Stage } from "@/lib/types";

interface Props {
  bookId: string;
  stage: Stage;
  onMoved?: () => void;
}

export default function StageActions({ bookId, stage, onMoved }: Props) {
  const transitions = STAGE_TRANSITIONS[stage];

  async function handleMove(nextStage: Stage) {
    await moveBookToPosition(bookId, nextStage, 0);
    onMoved?.();
  }

  return (
    <div className="flex flex-col gap-2">
      {transitions.map((t) => (
        <button
          key={t.next}
          onClick={() => handleMove(t.next)}
          className="w-full py-3 bg-forest text-paper rounded-lg font-medium text-sm hover:bg-forest/90 transition-colors"
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
