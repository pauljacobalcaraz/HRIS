import { shiftAssignments, shifts, type ShiftAssignment } from '@/mock/data/shifts'
import { MockStore } from '@/services/mock/mockClient'

const store = new MockStore<ShiftAssignment>('shift-assignments', shiftAssignments)

export const shiftService = {
  async getShifts() {
    return shifts
  },

  async getAssignments(): Promise<ShiftAssignment[]> {
    return store.getAll()
  },

  async updateAssignment(employeeId: string, shiftId: string): Promise<ShiftAssignment> {
    return store.update(employeeId, { shiftId })
  },
}
