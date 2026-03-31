"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

type ReaderViewportContextValue = {
  chromeVisible: boolean;
  setChromeVisible: (visible: boolean) => void;
  toggleChrome: () => void;
};

const ReaderViewportContext = createContext<ReaderViewportContextValue | null>(null);

export function ReaderViewportProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [chromeVisible, setChromeVisible] = useState(true);

  const value = useMemo<ReaderViewportContextValue>(
    () => ({
      chromeVisible,
      setChromeVisible,
      toggleChrome: () => setChromeVisible((current) => !current),
    }),
    [chromeVisible],
  );

  return <ReaderViewportContext value={value}>{children}</ReaderViewportContext>;
}

export function useReaderViewport() {
  const context = useContext(ReaderViewportContext);

  if (!context) {
    throw new Error("useReaderViewport must be used within ReaderViewportProvider");
  }

  return context;
}

export function useMaybeReaderViewport() {
  return useContext(ReaderViewportContext);
}
