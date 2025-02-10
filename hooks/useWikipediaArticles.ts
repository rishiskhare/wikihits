"use client"

import { useState, useEffect, useCallback } from "react"

interface Article {
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

interface PopularArticle {
  article: string
  views: number
  rank: number
}

interface WikipediaApiResponse {
  query: {
    pages: {
      [pageId: string]: WikipediaPage
    }
  }
}

interface WikipediaPage {
  pageid: number
  title: string
  extract?: string
  thumbnail?: {
    source: string
    width: number
    height: number
  }
}

export function useWikipediaArticles() {
  const [articles, setArticles] = useState<Article[]>([])
  const [popularArticles, setPopularArticles] = useState<PopularArticle[]>([])
  const [page, setPage] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const fetchPopularArticles = useCallback(async () => {
    try {
      const date = new Date()
      date.setDate(date.getDate() - 2)
      const dateString = date.toISOString().split("T")[0].replace(/-/g, "/")

      const response = await fetch(
        `https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia/all-access/${dateString}`,
      )
      const data = await response.json()

      const filtered = data.items[0].articles.filter(
        (article: PopularArticle) =>
          !article.article.startsWith("Special:") &&
          !["Main_Page", "Wikipedia:Featured_pictures"].includes(article.article),
      )

      setPopularArticles(filtered)
    } catch (error) {
      console.error("Error fetching popular articles:", error)
    }
  }, [])

  const fetchArticleBatch = useCallback(async () => {
    if (isLoading || !hasMore || !popularArticles.length) return

    setIsLoading(true)
    try {
      const batchSize = 20
      const startIndex = page * batchSize
      const batch = popularArticles.slice(startIndex, startIndex + batchSize)

      if (batch.length === 0) {
        setHasMore(false)
        return
      }

      const titles = batch.map((article) => article.article).join("|")
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&format=json&titles=${titles}&prop=extracts|pageimages&exintro&explaintext&pithumbsize=500&origin=*`,
      )
      const data = (await response.json()) as WikipediaApiResponse

      const newArticles = batch
        .map((popularArticle) => {
          const page = Object.values(data.query.pages).find(
            (p) => p.title.replace(/ /g, "_") === popularArticle.article,
          )
          if (!page || !page.thumbnail) return null

          return {
            title: page.title,
            extract: page.extract || "",
            pageid: page.pageid,
            thumbnail: page.thumbnail,
            views: popularArticle.views,
          }
        })
        .filter((article): article is Article => article !== null)

      setArticles((prev) => [...prev, ...newArticles])
      setPage((prev) => prev + 1)
      setHasMore(startIndex + batchSize < popularArticles.length)
    } catch (error) {
      console.error("Error fetching article batch:", error)
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, hasMore, popularArticles, page])

  useEffect(() => {
    fetchPopularArticles()
  }, [fetchPopularArticles])

  useEffect(() => {
    if (popularArticles.length > 0 && !isLoading && page === 0) {
      fetchArticleBatch()
    }
  }, [popularArticles, isLoading, page, fetchArticleBatch])

  const loadMoreArticles = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchArticleBatch()
    }
  }, [isLoading, hasMore, fetchArticleBatch])

  return { articles, isLoading, hasMore, loadMoreArticles }
}

