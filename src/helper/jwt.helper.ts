import jwt from 'jsonwebtoken'
import { autoEnv } from '../utils/autoEnv.utils'
import { JwtPayload } from '../utils/type.utils'
import { NextFunction, Response } from 'express'
import { CustomRequest, ErrorHandler } from '../config/custom.config'
import {Role} from '@prisma/client'
import { Crypto } from '../helper/crypto.helper'

export class Jwt {
  // Membuat JWT token
  static createJwt(payload: JwtPayload): string {
    return jwt.sign(payload, autoEnv.JWT_SECRET!, { expiresIn: '6h' })
  }

  static jwtValidator(req: CustomRequest, res: Response, next: NextFunction): void {
    try {
      const authHeader = req.headers.authorization
      if (!authHeader?.startsWith('Bearer ')) {
        return next(new ErrorHandler(401, 'Unauthorized: No token provided'))
      }

      const token = authHeader.split(' ')[1]
      const decoded = jwt.verify(token, autoEnv.JWT_SECRET!) as JwtPayload

      
      decoded.id = Crypto.decode(decoded.id)

      req.user = decoded
      next()
    } catch (error) {
      return next(new ErrorHandler(401, 'Unauthorized: Invalid token'))
    }
  }

  static allowedRole(...allowedRoles: Role[]) {
    return (req: CustomRequest, res: Response, next: NextFunction): void => {
      const userRole = req.user?.role
      if (!userRole || !allowedRoles.includes(userRole)) {
        res.status(403).json({
          success: false,
          data: null,
          message: 'Forbidden: Role not allowed',
        })
        return
      }
      next()
    }
  }
}
