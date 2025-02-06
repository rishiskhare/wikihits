"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"

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
}

export default function WikiArticle({ article }: ArticleProps) {
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [isVertical, setIsVertical] = useState(false)

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0)
    if (article.thumbnail) {
      setIsVertical(article.thumbnail.height > article.thumbnail.width)
    }
  }, [article.thumbnail])

  return (
    <article className="bg-white rounded-lg shadow-md border border-gray-200 w-full max-w-screen-sm mx-auto overflow-hidden flex flex-col lg:flex-row lg:max-w-5xl lg:h-[36rem]">
      <div className="relative w-full h-[14rem] sm:h-[16rem] lg:w-1/2 lg:h-full flex items-center justify-center bg-gray-100">
        {article.thumbnail ? (
          <Image
            src={article.thumbnail.source || "/placeholder.svg"}
            alt={article.title}
            width={500}
            height={550}
            className={`rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none w-full h-full
              object-contain
              lg:${isVertical ? "object-cover" : "object-contain"}`}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-gray-400 text-2xl">No image available</span>
          </div>
        )}
      </div>
      <div
        className={`p-4 sm:p-6 w-full lg:w-1/2 ${isTouchDevice ? "h-[22rem] sm:h-[24rem]" : "h-[22rem]"} lg:h-full flex flex-col`}
      >
        <h2 className="text-2xl sm:text-3xl mb-2 text-[#202122]">{article.title}</h2>
        <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-4">
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
        <div
          className={`wiki-content flex-1 ${isTouchDevice ? "" : "overflow-y-auto max-h-[calc(22rem-8rem)]"} lg:max-h-full mb-4`}
        >
          <p className="transition-all duration-300 ease-in-out">{article.extract}</p>
        </div>
        <Link
          href={`https://en.wikipedia.org/wiki?curid=${article.pageid}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#3366cc] hover:underline inline-flex items-center read-more-link text-sm sm:text-base mt-auto"
        >
          Read more on Wikipedia
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-5 sm:w-5 ml-1.5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </div>
    </article>
  )
}

