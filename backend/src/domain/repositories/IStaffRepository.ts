import { Staff } from '../entities/Staff'
import { Email } from '../valueObjects/Email'

export interface IStaffRepository {
  findById(id: string): Promise<Staff | null>
  findByEmail(email: Email): Promise<Staff | null>
  findByEmailAndStoreId(email: Email, storeId: string): Promise<Staff | null>
  findOwnerByStoreId(storeId: string): Promise<Staff | null>
  save(staff: Staff): Promise<Staff>
}