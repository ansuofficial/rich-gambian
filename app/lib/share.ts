import { track } from "@vercel/analytics";
import { toast } from "sonner";
import { formatMoney } from "@/utils/utils";
import { SITE_URL } from "@/utils/constants/constants";
import { ReceiptData } from "@/app/types/types";

export function buildShareCaption(data: ReceiptData): string {
  const itemLabel =
    data.totalQuantity === 1 ? "1 item" : `${data.totalQuantity} items`;
  return (
    `I spent ${formatMoney(data.totalSpent)} of The Gambia's GDP 🇬🇲\n` +
    `${data.percentSpent.toFixed(1)}% gone — ${itemLabel}!\n\n` +
    `Try it: ${SITE_URL}`
  );
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  try {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function captureReceiptPng(node: HTMLElement): Promise<Blob> {
  const { toPng } = await import("html-to-image");
  const dataUrl = await toPng(node, {
    pixelRatio: 2,
    cacheBust: true,
    skipFonts: false,
  });
  const res = await fetch(dataUrl);
  return res.blob();
}

export type ShareMethod = "native" | "whatsapp" | "download" | "copy";

export function canShareFiles(file: File, caption: string): boolean {
  return Boolean(navigator.canShare?.({ files: [file], text: caption }));
}

export async function shareReceipt(
  node: HTMLElement,
  data: ReceiptData,
  method: ShareMethod = "native"
): Promise<ShareMethod | null> {
  try {
    const caption = buildShareCaption(data);
    const blob = await captureReceiptPng(node);
    const file = new File([blob], "gambia-spending-receipt.png", {
      type: "image/png",
    });

    if (
      method === "native" &&
      canShareFiles(file, caption)
    ) {
      try {
        await navigator.share({
          files: [file],
          text: caption,
          title: "My Gambia GDP Receipt",
        });
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return null;
        }
        throw err;
      }
      track("receipt_shared", { method: "native" });
      return "native";
    }

    if (method === "whatsapp") {
      downloadBlob(blob, file.name);
      toast.info("Image saved — attach from your gallery in WhatsApp");
      const waUrl = `https://wa.me/?text=${encodeURIComponent(caption)}`;
      window.open(waUrl, "_blank", "noopener,noreferrer");
      track("receipt_shared", { method: "whatsapp" });
      return "whatsapp";
    }

    if (method === "download") {
      downloadBlob(blob, file.name);
      toast.success("Receipt image downloaded");
      track("receipt_shared", { method: "download" });
      return "download";
    }

    downloadBlob(blob, file.name);
    try {
      await navigator.clipboard.writeText(caption);
      toast.success("Image downloaded. Caption copied.");
    } catch (err) {
      if (err instanceof DOMException) {
        track("receipt_share_failed", { method: "copy", error: err.name });
        toast.error("Could not copy caption. Text is shown below.");
        return null;
      }
      throw err;
    }
    track("receipt_shared", { method: "copy" });
    return "copy";
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("shareReceipt failed", err);
    }
    track("receipt_share_failed", {
      method,
      error: err instanceof Error ? err.name : "unknown",
    });
    toast.error("Could not share. Try downloading instead.");
    return null;
  }
}