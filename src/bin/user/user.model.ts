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

export interface userResponse {
    id: string
    username: string
    email: string
    role: Role
    address: string
    phone: string
    summary: string
    education: string
    date_of_birth: Date
    experience: string
    gender: string
    cv: string
    photoProfile: string
}

export function toUserResponse(user: User): userResponse {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        address: user.address,
        phone: user.phone,
        summary: user.summary ?? '',
        education: user.education,
        date_of_birth: user.date_of_birth,
        experience: user.experience ?? '',
        gender: user.gender ?? '',
        cv: user.cv ?? '',
        photoProfile: user.photoProfile ?? '',
    }
}