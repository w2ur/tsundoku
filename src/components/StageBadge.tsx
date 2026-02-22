"use client";

import { STAGE_CONFIG } from "@/lib/constants";
import type { Stage } from "@/lib/types";
import { useTranslation } from "@/lib/preferences";

export default function StageBadge({ stage }: { stage: Stage }) {
  const config = STAGE_CONFIG[stage];
  const { t } = useTranslation();
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium tracking-wide uppercase ${config.bgColor} ${config.color}`}
    >
      {config.emoji} {t(config.labelKey)}
    </span>
  );
}
