import { useEffect, useState } from "react";

export const Dimensions = () => {
  const [width, setWidth] = useState(window.screen.width);
  const [height, setHeight] = useState(window.screen.height);
  useEffect(() => {
    window.addEventListener("resize", (event) => {
      setWidth(event.target.screen.width);
      setHeight(event.target.screen.height);
    });
    return () => {
      window.removeEventListener("resize", (event) => {
        setWidth(event.target.screen.width);
        setHeight(event.target.screen.height);
      });
    };
  }, []);
  return { width, height };
};
