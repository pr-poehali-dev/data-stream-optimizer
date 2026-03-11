import { useEffect, useRef, useState } from "react"

export function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null)
  const positionRef = useRef({ x: 0, y: 0 })
  const targetPositionRef = useRef({ x: 0, y: 0 })
  const isPointerRef = useRef(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)")
    setIsDesktop(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  useEffect(() => {
    if (!isDesktop) return

    let animationFrameId: number

    const lerp = (start: number, end: number, factor: number) =>
      start + (end - start) * factor

    const updateCursor = () => {
      positionRef.current.x = lerp(positionRef.current.x, targetPositionRef.current.x, 0.15)
      positionRef.current.y = lerp(positionRef.current.y, targetPositionRef.current.y, 0.15)

      if (outerRef.current) {
        outerRef.current.style.transform = `translate3d(${positionRef.current.x}px, ${positionRef.current.y}px, 0) translate(-50%, -50%)`
        outerRef.current.style.fontSize = isPointerRef.current ? "2rem" : "1.6rem"
      }

      animationFrameId = requestAnimationFrame(updateCursor)
    }

    const handleMouseMove = (e: MouseEvent) => {
      targetPositionRef.current = { x: e.clientX, y: e.clientY }
      const target = e.target as HTMLElement
      isPointerRef.current =
        window.getComputedStyle(target).cursor === "pointer" ||
        target.tagName === "BUTTON" ||
        target.tagName === "A"
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    animationFrameId = requestAnimationFrame(updateCursor)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [isDesktop])

  if (!isDesktop) return null

  return (
    <div
      ref={outerRef}
      className="pointer-events-none fixed left-0 top-0 z-[9999] will-change-transform select-none"
      style={{
        contain: "layout style paint",
        fontSize: "1.6rem",
        lineHeight: 1,
        filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.15))",
        transition: "font-size 0.15s ease",
        userSelect: "none",
      }}
    >
      🐾
    </div>
  )
}
