import { useEffect } from "react";

const titles = ["psssst...", "(1) wyd tho", "(7 ' ^ ' )7", "T^T", "ヽ(°◇° )ノ", "uhhhhh"];
const originalTitle = "whattuan";

const useTitleRotation = () => {
  useEffect(() => {
    // Set the initial title
    document.title = originalTitle;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        const randomTitle = titles[Math.floor(Math.random() * titles.length)];
        document.title = randomTitle;
      } else {
        document.title = originalTitle;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
};

export default useTitleRotation;