"use client";

import { STAGES, STAGE_CONFIG } from "@/lib/constants";
import type { Stage } from "@/lib/types";

interface StageTabsProps {
  active: Stage;
  counts: Record<Stage, number>;
  onChange: (stage: Stage) => void;
  searchActive?: boolean;
}

export default function StageTabs({ active, counts, onChange, searchActive }: StageTabsProps) {
  return (
    <div className="flex border-b border-forest/10">
      {STAGES.map((stage) => {
        const config = STAGE_CONFIG[stage];
        const isActive = stage === active;
        const hasResults = counts[stage] > 0;

        let badgeClass: string;
        if (isActive) {
          badgeClass = "bg-forest text-paper";
        } else if (searchActive && hasResults) {
          badgeClass = "bg-amber/20 text-amber";
        } else if (searchActive && !hasResults) {
          badgeClass = "bg-forest/5 text-forest/20";
        } else {
          badgeClass = "bg-forest/10 text-forest/50";
        }

        return (
          <button
            key={stage}
            onClick={() => onChange(stage)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors border-b-2 ${
              isActive
                ? "border-forest text-forest"
                : "border-transparent text-forest/40 hover:text-forest/60"
            }`}
          >
            <span>{config.emoji}</span>
            <span className="hidden sm:inline">{config.label}</span>
            <span className={`inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-[10px] font-semibold transition-colors ${badgeClass}`}>
              {counts[stage]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
