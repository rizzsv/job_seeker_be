import prisma from "../../config/prisma.config";
import { Validator } from "../../utils/valitador.utils";
import loggerConfig from "../../config/logger.config";
import { ErrorHandler } from "../../config/custom.config";
import { createCompany } from "./company.model";
import { companySchema } from "./company.schema";

export class CompanyService {
    static async createCompany(req: createCompany, userId: string) {
        const ctx = "Create Company";
        const scp = "companyService";

        const userRequest = Validator.Validate(companySchema.createCompany, req);

        const isCompanyExist = await prisma.company.count({
            where: {
                OR: [
                    { name: userRequest.name },
                    { email: userRequest.email },
                    { npwp: userRequest.npwp }
                ]
            },
        });

        if(isCompanyExist !== 0) {
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
                user: {
                    connect: {
                        id: userId
                    }
                }
            },
        });

        loggerConfig.info(ctx, 'Company created successfully', scp);
        
        return create;
    }
}