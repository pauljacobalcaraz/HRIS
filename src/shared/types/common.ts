export type EmploymentStatus = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED'
export type EmploymentType = 'REGULAR' | 'PROBATIONARY' | 'CONTRACTUAL' | 'PART_TIME'

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export interface ListQueryParams {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: string
  sortDir?: 'asc' | 'desc'
  filters?: Record<string, string | undefined>
}
