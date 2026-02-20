"use client";

import { useState, useEffect, useRef } from "react";
import { searchBooks, type OpenLibraryResult } from "@/lib/open-library";

interface Props {
  onSelect: (result: OpenLibraryResult) => void;
  value: string;
  onChange: (value: string) => void;
  onNoResults?: (empty: boolean) => void;
  author?: string;
  limit?: number;
}

export default function OpenLibraryAutocomplete({ onSelect, value, onChange, onNoResults, author, limit = 3 }: Props) {
  const [results, setResults] = useState<OpenLibraryResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value || value.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      const data = await searchBooks(value, author, limit);
      setResults(data);
      setIsOpen(data.length > 0);
      setLoading(false);
      onNoResults?.(data.length === 0);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, author]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-sm font-medium text-forest/70 mb-1">Titre</label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Rechercher un livre..."
          className="w-full px-3 py-2.5 bg-white border border-forest/15 rounded-lg text-sm text-ink placeholder:text-forest/30 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest/30"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-forest/20 border-t-forest/60 rounded-full animate-spin" />
          </div>
        )}
      </div>
      {isOpen && (
        <div className="absolute z-20 w-full mt-1 bg-white border border-forest/10 rounded-lg shadow-lg overflow-y-auto max-h-36">
          {results.map((result, i) => (
            <button
              key={`${result.title}-${i}`}
              type="button"
              onClick={() => {
                onSelect(result);
                setIsOpen(false);
              }}
              className="w-full px-3 py-2 text-left hover:bg-cream transition-colors border-b border-forest/5 last:border-b-0"
            >
              <p className="text-sm text-ink truncate">{result.title}</p>
              {result.author && (
                <p className="text-xs text-forest/40 truncate">{result.author}</p>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
