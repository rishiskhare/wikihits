"use client"

import { useEffect } from "react"
import WikiArticle from "./WikiArticle"
import { useInView } from "react-intersection-observer"
import { useWikipediaArticles } from "../hooks/useWikipediaArticles"

export default function WikiFeed() {
  const { articles, isLoading, hasMore, loadMoreArticles } = useWikipediaArticles()
  const { ref, inView } = useInView({
    threshold: 0,
  })

  useEffect(() => {
    if (inView && !isLoading && hasMore) {
      loadMoreArticles()
    }
  }, [inView, isLoading, hasMore, loadMoreArticles])

  return (
    <div className="w-full h-[var(--full-height)] md:h-[var(--content-height)] overflow-y-scroll snap-y snap-mandatory scroll-container">
      {articles.map((article, index) => (
        <div
          key={`${article.pageid}-${index}`}
          id={`article-${index}`}
          className="scroll-section w-full h-[var(--full-height)] md:h-[var(--content-height)] snap-start md:p-4 flex items-center justify-center"
          ref={index === articles.length - 1 && !isLoading ? ref : undefined}
        >
          <div className="w-full max-w-5xl mx-auto">
            <WikiArticle article={article} />
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="w-full h-[var(--full-height)] md:h-[var(--content-height)] flex items-center justify-center">
          Loading more articles...
        </div>
      )}
    </div>
  )
}

