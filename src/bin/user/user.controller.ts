import { NextFunction, Response } from "express";
import { CustomRequest, ErrorHandler } from "../../config/custom.config";
import LoggerService from "../../config/logger.config";
import { UserService } from "./user.service";
import { Wrapper } from "../../utils/wrapper.utils";
import { logRequest } from "../../helper/logger.request";
import { login, register, updateProfile } from "./user.model";
import { removeFileIfExists } from "../../helper/delete.file.helper";
import redis from "../../config/redis";
import { createAccessToken, createRefreshToken } from "../../helper/jwt.helper";
import { log } from "console";

export class UserController {
    static async Login(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const request: login = req.body;
            await logRequest(req, `POST /user/login ${JSON.stringify(request)}`);
            const response = await UserService.Login(request);

            const payload = { id: response.id, role: response.role }
            const accessToken = createAccessToken(payload);
            const refreshToken = createRefreshToken(payload);

            await redis.set(`refreshToken:${response.id}`, refreshToken, 'EX', 60 * 60 * 24 * 7);
            Wrapper.success(res, true, response, "Login Berhasil", 200);
        } catch (error) {
            next(error);
        }
    }

static async RegisterSociety(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const roleFromBody = req.body.role?.toUpperCase();
        if (roleFromBody && roleFromBody !== "SOCIETY") {
            throw new ErrorHandler(400, "Kembalilah, dan isi di halaman HRD");
        }

        const files = req.files as {
            photoProfile?: Express.Multer.File[];
            cv?: Express.Multer.File[];
        };

        const photoFile = files?.photoProfile?.[0];
        const cvFile = files?.cv?.[0];

        const request: register = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            address: req.body.address,
            gender: req.body.gender,
            photoProfile: photoFile ? `photoProfile/${photoFile.filename}` : undefined,
            cv: cvFile ? `cv/${cvFile.filename}` : undefined,
            phone: req.body.phone,
            education: req.body.education,
            experience: req.body.experience,
            date_of_birth: new Date(req.body.date_of_birth),
            role: "SOCIETY",
        };

        await logRequest(req, `POST /user/register/society ${JSON.stringify(request)}`);
        const response = await UserService.Register(request);
        Wrapper.success(res, true, response, "Register Berhasil", 200);
    } catch (error) {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        if (files) {
            for (const field in files) {
                files[field].forEach(file => {
                    removeFileIfExists(`public/${field}/${file.filename}`);
                });
            }
        }
        next(error);
    }
}


        static async RegisterHRD(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const roleFromBody = req.body.role?.toUpperCase();
        if (roleFromBody && roleFromBody !== "HRD") {
            throw new ErrorHandler(400, "Kembalilah, dan isi di halaman Society");
        }

        const files = req.files as {
            photoProfile?: Express.Multer.File[];
            cv?: Express.Multer.File[];
        };

        const photoFile = files?.photoProfile?.[0];
        const cvFile = files?.cv?.[0];

        const request: register = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            address: req.body.address,
            gender: req.body.gender,
            photoProfile: photoFile ? `photoProfile/${photoFile.filename}` : undefined,
            cv: cvFile ? `cv/${cvFile.filename}` : undefined,
            phone: req.body.phone,
            education: req.body.education,
            experience: req.body.experience,
            date_of_birth: new Date(req.body.date_of_birth),
            role: "HRD",
        };

        await logRequest(req, `POST /user/register/hrd ${JSON.stringify(request)}`);
        const response = await UserService.Register(request);
        Wrapper.success(res, true, response, "Register Berhasil", 200);
    } catch (error) {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        if (files) {
            for (const field in files) {
                files[field].forEach(file => {
                    removeFileIfExists(`public/${field}/${file.filename}`);
                });
            }
        }
        next(error);
    }
}


    static async UpdateProfile(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const files = req.files as {
                photoProfile?: Express.Multer.File[];
                cv?: Express.Multer.File[];
            };

            const photoFile = files?.photoProfile?.[0];
            const cvFile = files?.cv?.[0];

            const request: updateProfile = {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                address: req.body.address,
                phone: req.body.phone,
                summary: req.body.summary,
                photoProfile: photoFile ? `photoProfile/${photoFile.filename}` : undefined,
                cv: cvFile ? `cv/${cvFile.filename}` : undefined,
                education: req.body.education,
                experience: req.body.experience,
                date_of_birth: req.body.date_of_birth ? new Date(req.body.date_of_birth) : undefined,
                gender: req.body.gender,
            };

            const userId = req.user?.id;
            if (!userId) throw new ErrorHandler(401, "User tidak terautentikasi");

            await logRequest(req, `PUT /user/updateProfile ${JSON.stringify(request)}`);
            const response = await UserService.UpdateProfile(request, userId);
            Wrapper.success(res, true, response, "Profile updated successfully", 200);
        } catch (error) {
            next(error);
        }
    }

    static async GetProfile(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const response = await UserService.getProfile(req.user!.id);
            Wrapper.success(res, true, response, 'Succes Get User Profile', 200)
        } catch (error) {
            next(error);
        }
    }

    static async Logout(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.id;
            if (!userId) throw new ErrorHandler(401, "User tidak terautentikasi");

            await redis.del(`refreshToken:${userId}`);

            Wrapper.success(res, true, null, "Logout berhasil", 200);
        } catch (error) {
            next(error);
        }
    }

    static async DeleteProfile(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.id;
            if (!userId) throw new ErrorHandler(401, "User tidak terautentikasi");

            await logRequest(req, `DELETE /user/deleteProfile userId: ${userId}`);
            await redis.del(`refreshToken:${userId}`);

            Wrapper.success(res, true, null, "Delete profile berhasil", 200);
        } catch (error) {
            next(error);
        }
    }
}
