import Link from "next/link"
import Image from "next/image"
import { useRef, useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"

interface ArticleProps {
  article: {
    title: string
    extract: string
    pageid: number
    thumbnail?: {
      source: string
      width: number
      height: number
    }
    views: number
  }
  currentIndex: number
  totalArticles: number
}

export default function WikiArticle({ article }: ArticleProps) {
  const extractRef = useRef<HTMLParagraphElement>(null)
  const [isTruncated, setIsTruncated] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [lineHeight, setLineHeight] = useState(0)
  const [truncatedText, setTruncatedText] = useState("")

  useEffect(() => {
    const extractElement = extractRef.current
    if (extractElement) {
      const computedLineHeight = Number.parseFloat(window.getComputedStyle(extractElement).lineHeight)
      setLineHeight(computedLineHeight)

      const initialMaxHeight = computedLineHeight * 8 // 8 lines
      const expandedMaxHeight = computedLineHeight * 12 // 12 lines

      // Check if the content is truncated
      const isTrunc = extractElement.scrollHeight > initialMaxHeight
      setIsTruncated(isTrunc)

      if (isTrunc && !isExpanded) {
        // Calculate the visible text and add ellipsis
        const words = article.extract.split(" ")
        let visibleText = ""
        let lineCount = 0
        let i = 0

        while (lineCount < 8 && i < words.length) {
          const testText = visibleText + words[i] + " "
          extractElement.textContent = testText
          if (extractElement.scrollHeight > lineCount * computedLineHeight) {
            lineCount++
            if (lineCount === 8) {
              visibleText = visibleText.trim() + "..."
              break
            }
          }
          visibleText += words[i] + " "
          i++
        }

        setTruncatedText(visibleText)
      }

      extractElement.style.maxHeight = isExpanded ? `${expandedMaxHeight}px` : `${initialMaxHeight}px`
    }
  }, [isExpanded, article.extract])

  const handleSeeMore = () => {
    setIsExpanded(true)
  }

  return (
    <article className="bg-white rounded-lg shadow-md p-6 border border-gray-200 w-full max-h-[calc(100vh-12rem)] overflow-y-auto">
      <h2 className="text-3xl mb-2 text-[#202122]">{article.title}</h2>
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
          <path
            fillRule="evenodd"
            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
            clipRule="evenodd"
          />
        </svg>
        {article.views.toLocaleString()} views
      </div>
      <div className="flex flex-col md:flex-row md:space-x-4">
        {article.thumbnail && (
          <div className="mb-4 md:mb-0 md:w-1/3">
            <Image
              src={article.thumbnail.source || "/placeholder.svg"}
              alt={article.title}
              width={article.thumbnail.width}
              height={article.thumbnail.height}
              layout="responsive"
              className="rounded-lg"
            />
          </div>
        )}
        <div className={`wiki-content ${article.thumbnail ? "md:w-2/3" : "w-full"}`}>
          <div className={`mb-4 ${isExpanded ? "overflow-y-auto" : "overflow-hidden"}`}>
            <p
              ref={extractRef}
              className="transition-all duration-300 ease-in-out"
              style={{
                maxHeight: isExpanded ? `${lineHeight * 12}px` : `${lineHeight * 8}px`,
              }}
            >
              {isExpanded || !isTruncated ? article.extract : truncatedText}
            </p>
          </div>
          {isTruncated && !isExpanded && (
            <button
              onClick={handleSeeMore}
              className="w-full text-left text-[#606060] font-bold text-sm py-2 flex items-center hover:bg-gray-100 transition-colors duration-200"
            >
              <ChevronDown className="mr-1" size={16} />
              Show more
            </button>
          )}
          <Link
            href={`https://en.wikipedia.org/wiki?curid=${article.pageid}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#3366cc] hover:underline inline-flex items-center read-more-link mt-2"
          >
            Read more on Wikipedia
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  )
}

