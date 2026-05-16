"use client"

import { motion } from "framer-motion"

const socialLinks = [
  { name: "LinkedIn", href: "https://linkedin.com" },
  { name: "Instagram", href: "https://instagram.com" },
  { name: "GitHub", href: "https://github.com" },
  { name: "Dribbble", href: "https://dribbble.com" },
  { name: "X", href: "https://x.com" },
]

export function Contact() {
  return (
    <section id="contact" className="py-20 md:py-32 border-t border-border">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4"
          >
            <h2 className="text-sm font-medium text-muted-foreground mb-6">
              Contact
            </h2>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-8"
          >
            <div className="space-y-8">
              {/* Main CTA */}
              <div>
                <h3 className="text-xl md:text-2xl text-foreground mb-6 leading-relaxed">
                  If you would like to discuss a project or just say hi, I&apos;m always down to chat.
                </h3>
                <a
                  href="mailto:hello@alexchen.design"
                  className="inline-flex items-center px-5 py-2.5 bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors duration-300"
                >
                  Contact
                </a>
              </div>

              {/* Contact Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-border">
                <div>
                  <h4 className="text-sm text-muted-foreground mb-2">Mail</h4>
                  <a
                    href="mailto:hello@alexchen.design"
                    className="text-foreground hover:text-muted-foreground transition-colors inline-flex items-center gap-2"
                  >
                    hello@alexchen.design
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </a>
                </div>
                <div>
                  <h4 className="text-sm text-muted-foreground mb-2">Social</h4>
                  <div className="flex flex-col gap-1">
                    {socialLinks.map((link) => (
                      <a
                        key={link.name}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground hover:text-muted-foreground transition-colors w-fit"
                      >
                        {link.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
