import prisma from "../../config/prisma.config";
import { Validator } from "../../utils/valitador.utils";
import {
    login,
    register,
    updateProfile,
    getUser,
    toUserResponse
} from "./user.model"
import { userSchema } from "./user.schema";
import LoggerService from "../../config/logger.config";
import { ErrorHandler } from "../../config/custom.config";
import bcrypt from "bcrypt";
import { Jwt } from "../../helper/jwt.helper";
import { Crypto } from "../../helper/crypto.helper";
import loggerConfig from "../../config/logger.config";

export class UserService {
    /** Login User */
    static async Login(req: login) {
        const ctx = "Login";
        const scp = "UserService";

        const userRequest = Validator.Validate(userSchema.login, req)
        const isUserExist = await prisma.user.findFirst({
            where: {
                AND: [
                    {
                        OR: [
                            { email: userRequest.email },
                            { username: userRequest.username },
                            { password: userRequest.password }
                        ],
                    },
                    {
                        OR: [{ onDelete: false }]
                    }
                ]
            }
        });

        if (!isUserExist) {
            LoggerService.error(ctx, "user not found", scp);
            throw new ErrorHandler(400, "akun belum terdaftar")
        }

        const isPasswordMatch = await bcrypt.compare(
            userRequest.password,
            isUserExist.password
        );

        if (!isPasswordMatch) {
            LoggerService.error(ctx, "password not match", scp);
            throw new ErrorHandler(400, "password tidak sesuai")
        }

        const token = Jwt.createJwt({
            id: Crypto.encode(isUserExist.id),
            role: isUserExist.role,
            email: isUserExist.email,
            username: isUserExist.username,
        });

        LoggerService.info(ctx, 'user login successfully', scp)

        return {
            token,
            role: isUserExist.role,
            id: isUserExist.id,
        };
    }

    /** Register User */
static async Register(req: register) {
    const ctx = "Register";
    const scp = "UserService";

    const userRequest = Validator.Validate(userSchema.register, req);

    const isUserExist = await prisma.user.count({
        where: {
            OR: [{ email: userRequest.email }, { username: userRequest.username }],
        },
    });

    if (isUserExist !== 0) {
        LoggerService.error(ctx, "user already regist", scp);
        throw new ErrorHandler(409, "akun sudah terdaftar");
    }

    // Validasi role
    if (!userRequest.role) {
        throw new ErrorHandler(400, "Role harus diisi");
    }

    const role = userRequest.role.toUpperCase(); // normalisasi ke kapital

    if (role !== "HRD" && role !== "SOCIETY") {
        throw new ErrorHandler(400, "Role tidak valid. Hanya HRD atau SOCIETY yang diperbolehkan");
    }

    const hashedPassword = await bcrypt.hash(userRequest.password, 10);

    const user = await prisma.user.create({
        data: {
            email: userRequest.email,
            username: userRequest.username,
            password: hashedPassword,
            address: userRequest.address,
            phone: userRequest.phone,
            gender: userRequest.gender,
            education: userRequest.education,
            experience: userRequest.experience,
            photoProfile: userRequest.photoProfile,
            date_of_birth: userRequest.date_of_birth,
            role: role,
        },
    });

    LoggerService.info(ctx, "user created successfully", scp);

    return { user };
}



    /** Update User Profile */
    static async UpdateProfile(req: updateProfile, userId?: string) {
        const ctx = "UpdateProfile"
        const scp = "UserService";

        const userRequest = Validator.Validate(userSchema.updateProfile, req)

        const existing = await prisma.user.findFirst({
            where: {
                id: userId,
            },
        });

        if (!existing) {
            LoggerService.error(ctx, "user not found", scp);
            throw new ErrorHandler(404, "user tidak ditemukan")
        };

        const updateData = {
            email: userRequest.email ?? existing.email,
            username: userRequest.username ?? existing.username,
            phone: userRequest.phone ?? existing.phone,
            gender: userRequest.gender ?? existing.gender,
            education: userRequest.education ?? existing.education,
            summary: userRequest.summary ?? existing.summary,
            address: userRequest.address ?? existing.address,
            experience: userRequest.experience ?? existing.experience,
            cv: userRequest.cv ?? existing.cv,
            photoProfile: userRequest.photoProfile ?? existing.photoProfile,
            date_of_birth: userRequest.date_of_birth ?? existing.date_of_birth,
        };

        const updated = await prisma.user.update({
            where: {
                id: userId ? userId : userRequest.id,
            },
            data: {
                email: userRequest.email ?? existing.email,
                username: userRequest.username ?? existing.username,
                phone: userRequest.phone ?? existing.phone,
                gender: userRequest.gender ?? existing.gender,
                education: userRequest.education ?? existing.education,
                summary: userRequest.summary ?? existing.summary,
                address: userRequest.address ?? existing.address,
                experience: userRequest.experience ?? existing.experience,
                cv: userRequest.cv ?? existing.cv,
                photoProfile: userRequest.photoProfile ?? existing.photoProfile,
                date_of_birth: userRequest.date_of_birth ?? existing.date_of_birth,
            },
        });


        LoggerService.info(ctx, 'user updated successfully', scp)

        return { updated };
    }

    static async getProfile(req: string) {
        const ctx = "getProfile"
        const scp = "UserService";

        const userRequest = Validator.Validate(userSchema.getProfile, {id: req})

        const isUserExist = await prisma.user.findFirst({
            where: {
                id: userRequest.id
            }
        })

        if(!isUserExist) {
            LoggerService.error(ctx, "user not found", scp);
            throw new ErrorHandler(404, "user tidak ditemukan")
        }

        loggerConfig.info(ctx, "Success get profile", scp);

        return toUserResponse(isUserExist);
    }

    
}