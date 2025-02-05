import WikiFeed from "../components/WikiFeed"
import Header from "../components/Header"

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <Header />
      <div className="flex-grow overflow-y-auto">
        <WikiFeed />
      </div>
    </main>
  )
}

