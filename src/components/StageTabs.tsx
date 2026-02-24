"use client";

import { useDroppable } from "@dnd-kit/core";
import { STAGES, STAGE_CONFIG } from "@/lib/constants";
import type { Stage } from "@/lib/types";
import { useTranslation } from "@/lib/preferences";

interface StageTabsProps {
  active: Stage;
  counts: Record<Stage, number>;
  onChange: (stage: Stage) => void;
  searchActive?: boolean;
  isDragActive?: boolean;
}

function StageTab({
  stage,
  isActive,
  isDragActive,
  count,
  searchActive,
  hasResults,
  onChange,
}: {
  stage: Stage;
  isActive: boolean;
  isDragActive: boolean;
  count: number;
  searchActive: boolean;
  hasResults: boolean;
  onChange: (stage: Stage) => void;
}) {
  const { t } = useTranslation();
  const { setNodeRef, isOver } = useDroppable({
    id: `tab-${stage}`,
    disabled: !isDragActive || isActive,
  });

  const config = STAGE_CONFIG[stage];
  const isDropTarget = isDragActive && !isActive && isOver;

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
      ref={setNodeRef}
      key={stage}
      onClick={() => onChange(stage)}
      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-all border-b-2 ${
        isActive
          ? "border-forest text-forest"
          : "border-transparent text-forest/40 hover:text-forest/60"
      } ${isDropTarget ? "bg-forest/10 text-forest scale-105" : ""}`}
    >
      <span>{config.emoji}</span>
      <span className="hidden sm:inline">{t(config.labelKey)}</span>
      <span className={`inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-[10px] font-semibold transition-colors ${badgeClass}`}>
        {count}
      </span>
    </button>
  );
}

export default function StageTabs({ active, counts, onChange, searchActive, isDragActive = false }: StageTabsProps) {
  return (
    <div className="flex border-b border-forest/10">
      {STAGES.map((stage) => (
        <StageTab
          key={stage}
          stage={stage}
          isActive={stage === active}
          isDragActive={isDragActive}
          count={counts[stage]}
          searchActive={!!searchActive}
          hasResults={counts[stage] > 0}
          onChange={onChange}
        />
      ))}
    </div>
  );
}
