import { Role } from '@prisma/client'
import express from "express";
import { autoEnv } from "../utils/autoEnv.utils";
import { UserController } from "../bin/user/user.controller";
import { upload } from "../helper/upload.helper";
import { Jwt } from "../helper/jwt.helper";
import { CompanyController } from '../bin/company/company.controller';

export const ApiPrivate = express.Router()

/** Role */
const roles = {
    HRD: Role.HRD,
    SOCIETY : Role.SOCIETY
}

/** Api Hrd */

//login
ApiPrivate.post(`${autoEnv.PREFIX}/login/hrd`, UserController.Login)

//register
ApiPrivate.post(`${autoEnv.PREFIX}/register/hrd`, upload.fields([
    { name: 'photoProfile', maxCount: 1 },
    { name: 'cv', maxCount: 1 },
]) ,UserController.RegisterHRD)  

/** Hrd */

//update profile
ApiPrivate.put(`${autoEnv.PREFIX}/updateProfile/hrd`, Jwt.jwtValidator,Jwt.allowedRole(roles.HRD), upload.fields([
    { name: 'photoProfile', maxCount: 1 },
    { name: 'cv', maxCount: 1 },
]), UserController.UpdateProfile)

//get profile
ApiPrivate.get(`${autoEnv.PREFIX}/getProfile/hrd`, Jwt.jwtValidator,Jwt.allowedRole(roles.HRD), UserController.GetProfile)

//logout
ApiPrivate.post(`${autoEnv.PREFIX}/logout/hrd`, Jwt.jwtValidator,Jwt.allowedRole(roles.HRD), UserController.Logout)


/** Api For Company */

//create company
ApiPrivate.post(`${autoEnv.PREFIX}/company/create`, Jwt.jwtValidator, Jwt.allowedRole(roles.HRD), CompanyController.createCompany);
