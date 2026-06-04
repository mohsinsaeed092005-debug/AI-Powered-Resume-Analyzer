"use client";

import dynamic from "next/dynamic";

const HeroVisual = dynamic(() => import("@/components/HeroVisual"), {
  ssr: false,
  loading: () => (
    <div className="hidden h-[440px] w-full md:block" aria-hidden="true" />
  ),
});

export default function LandingHero() {
  return <HeroVisual />;
}
