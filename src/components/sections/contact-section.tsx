import { useReveal } from "@/hooks/use-reveal"
import { useState, type FormEvent } from "react"
import { MagneticButton } from "@/components/magnetic-button"
import Icon from "@/components/ui/icon"

export function ContactSection() {
  const { ref, isVisible } = useReveal(0.3)
  const [formData, setFormData] = useState({ name: "", contact: "", message: "" })
  const [contactType, setContactType] = useState<"email" | "telegram">("email")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!formData.name || !formData.contact || !formData.message) return

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setIsSubmitting(false)
    setSubmitSuccess(true)
    setFormData({ name: "", contact: "", message: "" })
    setTimeout(() => setSubmitSuccess(false), 5000)
  }

  return (
    <section
      ref={ref}
      className="flex h-screen w-screen shrink-0 snap-start items-center px-4 pt-20 md:px-12 md:pt-0 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid gap-8 md:grid-cols-[1.1fr_1fr] md:gap-12 lg:gap-20">
          {/* Left side */}
          <div className="flex flex-col justify-center">
            <div
              className={`mb-6 transition-all duration-700 md:mb-10 ${
                isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <h2 className="font-bold text-4xl leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl">
                  Напишите
                  <br />
                  нам
                </h2>
                <span className="text-4xl self-start mt-1">🐾</span>
              </div>
              <p className="text-xs text-foreground/50 font-mono">/ Мы ответим быстрее, чем кот мурлыкнет</p>
            </div>

            <div className="space-y-5">
              {/* Email */}
              <a
                href="mailto:hello@kotodom.ru"
                className={`group flex items-center gap-3 p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-orange-100 hover:border-orange-300 transition-all duration-500 ${
                  isVisible ? "translate-x-0 opacity-100" : "-translate-x-16 opacity-0"
                }`}
                style={{ transitionDelay: "150ms" }}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon name="Mail" size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-foreground/50 font-mono mb-0.5">Электронная почта</p>
                  <p className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm md:text-base">
                    hello@kotodom.ru
                  </p>
                </div>
              </a>

              {/* Telegram */}
              <a
                href="https://t.me/kotodom_shop"
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center gap-3 p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-orange-100 hover:border-blue-300 transition-all duration-500 ${
                  isVisible ? "translate-x-0 opacity-100" : "-translate-x-16 opacity-0"
                }`}
                style={{ transitionDelay: "280ms" }}
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">✈️</span>
                </div>
                <div>
                  <p className="text-xs text-foreground/50 font-mono mb-0.5">Telegram</p>
                  <p className="font-semibold text-foreground group-hover:text-blue-500 transition-colors text-sm md:text-base">
                    @kotodom_shop
                  </p>
                </div>
              </a>

              {/* Delivery info */}
              <div
                className={`flex items-center gap-3 p-4 rounded-2xl bg-orange-50/70 border border-orange-200 transition-all duration-500 ${
                  isVisible ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
                }`}
                style={{ transitionDelay: "400ms" }}
              >
                <span className="text-2xl">🚚</span>
                <div>
                  <p className="font-semibold text-foreground text-sm">Доставка по всей России</p>
                  <p className="text-xs text-foreground/60">СДЭК, Почта России, Яндекс.Доставка</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="flex flex-col justify-center">
            <form onSubmit={handleSubmit} className="space-y-4 p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-orange-100 shadow-sm">
              <div
                className={`transition-all duration-700 ${
                  isVisible ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0"
                }`}
                style={{ transitionDelay: "150ms" }}
              >
                <label className="block text-xs font-semibold text-foreground/60 mb-1.5 uppercase tracking-wide">
                  Ваше имя
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Как вас зовут?"
                  className="w-full px-3 py-2.5 rounded-xl border border-orange-200 bg-orange-50/30 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                />
              </div>

              {/* Contact type selector */}
              <div
                className={`transition-all duration-700 ${
                  isVisible ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0"
                }`}
                style={{ transitionDelay: "280ms" }}
              >
                <label className="block text-xs font-semibold text-foreground/60 mb-1.5 uppercase tracking-wide">
                  Способ связи
                </label>
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setContactType("email")}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                      contactType === "email"
                        ? "bg-primary text-white shadow-sm"
                        : "bg-orange-50 text-foreground/60 border border-orange-200 hover:border-orange-300"
                    }`}
                  >
                    📧 Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setContactType("telegram")}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                      contactType === "telegram"
                        ? "bg-blue-500 text-white shadow-sm"
                        : "bg-orange-50 text-foreground/60 border border-orange-200 hover:border-orange-300"
                    }`}
                  >
                    ✈️ Telegram
                  </button>
                </div>
                <input
                  type={contactType === "email" ? "email" : "text"}
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  required
                  placeholder={contactType === "email" ? "your@email.com" : "@username"}
                  className="w-full px-3 py-2.5 rounded-xl border border-orange-200 bg-orange-50/30 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                />
              </div>

              <div
                className={`transition-all duration-700 ${
                  isVisible ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0"
                }`}
                style={{ transitionDelay: "400ms" }}
              >
                <label className="block text-xs font-semibold text-foreground/60 mb-1.5 uppercase tracking-wide">
                  Сообщение
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  placeholder="Расскажите о вашем котике и что вы ищете..."
                  className="w-full px-3 py-2.5 rounded-xl border border-orange-200 bg-orange-50/30 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none text-sm"
                />
              </div>

              <div
                className={`transition-all duration-700 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
                }`}
                style={{ transitionDelay: "550ms" }}
              >
                <MagneticButton
                  variant="primary"
                  size="lg"
                  className="w-full disabled:opacity-50"
                >
                  {isSubmitting ? "Отправляем... 🐾" : "Написать нам ✉️"}
                </MagneticButton>
                {submitSuccess && (
                  <div className="mt-3 p-3 rounded-xl bg-green-50 border border-green-200 text-center">
                    <p className="text-sm font-semibold text-green-700">😺 Сообщение отправлено! Мурррр!</p>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
