import { useState, useEffect } from "react"

export interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
}

const CART_KEY = "kotodom_cart"

let listeners: Array<() => void> = []

function getCart(): CartItem[] {
  try {
    const data = localStorage.getItem(CART_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
  listeners.forEach((fn) => fn())
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(getCart)

  useEffect(() => {
    const update = () => setItems(getCart())
    listeners.push(update)
    return () => {
      listeners = listeners.filter((fn) => fn !== update)
    }
  }, [])

  const addItem = (product: Omit<CartItem, "quantity">) => {
    const current = getCart()
    const existing = current.find((i) => i.id === product.id)
    const updated = existing
      ? current.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i))
      : [...current, { ...product, quantity: 1 }]
    saveCart(updated)
    setItems(updated)
  }

  const removeItem = (id: number) => {
    const updated = getCart().filter((i) => i.id !== id)
    saveCart(updated)
    setItems(updated)
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    const updated = getCart().map((i) => (i.id === id ? { ...i, quantity } : i))
    saveCart(updated)
    setItems(updated)
  }

  const clearCart = () => {
    saveCart([])
    setItems([])
  }

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return { items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }
}
