import WikiFeed from "../components/WikiFeed"
import Header from "../components/Header"
import ScrollButtons from "../components/ScrollButtons"

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <Header />
      <WikiFeed />
      <ScrollButtons />
    </main>
  )
}

