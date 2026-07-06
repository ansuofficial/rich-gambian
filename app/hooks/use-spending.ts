import { useReducer, useMemo, useCallback } from "react";
import { GAMBIA_GDP } from "@/utils/constants/constants";
import {
  CategoryDataType,
  ProductsTypes,
  PurchaseItem,
} from "@/app/types/types";

interface SpendingSnapshot {
  balance: number;
  purchases: PurchaseItem[];
}

type SpendingAction =
  | { type: "buy"; product: ProductsTypes }
  | { type: "sell"; product: ProductsTypes }
  | { type: "reset" };

function aggregateByCategory(
  purchases: PurchaseItem[]
): CategoryDataType[] {
  return purchases.reduce((acc: CategoryDataType[], item) => {
    const existing = acc.find((a) => a.name === item.category);
    if (existing) {
      existing.value += item.price * item.quantity;
    } else {
      acc.push({ name: item.category, value: item.price * item.quantity });
    }
    return acc;
  }, []);
}

export function spendingReducer(
  state: SpendingSnapshot,
  action: SpendingAction
): SpendingSnapshot {
  switch (action.type) {
    case "buy": {
      const { product } = action;
      if (state.balance < product.price) return state;
      const existing = state.purchases.find((p) => p.id === product.id);
      const purchases = existing
        ? state.purchases.map((p) =>
            p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
          )
        : [...state.purchases, { ...product, quantity: 1 }];
      return { balance: state.balance - product.price, purchases };
    }
    case "sell": {
      const { product } = action;
      const existing = state.purchases.find((p) => p.id === product.id);
      if (!existing) return state;
      const purchases =
        existing.quantity > 1
          ? state.purchases.map((p) =>
              p.id === product.id ? { ...p, quantity: p.quantity - 1 } : p
            )
          : state.purchases.filter((p) => p.id !== product.id);
      return { balance: state.balance + product.price, purchases };
    }
    case "reset":
      return { balance: GAMBIA_GDP, purchases: [] };
    default:
      return state;
  }
}

export function useSpending() {
  const [{ balance, purchases }, dispatch] = useReducer(spendingReducer, {
    balance: GAMBIA_GDP,
    purchases: [] as PurchaseItem[],
  });

  const totalSpent = GAMBIA_GDP - balance;
  const percentSpent = (totalSpent / GAMBIA_GDP) * 100;
  const totalQuantity = useMemo(
    () => purchases.reduce((sum, p) => sum + p.quantity, 0),
    [purchases]
  );
  const categoryData = useMemo(
    () => aggregateByCategory(purchases),
    [purchases]
  );

  const getQuantity = useCallback(
    (productId: number) => {
      const item = purchases.find((p) => p.id === productId);
      return item ? item.quantity : 0;
    },
    [purchases]
  );

  const handleBuy = useCallback((product: ProductsTypes) => {
    dispatch({ type: "buy", product });
  }, []);

  const handleSell = useCallback((product: ProductsTypes) => {
    dispatch({ type: "sell", product });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "reset" });
  }, []);

  return {
    balance,
    purchases,
    totalSpent,
    percentSpent,
    totalQuantity,
    categoryData,
    getQuantity,
    handleBuy,
    handleSell,
    reset,
  };
}