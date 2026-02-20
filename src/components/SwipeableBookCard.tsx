"use client";

import { useRef } from "react";
import { motion, useMotionValue, useTransform, type PanInfo } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { STAGES, STAGE_CONFIG } from "@/lib/constants";
import { updateBookStage } from "@/lib/books";
import type { Book, Stage } from "@/lib/types";

const SWIPE_THRESHOLD = 80;

export default function SwipeableBookCard({ book }: { book: Book }) {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5]);
  const constraintRef = useRef(null);

  const stageIndex = STAGES.indexOf(book.stage);
  const canSwipeRight = stageIndex < STAGES.length - 1;
  const canSwipeLeft = stageIndex > 0;

  const nextStage = canSwipeRight ? STAGES[stageIndex + 1] : null;
  const prevStage = canSwipeLeft ? STAGES[stageIndex - 1] : null;

  async function handleDragEnd(_: unknown, info: PanInfo) {
    const offset = info.offset.x;
    if (offset > SWIPE_THRESHOLD && nextStage) {
      await updateBookStage(book.id, nextStage);
    } else if (offset < -SWIPE_THRESHOLD && prevStage) {
      await updateBookStage(book.id, prevStage);
    }
  }

  return (
    <div ref={constraintRef} className="relative overflow-hidden rounded-xl">
      {/* Swipe indicators */}
      <div className="absolute inset-y-0 left-0 w-20 flex items-center justify-start pl-3 text-xs text-forest/30">
        {nextStage && <span>{STAGE_CONFIG[nextStage].emoji}</span>}
      </div>
      <div className="absolute inset-y-0 right-0 w-20 flex items-center justify-end pr-3 text-xs text-forest/30">
        {prevStage && <span>{STAGE_CONFIG[prevStage].emoji}</span>}
      </div>

      <motion.div
        drag="x"
        dragConstraints={{ left: canSwipeLeft ? -150 : 0, right: canSwipeRight ? 150 : 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        style={{ x, opacity }}
        className="relative z-10"
      >
        <Link
          href={`/book/${book.id}`}
          className="group flex gap-3 p-3 rounded-xl bg-white border border-forest/5 shadow-sm"
          onClick={(e) => {
            if (Math.abs(x.get()) > 5) e.preventDefault();
          }}
        >
          <div className="relative w-14 h-20 flex-shrink-0 rounded-md overflow-hidden bg-cream">
            {book.coverUrl ? (
              <Image
                src={book.coverUrl}
                alt={book.title}
                fill
                className="object-cover"
                sizes="56px"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-forest/20">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                </svg>
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <h3 className="font-serif text-sm font-semibold text-ink truncate leading-tight">
              {book.title}
            </h3>
            <p className="text-xs text-forest/50 truncate mt-0.5">{book.author}</p>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
