import { track } from "@vercel/analytics";
import { toast } from "sonner";
import { formatMoney } from "@/utils/utils";
import { SITE_URL } from "@/utils/constants/constants";
import { ReceiptData } from "@/app/types/types";

function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

export function buildShareCaption(data: ReceiptData): string {
  const itemLabel =
    data.totalQuantity === 1 ? "1 item" : `${data.totalQuantity} items`;
  return (
    `I spent ${formatMoney(data.totalSpent)} of The Gambia's GDP\n` +
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
    anchor.rel = "noopener";
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function captureReceiptPng(node: HTMLElement): Promise<Blob> {
  const mobile = isMobileDevice();
  const { toPng } = await import("html-to-image");

  const capturePromise = toPng(node, {
    pixelRatio: mobile ? 1 : 2,
    cacheBust: true,
    skipFonts: mobile,
    width: 1080,
    height: 1350,
  });

  const timeoutMs = mobile ? 25000 : 15000;
  const dataUrl = await Promise.race([
    capturePromise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Capture timed out")), timeoutMs)
    ),
  ]);

  const res = await fetch(dataUrl);
  return res.blob();
}

export type ShareMethod = "native" | "whatsapp" | "download" | "copy";

export function canShareFiles(file: File, caption: string): boolean {
  try {
    return Boolean(navigator.canShare?.({ files: [file], text: caption }));
  } catch {
    return false;
  }
}

export async function shareReceipt(
  node: HTMLElement,
  data: ReceiptData,
  method: ShareMethod = "native"
): Promise<ShareMethod | null> {
  const toastId = toast.loading("Preparing receipt...");

  try {
    const caption = buildShareCaption(data);
    const blob = await captureReceiptPng(node);
    const file = new File([blob], "gambia-spending-receipt.png", {
      type: "image/png",
    });

    toast.dismiss(toastId);

    if (method === "native") {
      if (canShareFiles(file, caption)) {
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

      if (typeof navigator.share === "function") {
        try {
          downloadBlob(blob, file.name);
          toast.info("Receipt saved. Opening share sheet...");
          await navigator.share({
            text: caption,
            url: SITE_URL,
            title: "My Gambia GDP Receipt",
          });
          track("receipt_shared", { method: "native-text" });
          return "native";
        } catch (err) {
          if (err instanceof DOMException && err.name === "AbortError") {
            return null;
          }
        }
      }

      downloadBlob(blob, file.name);
      try {
        await navigator.clipboard.writeText(caption);
        toast.success("Receipt saved. Caption copied.");
      } catch {
        toast.success("Receipt image saved to your device.");
      }
      track("receipt_shared", { method: "copy" });
      return "copy";
    }

    if (method === "whatsapp") {
      if (canShareFiles(file, caption)) {
        try {
          await navigator.share({ files: [file], text: caption });
          track("receipt_shared", { method: "whatsapp-native" });
          return "whatsapp";
        } catch (err) {
          if (err instanceof DOMException && err.name === "AbortError") {
            return null;
          }
        }
      }
      downloadBlob(blob, file.name);
      toast.info("Receipt saved — attach from your gallery in WhatsApp");
      const waUrl = `https://wa.me/?text=${encodeURIComponent(caption)}`;
      window.open(waUrl, "_blank", "noopener,noreferrer");
      track("receipt_shared", { method: "whatsapp" });
      return "whatsapp";
    }

    if (method === "download") {
      downloadBlob(blob, file.name);
      toast.success("Receipt image saved");
      track("receipt_shared", { method: "download" });
      return "download";
    }

    downloadBlob(blob, file.name);
    try {
      await navigator.clipboard.writeText(caption);
      toast.success("Receipt saved. Caption copied.");
    } catch (err) {
      if (err instanceof DOMException) {
        track("receipt_share_failed", { method: "copy", error: err.name });
        toast.error("Could not copy caption.");
        return null;
      }
      throw err;
    }
    track("receipt_shared", { method: "copy" });
    return "copy";
  } catch (err) {
    toast.dismiss(toastId);
    if (process.env.NODE_ENV === "development") {
      console.error("shareReceipt failed", err);
    }
    track("receipt_share_failed", {
      method,
      error: err instanceof Error ? err.name : "unknown",
    });
    toast.error("Could not share. Please try again.");
    return null;
  }
}