"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Carousel } from "@ark-ui/react/carousel";

type HeroBanner = {
  id: string;
  href: string;
  title: string;
  description: string;
  imageUrl?: string;
  mobileImageUrl?: string;
  imageAlt?: string;
  viewCount: number;
  authorName: string;
  categoryName: string;
  accent: string;
  glow: string;
  panel: string;
};

type HeroCarouselProps = {
  banners: HeroBanner[];
};

export function HeroCarousel({ banners }: HeroCarouselProps) {
  const [slidesPerPage, setSlidesPerPage] = useState(1);

  useEffect(() => {
    const syncSlides = () => {
      if (window.innerWidth >= 1280) {
        setSlidesPerPage(3);
        return;
      }

      if (window.innerWidth >= 768) {
        setSlidesPerPage(2);
        return;
      }

      setSlidesPerPage(1);
    };

    syncSlides();
    window.addEventListener("resize", syncSlides);

    return () => window.removeEventListener("resize", syncSlides);
  }, []);

  return (
    <Carousel.Root
      className="space-y-4"
      slideCount={banners.length}
      slidesPerPage={slidesPerPage}
      slidesPerMove="auto"
      spacing="14px"
      loop
      autoplay={{ delay: 4800 }}
      allowMouseDrag
    >
      <div className="relative">
        <Carousel.ItemGroup className="flex gap-3 overflow-hidden sm:gap-4">
            {banners.map((banner, index) => (
              <Carousel.Item
                key={banner.id}
                index={index}
                className="min-w-0"
              >
                <Link
                  href={banner.href}
                  className="card-surface group relative block min-h-[220px] overflow-hidden rounded-[1.5rem] sm:min-h-[280px] sm:rounded-[1.75rem]"
                >
                  {banner.imageUrl ? (
                    <>
                      <div className="absolute inset-0 sm:hidden">
                        <img
                          src={banner.mobileImageUrl || banner.imageUrl}
                          alt={banner.imageAlt || banner.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 hidden sm:block">
                        <img
                          src={banner.imageUrl}
                          alt={banner.imageAlt || banner.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </>
                  ) : (
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `radial-gradient(circle at top right, ${banner.glow}, transparent 30%), linear-gradient(135deg, rgba(255,255,255,0.14), transparent 60%), ${banner.panel}`,
                      }}
                    />
                  )}
                </Link>
              </Carousel.Item>
            ))}
        </Carousel.ItemGroup>

        <Carousel.Control>
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-1 sm:pl-3">
            <Carousel.PrevTrigger className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-slate-950/35 text-sm font-semibold text-white backdrop-blur transition hover:bg-slate-950/55 sm:h-10 sm:w-10">
              {"<"}
            </Carousel.PrevTrigger>
          </div>

          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1 sm:pr-3">
            <Carousel.NextTrigger className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-slate-950/35 text-sm font-semibold text-white backdrop-blur transition hover:bg-slate-950/55 sm:h-10 sm:w-10">
              {">"}
            </Carousel.NextTrigger>
          </div>
        </Carousel.Control>
      </div>

      <Carousel.IndicatorGroup className="flex justify-center gap-2">
        {banners.map((banner, index) => (
          <Carousel.Indicator
            key={banner.id}
            index={index}
            className="h-2.5 w-7 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] transition data-[current]:w-10 data-[current]:border-[var(--color-foreground)] data-[current]:bg-[var(--color-foreground)]"
          />
        ))}
      </Carousel.IndicatorGroup>
    </Carousel.Root>
  );
}
