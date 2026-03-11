import { useReveal } from "@/hooks/use-reveal"
import { useCart } from "@/hooks/use-cart"
import { MagneticButton } from "@/components/magnetic-button"
import { useState } from "react"

const products = [
  {
    id: 1,
    name: "Домик «Уютный коттедж»",
    description: "Деревянный домик с крышей, игровой верёвкой и мягкой подстилкой",
    price: 3490,
    emoji: "🏡",
    image: "https://cdn.poehali.dev/projects/ed65bc89-86cb-40e1-ac73-8aef449eef7f/files/ed01493e-43a9-4d07-9745-8550ef3fd06c.jpg",
    tag: "Хит продаж",
    tagColor: "bg-primary text-white",
  },
  {
    id: 2,
    name: "Башня «Кошачий замок»",
    description: "Многоуровневый когтеточка-башня с тремя уютными домиками",
    price: 6990,
    emoji: "🏰",
    image: "https://cdn.poehali.dev/projects/ed65bc89-86cb-40e1-ac73-8aef449eef7f/files/10d9c529-2b75-4428-bdb5-8202ed2f355d.jpg",
    tag: "Новинка",
    tagColor: "bg-amber-400 text-white",
  },
  {
    id: 3,
    name: "Лежанка «Пуховое гнёздышко»",
    description: "Мягкая круглая лежанка из гипоаллергенного материала",
    price: 1890,
    emoji: "🪹",
    image: "https://cdn.poehali.dev/projects/ed65bc89-86cb-40e1-ac73-8aef449eef7f/files/45aa18e3-9b61-4ca0-a976-84e900e0647d.jpg",
    tag: "Популярное",
    tagColor: "bg-orange-400 text-white",
  },
  {
    id: 4,
    name: "Игровой комплекс «Джунгли»",
    description: "Полный комплекс с когтеточками, верёвками, мышками и домиком",
    price: 9490,
    emoji: "🌿",
    image: "https://cdn.poehali.dev/projects/ed65bc89-86cb-40e1-ac73-8aef449eef7f/files/ed01493e-43a9-4d07-9745-8550ef3fd06c.jpg",
    tag: "Премиум",
    tagColor: "bg-amber-600 text-white",
  },
  {
    id: 5,
    name: "Домик «Скандинав»",
    description: "Минималистичный деревянный домик в скандинавском стиле",
    price: 4290,
    emoji: "❄️",
    image: "https://cdn.poehali.dev/projects/ed65bc89-86cb-40e1-ac73-8aef449eef7f/files/10d9c529-2b75-4428-bdb5-8202ed2f355d.jpg",
    tag: "Дизайнерский",
    tagColor: "bg-stone-500 text-white",
  },
  {
    id: 6,
    name: "Гамак «Облако»",
    description: "Подвесной гамак-гнёздышко для кошек, крепится к когтеточке",
    price: 990,
    emoji: "☁️",
    image: "https://cdn.poehali.dev/projects/ed65bc89-86cb-40e1-ac73-8aef449eef7f/files/45aa18e3-9b61-4ca0-a976-84e900e0647d.jpg",
    tag: "Выгодно",
    tagColor: "bg-green-500 text-white",
  },
]

function ProductCard({
  product,
  index,
  isVisible,
  onCartOpen,
}: {
  product: typeof products[0]
  index: number
  isVisible: boolean
  onCartOpen: () => void
}) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
    onCartOpen()
  }

  return (
    <div
      className={`group relative flex flex-col rounded-2xl bg-white/70 backdrop-blur-sm border border-orange-100 shadow-sm overflow-hidden transition-all duration-700 hover:shadow-md hover:-translate-y-1 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-orange-50 to-amber-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${product.tagColor}`}>
          {product.tag}
        </span>
        <span className="absolute top-3 right-3 text-2xl">{product.emoji}</span>
      </div>

      <div className="flex flex-col flex-1 p-3 md:p-4">
        <h3 className="font-bold text-foreground text-sm md:text-base mb-1 leading-tight">{product.name}</h3>
        <p className="text-xs text-foreground/60 leading-relaxed mb-3 flex-1 hidden sm:block">{product.description}</p>

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-orange-100">
          <span className="font-bold text-primary text-sm md:text-base">{product.price.toLocaleString("ru-RU")} ₽</span>
          <button
            onClick={handleAdd}
            className={`flex items-center justify-center min-h-[36px] px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 ${
              added
                ? "bg-green-100 text-green-700"
                : "bg-primary text-white hover:bg-primary/90 active:scale-95"
            }`}
          >
            {added ? "✓" : "В корзину"}
          </button>
        </div>
      </div>
    </div>
  )
}

export function CatalogSection({ onCartOpen }: { onCartOpen: () => void }) {
  const { ref, isVisible } = useReveal(0.2)

  return (
    <section
      ref={ref}
      className="flex shrink-0 snap-start items-start overflow-y-auto px-4 pt-16 pb-6 md:px-12 md:items-center md:pt-0 lg:px-16"
      style={{ minHeight: "100dvh", width: "100vw" }}
    >
      <div className="mx-auto w-full max-w-7xl py-2 md:py-4">
        <div
          className={`mb-4 md:mb-8 transition-all duration-700 ${
            isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-bold text-2xl tracking-tight text-foreground md:text-5xl">
              Каталог
            </h2>
            <span className="text-2xl md:text-4xl">🐾</span>
          </div>
          <p className="text-foreground/60 text-xs md:text-base">/ Домики и уютные местечки для вашего питомца</p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
          {products.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              index={i}
              isVisible={isVisible}
              onCartOpen={onCartOpen}
            />
          ))}
        </div>

        {/* Decorative elements */}
        <div
          className={`mt-6 flex items-center justify-center gap-2 transition-all duration-700 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "700ms" }}
        >
          <span className="text-foreground/30 text-sm">🧶</span>
          <p className="text-xs text-foreground/40">Доставка по всей России · Гарантия качества</p>
          <span className="text-foreground/30 text-sm">🧶</span>
        </div>
      </div>
    </section>
  )
}