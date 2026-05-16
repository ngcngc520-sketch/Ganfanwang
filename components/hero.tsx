"use client"

import { motion } from "framer-motion"

export function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center pt-20 md:pt-0">
      <div className="mx-auto max-w-7xl px-6 md:px-12 w-full">
        <div className="max-w-4xl">
          {/* Greeting */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm text-muted-foreground mb-6 md:mb-8"
          >
            Good afternoon
          </motion.p>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-2xl md:text-3xl lg:text-4xl font-normal leading-relaxed text-foreground mb-8 md:mb-10 text-balance"
          >
            I&apos;m an independent digital product designer. While design is my primary focus, I regularly work with code, believing that understanding the technical foundations leads to more thoughtful designs.
          </motion.h1>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <a
              href="#about"
              className="inline-flex items-center px-5 py-2.5 border border-foreground text-sm font-medium text-foreground hover:bg-foreground hover:text-background transition-colors duration-300"
            >
              Information
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
