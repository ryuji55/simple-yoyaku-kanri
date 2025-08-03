import { Request, Response } from 'express'
import { PrismaClient } from '../../../generated/prisma'
import { LoginAdminUseCase } from '../../application/useCases/auth/LoginAdminUseCase'
import { LoginStoreUseCase } from '../../application/useCases/auth/LoginStoreUseCase'
import { LoginCustomerUseCase } from '../../application/useCases/auth/LoginCustomerUseCase'
import { RegisterStoreUseCase } from '../../application/useCases/auth/RegisterStoreUseCase'
import { RegisterCustomerUseCase } from '../../application/useCases/auth/RegisterCustomerUseCase'
import { PrismaAdminRepository } from '../../infrastructure/repositories/PrismaAdminRepository'
import { PrismaStoreRepository } from '../../infrastructure/repositories/PrismaStoreRepository'
import { PrismaStaffRepository } from '../../infrastructure/repositories/PrismaStaffRepository'
import { PrismaCustomerRepository } from '../../infrastructure/repositories/PrismaCustomerRepository'
import { AuthService } from '../../domain/services/AuthService'
import { JwtService } from '../../infrastructure/security/JwtService'

export class AuthController {
  private loginAdminUseCase: LoginAdminUseCase
  private loginStoreUseCase: LoginStoreUseCase
  private loginCustomerUseCase: LoginCustomerUseCase
  private registerStoreUseCase: RegisterStoreUseCase
  private registerCustomerUseCase: RegisterCustomerUseCase

  constructor() {
    const prisma = new PrismaClient()
    const authService = new AuthService()
    const jwtService = new JwtService()

    const adminRepository = new PrismaAdminRepository(prisma)
    const storeRepository = new PrismaStoreRepository(prisma)
    const staffRepository = new PrismaStaffRepository(prisma)
    const customerRepository = new PrismaCustomerRepository(prisma)

    this.loginAdminUseCase = new LoginAdminUseCase(
      adminRepository,
      authService,
      jwtService
    )

    this.loginStoreUseCase = new LoginStoreUseCase(
      staffRepository,
      storeRepository,
      authService,
      jwtService
    )

    this.loginCustomerUseCase = new LoginCustomerUseCase(
      customerRepository,
      storeRepository,
      authService,
      jwtService
    )

    this.registerStoreUseCase = new RegisterStoreUseCase(
      storeRepository,
      staffRepository,
      authService,
      jwtService
    )

    this.registerCustomerUseCase = new RegisterCustomerUseCase(
      customerRepository,
      storeRepository,
      authService,
      jwtService
    )
  }

  loginAdmin = async (req: Request, res: Response) => {
    const result = await this.loginAdminUseCase.execute(req.body)
    res.json({
      success: true,
      ...result
    })
  }

  loginStore = async (req: Request, res: Response) => {
    const result = await this.loginStoreUseCase.execute(req.body)
    res.json({
      success: true,
      ...result
    })
  }

  loginCustomer = async (req: Request, res: Response) => {
    const result = await this.loginCustomerUseCase.execute(req.body)
    res.json({
      success: true,
      ...result
    })
  }

  registerStore = async (req: Request, res: Response) => {
    const result = await this.registerStoreUseCase.execute(req.body)
    res.status(201).json({
      success: true,
      ...result
    })
  }

  registerCustomer = async (req: Request, res: Response) => {
    const result = await this.registerCustomerUseCase.execute(req.body)
    res.status(201).json({
      success: true,
      ...result
    })
  }
}