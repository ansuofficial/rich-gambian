"use client";
import React, { useState } from "react";
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
// import {
//   ShoppingCart,
//   TrendingDown,
//   Share2,
//   Download,
//   X,
//   Undo2,
// } from "lucide-react";
import { formatMoney } from "@/utils/utils";
import Header from "./components/Header";
import { COLORS, GAMBIA_GDP } from "@/utils/constants/constants";
import { CategoryDataType } from "./types/types";

export default function GambiaGDPSpender() {
  const [balance, setBalance] = useState(GAMBIA_GDP);
  const [purchases, setPurchases] = useState<
    (ProductsTypes & { quantity: number })[]
  >([]);
  // const [showInvoice, setShowInvoice] = useState(false);
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

  // const downloadInvoice = () => {
  //   alert("Invoice download feature - would generate PDF/image in production!");
  // };

  // const shareInvoice = () => {
  //   const text = `I just spent ${formatMoney(
  //     totalSpent
  //   )} of The Gambia's GDP! 🇬🇲\n\nTry it: [Your URL Here]`;
  //   if (navigator.share) {
  //     navigator.share({ text });
  //   } else {
  //     navigator.clipboard.writeText(text);
  //     alert("Copied to clipboard!");
  //   }
  // };

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
                  <div className="h-80 rounded overflow-hidden flex-shrink-0 bg-slate-700">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="object-cover h-full w-full"
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

      {/* Floating Actions */}
      {/* {purchases.length > 0 && (
        <div className="fixed bottom-6 left-0 right-0 px-4 flex gap-3 justify-center z-40">
          <button
            onClick={() => setShowInvoice(true)}
            className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-full px-8 py-4 shadow-2xl font-bold text-lg transition-all active:scale-95 flex items-center gap-2"
          >
            <ShoppingCart size={24} />
            View Invoice ({purchases.length})
          </button>
        </div>
      )} */}

      {/* Invoice Modal */}
      {/* {showInvoice && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-t-3xl md:rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-auto border border-slate-700 shadow-2xl">
            <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">🧾 Your Invoice</h2>
              <button
                onClick={() => setShowInvoice(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={28} />
              </button>
            </div>

            <div className="p-6">
              <div className="text-center mb-6 pb-6 border-b border-dashed border-slate-700">
                <div className="text-4xl mb-2">🇬🇲</div>
                <h3 className="text-xl font-bold mb-2">
                  The Gambia GDP Shopping Spree
                </h3>
                <p className="text-gray-400 text-sm">Official Receipt</p>
              </div>

              <div className="space-y-3 mb-6">
                {purchases.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.emoji}</span>
                      <div>
                        <div className="font-semibold">{item.name}</div>
                        <div className="text-sm text-gray-400">
                          Qty: {item.quantity}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-orange-400">
                        {formatMoney(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-slate-700 pt-4 space-y-2 mb-6">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-400">Original Balance:</span>
                  <span className="font-mono">{formatMoney(GAMBIA_GDP)}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-gray-400">Total Spent:</span>
                  <span className="font-mono text-red-400">
                    {formatMoney(totalSpent)}
                  </span>
                </div>
                <div className="flex justify-between text-2xl font-bold border-t border-slate-700 pt-2">
                  <span>Remaining:</span>
                  <span className="text-emerald-400">
                    {formatMoney(balance)}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={shareInvoice}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl py-3 font-semibold transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Share2 size={20} />
                  Share
                </button>
                <button
                  onClick={downloadInvoice}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl py-3 font-semibold transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}
