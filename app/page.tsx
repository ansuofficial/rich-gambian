"use client";
import React, { useState } from "react";
import Image from "next/image"; // ✅ Next.js optimized image
import { products } from "@/app/lib/products";
import { ProductsTypes } from "./types/types";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { formatMoney } from "@/utils/utils";
import Header from "./components/Header";
import { COLORS, GAMBIA_GDP } from "@/utils/constants/constants";
import { CategoryDataType } from "./types/types";

export default function GambiaGDPSpender() {
  const [balance, setBalance] = useState(GAMBIA_GDP);
  const [purchases, setPurchases] = useState<
    (ProductsTypes & { quantity: number })[]
  >([]);
  const [history, setHistory] = useState<
    (ProductsTypes & { action: string; time: number })[]
  >([]);

  const handleBuy = (product: ProductsTypes) => {
    if (balance >= product.price) {
      setBalance(balance - product.price);
      const existing = purchases.find((p) => p.id === product.id);
      if (existing) {
        setPurchases(
          purchases.map((p) =>
            p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
          )
        );
      } else {
        setPurchases([...purchases, { ...product, quantity: 1 }]);
      }
      setHistory([{ ...product, action: "buy", time: Date.now() }, ...history]);
    }
  };

  const handleSell = (product: ProductsTypes) => {
    const existing = purchases.find((p) => p.id === product.id);
    if (existing) {
      setBalance(balance + product.price);
      if (existing.quantity > 1) {
        setPurchases(
          purchases.map((p) =>
            p.id === product.id ? { ...p, quantity: p.quantity - 1 } : p
          )
        );
      } else {
        setPurchases(purchases.filter((p) => p.id !== product.id));
      }
      setHistory([
        { ...product, action: "sell", time: Date.now() },
        ...history,
      ]);
    }
  };

  const getQuantity = (productId: number) => {
    const item = purchases.find((p) => p.id === productId);
    return item ? item.quantity : 0;
  };

  const totalSpent = GAMBIA_GDP - balance;
  const percentSpent = ((totalSpent / GAMBIA_GDP) * 100).toFixed(1);

  const categoryData = purchases.reduce((acc: CategoryDataType[], item) => {
    const existing = acc.find((a) => a.name === item.category);
    if (existing) {
      existing.value += item.price * item.quantity;
    } else {
      acc.push({ name: item.category, value: item.price * item.quantity });
    }
    return acc;
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Header
        balance={balance}
        percentSpent={percentSpent}
        totalSpent={totalSpent}
      />
      <div className="px-4 py-6 pb-24 max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-3 grid-cols-1 sm:gap-6 gap-4 mb-6 sm:mb-8">
          {products.map((product) => {
            const qty = getQuantity(product.id);
            const canBuy = balance >= product.price;

            return (
              <div
                key={product.id}
                className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded overflow-hidden border border-slate-700/50 shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col gap-4 p-4">
                  <div className="h-80 rounded overflow-hidden flex-shrink-0 bg-slate-700 relative">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-lg leading-tight mb-1">
                          {product.name}
                        </h3>
                        <span className="text-xs px-2 py-1 bg-slate-700/50 rounded-full text-gray-300">
                          {product.category}
                        </span>
                      </div>
                    </div>

                    <div className="text-2xl font-bold text-orange-400 mb-3">
                      {formatMoney(product.price)}
                    </div>

                    <div className="flex items-center gap-2">
                      {qty > 0 ? (
                        <>
                          <button
                            onClick={() => handleSell(product)}
                            className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 rounded py-2 font-semibold transition-all active:scale-95 cursor-pointer"
                          >
                            Sell
                          </button>
                          <div className="bg-slate-700 rounded px-4 py-2 font-bold min-w-[3rem] text-center">
                            {qty}
                          </div>
                          <button
                            onClick={() => handleBuy(product)}
                            disabled={!canBuy}
                            className={`flex-1 rounded py-2 font-semibold transition-all active:scale-95 cursor-pointer ${
                              canBuy
                                ? "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/50"
                                : "bg-slate-700/50 text-gray-500 border border-slate-600/50 cursor-not-allowed"
                            }`}
                          >
                            Buy
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleBuy(product)}
                          disabled={!canBuy}
                          className={`w-full rounded py-2 font-semibold transition-all active:scale-95 cursor-pointer ${
                            canBuy
                              ? "ring-1 ring-teal-600 hover:ring-teal-600/80 text-white"
                              : "bg-slate-700/50 text-gray-500 border border-slate-600/50 cursor-not-allowed"
                          }`}
                        >
                          {canBuy ? "Buy Now" : "Not Enough Balance"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Chart Section */}
        {purchases.length > 0 && (
          <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded p-6 border border-slate-700/50 mb-6">
            <h2 className="text-xl font-bold mb-4 text-center">
              Spending Breakdown
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatMoney(value)}
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "0.5rem",
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "12px" }}
                  formatter={(value) => value}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
