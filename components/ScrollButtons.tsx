import { ChevronUp, ChevronDown } from "lucide-react"

interface ScrollButtonsProps {
  totalArticles: number
  currentArticle: number
  scrollToArticle: (direction: "up" | "down") => void
}

export default function ScrollButtons({ totalArticles, currentArticle, scrollToArticle }: ScrollButtonsProps) {
  return (
    <div className="hidden lg:flex flex-col fixed right-8 top-[calc(50%+2.5rem)] transform -translate-y-1/2 z-20">
      <button
        className="p-2 mb-4 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50"
        aria-label="Scroll to previous article"
        onClick={() => scrollToArticle("up")}
        disabled={currentArticle === 0}
      >
        <ChevronUp size={24} />
      </button>
      <button
        className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50"
        aria-label="Scroll to next article"
        onClick={() => scrollToArticle("down")}
        disabled={currentArticle === totalArticles - 1}
      >
        <ChevronDown size={24} />
      </button>
    </div>
  )
}

