import { useCart } from "@/hooks/use-cart"
import { useState } from "react"
import Icon from "@/components/ui/icon"

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

type CheckoutStep = "cart" | "form" | "sbp" | "success"

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCart()
  const [step, setStep] = useState<CheckoutStep>("cart")
  const [formData, setFormData] = useState({ name: "", phone: "", address: "" })
  const [sbpBank, setSbpBank] = useState("")

  const banks = [
    { id: "sber", name: "Сбербанк", emoji: "🟩" },
    { id: "tinkoff", name: "Т-Банк", emoji: "🟨" },
    { id: "vtb", name: "ВТБ", emoji: "🟦" },
    { id: "alfa", name: "Альфа-Банк", emoji: "🔴" },
    { id: "raiffeisen", name: "Райффайзен", emoji: "🟥" },
    { id: "other", name: "Другой банк", emoji: "🏦" },
  ]

  const handleReset = () => {
    setStep("cart")
    setSbpBank("")
    setFormData({ name: "", phone: "", address: "" })
  }

  const handleClose = () => {
    onClose()
    setTimeout(handleReset, 300)
  }

  const handleSuccess = () => {
    setStep("success")
    clearCart()
    setTimeout(() => {
      handleClose()
    }, 4000)
  }

  if (!open) return null

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white/95 backdrop-blur-xl shadow-2xl border-l border-orange-100 flex flex-col transition-transform duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-orange-100">
          <div className="flex items-center gap-2">
            {step !== "cart" && step !== "success" && (
              <button
                onClick={() => setStep(step === "sbp" ? "form" : "cart")}
                className="mr-1 p-1.5 rounded-lg hover:bg-orange-50 transition-colors"
              >
                <Icon name="ArrowLeft" size={16} />
              </button>
            )}
            <span className="text-2xl">🛒</span>
            <h2 className="font-bold text-foreground text-lg">
              {step === "cart" && "Корзина"}
              {step === "form" && "Данные доставки"}
              {step === "sbp" && "Оплата через СБП"}
              {step === "success" && "Заказ принят!"}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl hover:bg-orange-50 transition-colors"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Cart step */}
        {step === "cart" && (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <span className="text-6xl mb-4">🐾</span>
                  <p className="text-foreground/50 font-medium">Корзина пуста</p>
                  <p className="text-sm text-foreground/40 mt-1">Добавьте уютный домик для вашего кота!</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 rounded-xl bg-orange-50/50 border border-orange-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm leading-tight mb-2 truncate">{item.name}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-md bg-white border border-orange-200 flex items-center justify-center text-foreground/70 hover:border-primary transition-colors text-sm font-bold"
                          >
                            −
                          </button>
                          <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-md bg-white border border-orange-200 flex items-center justify-center text-foreground/70 hover:border-primary transition-colors text-sm font-bold"
                          >
                            +
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-primary text-sm">
                            {(item.price * item.quantity).toLocaleString("ru-RU")} ₽
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1 rounded-lg hover:bg-red-50 text-foreground/40 hover:text-red-400 transition-colors"
                          >
                            <Icon name="Trash2" size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-orange-100 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-foreground/60 text-sm">Итого:</span>
                  <span className="font-bold text-xl text-primary">{totalPrice.toLocaleString("ru-RU")} ₽</span>
                </div>
                <button
                  onClick={() => setStep("form")}
                  className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-base hover:bg-primary/90 transition-colors shadow-md"
                >
                  Оформить заказ →
                </button>
                <p className="text-center text-xs text-foreground/40">🚚 Бесплатная доставка от 3000 ₽</p>
              </div>
            )}
          </>
        )}

        {/* Delivery form step */}
        {step === "form" && (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-foreground/60 mb-1.5 uppercase tracking-wide">
                  Ваше имя
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Иван Иванов"
                  className="w-full px-4 py-3 rounded-xl border border-orange-200 bg-orange-50/30 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground/60 mb-1.5 uppercase tracking-wide">
                  Номер телефона
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+7 (999) 999-99-99"
                  className="w-full px-4 py-3 rounded-xl border border-orange-200 bg-orange-50/30 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground/60 mb-1.5 uppercase tracking-wide">
                  Адрес доставки
                </label>
                <textarea
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Город, улица, дом, квартира"
                  className="w-full px-4 py-3 rounded-xl border border-orange-200 bg-orange-50/30 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                />
              </div>

              <div className="p-4 rounded-xl bg-orange-50 border border-orange-200">
                <p className="text-xs font-semibold text-foreground/60 mb-2">Ваш заказ:</p>
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm py-1">
                    <span className="text-foreground/70 truncate mr-2">{item.name} ×{item.quantity}</span>
                    <span className="font-semibold text-foreground flex-shrink-0">
                      {(item.price * item.quantity).toLocaleString("ru-RU")} ₽
                    </span>
                  </div>
                ))}
                <div className="border-t border-orange-200 mt-2 pt-2 flex justify-between">
                  <span className="font-bold text-sm">Итого:</span>
                  <span className="font-bold text-primary">{totalPrice.toLocaleString("ru-RU")} ₽</span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-orange-100">
              <button
                onClick={() => {
                  if (formData.name && formData.phone && formData.address) {
                    setStep("sbp")
                  }
                }}
                disabled={!formData.name || !formData.phone || !formData.address}
                className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-base hover:bg-primary/90 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Перейти к оплате →
              </button>
            </div>
          </>
        )}

        {/* SBP payment step */}
        {step === "sbp" && (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="text-center p-5 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200">
                <div className="text-5xl mb-3">🏦</div>
                <h3 className="font-bold text-foreground text-lg mb-1">Оплата через СБП</h3>
                <p className="text-foreground/60 text-sm">Система быстрых платежей Банка России</p>
                <div className="mt-3 py-2 px-4 rounded-xl bg-white border border-orange-200 inline-block">
                  <span className="font-bold text-primary text-xl">{totalPrice.toLocaleString("ru-RU")} ₽</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-foreground/70 mb-3">Выберите ваш банк:</p>
                <div className="grid grid-cols-2 gap-2">
                  {banks.map((bank) => (
                    <button
                      key={bank.id}
                      onClick={() => setSbpBank(bank.id)}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        sbpBank === bank.id
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-orange-100 bg-white hover:border-orange-300 text-foreground/70"
                      }`}
                    >
                      <span className="text-xl">{bank.emoji}</span>
                      <span className="truncate">{bank.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                <p className="text-xs text-blue-700 leading-relaxed">
                  💡 После нажатия кнопки «Оплатить» откроется приложение вашего банка для подтверждения платежа через СБП
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-orange-100">
              <button
                onClick={handleSuccess}
                disabled={!sbpBank}
                className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-base hover:bg-primary/90 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Оплатить через СБП →
              </button>
            </div>
          </>
        )}

        {/* Success step */}
        {step === "success" && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="text-7xl mb-4 animate-float">🐾</div>
            <h3 className="font-bold text-foreground text-2xl mb-2">Заказ принят!</h3>
            <p className="text-foreground/60 text-base mb-4 leading-relaxed">
              Уютный домик для вашего котика уже в пути! Мы свяжемся с вами в ближайшее время.
            </p>
            <div className="flex gap-2 flex-wrap justify-center text-3xl">
              <span>😺</span><span>🏡</span><span>🧶</span>
            </div>
            <p className="text-xs text-foreground/40 mt-6">Это окно закроется автоматически...</p>
          </div>
        )}
      </div>
    </>
  )
}
