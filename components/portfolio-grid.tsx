"use client"

import { motion } from "framer-motion"
import { useRef } from "react"
import Image from "next/image"

interface Project {
  id: number
  title: string
  description: string
  image: string
  tags: string[]
  year: string
}

const projects: Project[] = [
  {
    id: 1,
    title: "Timeline",
    description: "Building a seamless path to better cellular health",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop",
    tags: ["Design", "Shopify Headless", "Sanity", "Next.js", "React", "Framer"],
    year: "2024"
  },
  {
    id: 2,
    title: "Siesta Campers",
    description: "Elevating Portugal's premier van rental company",
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800&h=600&fit=crop",
    tags: ["Design", "Next.js", "Prismic", "React", "TailwindCSS"],
    year: "2024"
  },
  {
    id: 3,
    title: "Dr. Julia Woehr",
    description: "Distilling architectural impact to its spatial essence",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
    tags: ["Design", "Development", "Next.js", "Sanity", "React", "Tailwind CSS"],
    year: "2023"
  },
  {
    id: 4,
    title: "Fahrplan.guru",
    description: "Bringing clarity to complex transit systems",
    image: "https://images.unsplash.com/photo-1545670723-196ed0954986?w=800&h=600&fit=crop",
    tags: ["Design", "React", "TypeScript", "Motion"],
    year: "2023"
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
}

function ProjectCard({ project }: { project: Project }) {
  const cardRef = useRef<HTMLDivElement>(null)

  return (
    <motion.div
      ref={cardRef}
      variants={itemVariants}
      className="group cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden mb-4 bg-muted">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-500" />
      </div>

      {/* Content */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-foreground group-hover:text-muted-foreground transition-colors duration-300">
          {project.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {project.description}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-2">
          {project.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs text-muted-foreground border border-border rounded-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export function PortfolioGrid() {
  return (
    <section id="work" className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-12 md:mb-16"
        >
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Selected work
          </h2>
          <div className="flex gap-2">
            <button className="w-8 h-8 flex items-center justify-center border border-border hover:border-foreground transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="w-8 h-8 flex items-center justify-center border border-border hover:border-foreground transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
