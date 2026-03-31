"use client";

import { useEffect } from "react";
import { useApp } from "@/components/providers/app-provider";
import { saveReadingHistory } from "@/lib/api/novels";

type ReaderHistorySyncProps = {
  novelId: string;
  chapterId: string;
};

export function ReaderHistorySync({
  novelId,
  chapterId,
}: ReaderHistorySyncProps) {
  const { token } = useApp();

  useEffect(() => {
    if (!token) {
      return;
    }

    void saveReadingHistory(token, novelId, chapterId).catch(() => undefined);
  }, [chapterId, novelId, token]);

  return null;
}
