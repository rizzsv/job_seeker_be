import express from "express";
import { Role } from '@prisma/client'
import { autoEnv } from "../utils/autoEnv.utils";
import { UserController } from "../bin/user/user.controller";
import { upload } from "../helper/upload.helper";
import { Jwt } from "../helper/jwt.helper";

export const ApiPublic = express.Router()

/** Role */
const roles = {
    HRD: Role.HRD,
    SOCIETY : Role.SOCIETY
}

/** Login */
ApiPublic.post(`${autoEnv.PREFIX}/login/society`, UserController.Login)

/** Register */
ApiPublic.post(`${autoEnv.PREFIX}/register/society`, upload.fields([
    { name: 'photoProfile', maxCount: 1 },
    { name: 'cv', maxCount: 1 },
]), UserController.RegisterSociety)

/** Society */

//update profile
ApiPublic.put(`${autoEnv.PREFIX}/updateProfile/society`, Jwt.jwtValidator, Jwt.allowedRole(roles.SOCIETY), upload.fields([
    { name: 'photoProfile', maxCount: 1 },
    { name: 'cv', maxCount: 1 },
]), UserController.UpdateProfile)

//get profile
ApiPublic.get(`${autoEnv.PREFIX}/getProfile/society`, Jwt.jwtValidator, UserController.GetProfile)

//logout
ApiPublic.post(`${autoEnv.PREFIX}/logout/society`, Jwt.jwtValidator, UserController.Logout);
