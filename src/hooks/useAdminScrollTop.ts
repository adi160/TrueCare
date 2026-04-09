import { useLayoutEffect } from "react";

export function useAdminScrollTop(): void {
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);
}
