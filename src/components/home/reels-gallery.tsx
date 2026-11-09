"use client";

import { Play, ExternalLink } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Reveal } from "@/components/motion/reveal";
import { SectionHead } from "@/components/home/section-head";
import { cn } from "@/lib/utils";

interface ReelPost {
  id: string;
  url: string;
  likes: string;
  comments: string;
  videoSrc?: string;
  label: string;
}

const REELS: ReelPost[] = [
  { id: "panda-reel-1", url: "https://www.instagram.com/p/Dbl8A0Ovv1R/", likes: "284", comments: "24", label: "Barbería clásica" },
  { id: "panda-reel-2", url: "https://www.instagram.com/p/Dbd_QOHolsp/", likes: "342", comments: "31", label: "Fade y diseños" },
  { id: "panda-reel-3", url: "https://www.instagram.com/p/DbOP3D_R7sG/", likes: "198", comments: "16", label: "Corte con navaja" },
  { id: "panda-reel-4", url: "https://www.instagram.com/p/DbE1Z0kviFO/", likes: "412", comments: "39", label: "Estilo y textura" },
];

function ReelCard({ post, idx }: { post: ReelPost; idx: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, rotate: idx % 2 === 0 ? -5 : 5 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay: idx * 0.15, type: "spring", damping: 14, stiffness: 110 }}
      onDoubleClick={() => window.open(post.url, "_blank", "noopener,noreferrer")}
      className="group relative aspect-[9/16] rounded-lg overflow-hidden border border-ink/10 cursor-pointer select-none bg-mark/20 backdrop-blur-sm"
      title="Doble clic para ver en Instagram"
    >
      <div className="w-full h-full flex items-center justify-center bg-mark/15 border border-white/10 backdrop-blur-md">
        <div className="text-center">
          <Play className="mx-auto mb-2 sm:mb-3 w-6 sm:w-8 h-6 sm:h-8 text-ink" />
          <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-ink-mute">
            Reel {idx + 1}
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileHover={{ opacity: 1, scale: 1 }}
        className="absolute inset-0 bg-black/30 opacity-0 flex flex-col items-center justify-center gap-2 z-20 pointer-events-none"
      >
        <span className="bg-elec text-ink px-2.5 sm:px-3 py-1 sm:py-1.5 rounded font-mono text-[8px] sm:text-[9px] font-bold uppercase tracking-widest">
          Ver publicación
        </span>
        <span className="text-[7px] sm:text-[8px] text-white/60 uppercase tracking-widest">
          Doble clic para abrir
        </span>
      </motion.div>

      <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 z-20 flex items-center gap-1.5 sm:gap-2">
        <span className="font-mono text-[8px] sm:text-[9px] font-bold text-white uppercase tracking-widest drop-shadow">
          {post.likes} ❤
        </span>
        <span className="font-mono text-[8px] sm:text-[9px] text-white/70 uppercase tracking-widest drop-shadow">
          {post.comments} ✎
        </span>
      </div>
    </motion.div>
  );
}

export function ReelsGallery() {
  return (
    <section id="reels" className="relative py-20 sm:py-24 lg:py-32 overflow-hidden" aria-labelledby="tit-reels">
      <div className="hidden sm:block aurora -top-20 left-1/6 h-[420px] w-[420px] bg-elec/20 rounded-full blur-[100px]" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead
          id="tit-reels"
          no="03"
          kicker="Mural social"
          title={
            <>
              Los reels más vistos de<br />
              <span className="text-gradient italic">nuestros clientes</span>
            </>
          }
          deck="Mural de reels de Instagram de nuestros clientes. Doble clic sobre cualquier reel para abrir la publicación en Instagram."
          meta="4 publicaciones"
        />

        <div className="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <Reveal>
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-ink-mute">
                Ver perfiles
              </span>
              <Link
                href="/instagram-clientes"
                className="flex items-center gap-1.5 sm:gap-2 font-mono text-[10px] sm:text-xs font-bold text-ink hover:text-elec transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                Todos los clientes
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {REELS.map((post, idx) => (
            <ReelCard key={post.id} post={post} idx={idx} />
          ))}
        </div>

        <div className="mt-10 sm:mt-12 flex justify-center">
          <Link
            href="/instagram-clientes"
            className="inline-flex items-center gap-2 border border-ink bg-paper px-6 sm:px-7 py-2 sm:py-2.5 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider text-ink transition-colors hover:bg-elec hover:text-ink group"
          >
            Seguir en Instagram <svg width="16" height="16" stroke="currentColor" viewBox="0 0 24 24" className="group-hover:translate-x-1 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-5 7-5"/></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
