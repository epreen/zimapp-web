"use client";

import { useCallback, useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import type { Product } from "@/sanity.types";

const SALE_QUERY = `*[_type == "product" && status == "sale"] | order(name asc)[0...12]`;
const SEARCH_QUERY = `*[_type == "product" && name match $search] | order(name asc)`;

export function useSearchModalData(query: string, isOpen: boolean) {
  const [products, setProducts] = useState<Product[]>([]);
  const [saleProducts, setSaleProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSaleProducts = useCallback(async () => {
    try {
      const response = await client.fetch<Product[]>(SALE_QUERY);
      setSaleProducts(response ?? []);
    } catch (error) {
      console.error("Error fetching sale products:", error);
      setSaleProducts([]);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const params = { search: `${trimmed}*` };
      const response = await client.fetch<Product[]>(SEARCH_QUERY, params);
      setProducts(response ?? []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      fetchSaleProducts();
    }
  }, [isOpen, fetchSaleProducts]);

  useEffect(() => {
    const t = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(t);
  }, [fetchProducts]);

  return { products, saleProducts, loading };
}
