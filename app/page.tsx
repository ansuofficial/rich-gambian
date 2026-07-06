"use client";

import { useMemo, useState } from "react";
import { useSpending } from "@/app/hooks/use-spending";
import { AppHeader } from "@/app/components/app-header";
import { ProductGrid } from "@/app/components/product-grid";
import { SpendingChart } from "@/app/components/spending-chart";
import { ShareReceiptDialog } from "@/app/components/share-receipt-dialog";
import { ShareReceiptFab } from "@/app/components/share-receipt-fab";
import { SHARE_ENABLED } from "@/utils/constants/constants";
import { ReceiptData } from "@/app/types/types";

export default function GambiaGDPSpender() {
  const {
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
  } = useSpending();

  const [shareOpen, setShareOpen] = useState(false);

  const receiptData: ReceiptData = useMemo(
    () => ({
      balance,
      totalSpent,
      percentSpent,
      totalQuantity,
      purchases,
      categoryData,
      generatedAt: Date.now(),
    }),
    [balance, totalSpent, percentSpent, totalQuantity, purchases, categoryData]
  );

  const shareEnabled = SHARE_ENABLED && purchases.length > 0;
  const openShare = () => setShareOpen(true);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader
        balance={balance}
        percentSpent={percentSpent}
        totalSpent={totalSpent}
        hasPurchases={purchases.length > 0}
        onShare={shareEnabled ? openShare : undefined}
        onReset={purchases.length > 0 ? reset : undefined}
      />

      <main className="mx-auto max-w-7xl px-4 py-6 pb-28">
        <ProductGrid
          getQuantity={getQuantity}
          balance={balance}
          onBuy={handleBuy}
          onSell={handleSell}
        />

        {purchases.length > 0 && (
          <SpendingChart
            className="mt-8"
            categoryData={categoryData}
            onShare={shareEnabled ? openShare : undefined}
          />
        )}
      </main>

      {shareEnabled && (
        <>
          <ShareReceiptFab onClick={openShare} />
          <ShareReceiptDialog
            open={shareOpen}
            onOpenChange={setShareOpen}
            receiptData={receiptData}
          />
        </>
      )}
    </div>
  );
}