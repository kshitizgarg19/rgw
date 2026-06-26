"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { BUSINESS, whatsappLink } from "@/lib/constants";

export function WhatsAppButton() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [showTip, setShowTip] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 1200);
    const tip = setTimeout(() => setShowTip(true), 3200);
    const hide = setTimeout(() => setShowTip(false), 9000);
    return () => {
      clearTimeout(t);
      clearTimeout(tip);
      clearTimeout(hide);
    };
  }, []);

  if (pathname?.startsWith("/rgw-admin")) return null;

  return (
    <AnimatePresence>
      {mounted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ type: "spring", damping: 18, stiffness: 260 }}
          className="fixed bottom-5 right-5 z-[140] flex items-center gap-3"
        >
          <AnimatePresence>
            {showTip && (
              <motion.div
                initial={{ opacity: 0, x: 12, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 12, scale: 0.9 }}
                className="glass relative hidden items-center gap-2 rounded-full py-2.5 pl-4 pr-3 text-sm font-medium text-[var(--color-maroon)] shadow-lg sm:flex"
              >
                Questions? Chat with us
                <button onClick={() => setShowTip(false)} aria-label="Dismiss" className="text-[var(--color-ink-faint)] hover:text-[var(--color-maroon)]">
                  <X size={14} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <a
            href={whatsappLink(BUSINESS.whatsappDefaultMessage)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="group relative grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_rgba(37,211,102,0.45)] transition-transform duration-300 hover:scale-110"
          >
            <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30" />
            <MessageCircle size={26} className="relative" fill="currentColor" />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
