"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover"
import { Loader2 } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"
import { useEffect } from "react"

interface DisplayItem {
  id: string
  name: string
}

interface MagicSearchInputProps {
  ref: React.Ref<HTMLInputElement>
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onFocus: () => void
  onBlur: () => void
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  role: string
  autoComplete: string
  "aria-autocomplete": "list" | "none" | "inline" | "both"
  "aria-controls": string
  "aria-expanded": boolean
  "aria-activedescendant": string | undefined
  "aria-label": string
}

interface MagicSearchProps {
  items: DisplayItem[]
  onQueryChange: (query: string) => void
  onSelect: (item: DisplayItem) => void
  onQueryClear?: () => void
  renderInput: (props: MagicSearchInputProps) => React.ReactElement
  isLoading?: boolean
  initialQuery?: string
  emptyMessage?: string
  errorMessage?: string
}

function MagicSearch({
  items,
  onQueryChange,
  onQueryClear,
  onSelect,
  renderInput,
  isLoading = false,
  initialQuery = "",
  emptyMessage = "No results found.",
  errorMessage = "Something went wrong. Please try again.",
}: MagicSearchProps) {
  const [inputValue, setInputValue] = React.useState(initialQuery)
  const [isOpen, setIsOpen] = React.useState(false)
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1)

  const inputRef = React.useRef<HTMLInputElement>(null)
  const listboxRef = React.useRef<HTMLDivElement>(null)
  const optionRefs = React.useRef<Array<HTMLButtonElement | null>>([])

  const hasSelectedRef = React.useRef(false)
  const listboxId = React.useId()

  const { debounceFn } = useDebounce(onQueryChange, 300)

  const showPopover = isOpen && (items.length > 0 || isLoading)

  const activeDescendant =
    highlightedIndex >= 0 ? `${listboxId}-option-${highlightedIndex}` : undefined

  useEffect(() => {
    if (highlightedIndex < 0 || !optionRefs.current[highlightedIndex])
      return;
    optionRefs.current[highlightedIndex]?.scrollIntoView({ block: "nearest" })
  }, [highlightedIndex]);

  useEffect(() => {
    hasSelectedRef.current = true
    setInputValue(initialQuery)
  }, [initialQuery]);

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value
    setInputValue(value)
    setHighlightedIndex(0)
    hasSelectedRef.current = false
    if (!isOpen) setIsOpen(true)
    debounceFn(value)
  }

  function handleInputFocus() {
    setIsOpen(true)
    setHighlightedIndex(0)
  }

  function handleInputBlur() {
    requestAnimationFrame(() => {
      const activeElement = document.activeElement
      if (
        activeElement === inputRef.current ||
        listboxRef.current?.contains(activeElement)
      ) {
        return
      }
      setIsOpen(false)
      if (!hasSelectedRef.current) {
        setInputValue("");
        hasSelectedRef.current = false;
        if (onQueryClear) onQueryClear();
      }

    })
  }

  function handleItemMouseDown(event: React.MouseEvent) {
    event.preventDefault()
  }

  const handleItemClick = React.useCallback(
    (item: DisplayItem) => {
      hasSelectedRef.current = true
      setInputValue(item.name)
      onSelect(item)
      setIsOpen(false)
      setHighlightedIndex(-1)
      requestAnimationFrame(() => inputRef.current?.focus())
    },
    [onSelect]
  )

  function handleItemMouseEnter(index: number) {
    setHighlightedIndex(index)
  }

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "ArrowDown") {
        event.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
          setHighlightedIndex(0)
          return
        }
        setHighlightedIndex((prev) => {
          if (items.length === 0) return -1
          return prev < items.length - 1 ? prev + 1 : items.length - 1
        })
        return
      }

      if (event.key === "ArrowUp") {
        event.preventDefault()
        setHighlightedIndex((prev) => {
          if (items.length === 0) return -1
          return prev > 0 ? prev - 1 : 0
        })
        return
      }

      if (event.key === "Enter" && isOpen && highlightedIndex >= 0) {
        event.preventDefault();
        if (items && items.length != 0) {
          handleItemClick(items[highlightedIndex])
        }
        return
      }

      if (event.key === "Escape") {
        event.preventDefault()
        setIsOpen(false)
        setHighlightedIndex(-1)
        return
      }
    },
    [isOpen, highlightedIndex, items, handleItemClick]
  )

  return (
    <Popover open={showPopover} onOpenChange={setIsOpen}>
      <PopoverAnchor asChild>
        {renderInput({
          ref: inputRef,
          value: inputValue,
          onChange: handleInputChange,
          onFocus: handleInputFocus,
          onBlur: handleInputBlur,
          onKeyDown: handleKeyDown,
          role: "combobox",
          autoComplete: "off",
          "aria-autocomplete": "list",
          "aria-controls": listboxId,
          "aria-expanded": showPopover,
          "aria-activedescendant": activeDescendant,
          "aria-label": "Search",
        })}
      </PopoverAnchor>

      <PopoverContent
        align="start"
        className="w-[var(--radix-popover-trigger-width)] gap-0 p-1"
        onOpenAutoFocus={(event) => event.preventDefault()}
        onCloseAutoFocus={(event) => event.preventDefault()}
      >
        <MagicSearchListbox
          ref={listboxRef}
          listboxId={listboxId}
          results={items}
          isLoading={isLoading}
          highlightedIndex={highlightedIndex}
          emptyMessage={emptyMessage}
          errorMessage={errorMessage}
          onItemClick={handleItemClick}
          onItemMouseDown={handleItemMouseDown}
          onItemMouseEnter={handleItemMouseEnter}
          optionRefs={optionRefs}
        />
      </PopoverContent>
    </Popover>
  )
}

