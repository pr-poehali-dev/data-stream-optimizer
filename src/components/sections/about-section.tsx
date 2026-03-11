import { MagneticButton } from "@/components/magnetic-button"
import { useReveal } from "@/hooks/use-reveal"

export function AboutSection({ scrollToSection }: { scrollToSection?: (index: number) => void }) {
  const { ref, isVisible } = useReveal(0.3)

  return (
    <section
      ref={ref}
      className="flex h-screen w-screen shrink-0 snap-start items-center px-4 pt-20 md:px-12 md:pt-0 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid gap-8 md:grid-cols-2 md:gap-16 lg:gap-24">
          {/* Left side */}
          <div>
            <div
              className={`mb-6 transition-all duration-700 md:mb-10 ${
                isVisible ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <h2 className="font-bold text-4xl leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl">
                  О нас
                </h2>
                <span className="text-4xl">😺</span>
              </div>
              <p className="font-mono text-sm text-foreground/50">/ История КотоДом</p>
            </div>

            <div
              className={`space-y-4 transition-all duration-700 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <p className="max-w-md text-base leading-relaxed text-foreground/80">
                КотоДом — это магазин, созданный настоящими кошатниками! Мы знаем, как важно, чтобы ваш питомец чувствовал себя любимым и имел своё особенное место.
              </p>
              <p className="max-w-md text-base leading-relaxed text-foreground/80">
                Каждый домик мы делаем с любовью: из натуральных материалов, с мягкими подстилками и удобными входами. Потому что счастливый кот — счастливый хозяин!
              </p>

              {/* Cat mascot block */}
              <div
                className={`mt-6 flex items-center gap-4 p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-orange-200/50 shadow-sm transition-all duration-700 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
                style={{ transitionDelay: "350ms" }}
              >
                <img
                  src="https://cdn.poehali.dev/projects/ed65bc89-86cb-40e1-ac73-8aef449eef7f/files/b4d46075-d285-4265-ba55-fb3bdbfe5dbb.jpg"
                  alt="Снежок — талисман КотоДом"
                  className="w-16 h-16 rounded-full object-cover border-2 border-orange-200 flex-shrink-0"
                />
                <div>
                  <p className="font-bold text-foreground text-sm">Снежок</p>
                  <p className="text-xs text-foreground/60 leading-relaxed">Главный инспектор качества КотоДом. Лично проверяет каждый домик на мягкость и уют! 😸</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Stats */}
          <div className="flex flex-col justify-center space-y-5 md:space-y-8">
            {[
              { value: "2 000+", label: "Счастливых котов", sublabel: "получили свой уютный домик", emoji: "😸", direction: "right" },
              { value: "5", label: "Лет на рынке", sublabel: "создаём лучшие домики для кошек", emoji: "🏡", direction: "left" },
              { value: "98%", label: "Довольных хозяев", sublabel: "рекомендуют друзьям", emoji: "⭐", direction: "right" },
            ].map((stat, i) => {
              const getRevealClass = () => {
                if (!isVisible) {
                  return stat.direction === "left" ? "-translate-x-16 opacity-0" : "translate-x-16 opacity-0"
                }
                return "translate-x-0 opacity-100"
              }

              return (
                <div
                  key={i}
                  className={`flex items-center gap-4 border-l-4 border-primary/40 pl-4 rounded-r-xl bg-white/40 backdrop-blur-sm py-3 pr-4 transition-all duration-700 md:gap-6 md:pl-6 ${getRevealClass()}`}
                  style={{
                    transitionDelay: `${300 + i * 150}ms`,
                    marginLeft: i % 2 === 0 ? "0" : "auto",
                    maxWidth: i % 2 === 0 ? "100%" : "88%",
                  }}
                >
                  <span className="text-3xl flex-shrink-0">{stat.emoji}</span>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <div className="text-2xl font-bold text-foreground md:text-4xl">{stat.value}</div>
                    </div>
                    <div className="font-semibold text-sm text-foreground">{stat.label}</div>
                    <div className="text-xs text-foreground/50">{stat.sublabel}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div
          className={`mt-8 flex flex-wrap gap-3 transition-all duration-700 md:mt-12 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
          }`}
          style={{ transitionDelay: "750ms" }}
        >
          <MagneticButton size="lg" variant="primary" onClick={() => scrollToSection?.(1)}>
            Смотреть каталог
          </MagneticButton>
          <MagneticButton size="lg" variant="secondary" onClick={() => scrollToSection?.(3)}>
            Написать нам
          </MagneticButton>
        </div>
      </div>
    </section>
  )
}
