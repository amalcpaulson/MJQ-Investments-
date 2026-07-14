"use client";

import { useSyncExternalStore, useCallback } from "react";

export interface CartItem {
  handle: string;
  title: string;
  image: string | null;
  priceFils: number;
  qty: number;
}

/* ------------------------------------------------------------------ */
/* localStorage-backed external store (avoids setState-in-effect)      */
/* ------------------------------------------------------------------ */

const KEY = "luxae-cart";
const EMPTY: CartItem[] = [];

let items: CartItem[] = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function hydrate() {
  hydrated = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) items = JSON.parse(raw);
  } catch {
    /* ignore */
  }
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* ignore */
  }
}

function subscribe(cb: () => void) {
  if (!hydrated) {
    hydrate();
    // notify on next tick so freshly-subscribed components pick up stored state
    queueMicrotask(emit);
  }
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function commit(next: CartItem[]) {
  items = next;
  persist();
  emit();
}

const getSnapshot = () => items;
const getServerSnapshot = () => EMPTY;
const getReady = () => hydrated;
const getReadyServer = () => false;

/* mutations */
function addItem(item: Omit<CartItem, "qty">, qty = 1) {
  const found = items.find((p) => p.handle === item.handle);
  commit(
    found
      ? items.map((p) => (p.handle === item.handle ? { ...p, qty: p.qty + qty } : p))
      : [...items, { ...item, qty }]
  );
}
function setItemQty(handle: string, qty: number) {
  commit(qty <= 0 ? items.filter((p) => p.handle !== handle) : items.map((p) => (p.handle === handle ? { ...p, qty } : p)));
}
function removeItem(handle: string) {
  commit(items.filter((p) => p.handle !== handle));
}
function clearCart() {
  commit([]);
}

/* ------------------------------------------------------------------ */
/* Public hook + (no-op) provider kept for a stable import surface     */
/* ------------------------------------------------------------------ */

export function CartProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useCart() {
  const list = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ready = useSyncExternalStore(subscribe, getReady, getReadyServer);

  const add = useCallback((item: Omit<CartItem, "qty">, qty = 1) => addItem(item, qty), []);
  const setQty = useCallback((handle: string, qty: number) => setItemQty(handle, qty), []);
  const remove = useCallback((handle: string) => removeItem(handle), []);
  const clear = useCallback(() => clearCart(), []);

  const count = list.reduce((n, i) => n + i.qty, 0);
  const totalFils = list.reduce((n, i) => n + i.qty * i.priceFils, 0);

  return { items: list, count, totalFils, add, setQty, remove, clear, ready };
}
