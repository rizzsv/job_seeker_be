import prisma from "../../config/prisma.config";
import { Validator } from "../../utils/valitador.utils";
import loggerConfig from "../../config/logger.config";
import { ErrorHandler } from "../../config/custom.config";
import { createCompany, updateCompany } from "./company.model";
import { companySchema } from "./company.schema";

export class CompanyService {
    static async createCompany(req: createCompany, userId: string) {
        const ctx = "Create Company";
        const scp = "companyService";

        const userRequest = Validator.Validate(companySchema.createCompany, req);

        const existingCompany = await prisma.company.findFirst({
            where: {
                createdBy: userId,
            },
        });

        if (existingCompany) {
            loggerConfig.error(ctx, "User already has a company", scp);
            throw new ErrorHandler(400, "Anda sudah memiliki perusahaan");
        }

        const isCompanyExist = await prisma.company.count({
            where: {
                OR: [
                    { name: userRequest.name },
                    { email: userRequest.email },
                    { npwp: userRequest.npwp }
                ]
            },
        });

        if (isCompanyExist !== 0) {
            loggerConfig.error(ctx, 'Company already exists', scp);
            throw new ErrorHandler(400, "Perusahaan dengan nama, email, atau NPWP tersebut sudah ada");
        }

        const create = await prisma.company.create({
            data: {
                name: userRequest.name,
                address: userRequest.address,
                phone: userRequest.phone,
                description: userRequest.description,
                email: userRequest.email,
                foundedYear: userRequest.foundedYear,
                npwp: userRequest.npwp,
                sizeEmployee: userRequest.sizeEmployee,
                createdBy: userId,
                user: {
                    connect: {
                        id: userId
                    }
                }
            },
        });

        loggerConfig.info(ctx, 'Company created successfully', scp);

        return {
            message: "Perusahaan berhasil dibuat",
            data: {
                id: create.id,
                name: create.name,
                address: create.address,
                phone: create.phone,
                description: create.description,
                email: create.email,
                foundedYear: create.foundedYear,
                npwp: create.npwp,
                sizeEmployee: create.sizeEmployee,
                createdBy: create.createdBy,
            }
        }
    }

    static async updateCompany(req: updateCompany, userId: string) {
        const ctx = "Update Company";
        const scp = "companyService";

        const userRequest = Validator.Validate(companySchema.updateCompany, req);
        const isCompanyExist = await prisma.company.findFirst({
            where: { id: userRequest.id, createdBy: userId }
        });

        if (!isCompanyExist) {
            loggerConfig.error(ctx, "Company not found", scp);
            throw new ErrorHandler(404, "Perusahaan tidak ditemukan");
        }

        userRequest.name ??= isCompanyExist.name;
        userRequest.address ??= isCompanyExist.address;
        userRequest.phone ??= isCompanyExist.phone;
        userRequest.description ??= isCompanyExist.description;
        userRequest.email ??= isCompanyExist.email;
        userRequest.foundedYear ??= isCompanyExist.foundedYear;
        userRequest.npwp ??= isCompanyExist.npwp;
        userRequest.sizeEmployee ??= isCompanyExist.sizeEmployee;

        await prisma.company.update({
            where: { id: userRequest.id },
            data: {
                name: userRequest.name,
                address: userRequest.address,
                phone: userRequest.phone,
                description: userRequest.description,
                email: userRequest.email,
                foundedYear: userRequest.foundedYear,
                npwp: userRequest.npwp,
                sizeEmployee: userRequest.sizeEmployee,
            },
        });

        loggerConfig.info(ctx, 'Company updated successfully', scp);

        return {
            message: "Perusahaan berhasil diperbarui",
        }
    }
}