import { NextFunction, Response } from "express";
import { CustomRequest, ErrorHandler } from "../../config/custom.config";
import Loggerconfig from "../../config/logger.config";
import { logRequest } from "../../helper/logger.request";
import { removeFileIfExists } from "../../helper/delete.file.helper";
import { Wrapper } from "../../utils/wrapper.utils";
import { createCompany, getCompany, updateCompany } from "./company.model";
import { CompanyService } from "./company.service";

export class CompanyController {
    static async createCompany(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
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

    static async updateCompany(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const request: updateCompany = req.body as updateCompany;
            const userId = req.user?.id;
            if (!userId) {
                throw new ErrorHandler(401, "User tidak terautentikasi");
            }

            await logRequest(req, `PUT /api/company/update` + JSON.stringify(request));

            const response = await CompanyService.updateCompany(request, userId);
            Wrapper.success(res, true, response, "Sukses memperbarui perusahaan", 200);
        } catch (error) {
            next(error);
        }
    }

    static async getCompanyProfile(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const request = req.params.id

            await logRequest(req, `GET /api/company/profile` + JSON.stringify(request));

            const response = await CompanyService.getCompanyProfile({ id: request });
            Wrapper.success(res, true, response, "Sukses mengambil profil perusahaan", 200);
        } catch (error) {
            next(error);
        }
    }

    static async getCompany(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const request: getCompany = req.query as unknown as getCompany;

            request.periode = Number(request.periode);
            request.page = Number(request.page);
            request.quantity = Number(request.quantity);

            await logRequest(req, `GET /api/company` + JSON.stringify(request));

            const response = await CompanyService.getAllCompany(request);
            Wrapper.pagination(res, true, response.metaData, 'Sukses mengambil daftar perusahaan', response.data, 200);
        } catch (error) {
            next(error);
        }
    }

    static async deleteCompany(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const request = req.params.id;

            await logRequest(req, `DELETE /api/company/delete/${request}`);

            // Remove company logo if exists
            await removeFileIfExists(`companyLogo/${request}`);

            const response = await CompanyService.deleteCompany({ id: request });
            Wrapper.success(res, true, response, "Perusahaan berhasil dihapus", 200);
        } catch (error) {
            next(error);
        }
    }
}