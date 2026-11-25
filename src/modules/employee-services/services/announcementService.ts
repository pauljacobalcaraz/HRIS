import { announcements, type Announcement } from '@/mock/data/announcements'
import { MockStore } from '@/services/mock/mockClient'

const store = new MockStore<Announcement>('announcements', announcements)

export type CreateAnnouncementInput = Omit<Announcement, 'id' | 'postedDate'>

function nextId(existing: Announcement[]): string {
  const maxNum = existing.reduce((max, a) => Math.max(max, Number(a.id.replace('ANN-', '')) || 0), 0)
  return `ANN-${String(maxNum + 1).padStart(3, '0')}`
}

export const announcementService = {
  async getAll(): Promise<Announcement[]> {
    const all = await store.getAll()
    return all.sort((a, b) => (a.postedDate < b.postedDate ? 1 : -1))
  },

  async create(payload: CreateAnnouncementInput): Promise<Announcement> {
    const existing = await store.getAll()
    return store.create({ ...payload, id: nextId(existing), postedDate: new Date().toISOString().slice(0, 10) })
  },
}
