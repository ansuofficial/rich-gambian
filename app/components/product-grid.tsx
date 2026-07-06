"use client";

import { products } from "@/app/lib/products";
import { ProductsTypes } from "@/app/types/types";
import { ProductCard } from "./product-card";

interface ProductGridProps {
  getQuantity: (id: number) => number;
  balance: number;
  onBuy: (product: ProductsTypes) => void;
  onSell: (product: ProductsTypes) => void;
}

export function ProductGrid({
  getQuantity,
  balance,
  onBuy,
  onSell,
}: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      {products.map((product, index) => {
        const qty = getQuantity(product.id);
        const canBuy = balance >= product.price;

        return (
          <ProductCard
            key={product.id}
            product={product}
            quantity={qty}
            canBuy={canBuy}
            balance={balance}
            priorityImage={index < 3}
            onBuy={onBuy}
            onSell={onSell}
          />
        );
      })}
    </div>
  );
}