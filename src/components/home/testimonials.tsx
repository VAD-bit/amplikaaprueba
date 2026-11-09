"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { TESTIMONIALS } from "@/lib/config";
import { Reveal } from "@/components/motion/reveal";
import { SectionHead } from "@/components/home/section-head";

const cardVariants = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 14 } } };

export function Testimonials() {
  return (
    <section className="relative py-24 sm:py-32" aria-labelledby="tit-testi">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead id="tit-testi" no="08" kicker="Cartas de lectores" title={<>Lo que dicen<span className="text-gradient italic">nuestros clientes</span></>} deck="Testimonios verificados de marcas que ya pasaron por la redacción." meta="Sin editar" />

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6 }} className="grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={t.name} variants={cardVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} transition={{ delay: i * 0.08 }}>
              <Reveal>
                <figure className="glass relative h-full p-7 backdrop-blur-sm">
                  <span className="headline absolute -top-2 right-4 text-6xl leading-none text-ink" aria-hidden="true">&rdquo;</span>
                  <div className="mb-4 flex gap-1" aria-label={`${t.rating} de 5 estrellas`}>{Array.from({ length: t.rating }).map((_, s) => (<Star key={s} className="h-4 w-4 fill-ink text-ink" aria-hidden="true" />))}</div>
                  <blockquote className="mb-6 font-syne text-[15px] italic leading-relaxed text-ink-soft">{t.quote}</blockquote>
                  <figcaption className="border-t border-ink/20 pt-4"><p className="headline text-base uppercase">{t.name}</p><p className="label-mono mt-1 text-[10px]">{t.role}</p></figcaption>
                </figure>
              </Reveal>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
