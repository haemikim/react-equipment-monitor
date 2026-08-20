import { useEffect, useRef, useState } from "react";
import type { Column } from "@tanstack/react-table";
import { Search, X } from "lucide-react";

interface SearchableHeaderProps<TData> {
  column: Column<TData, unknown>;
  title: string;
}

export function SearchableHeader<TData>({
  column,
  title,
}: SearchableHeaderProps<TData>) {
  const [isOpen, setIsOpen] = useState(false);

  // 해당 검색 헤더 전체 영역
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const filterValue = (column.getFilterValue() as string) ?? "";

  // X 버튼과 외부 클릭에서 공통으로 사용
  const closeSearch = () => {
    column.setFilterValue("");
    setIsOpen(false);
  };

  useEffect(() => {
    // 검색창이 닫혀 있으면 return
    if (!isOpen) return;

    const handleClickOutside = (event: PointerEvent) => {
      const target = event.target as Node;

      if (wrapperRef.current && !wrapperRef.current.contains(target)) {
        closeSearch();
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [isOpen, column, closeSearch]);

  if (isOpen) {
    return (
      <div
        ref={wrapperRef}
        className="flex items-center gap-1"
        onClick={(event) => event.stopPropagation()}
      >
        <input
          autoFocus
          value={filterValue}
          onChange={(event) => {
            column.setFilterValue(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              closeSearch();
            }
          }}
          placeholder={`${title} 검색`}
          className="h-7 w-28 rounded-md border bg-background px-2 text-xs outline-none"
        />

        <button
          type="button"
          onClick={closeSearch}
          aria-label={`${title} 검색 닫기`}
        >
          <X className="h-4 w-4 text-muted-foreground cursor-pointer" />
        </button>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="flex items-center justify-center gap-1">
      <span>{title}</span>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          setIsOpen(true);
        }}
        aria-label={`${title} 검색`}
      >
        <Search className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer" />
      </button>
    </div>
  );
}
