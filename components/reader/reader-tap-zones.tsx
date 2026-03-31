"use client";

import { useRouter } from "next/navigation";
import { useReaderViewport } from "@/components/reader/reader-viewport";

type ReaderTapZonesProps = {
  previousHref?: string;
  nextHref?: string;
};

export function ReaderTapZones({
  previousHref,
  nextHref,
}: ReaderTapZonesProps) {
  const router = useRouter();
  const { toggleChrome } = useReaderViewport();

  return (
    <>
      <div className="fixed inset-x-0 bottom-24 top-24 z-10 md:hidden">
        <button
          type="button"
          aria-label="ไปตอนก่อนหน้า"
          disabled={!previousHref}
          onClick={() => {
            if (previousHref) {
              router.push(previousHref);
            }
          }}
          className="absolute inset-y-0 left-0 w-[22%] disabled:cursor-default"
        />
        <button
          type="button"
          aria-label="ซ่อนหรือแสดงเมนูการอ่าน"
          onClick={toggleChrome}
          className="absolute inset-y-0 left-[22%] w-[56%]"
        />
        <button
          type="button"
          aria-label="ไปตอนถัดไป"
          disabled={!nextHref}
          onClick={() => {
            if (nextHref) {
              router.push(nextHref);
            }
          }}
          className="absolute inset-y-0 right-0 w-[22%] disabled:cursor-default"
        />
      </div>
    </>
  );
}
