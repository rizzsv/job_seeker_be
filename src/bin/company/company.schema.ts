import Joi from "joi";

export class companySchema {
  static readonly createCompany = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
      "string.empty": "Nama perusahaan tidak boleh kosong",
      "string.min": "Nama perusahaan minimal 3 karakter",
      "string.max": "Nama perusahaan maksimal 100 karakter",
    }),

    address: Joi.string().min(5).max(255).required().messages({
      "string.empty": "Alamat perusahaan tidak boleh kosong",
    }),

    phone: Joi.string().pattern(/^\+?\d{9,15}$/).required().messages({
      "string.pattern.base": "Format nomor telepon tidak valid",
      "string.empty": "Nomor telepon tidak boleh kosong",
    }),

    description: Joi.string().max(500).required().messages({
      "string.empty": "Deskripsi perusahaan tidak boleh kosong",
      "string.max": "Deskripsi maksimal 500 karakter",
    }),

    email: Joi.string().email().required().messages({
      "string.email": "Format email tidak valid",
      "string.empty": "Email tidak boleh kosong",
    }),

    foundedYear: Joi.number().integer().min(1800).max(new Date().getFullYear()).optional().messages({
      "number.base": "Tahun berdiri harus berupa angka",
    }),

    npwp: Joi.string().length(15).optional().messages({
      "string.length": "NPWP harus terdiri dari 15 digit",
    }),

    sizeEmployee: Joi.number().integer().min(1).optional().messages({
      "number.min": "Jumlah karyawan minimal 1 orang",
    }),
  });

  static readonly updateCompany = Joi.object({
    id: Joi.string().required().messages({
      "string.uuid": "ID perusahaan tidak valid",
    }),
    name: Joi.string().min(3).max(100).optional(),
    address: Joi.string().min(5).max(255).optional(),
    phone: Joi.string().pattern(/^\+?\d{9,15}$/).optional(),
    description: Joi.string().max(500).optional(),
    email: Joi.string().email().optional(),
    foundedYear: Joi.number().integer().min(1800).max(new Date().getFullYear()).optional(),
    npwp: Joi.string().length(15).optional(),
    sizeEmployee: Joi.number().integer().min(1).optional(),
  });

  static readonly getCompanyProfile = Joi.object({
    id: Joi.string().required().messages({
      "string.uuid": "ID perusahaan tidak valid",
    }),
  });

  static readonly getCompany = Joi.object({
    search: Joi.string().allow(null, "").optional(),
    periode: Joi.number().integer().required().messages({
      "number.base": "Periode wajib berupa angka",
    }),
    page: Joi.number().integer().positive().default(1),
    quantity: Joi.number().integer().positive().required(),
  });

  static readonly deleteCompany = Joi.object({
    id: Joi.string().required().messages({
      "string.uuid": "ID tidak valid",
    }),
  });
}
