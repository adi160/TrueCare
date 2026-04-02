import { useEffect } from "react";
import { recordVisitorEvent } from "../services/backend";

function getSessionPageViewKey(pagePath: string): string {
  return `truecare:page-view:${pagePath}`;
}

export function useTrackPageView(pagePath: string, sectionId?: string): void {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storageKey = getSessionPageViewKey(pagePath);

    if (window.sessionStorage.getItem(storageKey) === "tracked") {
      return;
    }

    window.sessionStorage.setItem(storageKey, "tracked");

    void recordVisitorEvent({
      eventType: "page_view",
      pagePath,
      sectionId
    });
  }, [pagePath, sectionId]);
}
