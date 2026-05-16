"use client"

import { motion } from "framer-motion"
import Image from "next/image"

interface CraftItem {
  id: number
  title: string
  description: string
  image: string
  year: string
  type?: string
}

const craftItems: CraftItem[] = [
  {
    id: 1,
    title: "Fluid superscripts and subscripts",
    description: "Accompanying interactive demo",
    image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=400&fit=crop",
    year: "2024",
    type: "Experiment"
  },
  {
    id: 2,
    title: "Adaptive precision",
    description: "Open source re-implementation of Rauno Freiberg's web experiment",
    image: "https://images.unsplash.com/photo-1555421689-d68471e189f2?w=600&h=400&fit=crop",
    year: "2024",
    type: "Open Source"
  },
  {
    id: 3,
    title: "Golden ratio line height",
    description: "Using the golden ratio to optimize typography with ease",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
    year: "2024",
    type: "Tool"
  },
  {
    id: 4,
    title: "Link spacing variables",
    description: "Effortlessly link spacing variables to your design system",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop",
    year: "2024",
    type: "Figma Plugin"
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
}

function CraftCard({ item }: { item: CraftItem }) {
  return (
    <motion.div
      variants={itemVariants}
      className="group cursor-pointer"
    >
      <div className="relative aspect-[3/2] overflow-hidden mb-3 bg-muted rounded-sm">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
        />
        {item.type && (
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-background/90 backdrop-blur-sm text-xs text-muted-foreground rounded-sm">
            {item.type}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-medium text-foreground group-hover:text-muted-foreground transition-colors">
          {item.title}
        </h4>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {item.description}
        </p>
        <p className="text-xs text-muted-foreground/60">
          {item.year}
        </p>
      </div>
    </motion.div>
  )
}

export function CraftSection() {
  return (
    <section className="py-16 md:py-24 border-t border-border">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        {/* Section Header */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-sm font-medium text-muted-foreground mb-10 md:mb-12"
        >
          Craft
        </motion.h2>

        {/* Craft Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {craftItems.map((item) => (
            <CraftCard key={item.id} item={item} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
