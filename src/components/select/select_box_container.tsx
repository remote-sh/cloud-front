"use client";

import { useFileStore } from "@/store/file.store";
import { useMenuStore } from "@/store/menu.store";
import { useSelectBoxStore } from "@/store/select_box.store";
import { useWindowStore } from "@/store/window.store";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./select_box_container.module.css";

export default function SelectBoxContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  // Store states
  const highlightedFile = useFileStore((state) => state.highlightedFile);
  const menuRef = useMenuStore((state) => state.menuRef);
  const backgroundWindowRef = useWindowStore(
    (state) => state.backgroundWindowRef,
  );
  const currentWindow = useWindowStore((state) => state.currentWindow);
  // Store actions
  const setRect = useSelectBoxStore((state) => state.setRect);

  // States
  const [isSelecting, setIsSelecting] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [targetWindowRect, setTargetWindowRect] = useState<DOMRect | null>();

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const selectStart = useCallback(
    (e: MouseEvent) => {
      // Check if the click is inside the menu
      const currentMenuRef = menuRef?.current;
      if (currentMenuRef && currentMenuRef.contains(e.target as Node)) return;
      // Check if the click is inside the highlighted file
      if (highlightedFile) return;

      // Select start
      setIsSelecting(true);
      setStart({ x: e.clientX, y: e.clientY });
      document.body.style.cursor = "default";

      // Get target window rect
      if (currentWindow?.ref.current) {
        setTargetWindowRect(currentWindow.ref.current.getBoundingClientRect());
      } else if (backgroundWindowRef?.current) {
        setTargetWindowRect(
          backgroundWindowRef.current.getBoundingClientRect(),
        );
      }
    },
    [backgroundWindowRef, currentWindow, highlightedFile, menuRef],
  );

  const selecting = useCallback(
    (e: MouseEvent) => {
      if (
        !containerRef.current ||
        !boxRef.current ||
        !isSelecting ||
        !targetWindowRect
      )
        return;

      const left = Math.max(
        Math.min(start.x, e.clientX),
        targetWindowRect.left,
      );
      const top = Math.max(Math.min(start.y, e.clientY), targetWindowRect.top);
      const right = Math.min(
        Math.max(start.x, e.clientX),
        targetWindowRect.right - 2,
      );
      const bottom = Math.min(
        Math.max(start.y, e.clientY),
        targetWindowRect.bottom - 3,
      );
      const width = right - left;
      const height = bottom - top;

      boxRef.current.style.left = `${left}px`;
      boxRef.current.style.top = `${top}px`;
      boxRef.current.style.width = `${width}px`;
      boxRef.current.style.height = `${height}px`;
      boxRef.current.style.display = "block";

      setRect({
        ...boxRef.current.getBoundingClientRect(),
        left,
        top,
        right,
        bottom,
      });
    },
    [isSelecting, setRect, start.x, start.y, targetWindowRect],
  );

  // Selecting end event listener
  const selectingEnd = useCallback(() => {
    if (!boxRef.current) return;
    setIsSelecting(false);
    setRect(null);
    boxRef.current.style.display = "none";
  }, [setRect]);

  // Event listeners
  useEffect(() => {
    document.addEventListener("mousedown", selectStart);
    return () => {
      document.removeEventListener("mousedown", selectStart);
    };
  }, [selectStart]);

  useEffect(() => {
    document.addEventListener("mousemove", selecting);
    return () => {
      document.removeEventListener("mousemove", selecting);
    };
  }, [selecting]);

  useEffect(() => {
    document.addEventListener("mouseup", selectingEnd);
    return () => {
      document.removeEventListener("mouseup", selectingEnd);
    };
  }, [selectingEnd]);

  return (
    <div className={`full-size`} ref={containerRef}>
      <div className={styles.box} ref={boxRef} />
      {children}
    </div>
  );
}
