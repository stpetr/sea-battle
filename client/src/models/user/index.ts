export type UserType = 'regular' | 'anonymous'

export type User = {
  _id: string
  type: UserType
  name: string
  email: string
  age: number
  score: number
}
