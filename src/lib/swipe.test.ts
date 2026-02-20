import { describe, it, expect } from "vitest";
import { getSwipeThresholds, shouldConfirm } from "./swipe";

describe("getSwipeThresholds", () => {
  it("computes thresholds from card width", () => {
    const t = getSwipeThresholds(320);
    expect(t.deadZone).toBe(15);
    expect(t.revealSnap).toBe(96);   // 30% of 320
    expect(t.fullConfirm).toBe(256); // 80% of 320
  });

  it("handles narrow cards", () => {
    const t = getSwipeThresholds(200);
    expect(t.deadZone).toBe(15);
    expect(t.revealSnap).toBe(60);
    expect(t.fullConfirm).toBe(160);
  });
});

describe("shouldConfirm", () => {
  it("returns true when offset exceeds fullConfirm", () => {
    expect(shouldConfirm(260, 320)).toBe(true);
  });

  it("returns false when offset is in peeking range", () => {
    expect(shouldConfirm(100, 320)).toBe(false);
  });

  it("returns false when offset is below revealSnap", () => {
    expect(shouldConfirm(50, 320)).toBe(false);
  });

  it("works with negative offsets (left swipe)", () => {
    expect(shouldConfirm(-260, 320)).toBe(true);
    expect(shouldConfirm(-100, 320)).toBe(false);
  });
});
