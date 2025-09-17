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
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={local}
        onChange={(e) => setLocal(e.target.value)}
      />
    </div>
  );
}
