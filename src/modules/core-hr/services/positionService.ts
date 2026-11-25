import { positions, type Position } from '@/mock/data/positions'
import { MockStore } from '@/services/mock/mockClient'

const store = new MockStore<Position>('positions', positions)

export const positionService = {
  async getPositions(): Promise<Position[]> {
    return store.getAll()
  },
  async getPositionById(id: string): Promise<Position | undefined> {
    return store.getById(id)
  },
}
