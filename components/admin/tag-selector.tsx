'use client'

import { useId, useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Search, X } from 'lucide-react'

type Tag = {
  id: string
  name: string
  slug: string
}

type TagGroup = {
  letter: string
  tags: Tag[]
}

interface TagSelectorProps {
  tags: Tag[]
  selectedTagIds: string[]
  onToggle: (tagId: string) => void
  onCreate?: () => void
}

const sortTags = (items: Tag[]) =>
  [...items].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))

const getGroupLetter = (name: string) => {
  const trimmed = name.trim()
  if (!trimmed) return '#'
  const letter = trimmed[0].toUpperCase()
  return /[A-Z]/.test(letter) ? letter : '#'
}

export function TagSelector({ tags, selectedTagIds, onToggle, onCreate }: TagSelectorProps) {
  const [query, setQuery] = useState('')
  const searchId = useId()
  const normalizedQuery = query.trim().toLowerCase()
  const selectedSet = useMemo(() => new Set(selectedTagIds), [selectedTagIds])

  const selectedTags = useMemo(() => {
    if (!selectedTagIds.length) return []
    return sortTags(tags.filter((tag) => selectedSet.has(tag.id)))
  }, [tags, selectedSet, selectedTagIds.length])

  const groupedTags = useMemo<TagGroup[]>(() => {
    const sortedTags = sortTags(tags)
    const filteredTags = normalizedQuery
      ? sortedTags.filter((tag) => tag.name.toLowerCase().includes(normalizedQuery))
      : sortedTags

    const groups = new Map<string, Tag[]>()
    for (const tag of filteredTags) {
      const letter = getGroupLetter(tag.name)
      const group = groups.get(letter)
      if (group) {
        group.push(tag)
      } else {
        groups.set(letter, [tag])
      }
    }

    return Array.from(groups.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([letter, groupTags]) => ({ letter, tags: groupTags }))
  }, [tags, normalizedQuery])

  return (
    <div className="space-y-4">
      <div className="space-y-3 rounded-lg border border-border/60 bg-muted/20 p-3">
        <Label>Selected Tags</Label>
        {selectedTags.length > 0 ? (
          <div className="flex max-h-48 flex-wrap gap-2 overflow-y-auto pr-1">
            {selectedTags.map((tag) => (
              <Badge key={tag.id} variant="secondary" className="flex items-center gap-1">
                {tag.name}
                <button
                  type="button"
                  onClick={() => onToggle(tag.id)}
                  aria-label={`Remove ${tag.name}`}
                  className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No tags selected yet.</p>
        )}
      </div>

      <div className="space-y-3 rounded-lg border border-border/60 bg-muted/10 p-3">
        <div className="space-y-2">
          <p className="text-sm font-medium">Available Tags</p>
          <div className="space-y-2">
            <Label htmlFor={searchId} className="text-xs text-muted-foreground">
              Search tags
            </Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id={searchId}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search tags..."
                className="pl-8"
              />
            </div>
          </div>
        </div>

        <div className="space-y-5 max-h-64 overflow-y-auto pr-1">
          {groupedTags.length > 0 ? (
            groupedTags.map((group) => (
              <div key={group.letter} className="flex items-start gap-3 py-1">
                <div className="w-6 shrink-0 text-sm font-semibold text-muted-foreground">
                  {group.letter}:
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.tags.map((tag) => {
                    const isSelected = selectedSet.has(tag.id)
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => onToggle(tag.id)}
                        disabled={isSelected}
                        className={`inline-flex items-center gap-1 px-2 py-1 text-sm rounded-md transition-colors
                          ${isSelected
                            ? 'bg-muted/60 text-muted-foreground cursor-not-allowed'
                            : 'bg-muted hover:bg-muted-foreground/20'}
                        `}
                      >
                        {!isSelected && <Plus className="h-3 w-3" />}
                        {tag.name}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-muted-foreground">No tags match your search.</p>
          )}
        </div>

        {onCreate && (
          <Button
            type="button"
            className="w-full border-transparent bg-[#7fffc1] text-[#0f1f16] hover:bg-secondary hover:text-secondary-foreground"
            onClick={onCreate}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create tag
          </Button>
        )}
      </div>
    </div>
  )
}
