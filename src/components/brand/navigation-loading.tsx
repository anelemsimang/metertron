"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { AppLoading } from "@/components/brand/app-loading";

const MIN_MS = 280;
/** Never leave the full-screen overlay up forever (e.g. cancelled / raced navigations). */
const MAX_MS = 2500;

function isAppNavigation(anchor: HTMLAnchorElement) {
  if (anchor.target && anchor.target !== "_self") return false;
  if (anchor.hasAttribute("download")) return false;
  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return false;
  try {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return false;
    if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash) {
      return false;
    }
    return url.pathname !== window.location.pathname || url.search !== window.location.search;
  } catch {
    return false;
  }
}

export function NavigationLoading() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const shownAt = useRef(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const routeKey = `${pathname}?${searchParams.toString()}`;

  function clearTimers() {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
    if (maxTimer.current) {
      clearTimeout(maxTimer.current);
      maxTimer.current = null;
    }
  }

  function show() {
    clearTimers();
    shownAt.current = Date.now();
    setVisible(true);
    maxTimer.current = setTimeout(() => {
      setVisible(false);
      maxTimer.current = null;
    }, MAX_MS);
  }

  function hide() {
    if (maxTimer.current) {
      clearTimeout(maxTimer.current);
      maxTimer.current = null;
    }
    const elapsed = Date.now() - shownAt.current;
    const wait = Math.max(0, MIN_MS - elapsed);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      setVisible(false);
      hideTimer.current = null;
    }, wait);
  }

  useEffect(() => {
    hide();
  }, [routeKey]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor || !isAppNavigation(anchor)) return;
      show();
    }

    function onSubmit(event: SubmitEvent) {
      // Capture phase runs before React preventDefault. Only show for real
      // navigational GET submits — never for fetch/XHR login forms.
      const form = event.target as HTMLFormElement | null;
      if (!form) return;
      const method = (form.getAttribute("method") || "get").toLowerCase();
      if (method !== "get") return;
      if (form.getAttribute("action") === "#" || form.dataset.noNavLoading === "true") return;
      const action = form.getAttribute("action");
      if (!action || action === "" || action.startsWith("?")) return;
      if (action.startsWith("http") && !action.startsWith(window.location.origin)) return;
      show();
    }

    function maybeShowForUrl(url: string | URL | null | undefined) {
      if (!url) return;
      try {
        const next = new URL(String(url), window.location.href);
        if (next.origin !== window.location.origin) return;
        if (next.pathname === window.location.pathname && next.search === window.location.search) return;
        show();
      } catch {
        /* ignore */
      }
    }

    const pushState = history.pushState.bind(history);
    const replaceState = history.replaceState.bind(history);
    history.pushState = (data, unused, url) => {
      maybeShowForUrl(url);
      return pushState(data, unused, url);
    };
    history.replaceState = (data, unused, url) => {
      maybeShowForUrl(url);
      return replaceState(data, unused, url);
    };

    // Do not show on popstate (browser back/forward). Next often updates the
    // route before popstate fires, so show()-after-hide leaves the overlay stuck.
    document.addEventListener("click", onPointerDown, true);
    document.addEventListener("submit", onSubmit, true);
    return () => {
      history.pushState = pushState;
      history.replaceState = replaceState;
      document.removeEventListener("click", onPointerDown, true);
      document.removeEventListener("submit", onSubmit, true);
      clearTimers();
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-canvas/95 backdrop-blur-[1px]">
      <AppLoading full label="Loading Metertron" />
    </div>
  );
}
