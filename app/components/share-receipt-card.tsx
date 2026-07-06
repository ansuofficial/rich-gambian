"use client";

import { forwardRef } from "react";
import Image from "next/image";
import { formatMoney } from "@/utils/utils";
import { RECEIPT_CAPTURE_COLORS } from "@/utils/constants/constants";
import { ReceiptData } from "@/app/types/types";
import { Separator } from "@/components/ui/separator";

interface ShareReceiptCardProps {
  data: ReceiptData;
}

export const ShareReceiptCard = forwardRef<HTMLDivElement, ShareReceiptCardProps>(
  function ShareReceiptCard({ data }, ref) {
    const c = RECEIPT_CAPTURE_COLORS;
    const dateStr = new Date(data.generatedAt).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    return (
      <div
        ref={ref}
        style={{
          width: 1080,
          height: 1350,
          backgroundColor: c.background,
          color: c.bodyText,
          fontFamily: "system-ui, sans-serif",
        }}
        className="flex flex-col overflow-hidden"
      >
        <div
          style={{ backgroundColor: c.headerBg, color: c.headerText }}
          className="px-12 py-10"
        >
          <div className="mb-6 flex items-center gap-4">
            <div className="relative h-12 w-16 overflow-hidden rounded-sm">
              <Image src="/gm.svg" alt="" fill className="object-cover" />
            </div>
            <div>
              <p className="text-sm font-medium uppercase tracking-widest opacity-90">
                Official Spending Receipt
              </p>
              <h2 className="text-3xl font-bold">Spend The Gambia&apos;s Money</h2>
            </div>
          </div>
          <p className="text-lg opacity-90">{dateStr}</p>
        </div>

        <div className="flex flex-1 flex-col px-12 py-10">
          <div className="mb-8 grid grid-cols-2 gap-6">
            <div>
              <p style={{ color: c.mutedText }} className="text-sm uppercase tracking-wide">
                Total Spent
              </p>
              <p
                style={{ color: c.accentRed }}
                className="font-mono text-4xl font-bold"
              >
                {formatMoney(data.totalSpent)}
              </p>
            </div>
            <div>
              <p style={{ color: c.mutedText }} className="text-sm uppercase tracking-wide">
                Remaining Balance
              </p>
              <p
                style={{ color: c.accentGreen }}
                className="font-mono text-4xl font-bold"
              >
                {formatMoney(data.balance)}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <div className="mb-2 flex justify-between text-sm">
              <span style={{ color: c.mutedText }}>GDP spent</span>
              <span className="font-semibold">
                {data.percentSpent.toFixed(1)}%
              </span>
            </div>
            <div
              style={{ backgroundColor: c.progressTrack }}
              className="h-4 overflow-hidden rounded-full"
            >
              <div
                style={{
                  backgroundColor: c.progressFill,
                  width: `${Math.min(data.percentSpent, 100)}%`,
                }}
                className="h-full rounded-full"
              />
            </div>
          </div>

          <Separator style={{ backgroundColor: c.border }} className="mb-6" />

          <div className="min-h-0 flex-1 overflow-hidden">
            <p className="mb-4 text-lg font-semibold">
              Purchases ({data.totalQuantity}{" "}
              {data.totalQuantity === 1 ? "item" : "items"})
            </p>
            <div className="space-y-3">
              {data.purchases.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 text-base"
                >
                  <span className="min-w-0 flex-1 truncate">
                    {item.emoji} {item.name}
                    {item.quantity > 1 ? ` × ${item.quantity}` : ""}
                  </span>
                  <span className="shrink-0 font-mono font-semibold">
                    {formatMoney(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{ borderColor: c.border }}
            className="mt-8 border-t pt-6 text-center"
          >
            <p style={{ color: c.mutedText }} className="text-sm">
              How would you spend The Gambia&apos;s GDP?
            </p>
            <p style={{ color: c.accentRed }} className="mt-1 font-semibold">
              rich-gambian.vercel.app
            </p>
          </div>
        </div>
      </div>
    );
  }
);