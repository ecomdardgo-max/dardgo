import { useCallback, useEffect, useRef, useState } from "react";
import { Download, Share2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "dardgo_pwa_install_prompt_v1";
/** Show again at most once per this interval after dismiss (between 2–3 hours). */
const COOLDOWN_MS = 2.5 * 60 * 60 * 1000;
const SHOW_DELAY_MS = 2800;

type StoredState = {
  lastDismissedAt?: number;
  installed?: boolean;
};

type BeforeInstallPromptEventTyped = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function readStored(): StoredState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredState;
  } catch {
    return null;
  }
}

function canShowPrompt(): boolean {
  const s = readStored();
  if (!s) return true;
  if (s.installed) return false;
  if (!s.lastDismissedAt) return true;
  return Date.now() - s.lastDismissedAt >= COOLDOWN_MS;
}

function writeDismissed() {
  const prev = readStored() ?? {};
  const next: StoredState = {
    ...prev,
    lastDismissedAt: Date.now(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

function writeInstalled() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      lastDismissedAt: Date.now(),
      installed: true,
    } satisfies StoredState),
  );
}

function isStandalonePwa(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(display-mode: standalone)").matches) return true;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return Boolean(nav.standalone);
}

function isIosSafari(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return (
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

export function PwaInstallPrompt() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [hasNativeInstall, setHasNativeInstall] = useState(false);
  const deferredPrompt = useRef<BeforeInstallPromptEventTyped | null>(null);
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const clearShowTimer = useCallback(() => {
    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
  }, []);

  const scheduleShow = useCallback(() => {
    if (!canShowPrompt()) return;
    if (isStandalonePwa()) return;
    clearShowTimer();
    showTimerRef.current = window.setTimeout(() => {
      if (!canShowPrompt()) return;
      if (isStandalonePwa()) return;
      setOpen(true);
    }, SHOW_DELAY_MS);
  }, [clearShowTimer]);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;
    if (isStandalonePwa()) return;

    const onBip = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e as BeforeInstallPromptEventTyped;
      setHasNativeInstall(true);
      scheduleShow();
    };

    const onInstalled = () => {
      writeInstalled();
      deferredPrompt.current = null;
      clearShowTimer();
      setOpen(false);
    };

    window.addEventListener("beforeinstallprompt", onBip);
    window.addEventListener("appinstalled", onInstalled);

    // iOS Safari never fires beforeinstallprompt — show install hints on same cooldown rules.
    if (isIosSafari() && canShowPrompt()) {
      setHasNativeInstall(false);
      scheduleShow();
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBip);
      window.removeEventListener("appinstalled", onInstalled);
      clearShowTimer();
    };
  }, [mounted, scheduleShow, clearShowTimer]);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      const s = readStored();
      if (!s?.installed) {
        writeDismissed();
      }
    }
  };

  const handleInstallClick = async () => {
    const ev = deferredPrompt.current;
    if (!ev) {
      handleOpenChange(false);
      return;
    }
    await ev.prompt();
    const { outcome } = await ev.userChoice;
    deferredPrompt.current = null;
    if (outcome === "accepted") {
      writeInstalled();
    } else {
      writeDismissed();
    }
    setOpen(false);
  };

  if (!mounted || isStandalonePwa()) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[min(100vw-2rem,380px)] rounded-2xl border-border p-5 sm:p-6">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Install DARDGO app</DialogTitle>
          <DialogDescription className="text-left text-muted-foreground">
            Open faster from your home screen and get a focused shopping experience.
          </DialogDescription>
        </DialogHeader>

        {hasNativeInstall ? (
          <p className="text-sm text-muted-foreground">
            Tap <strong className="text-foreground">Install</strong> below when your browser asks —
            it only takes a moment.
          </p>
        ) : (
          <div className="space-y-3 text-sm text-muted-foreground">
            <p className="flex items-start gap-2">
              <Share2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <span>
                On <strong className="text-foreground">Safari</strong>: tap the{" "}
                <strong className="text-foreground">Share</strong> button, then{" "}
                <strong className="text-foreground">Add to Home Screen</strong>.
              </span>
            </p>
          </div>
        )}

        <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-end">
          {hasNativeInstall ? (
            <>
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => handleOpenChange(false)}
              >
                Not now
              </Button>
              <Button type="button" className="w-full sm:w-auto" onClick={handleInstallClick}>
                <Download className="h-4 w-4" />
                Install app
              </Button>
            </>
          ) : (
            <Button
              type="button"
              className="w-full sm:w-auto"
              onClick={() => handleOpenChange(false)}
            >
              OK, thanks
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
