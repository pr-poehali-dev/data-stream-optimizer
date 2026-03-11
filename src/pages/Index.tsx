import { Shader, ChromaFlow, Swirl } from "shaders/react"
import { CustomCursor } from "@/components/custom-cursor"
import { GrainOverlay } from "@/components/grain-overlay"
import { CatalogSection } from "@/components/sections/catalog-section"
import { AboutSection } from "@/components/sections/about-section"
import { ContactSection } from "@/components/sections/contact-section"
import { MagneticButton } from "@/components/magnetic-button"
import { CartDrawer } from "@/components/cart-drawer"
import { useRef, useEffect, useState } from "react"
import { useCart } from "@/hooks/use-cart"
import Icon from "@/components/ui/icon"

const SECTIONS = ["Главная", "Каталог", "О нас", "Контакты"]

export default function Index() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [currentSection, setCurrentSection] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const touchStartY = useRef(0)
  const touchStartX = useRef(0)
  const shaderContainerRef = useRef<HTMLDivElement>(null)
  const scrollThrottleRef = useRef<number>()
  const [cartOpen, setCartOpen] = useState(false)
  const { totalItems } = useCart()

  useEffect(() => {
    const checkShaderReady = () => {
      if (shaderContainerRef.current) {
        const canvas = shaderContainerRef.current.querySelector("canvas")
        if (canvas && canvas.width > 0 && canvas.height > 0) {
          setIsLoaded(true)
          return true
        }
      }
      return false
    }
    if (checkShaderReady()) return
    const intervalId = setInterval(() => { if (checkShaderReady()) clearInterval(intervalId) }, 100)
    const fallbackTimer = setTimeout(() => setIsLoaded(true), 1500)
    return () => { clearInterval(intervalId); clearTimeout(fallbackTimer) }
  }, [])

  const scrollToSection = (index: number) => {
    if (scrollContainerRef.current) {
      const sectionWidth = scrollContainerRef.current.offsetWidth
      scrollContainerRef.current.scrollTo({ left: sectionWidth * index, behavior: "smooth" })
      setCurrentSection(index)
    }
    setMobileMenuOpen(false)
  }

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
      touchStartX.current = e.touches[0].clientX
    }
    const handleTouchMove = (e: TouchEvent) => {
      const dy = Math.abs(e.touches[0].clientY - touchStartY.current)
      const dx = Math.abs(e.touches[0].clientX - touchStartX.current)
      if (dy > dx && dy > 10) e.preventDefault()
    }
    const handleTouchEnd = (e: TouchEvent) => {
      const deltaY = touchStartY.current - e.changedTouches[0].clientY
      const deltaX = touchStartX.current - e.changedTouches[0].clientX
      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
        if (deltaY > 0 && currentSection < 3) scrollToSection(currentSection + 1)
        else if (deltaY < 0 && currentSection > 0) scrollToSection(currentSection - 1)
      }
    }
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("touchstart", handleTouchStart, { passive: true })
      container.addEventListener("touchmove", handleTouchMove, { passive: false })
      container.addEventListener("touchend", handleTouchEnd, { passive: true })
    }
    return () => {
      if (container) {
        container.removeEventListener("touchstart", handleTouchStart)
        container.removeEventListener("touchmove", handleTouchMove)
        container.removeEventListener("touchend", handleTouchEnd)
      }
    }
  }, [currentSection])

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault()
        if (!scrollContainerRef.current) return
        scrollContainerRef.current.scrollBy({ left: e.deltaY, behavior: "instant" })
        const sectionWidth = scrollContainerRef.current.offsetWidth
        const newSection = Math.round(scrollContainerRef.current.scrollLeft / sectionWidth)
        if (newSection !== currentSection) setCurrentSection(newSection)
      }
    }
    const container = scrollContainerRef.current
    if (container) container.addEventListener("wheel", handleWheel, { passive: false })
    return () => { if (container) container.removeEventListener("wheel", handleWheel) }
  }, [currentSection])

  useEffect(() => {
    const handleScroll = () => {
      if (scrollThrottleRef.current) return
      scrollThrottleRef.current = requestAnimationFrame(() => {
        if (!scrollContainerRef.current) { scrollThrottleRef.current = undefined; return }
        const sectionWidth = scrollContainerRef.current.offsetWidth
        const newSection = Math.round(scrollContainerRef.current.scrollLeft / sectionWidth)
        if (newSection !== currentSection && newSection >= 0 && newSection <= 3) setCurrentSection(newSection)
        scrollThrottleRef.current = undefined
      })
    }
    const container = scrollContainerRef.current
    if (container) container.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      if (container) container.removeEventListener("scroll", handleScroll)
      if (scrollThrottleRef.current) cancelAnimationFrame(scrollThrottleRef.current)
    }
  }, [currentSection])

  return (
    <main className="relative w-full overflow-hidden bg-background" style={{ height: "100dvh" }}>
      <CustomCursor />
      <GrainOverlay />

      {/* WebGL shader background */}
      <div
        ref={shaderContainerRef}
        className={`fixed inset-0 z-0 transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        style={{ contain: "strict" }}
      >
        <Shader className="h-full w-full">
          <Swirl colorA="#f97316" colorB="#fed7aa" speed={0.4} detail={0.6} blend={60} coarseX={30} coarseY={30} mediumX={30} mediumY={30} fineX={30} fineY={30} />
          <ChromaFlow baseColor="#fef3c7" upColor="#fed7aa" downColor="#fff7ed" leftColor="#f97316" rightColor="#fb923c" intensity={0.6} radius={2.0} momentum={20} maskType="alpha" opacity={0.85} />
        </Shader>
        <div className="absolute inset-0 bg-orange-50/30" />
      </div>

      {/* Floating decorative paws — only desktop */}
      <div className="pointer-events-none fixed inset-0 z-5 overflow-hidden hidden md:block">
        <span className="absolute top-20 left-16 text-4xl animate-float opacity-10">🐾</span>
        <span className="absolute top-40 right-24 text-3xl animate-float-delay opacity-10">🧶</span>
        <span className="absolute bottom-32 left-32 text-3xl animate-float opacity-10">🐾</span>
        <span className="absolute top-60 left-1/4 text-2xl animate-float-delay opacity-10">🐾</span>
        <span className="absolute bottom-48 right-16 text-4xl animate-float opacity-10">🧶</span>
      </div>

      {/* Navigation */}
      <nav
        className={`fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-4 py-3 transition-opacity duration-700 md:px-12 md:py-4 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <button onClick={() => scrollToSection(0)} className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/60 backdrop-blur-md shadow-sm border border-orange-200/50">
            <span className="text-lg">🐱</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-foreground text-sm tracking-tight">КотоДом</span>
            <span className="text-[10px] text-foreground/50 hidden sm:block">Дом, в котором мурчат от счастья</span>
          </div>
        </button>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          {SECTIONS.map((item, index) => (
            <button
              key={item}
              onClick={() => scrollToSection(index)}
              className={`group relative font-medium text-sm transition-colors ${
                currentSection === index ? "text-primary" : "text-foreground/70 hover:text-foreground"
              }`}
            >
              {item}
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary rounded-full transition-all duration-300 ${currentSection === index ? "w-full" : "w-0 group-hover:w-full"}`} />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Cart button */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/60 backdrop-blur-md shadow-sm border border-orange-200/50 transition-all hover:bg-white/80"
          >
            <Icon name="ShoppingCart" size={16} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white text-[10px] font-bold">
                {totalItems}
              </span>
            )}
          </button>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <MagneticButton variant="primary" onClick={() => scrollToSection(1)}>В каталог</MagneticButton>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/60 backdrop-blur-md shadow-sm border border-orange-200/50 md:hidden"
          >
            <Icon name={mobileMenuOpen ? "X" : "Menu"} size={18} />
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="fixed left-0 right-0 top-[60px] z-40 md:hidden">
          <div className="mx-4 rounded-2xl bg-white/90 backdrop-blur-xl border border-orange-100 shadow-lg overflow-hidden">
            {SECTIONS.map((item, index) => (
              <button
                key={item}
                onClick={() => scrollToSection(index)}
                className={`w-full flex items-center justify-between px-5 py-3.5 text-sm font-semibold transition-colors border-b border-orange-50 last:border-0 ${
                  currentSection === index ? "text-primary bg-orange-50" : "text-foreground hover:bg-orange-50/50"
                }`}
              >
                {item}
                {currentSection === index && <span className="text-primary">🐾</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Horizontal scroll sections */}
      <div
        ref={scrollContainerRef}
        data-scroll-container
        className={`relative z-10 flex overflow-x-auto overflow-y-hidden transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        style={{ height: "100dvh", scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Hero Section */}
        <section
          className="flex shrink-0 flex-col justify-end px-4 pb-12 pt-20 md:px-12 md:pb-24 lg:px-16"
          style={{ minHeight: "100dvh", width: "100vw" }}
        >
          <div className="max-w-4xl flex flex-col md:flex-row items-end gap-6 md:gap-8">
            <div className="flex-1 w-full">
              <div className="mb-3 inline-block animate-in fade-in slide-in-from-bottom-4 rounded-full border border-orange-300/40 bg-white/50 backdrop-blur-md px-3 py-1 duration-700 shadow-sm">
                <p className="text-xs text-foreground/70 font-medium">🐾 Уютные домики для ваших питомцев</p>
              </div>
              <h1 className="mb-3 animate-in fade-in slide-in-from-bottom-8 font-bold text-3xl leading-[1.1] tracking-tight text-foreground duration-1000 sm:text-4xl md:text-6xl lg:text-7xl">
                Дом, в котором
                <br />
                <span className="text-primary">мурчат от счастья</span>
              </h1>
              <p className="mb-6 max-w-xl animate-in fade-in slide-in-from-bottom-4 text-sm leading-relaxed text-foreground/80 duration-1000 delay-200 md:text-lg">
                Создаём уютные домики для кошек с любовью и заботой. Каждый питомец заслуживает своё особенное место!
              </p>
              <div className="flex animate-in fade-in slide-in-from-bottom-4 flex-col gap-3 duration-1000 delay-300 sm:flex-row sm:items-center">
                <MagneticButton size="lg" variant="primary" onClick={() => scrollToSection(1)}>
                  Смотреть каталог
                </MagneticButton>
                <MagneticButton size="lg" variant="secondary" onClick={() => scrollToSection(3)}>
                  Связаться с нами
                </MagneticButton>
              </div>
            </div>

            {/* Cat mascot — desktop only */}
            <div className="animate-in fade-in duration-1000 delay-500 hidden md:block flex-shrink-0">
              <div className="relative w-56 h-56 lg:w-72 lg:h-72">
                <div className="absolute inset-0 rounded-full bg-white/40 backdrop-blur-sm border border-orange-200/50 shadow-lg" />
                <img
                  src="https://cdn.poehali.dev/projects/ed65bc89-86cb-40e1-ac73-8aef449eef7f/files/b4d46075-d285-4265-ba55-fb3bdbfe5dbb.jpg"
                  alt="Снежок — талисман КотоДом"
                  className="relative z-10 w-full h-full object-cover rounded-full"
                />
                <div className="absolute -bottom-2 -right-2 text-3xl animate-float">🐾</div>
                <div className="absolute -top-2 -left-2 text-2xl animate-float-delay">🧶</div>
              </div>
            </div>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-in fade-in duration-1000 delay-500">
            <div className="flex flex-col items-center gap-1.5">
              <p className="text-[10px] text-foreground/50 font-medium hidden md:block">Листайте вправо</p>
              <p className="text-[10px] text-foreground/50 font-medium md:hidden">Свайпайте вверх</p>
              <div className="flex h-5 w-10 items-center justify-center rounded-full border border-orange-300/40 bg-white/50 backdrop-blur-md">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary/80" />
              </div>
            </div>
          </div>

          {/* Section dots — mobile */}
          <div className="absolute bottom-6 right-4 flex flex-col gap-1.5 md:hidden">
            {SECTIONS.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToSection(i)}
                className={`w-1.5 rounded-full transition-all duration-300 ${currentSection === i ? "h-4 bg-primary" : "h-1.5 bg-foreground/20"}`}
              />
            ))}
          </div>
        </section>

        <CatalogSection onCartOpen={() => setCartOpen(true)} />
        <AboutSection scrollToSection={scrollToSection} />
        <ContactSection />
      </div>

      <style>{`div::-webkit-scrollbar { display: none; }`}</style>
    </main>
  )
}
