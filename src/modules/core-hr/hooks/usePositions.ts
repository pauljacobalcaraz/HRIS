import { useQuery } from '@tanstack/react-query'
import { positionService } from '../services/positionService'

export const positionKeys = {
  all: ['positions'] as const,
}

export function usePositions() {
  return useQuery({
    queryKey: positionKeys.all,
    queryFn: () => positionService.getPositions(),
  })
}
