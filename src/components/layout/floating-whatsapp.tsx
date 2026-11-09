"use client";

import { WaIcon } from "@/components/icons/wa-icon";
import { CONTACT } from "@/lib/config";

export function FloatingWhatsapp() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full bg-elec flex items-center justify-center shadow-[4px_4px_0_rgba(11,10,8,0.85)] hover:shadow-[6px_6px_0_rgba(11,10,8,0.9)] transition-all">
        <WaIcon className="h-7 w-7 text-ink" />
      </a>
    </div>
  );
}
