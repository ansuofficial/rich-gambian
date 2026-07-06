"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Download, Loader2, MessageCircle, Share2 } from "lucide-react";
import { toast } from "sonner";
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

const RECEIPT_WIDTH = 1080;
const RECEIPT_HEIGHT = 1350;

interface ShareReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receiptData: ReceiptData;
}

function ReceiptPreview({ receiptData, open }: { receiptData: ReceiptData; open: boolean }) {
  const captureRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [sharing, setSharing] = useState(false);
  const [scale, setScale] = useState(0.3);

  const updateScale = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const available = container.clientWidth - 8;
    const nextScale = Math.min(available / RECEIPT_WIDTH, 0.38);
    setScale(Math.max(nextScale, 0.22));
  }, []);

  useEffect(() => {
    if (!open) return;
    updateScale();
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) observer.observe(containerRef.current);
    window.addEventListener("resize", updateScale);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, [open, updateScale]);

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
      toast.success("Caption copied");
    } catch {
      toast.error("Could not copy caption");
    }
  };

  const nativeShareAvailable =
    typeof navigator.share === "function";

  const scaledWidth = RECEIPT_WIDTH * scale;
  const scaledHeight = RECEIPT_HEIGHT * scale;

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 overflow-hidden">
      {/* Visible scaled preview — does not affect capture */}
      <div
        ref={containerRef}
        className="mx-auto w-full max-w-full overflow-hidden rounded-lg border border-border bg-muted/30"
      >
        <div
          className="mx-auto overflow-hidden"
          style={{ width: scaledWidth, height: scaledHeight }}
        >
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              width: RECEIPT_WIDTH,
              height: RECEIPT_HEIGHT,
            }}
          >
            <ShareReceiptCard data={receiptData} />
          </div>
        </div>
      </div>

      {/* Off-screen capture target — full size, no transforms */}
      {open && (
        <div
          aria-hidden
          className="pointer-events-none fixed overflow-hidden opacity-0"
          style={{ left: -10000, top: 0, zIndex: -1 }}
        >
          <ShareReceiptCard ref={captureRef} data={receiptData} />
        </div>
      )}

      <div className="grid w-full min-w-0 grid-cols-1 gap-2 sm:grid-cols-2">
        <Button
          className="w-full min-w-0"
          disabled={sharing}
          onClick={() => runShare("native")}
        >
          {sharing ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Share2 className="size-4" />
          )}
          {nativeShareAvailable ? "Share image" : "Save & copy"}
        </Button>
        <Button
          variant="outline"
          className="w-full min-w-0"
          disabled={sharing}
          onClick={() => runShare("whatsapp")}
        >
          <MessageCircle className="size-4" />
          WhatsApp
        </Button>
        <Button
          variant="outline"
          className="w-full min-w-0"
          disabled={sharing}
          onClick={() => runShare("download")}
        >
          <Download className="size-4" />
          Download
        </Button>
        <Button
          variant="ghost"
          className="w-full min-w-0"
          disabled={sharing}
          onClick={handleCopyCaption}
        >
          Copy caption
        </Button>
      </div>
    </div>
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
        <DialogContent className="max-w-sm overflow-hidden">
          <div className="h-48 animate-pulse rounded-md bg-muted" />
        </DialogContent>
      </Dialog>
    );
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md overflow-hidden p-4 sm:max-w-lg sm:p-6">
          <DialogHeader>
            <DialogTitle>Share your spending receipt</DialogTitle>
            <DialogDescription>
              Preview your receipt and share it on social media or WhatsApp.
            </DialogDescription>
          </DialogHeader>
          <ReceiptPreview receiptData={receiptData} open={open} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-h-[92vh] overflow-x-hidden overflow-y-auto px-4 pb-6"
      >
        <SheetHeader className="text-left">
          <SheetTitle>Share your spending receipt</SheetTitle>
          <SheetDescription>
            Preview your receipt and share it on social media or WhatsApp.
          </SheetDescription>
        </SheetHeader>
        <ReceiptPreview receiptData={receiptData} open={open} />
      </SheetContent>
    </Sheet>
  );
}