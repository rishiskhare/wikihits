"use client"

import { useState, useEffect, useCallback } from "react"

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

export function useWikipediaArticles() {
  const [articles, setArticles] = useState<Article[]>([])
  const [popularArticles, setPopularArticles] = useState<PopularArticle[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)

  const fetchPopularArticles = useCallback(async () => {
    try {
      const date = new Date()
      date.setDate(date.getDate() - 2)
      const dateString = date.toISOString().split("T")[0].replace(/-/g, "/")

      const popularResponse = await fetch(
        `https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia/all-access/${dateString}`,
      )
      const popularData: PopularApiResponse = await popularResponse.json()

      const filteredArticles = popularData.items[0].articles.filter(
        (article: PopularArticle) =>
          !article.article.startsWith("Special:") &&
          article.article !== "Main_Page" &&
          article.article !== "Wikipedia:Featured_pictures",
      )

      setPopularArticles(filteredArticles)
    } catch (error) {
      console.error("Error fetching popular articles:", error)
    }
  }, [])

  const fetchArticleBatch = useCallback(async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    try {
      // Fetch 20 articles at a time
      const startIndex = page * 20
      const endIndex = startIndex + 20
      const batch = popularArticles.slice(startIndex, endIndex)

      if (batch.length === 0) {
        setHasMore(false)
        return
      }

      const pageIds = batch.map((article: PopularArticle) => article.article).join("|")
      const contentResponse = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&format=json&titles=${pageIds}&prop=extracts|pageimages&exintro&explaintext&pithumbsize=500&origin=*`,
      )
      const contentData: WikiApiResponse = await contentResponse.json()

      const newArticles = Object.values(contentData.query.pages)
        .map((page) => {
          const popularityData = batch.find((a: PopularArticle) => a.article === page.title.replace(/ /g, "_"))
          return {
            title: page.title,
            extract: page.extract,
            pageid: page.pageid,
            thumbnail: page.thumbnail,
            views: popularityData ? popularityData.views : 0,
          }
        })
        .filter((article) => article.thumbnail) // Only keep articles with thumbnails

      setArticles((prevArticles) => [...prevArticles, ...newArticles])
      setPage((prevPage) => prevPage + 1)

      if (endIndex >= popularArticles.length) {
        setHasMore(false)
      }
    } catch (error) {
      console.error("Error fetching article batch:", error)
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, hasMore, page, popularArticles])

  useEffect(() => {
    fetchPopularArticles()
  }, [fetchPopularArticles])

  useEffect(() => {
    if (popularArticles.length > 0 && articles.length === 0) {
      fetchArticleBatch()
    }
  }, [popularArticles, articles.length, fetchArticleBatch])

  const loadMoreArticles = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchArticleBatch()
    }
  }, [isLoading, hasMore, fetchArticleBatch])

  return { articles, isLoading, hasMore, loadMoreArticles }
}

