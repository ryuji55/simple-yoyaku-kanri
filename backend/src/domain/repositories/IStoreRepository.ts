import { Store } from '../entities/Store'
import { Email } from '../valueObjects/Email'

export interface IStoreRepository {
  findById(id: string): Promise<Store | null>
  findByEmail(email: Email): Promise<Store | null>
  save(store: Store): Promise<Store>
  existsByEmail(email: Email): Promise<boolean>
}