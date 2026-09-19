"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 화면에 들어오면 한 번 켜지는 스위치.
 *
 * 정적인 그림도 0에서 자라나면 크기를 몸으로 읽게 된다. 숫자를 먼저 보여주고
 * 나중에 막대를 맞추는 것과, 막대가 자라는 것을 보는 것은 다른 경험이다.
 *
 * 한 번 켜지면 끄지 않는다. 스크롤을 오르내릴 때마다 다시 자라면 산만하다.
 * 움직임을 원하지 않는다고 밝힌 사용자에게는 globals.css가 전환 시간을 0으로
 * 만들어 두었으므로, 여기서 따로 갈라 볼 필요가 없다.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px", threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, shown };
}
