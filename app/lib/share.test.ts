import { describe, it, expect } from "vitest";
import { buildShareCaption } from "./share";
import { products } from "@/app/lib/products";
import { ReceiptData } from "@/app/types/types";

const benachin = products.find((p) => p.id === 15)!;

describe("buildShareCaption", () => {
  it("uses totalQuantity not unique purchase count", () => {
    const data: ReceiptData = {
      balance: 0,
      totalSpent: benachin.price * 12,
      percentSpent: 0.01,
      totalQuantity: 12,
      purchases: [{ ...benachin, quantity: 12 }],
      categoryData: [{ name: "Food", value: benachin.price * 12 }],
      generatedAt: Date.now(),
    };

    expect(buildShareCaption(data)).toContain("12 items");
  });
});