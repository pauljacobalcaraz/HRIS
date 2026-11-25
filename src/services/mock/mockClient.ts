import type { ListQueryParams, PaginatedResult } from '@/shared/types/common'

const NETWORK_DELAY_MS = 350

export function delay<T>(value: T, ms = NETWORK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

/**
 * Generic localStorage-backed CRUD store that simulates a REST resource.
 * Seeds itself from `seedData` on first access so the dataset survives refreshes
 * but can be reset independently per resource.
 */
export class MockStore<T extends { id: string }> {
  private storageKey: string
  private seedData: T[]

  constructor(resourceKey: string, seedData: T[]) {
    this.storageKey = `hris:mock:${resourceKey}`
    this.seedData = seedData
  }

  private readAll(): T[] {
    const raw = localStorage.getItem(this.storageKey)
    if (!raw) {
      localStorage.setItem(this.storageKey, JSON.stringify(this.seedData))
      return [...this.seedData]
    }
    try {
      return JSON.parse(raw) as T[]
    } catch {
      return [...this.seedData]
    }
  }

  private writeAll(items: T[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(items))
  }

  async getAll(): Promise<T[]> {
    return delay(this.readAll())
  }

  async getById(id: string): Promise<T | undefined> {
    return delay(this.readAll().find((item) => item.id === id))
  }

  async create(item: T): Promise<T> {
    const items = this.readAll()
    items.push(item)
    this.writeAll(items)
    return delay(item)
  }

  async update(id: string, patch: Partial<T>): Promise<T> {
    const items = this.readAll()
    const index = items.findIndex((item) => item.id === id)
    if (index === -1) throw new Error(`Record ${id} not found`)
    items[index] = { ...items[index], ...patch }
    this.writeAll(items)
    return delay(items[index])
  }

  async remove(id: string): Promise<void> {
    const items = this.readAll().filter((item) => item.id !== id)
    this.writeAll(items)
    return delay(undefined)
  }

  async paginate(
    params: ListQueryParams,
    searchableFields: (keyof T)[] = [],
  ): Promise<PaginatedResult<T>> {
    let items = this.readAll()

    if (params.search) {
      const term = params.search.toLowerCase()
      items = items.filter((item) =>
        searchableFields.some((field) =>
          String(item[field] ?? '').toLowerCase().includes(term),
        ),
      )
    }

    if (params.filters) {
      for (const [key, value] of Object.entries(params.filters)) {
        if (!value) continue
        items = items.filter((item) => String((item as Record<string, unknown>)[key]) === value)
      }
    }

    if (params.sortBy) {
      const dir = params.sortDir === 'desc' ? -1 : 1
      items = [...items].sort((a, b) => {
        const aVal = (a as Record<string, unknown>)[params.sortBy!]
        const bVal = (b as Record<string, unknown>)[params.sortBy!]
        if (aVal === bVal) return 0
        return aVal! > bVal! ? dir : -dir
      })
    }

    const page = params.page ?? 1
    const pageSize = params.pageSize ?? 10
    const start = (page - 1) * pageSize
    const paged = items.slice(start, start + pageSize)

    return delay({ data: paged, total: items.length, page, pageSize })
  }

  /** Reset this resource back to its seed dataset. */
  async reset(): Promise<void> {
    this.writeAll(this.seedData)
    return delay(undefined)
  }
}
