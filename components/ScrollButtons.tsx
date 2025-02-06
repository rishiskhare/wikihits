"use client"

import { ChevronUp, ChevronDown } from "lucide-react"
import { useCallback } from "react"

export default function ScrollButtons() {
  const scrollToArticle = useCallback((direction: "up" | "down") => {
    const container = document.querySelector(".scroll-container")
    if (!container) return

    const currentScroll = container.scrollTop
    const articleHeight = container.clientHeight

    let targetScroll
    if (direction === "up") {
      targetScroll = Math.max(0, Math.floor(currentScroll / articleHeight - 0.5) * articleHeight)
    } else {
      targetScroll = Math.min(
        container.scrollHeight - articleHeight,
        Math.ceil(currentScroll / articleHeight) * articleHeight + articleHeight,
      )
    }

    container.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    })
  }, [])

  return (
    <div className="hidden lg:flex flex-col fixed right-8 top-[calc(50%+var(--header-height)/2)] transform -translate-y-1/2 z-20">
      <button
        className="p-2 mb-4 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
        aria-label="Scroll to previous article"
        onClick={() => scrollToArticle("up")}
      >
        <ChevronUp size={24} />
      </button>
      <button
        className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
        aria-label="Scroll to next article"
        onClick={() => scrollToArticle("down")}
      >
        <ChevronDown size={24} />
      </button>
    </div>
  )
}

