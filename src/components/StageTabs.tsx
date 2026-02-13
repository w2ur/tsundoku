"use client";

import { STAGES, STAGE_CONFIG } from "@/lib/constants";
import type { Stage } from "@/lib/types";

interface StageTabsProps {
  active: Stage;
  counts: Record<Stage, number>;
  onChange: (stage: Stage) => void;
}

export default function StageTabs({ active, counts, onChange }: StageTabsProps) {
  return (
    <div className="flex border-b border-forest/10 overflow-x-auto">
      {STAGES.map((stage) => {
        const config = STAGE_CONFIG[stage];
        const isActive = stage === active;
        return (
          <button
            key={stage}
            onClick={() => onChange(stage)}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium tracking-wide whitespace-nowrap transition-colors border-b-2 ${
              isActive
                ? "border-forest text-forest"
                : "border-transparent text-forest/40 hover:text-forest/60"
            }`}
          >
            <span>{config.emoji}</span>
            <span className="hidden sm:inline">{config.label}</span>
            <span className="sm:hidden">
              {stage === "a_acheter" ? "Acheter" : stage === "tsundoku" ? "Tsundoku" : stage === "bibliotheque" ? "Biblio" : "Revendre"}
            </span>
            <span className={`inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-[10px] font-semibold ${isActive ? "bg-forest text-paper" : "bg-forest/10 text-forest/50"}`}>
              {counts[stage]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
