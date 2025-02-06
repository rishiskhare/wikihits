export default function Header() {
  return (
    <header className="bg-white shadow-md z-10 fixed w-full" style={{ height: "var(--header-height)" }}>
      <div className="max-w-3xl mx-auto py-4 px-4 h-full flex flex-col justify-center">
        <h1 className="text-2xl text-center text-[#202122]">WikiHits</h1>
        <p className="text-center text-[#202122] text-sm mt-1">Explore today&apos;s most popular Wikipedia articles</p>
      </div>
    </header>
  )
}

