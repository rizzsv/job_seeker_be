import { NextFunction, Response } from "express";
import { CustomRequest, ErrorHandler } from "../../config/custom.config";
import Loggerconfig from "../../config/logger.config";
import { logRequest } from "../../helper/logger.request";
import { removeFileIfExists } from "../../helper/delete.file.helper";
import { Wrapper } from "../../utils/wrapper.utils";
import { createCompany } from "./company.model";
import { CompanyService } from "./company.service";

export class CompanyController {
    static async createCompany(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const request: createCompany = {
                name: req.body.name,
                address: req.body.address,
                phone: req.body.phone,
                description: req.body.description,
                email: req.body.email,
                foundedYear: req.body.foundedYear,
                npwp: req.body.npwp,
                sizeEmployee: req.body.sizeEmployee
            };
            const userId = req.user?.id;
            if (!userId) {
                throw new ErrorHandler(401, "User tidak terautentikasi");
            }

            await logRequest(req, `POST /api/company/create` + JSON.stringify(request));

            const response = await CompanyService.createCompany(request, userId)
            Wrapper.success(res, true, response, "Sukses membuat perusahaan", 201);
        } catch (error) {
             next(error);
        }
    }
}