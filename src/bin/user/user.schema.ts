import Joi from "joi"

export class userSchema {
  static readonly login = Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().required(),
    password: Joi.string().min(6).required(),
  })

  static readonly register = Joi.object({
    username: Joi.string()
      .min(5)
      .max(100)
      .pattern(/^[a-z0-9._-]+$/)
      .required()
      .messages({
        "string.empty": "Username tidak boleh kosong",
        "string.min": "Username minimal harus 5 karakter",
        "string.max": "Username terlalu panjang (maksimal 100 karakter)",
        "string.pattern.base":
          "Username hanya boleh huruf kecil, angka, titik, minus, atau underscore",
      }),

    email: Joi.string().email().required().messages({
      "string.email": "Format email tidak valid",
      "string.empty": "Email tidak boleh kosong",
    }),

    password: Joi.string()
      .min(8)
      .required()
      .messages({
        "string.min": "Password minimal 8 karakter",
      }),

    role: Joi.string().valid("SOCIETY", "HRD").optional(),

    address: Joi.string().required(),
    phone: Joi.string()
      .pattern(/^\+?\d{9,15}$/)
      .required()
      .messages({
        "string.pattern.base": "Nomor telepon tidak valid",
      }),
    education: Joi.string().required(),
    date_of_birth: Joi.date().iso().required(),
    gender: Joi.string().valid("L", "P").required(),

    cv: Joi.string().optional(),
    photoProfile: Joi.string().optional(),
  })

    static readonly updateProfile = Joi.object({
      username: Joi.string()
        .min(5)
        .max(100)
        .pattern(/^[a-z0-9._-]+$/)
        .messages({
          "string.min": "Username minimal harus 5 karakter",
          "string.max": "Username terlalu panjang (maksimal 100 karakter)",
          "string.pattern.base":
            "Username hanya boleh huruf kecil, angka, titik, minus, atau underscore",
        }),

      email: Joi.string().email().messages({
        "string.email": "Format email tidak valid",
      }),

      password: Joi.string()
        .min(8)
        .messages({
          "string.min": "Password minimal 8 karakter",
        }),

      role: Joi.string().valid("ADMIN", "USER", "HRD"),
      address: Joi.string().optional(),
      phone: Joi.string()
        .pattern(/^\+?\d{9,15}$/)
        .messages({
          "string.pattern.base": "Nomor telepon tidak valid",
        }),
      experience: Joi.string().optional(),
      education: Joi.string().optional(),
      summary: Joi.string().optional(),
      date_of_birth: Joi.date().iso().optional(),
      gender: Joi.string().valid("L", "P").optional(),
      cv: Joi.string().optional(),
      photoProfile: Joi.string().optional(),
    })

  static readonly getUser = Joi.object({
    search: Joi.string().optional(),
    role: Joi.string().valid("SOCIETY", "HRD").required(),
    periode: Joi.number().integer().min(2024).max(new Date().getFullYear()).required(),
    page: Joi.number().integer().positive().default(1),
    quantity: Joi.number().integer().positive().required(),
  })

  static readonly getProfile = Joi.object({
    id: Joi.string().required(),
  })
}