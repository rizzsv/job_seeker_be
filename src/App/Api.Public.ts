import express from "express";
import { autoEnv } from "../utils/autoEnv.utils";
import { UserController } from "../bin/user/user.controller";
import { upload } from "../helper/upload.helper";
import { Jwt } from "../helper/jwt.helper";

export const ApiPublic = express.Router()

/** Login */
ApiPublic.post(`${autoEnv.PREFIX}/login/society`, UserController.Login)

/** Register */
ApiPublic.post(`${autoEnv.PREFIX}/register/society`, upload.fields([
    { name: 'photoProfile', maxCount: 1 },
    { name: 'cv', maxCount: 1 },
]), UserController.Register)

/** Society */
ApiPublic.put(`${autoEnv.PREFIX}/updateProfile/society`, Jwt.jwtValidator, upload.fields([
    { name: 'photoProfile', maxCount: 1 },
    { name: 'cv', maxCount: 1 },
]), UserController.UpdateProfile)