interface MagicSearchListboxProps {
  listboxId: string
  results: DisplayItem[]
  isLoading: boolean
  highlightedIndex: number
  emptyMessage: string
  errorMessage: string
  onItemClick: (item: DisplayItem) => void
  onItemMouseDown: (event: React.MouseEvent) => void
  onItemMouseEnter: (index: number) => void
  optionRefs: React.RefObject<Array<HTMLButtonElement | null>>
}

const MagicSearchListbox = React.forwardRef<
  HTMLDivElement,
  MagicSearchListboxProps
>(function MagicSearchListbox(
  {
    listboxId,
    results,
    isLoading,
    highlightedIndex,
    emptyMessage,
    onItemClick,
    onItemMouseDown,
    onItemMouseEnter,
    optionRefs,
  },
  ref
) {
  if (isLoading) {
    return (
      <div
        ref={ref}
        id={listboxId}
        role="listbox"
        aria-label="Search results"
        className="flex items-center justify-center py-4"
      >
        <Loader2 className="size-4 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div
        ref={ref}
        id={listboxId}
        role="listbox"
        aria-label="Search results"
        className="py-4 text-center text-sm text-muted-foreground"
      >
        {emptyMessage}
      </div>
    )
  }

  return (
    <div
      ref={ref}
      id={listboxId}
      role="listbox"
      aria-label="Search results"
      className="max-h-72 overflow-y-auto"
    >
      {results.map((item, index) => (
        <button
          key={item.id}
          id={`${listboxId}-option-${index}`}
          ref={(node) => {
            optionRefs.current[index] = node
          }}
          type="button"
          role="option"
          aria-selected={highlightedIndex === index}
          className={cn(
            "w-full rounded-sm px-2 py-1.5 text-left text-sm outline-hidden transition-colors",
            highlightedIndex === index
              ? "bg-accent text-accent-foreground"
              : "hover:bg-accent/50"
          )}
          onMouseDown={onItemMouseDown}
          onMouseEnter={() => onItemMouseEnter(index)}
          onClick={() => onItemClick(item)}
        >
          <span className="truncate">{item.name}</span>
        </button>
      ))}
    </div>
  )
})

export { MagicSearch }
export type { DisplayItem, MagicSearchProps, MagicSearchInputProps }
