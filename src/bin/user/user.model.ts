import { Role, User } from '@prisma/client'

export interface login {
    email: string
    username: string
    password: string
}

export interface register {
    username: string
    email: string
    password: string
    role?: Role
    address: string
    phone: string
    education: string
    date_of_birth: Date
    experience?: string
    gender: string
    cv?: string
    photoProfile?: string
}

export interface updateProfile {
    username?: string
    email?: string
    password?: string
    role?: Role
    address?: string
    phone?: string
    summary?: string
    education?: string
    date_of_birth?: Date
    experience?: string
    gender?: string
    cv?: string
    photoProfile?: string
}

export interface getUser {
    search?: string
    role: Role
    periode: number
    page: number
    quantity: number
}