"use client";

import { useCallback, useRef, MouseEvent, TouchEvent } from "react";

type LongPressOptions = {
  shouldPreventDefault?: boolean;
  delay?: number;
};

const useLongPress = (
  onLongPress: (event: MouseEvent | TouchEvent) => void,
  onClick: (event: MouseEvent | TouchEvent) => void,
  { shouldPreventDefault = true, delay = 500 }: LongPressOptions = {}
) => {
  const timeout = useRef<NodeJS.Timeout>();
  const longPressTriggered = useRef(false);

  const start = useCallback(
    (event: MouseEvent | TouchEvent) => {
      // Prevent context menu on right-click
      if ('button' in event && event.button === 2) {
        return;
      }

      longPressTriggered.current = false;
      timeout.current = setTimeout(() => {
        onLongPress(event);
        longPressTriggered.current = true;
      }, delay);
    },
    [onLongPress, delay]
  );

  const clear = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
      if (event.type === 'mouseup' || event.type === 'touchend') {
        if (!longPressTriggered.current) {
          onClick(event);
        }
      }
      // Prevent context menu from appearing after long press
      if(longPressTriggered.current && shouldPreventDefault) {
        event.preventDefault();
      }
    },
    [onClick, shouldPreventDefault]
  );
  
  const cancel = useCallback(() => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
  }, []);

  return {
    onMouseDown: (e: MouseEvent) => start(e),
    onTouchStart: (e: TouchEvent) => start(e),
    onMouseUp: (e: MouseEvent) => clear(e),
    onTouchEnd: (e: TouchEvent) => clear(e),
    onMouseLeave: () => cancel(),
    onContextMenu: (e: MouseEvent) => {
      if (longPressTriggered.current) {
        e.preventDefault();
      }
    }
  };
};

export default useLongPress;
