"use client";

import { useRef, useState } from "react";
import { Download, MessageCircle, Share2 } from "lucide-react";
import { ReceiptData } from "@/app/types/types";
import { useMediaQuery } from "@/app/hooks/use-media-query";
import { buildShareCaption, shareReceipt } from "@/app/lib/share";
import { ShareReceiptCard } from "./share-receipt-card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ShareReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receiptData: ReceiptData;
}

function ReceiptPreview({ receiptData }: { receiptData: ReceiptData }) {
  const captureRef = useRef<HTMLDivElement>(null);
  const [sharing, setSharing] = useState(false);

  const runShare = async (method: Parameters<typeof shareReceipt>[2]) => {
    if (!captureRef.current || sharing) return;
    setSharing(true);
    try {
      await shareReceipt(captureRef.current, receiptData, method);
    } finally {
      setSharing(false);
    }
  };

  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(buildShareCaption(receiptData));
    } catch {
      // share.ts handles errors for full share flow
    }
  };

  const nativeShareAvailable =
    typeof navigator.share === "function" &&
    typeof navigator.canShare === "function";

  return (
    <>
      <ScrollArea className="max-h-[50vh] w-full">
        <div className="flex justify-center overflow-auto p-4">
          <div
            style={{ transform: "scale(0.35)", transformOrigin: "top center" }}
            className="shrink-0"
          >
            <ShareReceiptCard ref={captureRef} data={receiptData} />
          </div>
        </div>
      </ScrollArea>

      <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:flex-wrap">
        <Button
          className="flex-1"
          disabled={sharing}
          onClick={() =>
            runShare(nativeShareAvailable ? "native" : "copy")
          }
        >
          <Share2 className="size-4" />
          {nativeShareAvailable ? "Share image" : "Download & copy"}
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          disabled={sharing}
          onClick={() => runShare("whatsapp")}
        >
          <MessageCircle className="size-4" />
          Share link on WhatsApp
        </Button>
        <Button
          variant="outline"
          disabled={sharing}
          onClick={() => runShare("download")}
        >
          <Download className="size-4" />
          Download
        </Button>
        <Button variant="ghost" onClick={handleCopyCaption}>
          Copy caption
        </Button>
      </div>
    </>
  );
}

export function ShareReceiptDialog({
  open,
  onOpenChange,
  receiptData,
}: ShareReceiptDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop === undefined) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-sm">
          <div className="h-48 animate-pulse rounded-md bg-muted" />
        </DialogContent>
      </Dialog>
    );
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Share your spending receipt</DialogTitle>
            <DialogDescription>
              Preview your receipt and share it on social media or WhatsApp.
            </DialogDescription>
          </DialogHeader>
          <ReceiptPreview receiptData={receiptData} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[90vh]">
        <SheetHeader>
          <SheetTitle>Share your spending receipt</SheetTitle>
          <SheetDescription>
            Preview your receipt and share it on social media or WhatsApp.
          </SheetDescription>
        </SheetHeader>
        <ReceiptPreview receiptData={receiptData} />
      </SheetContent>
    </Sheet>
  );
}