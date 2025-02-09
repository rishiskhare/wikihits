export default function Header() {
  return (
    <header className="bg-white shadow-md z-10 w-full hidden md:block" style={{ height: "var(--header-height)" }}>
      <div className="max-w-5xl mx-auto py-4 px-4 h-full flex flex-col justify-center">
        <h1 className="text-2xl text-center text-[#202122] font-linux">WikiHits</h1>
        <p className="text-center text-[#202122] text-sm mt-1">Explore today&apos;s most popular Wikipedia articles</p>
      </div>
    </header>
  )
}

