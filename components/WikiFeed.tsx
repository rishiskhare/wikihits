"use client"

import { useState, useEffect, useCallback } from "react"
import WikiArticle from "./WikiArticle"
import { useInView } from "react-intersection-observer"

interface Article {
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

interface PopularArticle {
  article: string
  views: number
  rank: number
}

interface WikiApiResponse {
  query: {
    pages: {
      [key: string]: {
        title: string
        extract: string
        pageid: number
        thumbnail?: {
          source: string
          width: number
          height: number
        }
      }
    }
  }
}

interface PopularApiResponse {
  items: [
    {
      articles: PopularArticle[]
    },
  ]
}

export default function WikiFeed() {
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  const { ref, inView } = useInView({
    threshold: 0,
  })

  const fetchTrendingArticles = useCallback(async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    try {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      const dateString = date.toISOString().split("T")[0].replace(/-/g, "/")

      const popularResponse = await fetch(
        `https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia/all-access/${dateString}`,
      )
      const popularData: PopularApiResponse = await popularResponse.json()

      // Fetch 3 articles at a time
      const topArticles = popularData.items[0].articles
        .filter(
          (article: PopularArticle) =>
            !article.article.startsWith("Special:") &&
            !article.article.startsWith("Portal:") &&
            article.article !== "Main_Page" &&
            article.article !== "Wikipedia:Featured_pictures",
        )
        .slice(page * 3, (page + 1) * 3)

      if (topArticles.length === 0) {
        setHasMore(false)
        return
      }

      const pageIds = topArticles.map((article: PopularArticle) => article.article).join("|")
      const contentResponse = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&format=json&titles=${pageIds}&prop=extracts|pageimages&exintro&explaintext&pithumbsize=500&origin=*`,
      )
      const contentData: WikiApiResponse = await contentResponse.json()

      const newArticles = Object.values(contentData.query.pages).map((page) => {
        const popularityData = topArticles.find((a: PopularArticle) => a.article === page.title.replace(/ /g, "_"))
        return {
          title: page.title,
          extract: page.extract,
          pageid: page.pageid,
          thumbnail: page.thumbnail,
          views: popularityData ? popularityData.views : 0,
        }
      })

      setArticles((prevArticles) => [...prevArticles, ...newArticles])
      setPage((prevPage) => prevPage + 1)
    } catch (error) {
      console.error("Error fetching articles:", error)
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, hasMore, page])

  useEffect(() => {
    if (articles.length === 0) {
      fetchTrendingArticles()
    }
  }, [articles.length, fetchTrendingArticles])

  useEffect(() => {
    if (inView && !isLoading && hasMore) {
      fetchTrendingArticles()
    }
  }, [inView, isLoading, hasMore, fetchTrendingArticles])

  return (
    <div className="scroll-container mt-[var(--header-height)]">
      {articles.map((article, index) => (
        <div
          key={`${article.pageid}-${index}`}
          id={`article-${index}`}
          className={`scroll-section w-full py-4 flex items-center justify-center`}
          ref={index === articles.length - 1 ? ref : undefined}
        >
          <div className="w-full max-w-5xl mx-auto px-4">
            <WikiArticle article={article} />
          </div>
        </div>
      ))}
      {isLoading && <div className="h-20 flex items-center justify-center">Loading more articles...</div>}
    </div>
  )
}

