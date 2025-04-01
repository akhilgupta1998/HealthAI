
"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
  icon: React.ComponentType<any>
  children?: NavItem[]
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

export function TubeNavbar({ items, className }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name)
  const [isMobile, setIsMobile] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div
      className={cn(
        "fixed top-0 left-1/2 -translate-x-1/2 z-50 pt-4",
        className,
      )}
    >
      <div className="flex items-center gap-3 bg-background/70 border border-border backdrop-blur-xl py-1.5 px-2 rounded-full shadow-lg">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name
          const isHovered = hoveredItem === item.name

          return (
            <div key={item.name} className="relative group">
              <Link
                to={item.url}
                onClick={() => setActiveTab(item.name)}
                onMouseEnter={() => setHoveredItem(item.name)}
                onMouseLeave={() => setHoveredItem(null)}
                className={cn(
                  "relative cursor-pointer text-sm font-medium px-5 py-2 rounded-full transition-colors flex items-center gap-2",
                  "text-foreground/80 hover:text-primary",
                  isActive && "text-primary font-semibold"
                )}
              >
                <span className="hidden md:inline">{item.name}</span>
                <span className={cn("md:hidden", isMobile ? "inline-block" : "hidden")}>
                  <Icon size={18} strokeWidth={2.5} />
                </span>
                {isActive && (
                  <motion.div
                    layoutId="tube-navbar-active"
                    className="absolute inset-0 w-full bg-primary/5 rounded-full -z-10"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  >
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-t-full">
                      <div className="absolute w-10 h-5 bg-primary/20 rounded-full blur-md -top-2 -left-2" />
                      <div className="absolute w-6 h-5 bg-primary/20 rounded-full blur-md -top-1" />
                      <div className="absolute w-3 h-3 bg-primary/20 rounded-full blur-sm top-0 left-1.5" />
                    </div>
                  </motion.div>
                )}
              </Link>
              
              {/* Dropdown for items with children */}
              {item.children && item.children.length > 0 && (isHovered || isActive) && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 mt-2 w-48 bg-background/95 backdrop-blur-xl border border-border rounded-lg shadow-lg z-50 overflow-hidden"
                >
                  <div className="py-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        to={child.url}
                        className="flex items-center px-4 py-2 text-sm text-foreground/80 hover:bg-primary/5 hover:text-primary"
                      >
                        {child.icon && <child.icon className="mr-2 h-4 w-4" />}
                        <span>{child.name}</span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  )
}
