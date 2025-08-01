export interface JwtPayload {
  id: string
  username: string
  email: string
  role: 'HRD' | 'SOCIETY'
  iat?: number
  exp?: number
}

export interface MetaData {
  totalItem: number
  currentPage: number
  totalPages?: number
  quantity?: number
}
