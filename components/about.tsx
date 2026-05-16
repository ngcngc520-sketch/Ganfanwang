"use client"

import { motion } from "framer-motion"

const skills = [
  "UI/UX Design",
  "Brand Identity",
  "Design Systems",
  "Prototyping",
  "Typography",
  "Motion Design",
  "Front-End Development",
  "Creative Direction",
]

const experience = [
  {
    role: "Independent Designer",
    company: "Self-employed",
    period: "2022 — Present",
    description: "Working with brands and startups to create thoughtful digital experiences.",
  },
  {
    role: "Senior Product Designer",
    company: "Linear",
    period: "2020 — 2022",
    description: "Led product design initiatives for the core application experience.",
  },
  {
    role: "Product Designer",
    company: "Vercel",
    period: "2018 — 2020",
    description: "Developed the design system and dashboard interfaces.",
  },
]

export function About() {
  return (
    <section id="about" className="py-20 md:py-32 border-t border-border">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left Column - About Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5"
          >
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-6">
              About
            </h2>
            <div className="space-y-6 text-foreground">
              <p className="text-lg leading-relaxed">
                I&apos;m Alex Chen, a digital product designer based in San Francisco. I specialize in creating thoughtful, accessible interfaces that balance aesthetics with functionality.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed">
                With over 8 years of experience, I&apos;ve had the privilege of working with companies ranging from early-stage startups to established tech companies. My approach combines strategic thinking with meticulous craft.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed">
                When I&apos;m not designing, you&apos;ll find me exploring photography, reading about architecture, or experimenting with new creative tools.
              </p>
            </div>

            {/* Skills */}
            <div className="mt-10">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">
                Capabilities
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 text-sm border border-border hover:border-foreground transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Experience */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7"
          >
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-6">
              Experience
            </h2>
            <div className="space-y-8">
              {experience.map((job, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group pb-8 border-b border-border last:border-b-0 last:pb-0"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-lg font-medium text-foreground">
                        {job.role}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {job.company}
                      </p>
                    </div>
                    <span className="text-sm text-muted-foreground/60 md:text-right">
                      {job.period}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {job.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
