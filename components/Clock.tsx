import { assert } from "$std/assert/assert.ts";
import { cl } from "cl";
import { JSX } from "preact";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";

export function Clock(props: JSX.HTMLAttributes<HTMLButtonElement>) {
  const [time, setTime] = useState(new Date());
  const secondsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const intervalHandle = setInterval(() => {
      setTime(new Date());
    }, 200);
    return () => {
      clearInterval(intervalHandle);
    };
  }, []);

  const Seconds = () => {
    if (!secondsRef.current) return <></>;
    const rect = secondsRef.current.getBoundingClientRect();
    const ticks = 60;
    const ticksH = 20;
    const ticksV = (ticks - ticksH * 2) / 2;

    const size = Math.min(rect.width / ticksH, rect.height / ticksV) * 0.9;

    assert(ticksV > 0);
    return (
      <>
        {Array.from(Array(ticks).keys()).map((sec) => {
          const i = (sec + Math.floor(ticksH / 2)) % ticks;
          const [q, d] = (() => {
            if (i < ticksH) return [0, i];
            if (i < ticksH + ticksV) return [1, i - ticksH];
            if (i < ticksH * 2 + ticksV) return [2, i - ticksH - ticksV];
            return [3, i - ticksH - ticksV - ticksH];
          })();
          return (
            <>
              <span
                class={cl(
                  "flex absolute items-center justify-center rounded-lg",
                  (sec % 5 == 0) ? "bg-red-900" : "",
                )}
                style={{
                  left: (() => {
                    switch (q) {
                      case 0:
                        return d * (rect.width - size) / ticksH;
                      case 1:
                        return (rect.width - size);
                      case 2:
                        return (ticksH - d) * (rect.width - size) / ticksH;
                      case 3:
                        return 0;
                      default:
                        return 0;
                    }
                  })(),
                  top: (() => {
                    switch (q) {
                      case 0:
                        return 0;
                      case 1:
                        return d * (rect.height - size) / ticksV;
                      case 2:
                        return (rect.height - size);
                      case 3:
                        return (ticksV - d) * (rect.height - size) / ticksV;
                      default:
                        return 0;
                    }
                  })(),
                  height: size,
                  width: size,
                  padding: "4px",
                }}
              >
                <span
                  class={cl(
                    "flex absolute items-center justify-center font-bold text-black",
                    "w-[90%] h-[90%] rounded-md",
                    sec <= time.getSeconds()
                      ? "bg-[#cecece] shadow-lg"
                      : "bg-[#454545]",
                  )}
                >
                  {time.getSeconds() == sec ? sec : ""}
                </span>
              </span>
            </>
          );
        })}
      </>
    );
  };

  const hours = useMemo(() => {
    const h = time.getHours();
    if (h > 12) {
      return (h - 12).toString();
    }
    return h.toString();
  }, [time]);

  return (
    <div class="flex flex-col h-full text-center justify-center relative">
      <div class="text-[#FFE8B7] leading-none font-bold flex items-center justify-center w-full">
        <div class="text-[calc(min(35vw,70vh))] flex-[1] text-right inline-block">{hours}</div>
        <div class="text-[calc(min(30vw,70vh))] opacity-25 inline-block">:</div>
        <div class="text-[calc(min(35vw,70vh))] flex-[1] text-left inline-block">{time.getMinutes().toString().padStart(2, "0")}</div>
      </div>
      <div
        ref={secondsRef}
        class="absolute top-0 left-0 min-h-full w-full"
      >
        <Seconds />
      </div>
    </div>
  );
}
