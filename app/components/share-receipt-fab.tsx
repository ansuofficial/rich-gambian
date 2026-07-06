"use client";

import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareReceiptFabProps {
  onClick: () => void;
}

export function ShareReceiptFab({ onClick }: ShareReceiptFabProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-4">
      <Button
        size="lg"
        className="pointer-events-auto gap-2 bg-gambia-red text-white shadow-lg hover:bg-gambia-red/90"
        onClick={onClick}
      >
        <Share2 className="size-4" />
        Share receipt
      </Button>
    </div>
  );
}