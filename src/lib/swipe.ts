const DEAD_ZONE = 15;
const REVEAL_SNAP_PERCENT = 0.3;
const FULL_CONFIRM_PERCENT = 0.8;

export interface SwipeThresholds {
  deadZone: number;
  revealSnap: number;
  fullConfirm: number;
}

export function getSwipeThresholds(cardWidth: number): SwipeThresholds {
  return {
    deadZone: DEAD_ZONE,
    revealSnap: Math.round(cardWidth * REVEAL_SNAP_PERCENT),
    fullConfirm: Math.round(cardWidth * FULL_CONFIRM_PERCENT),
  };
}

export function shouldConfirm(offset: number, cardWidth: number): boolean {
  const { fullConfirm } = getSwipeThresholds(cardWidth);
  return Math.abs(offset) >= fullConfirm;
}
