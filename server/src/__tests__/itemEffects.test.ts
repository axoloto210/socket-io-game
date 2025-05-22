import { Items } from "../feature/items";
import { ALL_ITEMS, Card, Item } from "@socket-io-game/common";

describe("Item Effects", () => {
  let items: Items;

  beforeEach(() => {
    items = new Items();
  });

  test("should detect when mukouEffect applies", () => {
    const mukouka: Item = ALL_ITEMS.MUKOUKA;
    const risky: Item = ALL_ITEMS.RISKY;

    // When one player has mukou
    expect(items.isMukouEffect(mukouka, risky)).toBe(true);
    expect(items.isMukouEffect(risky, mukouka)).toBe(true);

    // When neither player has mukou
    expect(items.isMukouEffect(risky, undefined)).toBe(false);
    expect(items.isMukouEffect(undefined, risky)).toBe(false);
    expect(items.isMukouEffect(undefined, undefined)).toBe(false);
  });

  test("should apply gusuEffect correctly", () => {
    // Create test cards
    const oddCard: Card = { cardId: 1, power: 5 };
    const evenCard: Card = { cardId: 2, power: 4 };

    // Apply gusu effect (even cards get +2)
    items.applyGusuEffect(oddCard, evenCard);

    // Check powers after effect
    expect(oddCard.power).toBe(5); // Unchanged
    expect(evenCard.power).toBe(6); // 4 + 2 = 6
  });

  test("should apply riskyEffect correctly", () => {
    const card: Card = { cardId: 3, power: 3 };

    // Apply risky effect (-2 power)
    items.applyRiskyEffect(card);

    // Power should decrease by 2
    expect(card.power).toBe(1);
  });

  test("should detect abekobe effect correctly", () => {
    const abekobe: Item = ALL_ITEMS.ABEKOBE;
    const risky: Item = ALL_ITEMS.RISKY;

    // When one player has abekobe
    expect(items.isAbekobe(abekobe, undefined)).toBe(true);
    expect(items.isAbekobe(undefined, abekobe)).toBe(true);

    // When both players have abekobe (effect cancels out)
    expect(items.isAbekobe(abekobe, abekobe)).toBe(false);

    // When neither player has abekobe
    expect(items.isAbekobe(risky, undefined)).toBe(false);
    expect(items.isAbekobe(undefined, risky)).toBe(false);
    expect(items.isAbekobe(undefined, undefined)).toBe(false);
  });

  test("should get correct base point for draw situations", () => {
    const basePoint = 1;
    const risky: Item = ALL_ITEMS.RISKY;

    // Normal draw (both take 1 damage)
    const normalResult = items.getDrawBasePoint(
      basePoint,
      undefined,
      undefined
    );
    expect(normalResult.player1BasePoint).toBe(1);
    expect(normalResult.player2BasePoint).toBe(1);

    // Draw with one player having risky (no effect in draw)
    const riskyResult = items.getDrawBasePoint(basePoint, risky, undefined);
    expect(riskyResult.player1BasePoint).toBe(1);
    expect(riskyResult.player2BasePoint).toBe(1);
  });
});
