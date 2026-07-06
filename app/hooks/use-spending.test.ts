import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSpending, spendingReducer } from "./use-spending";
import { products } from "@/app/lib/products";
import { GAMBIA_GDP } from "@/utils/constants/constants";

const benachin = products.find((p) => p.id === 15)!;
const footballClub = products.find((p) => p.id === 6)!;
const privateJet = products.find((p) => p.id === 3)!;

describe("spendingReducer", () => {
  it("buy blocked when balance insufficient (direct reducer test)", () => {
    const state = { balance: 100, purchases: [] };
    const next = spendingReducer(state, { type: "buy", product: benachin });
    expect(next).toEqual(state);
  });

  it("sell no-op when product not owned", () => {
    const state = { balance: GAMBIA_GDP, purchases: [] };
    const next = spendingReducer(state, { type: "sell", product: benachin });
    expect(next).toEqual(state);
  });

  it("reset restores initial state", () => {
    const state = {
      balance: 1000,
      purchases: [{ ...benachin, quantity: 2 }],
    };
    const next = spendingReducer(state, { type: "reset" });
    expect(next.balance).toBe(GAMBIA_GDP);
    expect(next.purchases).toEqual([]);
  });
});

describe("useSpending", () => {
  it("buy reduces balance", () => {
    const { result } = renderHook(() => useSpending());
    act(() => result.current.handleBuy(benachin));
    expect(result.current.balance).toBe(GAMBIA_GDP - benachin.price);
  });

  it("buy blocked after balance drained (multi-step hook test)", () => {
    const { result } = renderHook(() => useSpending());
    for (let i = 0; i < 15; i++) {
      act(() => result.current.handleBuy(footballClub));
    }
    expect(result.current.balance).toBe(GAMBIA_GDP - 15 * footballClub.price);
    act(() => result.current.handleBuy(privateJet));
    expect(result.current.balance).toBe(GAMBIA_GDP - 15 * footballClub.price);
    expect(
      result.current.purchases.find((p) => p.id === privateJet.id)
    ).toBeUndefined();
  });

  it("sell at qty 1 credits balance exactly once", () => {
    const { result } = renderHook(() => useSpending());
    act(() => result.current.handleBuy(benachin));
    const balanceAfterBuy = result.current.balance;
    act(() => result.current.handleSell(benachin));
    expect(result.current.balance).toBe(balanceAfterBuy + benachin.price);
    expect(result.current.purchases).toHaveLength(0);
  });
});