"use client";

import { useState, useRef, KeyboardEvent, ClipboardEvent } from "react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { AddTagSchemaType } from "../schema";

export function TagInput({
  value,
  onChange,
  placeholder,
  maxTags,
}: AddTagSchemaType) {
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTags = (raw: string | string[]) => {
    const pieces = (Array.isArray(raw) ? raw : [raw])
      .join(",")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (!pieces.length) return;

    const next = Array.from(new Set([...value, ...pieces]));
    onChange(typeof maxTags === "number" ? next.slice(0, maxTags) : next);
    setDraft("");
  };

  const removeAt = (index: number) => {
    const next = value.filter((_, i) => i !== index);
    onChange(next);
    inputRef.current?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTags(draft);
    } else if (e.key === "Backspace" && !draft && value.length) {
      e.preventDefault();
      removeAt(value.length - 1);
    }
  };

  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text");
    if (text.includes(",")) {
      e.preventDefault();
      addTags(text);
    }
  };

  return (
    <div
      className="
        flex min-h-11 w-full items-center gap-2 rounded-xl border bg-background px-2 py-1
        focus-within:ring-2 focus-within:ring-ring
      "
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex flex-wrap items-center gap-2">
        {value.map((t, i) => (
          <Badge
            key={t}
            variant="secondary"
            className="gap-1 rounded-full px-2 py-1 text-xs"
          >
            {t}
            <button
              type="button"
              aria-label={`Remove ${t}`}
              onClick={() => removeAt(i)}
              className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-muted"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
          placeholder={
            value.length ? "" : placeholder ?? "Type a tag and press Enter"
          }
          className="bg-transparent outline-none placeholder:text-muted-foreground text-sm py-2"
        />
      </div>
    </div>
  );
}
