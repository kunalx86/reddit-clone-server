import { QueryOrderMap } from "@mikro-orm/core"

export const generateOrderByClause = (sortBy: string | undefined): QueryOrderMap => {
  switch (sortBy) {
    case 'upvoted': 
      return {
        votesCount: 'desc'
      }
    case 'downvoted':
      return {
        votesCount: 'asc'
      }
    case 'latest':
      return {
        createdAt: 'asc'
      }
    default:
      return {
        votesCount: 'desc'
      }
  }
}