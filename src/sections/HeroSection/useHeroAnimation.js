import { useState, useEffect } from "react";

export default function useHeroAnimation() {
  const [animationStates, setAnimationStates] = useState({
    title: false,
    subtitle: false,
    text: false
  });

  useEffect(() => {
    const timers = {
      title: setTimeout(() => setAnimationStates(s => ({...s, title: true})), 100),
      subtitle: setTimeout(() => setAnimationStates(s => ({...s, subtitle: true})), 600),
      text: setTimeout(() => setAnimationStates(s => ({...s, text: true})), 1100)
    };

    return () => {
      Object.values(timers).forEach(timer => clearTimeout(timer));
    };
  }, []);

  return animationStates;
}