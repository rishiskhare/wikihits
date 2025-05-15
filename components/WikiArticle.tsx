"use client"

import type React from "react"

import Image from "next/image"
import { useState, useRef, useEffect, useCallback } from "react"
import { ChevronUp } from "lucide-react"

interface ArticleProps {
  article: {
    title: string
    extract: string
    pageid: number
    thumbnail: {
      source: string
      width: number
      height: number
    }
    views: number
  }
}

export default function WikiArticle({ article }: ArticleProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [previewHeight, setPreviewHeight] = useState(0)
  const [expandedHeight, setExpandedHeight] = useState(0)
  const [imageOrientation, setImageOrientation] = useState<"horizontal" | "vertical">("horizontal")
  const [imageLoaded, setImageLoaded] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const expandedContentRef = useRef<HTMLDivElement>(null)

  const updatePreviewHeight = useCallback(() => {
    if (headerRef.current) {
      const height = headerRef.current.offsetHeight
      setPreviewHeight(height)
    }
  }, [])

  const updateExpandedHeight = useCallback(() => {
    if (expandedContentRef.current) {
      const height = expandedContentRef.current.scrollHeight
      setExpandedHeight(height)
    }
  }, [])

  useEffect(() => {
    updatePreviewHeight()
    updateExpandedHeight()

    window.addEventListener("resize", () => {
      updatePreviewHeight()
      updateExpandedHeight()
    })

    const resizeObserver = new ResizeObserver(() => {
      updatePreviewHeight()
      updateExpandedHeight()
    })

    if (headerRef.current) {
      resizeObserver.observe(headerRef.current)
    }
    if (expandedContentRef.current) {
      resizeObserver.observe(expandedContentRef.current)
    }

    return () => {
      window.removeEventListener("resize", updatePreviewHeight)
      resizeObserver.disconnect()
    }
  }, [updatePreviewHeight, updateExpandedHeight])

  useEffect(() => {
    if (article.thumbnail) {
      setImageOrientation(article.thumbnail.width >= article.thumbnail.height ? "horizontal" : "vertical")
      setImageLoaded(false)
    }
  }, [article.thumbnail])

  const lineClamp = article.title.length > 50 ? 7 : article.title.length > 30 ? 12 : 15

  const toggleExpand = () => setIsExpanded(!isExpanded)

  const handleContentClick = (event: React.MouseEvent) => {
    if (!(event.target as HTMLElement).closest("button")) {
      toggleExpand()
    }
  }

  return (
    <article className="flex flex-col md:flex-row h-[var(--content-height)] md:h-[var(--article-height)] w-full bg-white relative overflow-hidden md:items-stretch md:rounded-xl md:shadow-lg">
      <div className="w-full md:w-1/2 h-full relative md:overflow-hidden">
        <Image
          src={article.thumbnail.source || "/placeholder.svg"}
          alt={article.title}
          layout="fill"
          objectFit="cover"
          className={`md:hidden transition-opacity duration-200 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setImageLoaded(true)}
        />
        <Image
          src={article.thumbnail.source || "/placeholder.svg"}
          alt={article.title}
          layout="fill"
          objectFit={imageOrientation === "horizontal" ? "contain" : "cover"}
          className={`hidden md:block transition-opacity duration-200 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setImageLoaded(true)}
        />
      </div>

      <div className="w-full md:w-1/2 md:flex md:flex-col bg-white transition-all duration-500 ease-in-out overflow-hidden">
        <div className="md:hidden">
          <div
            className="absolute inset-x-0 bottom-0 bg-white transition-all duration-500 ease-in-out flex flex-col overflow-hidden cursor-pointer"
            style={{ height: isExpanded ? `${expandedHeight}px` : `${previewHeight}px` }}
            ref={contentRef}
            onClick={handleContentClick}
          >
            <div ref={expandedContentRef}>
              <div className="p-4" ref={headerRef}>
                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-4">
                    <h2 className="text-4xl text-[#202122] break-words font-linux font-bold leading-tight mb-2">
                      {article.title}
                    </h2>
                    <div className="flex items-center text-base text-gray-500 mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {article.views.toLocaleString()} views
                    </div>
                  </div>
                  <ChevronUp
                    size={24}
                    className={`text-gray-500 transition-transform duration-500 ${isExpanded ? "rotate-180" : ""}`}
                  />
                </div>
                <div className="relative mt-3">
                  <div
                    className={`text-lg text-[#202122] font-roboto ${
                      isExpanded ? "opacity-0" : "opacity-100"
                    } transition-opacity duration-500`}
                  >
                    <div
                      className={`leading-relaxed line-clamp line-clamp-custom`}
                      style={{ "--line-clamp": 3 } as React.CSSProperties}
                    >
                      {article.extract}
                    </div>
                    <button
                      onClick={toggleExpand}
                      className="block mt-2 text-[#3366cc] hover:underline text-lg font-roboto font-bold"
                    >
                      See more
                    </button>
                  </div>
                  <div
                    className={`
                      absolute top-0 left-0 right-0
                      text-lg text-[#202122] font-roboto leading-relaxed
                      transition-opacity duration-500
                      ${isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"}
                    `}
                  >
                    <div
                      className={`line-clamp line-clamp-custom`}
                      style={{ "--line-clamp": lineClamp, WebkitLineClamp: lineClamp } as React.CSSProperties}
                    >
                      {article.extract}
                    </div>
                    <button
                      onClick={toggleExpand}
                      className="block mt-2 text-[#3366cc] hover:underline text-lg font-roboto font-bold"
                    >
                      See less
                    </button>
                    <div className="mt-4 pt-4 pb-4 border-t border-gray-200">
                      <a
                        href={`https://en.wikipedia.org/wiki?curid=${article.pageid}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#3366cc] hover:underline inline-flex items-center text-lg"
                      >
                        Read more on Wikipedia
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 ml-1.5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden md:flex flex-col h-full">
          <div className="flex-grow overflow-y-auto">
            <div className="p-4">
              <h2 className="text-4xl text-[#202122] break-words font-linux font-bold leading-tight mb-2">
                {article.title}
              </h2>
              <div className="flex items-center text-base text-gray-500 mt-1 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {article.views.toLocaleString()} views
              </div>
              <div className="text-lg text-[#202122] font-roboto leading-relaxed">{article.extract}</div>
            </div>
          </div>
          <div className="p-4 border-t border-gray-200">
            <a
              href={`https://en.wikipedia.org/wiki?curid=${article.pageid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#3366cc] hover:underline inline-flex items-center text-lg"
            >
              Read more on Wikipedia
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-1.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </article>
  )
}
