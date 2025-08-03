import { Admin } from '../entities/Admin'
import { Email } from '../valueObjects/Email'

export interface IAdminRepository {
  findById(id: string): Promise<Admin | null>
  findByEmail(email: Email): Promise<Admin | null>
  save(admin: Admin): Promise<Admin>
}