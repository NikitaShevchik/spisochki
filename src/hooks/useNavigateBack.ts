import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

let alreadyShowen = false;

export const useNavigateBack = (url: string | (() => void) | number = -1, deps: string[] = []) => {
  const navigate = useNavigate();
  useEffect(() => {
    const handler = () => {
      if (typeof url === "function") url();
      else navigate(url as string, { replace: true });
    };

    const navigateBackButton = document.getElementById("navigateBackButton");
    if (navigateBackButton) navigateBackButton.onclick = handler;

    if (!window.Telegram?.WebApp?.BackButton) return;
    window.Telegram.WebApp.BackButton.onClick(handler);
    window.Telegram.WebApp.BackButton.show();
    alreadyShowen = true;

    return () => {
      alreadyShowen = false;
      window.Telegram.WebApp.BackButton.offClick(handler);
      if (navigateBackButton) navigateBackButton.onclick = () => navigate(-1);

      setTimeout(() => {
        if (alreadyShowen) return;
        window.Telegram.WebApp.BackButton.hide();
      }, 500);
    };
  }, deps);
};
