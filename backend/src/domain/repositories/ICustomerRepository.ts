import { Customer } from '../entities/Customer'
import { Email } from '../valueObjects/Email'

export interface ICustomerRepository {
  findById(id: string): Promise<Customer | null>
  findByEmail(email: Email): Promise<Customer | null>
  findByEmailAndStoreId(email: Email, storeId: string): Promise<Customer | null>
  save(customer: Customer): Promise<Customer>
}