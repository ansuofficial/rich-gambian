"use client";

import { useState } from "react";
import Image from "next/image";
import { RotateCcw, Share2 } from "lucide-react";
import { formatMoney } from "@/utils/utils";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AppHeaderProps {
  balance: number;
  percentSpent: number;
  totalSpent: number;
  hasPurchases?: boolean;
  onShare?: () => void;
  onReset?: () => void;
}

export function AppHeader({
  balance,
  percentSpent,
  totalSpent,
  hasPurchases = false,
  onShare,
  onReset,
}: AppHeaderProps) {
  const [resetOpen, setResetOpen] = useState(false);

  const handleReset = () => {
    onReset?.();
    setResetOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center justify-center gap-3 sm:justify-start">
            <div className="relative h-6 w-8 shrink-0 overflow-hidden rounded-sm ring-1 ring-border">
              <Image
                src="/gm.svg"
                alt="The Gambian Flag"
                fill
                className="object-cover"
              />
            </div>
            <h1 className="truncate text-lg font-semibold tracking-tight sm:text-xl">
              Spend The Gambia&apos;s Money
            </h1>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {hasPurchases && onShare && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onShare}
                aria-label="Share spending receipt"
              >
                <Share2 className="size-4" />
              </Button>
            )}
            {hasPurchases && onReset && (
              <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
                <AlertDialogTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Reset cart"
                    >
                      <RotateCcw className="size-4" />
                    </Button>
                  }
                />
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reset your spending?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This clears all purchases and restores the full GDP
                      balance. This cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleReset}>
                      Reset cart
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <ThemeToggle />
          </div>
        </div>

        <div className="text-center sm:text-left">
          <p className="font-mono text-3xl font-bold tracking-tight text-foreground">
            {formatMoney(balance)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {percentSpent.toFixed(1)}% spent · {formatMoney(totalSpent)} used
          </p>
        </div>

        <Progress
          value={percentSpent}
          className="mt-3 w-full [&_[data-slot=progress-indicator]]:bg-gambia-red"
          aria-label={`${percentSpent.toFixed(1)}% of GDP spent`}
        />
      </div>
    </header>
  );
}