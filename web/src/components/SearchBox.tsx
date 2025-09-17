"use client"

import { search } from "@/lib/api";
import { SearchBoxProps } from "@/types/types";
import { useEffect, useState } from "react";

export default function SearchBox({
  value,
  onChange,
  onResult,
}: SearchBoxProps) {

  const [local, setLocal] = useState(value);

  useEffect(() => {
    setLocal(value);
  }, [value]);


  useEffect(() => {
    
    const id = setTimeout(async () => {
      try{
        const result = await search(local);
        onResult(result);   
      } catch (error) {
        console.error("Failed to search", error);
        onResult([]);
      }   
    }, 250);

    return () => clearTimeout(id);

  }, [local, onResult]);

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-foreground/40">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 4.243 11.943l3.782 3.782a.75.75 0 1 0 1.06-1.06l-3.782-3.783A6.75 6.75 0 0 0 10.5 3.75Zm-5.25 6.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Z" clipRule="evenodd" />
        </svg>
      </div>
      <input
        type="text"
        placeholder="Search nodes..."
        value={local}
        onChange={(e) => { setLocal(e.target.value); onChange?.(e.target.value); }}
        className="w-full rounded-md border border-foreground/10 bg-background px-9 py-2 text-sm placeholder:text-foreground/40 shadow-sm outline-none ring-1 ring-transparent focus:border-foreground/20 focus:ring-2 focus:ring-blue-500/60"
      />
    </div>
  );
}
