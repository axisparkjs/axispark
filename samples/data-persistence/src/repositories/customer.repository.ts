import { Repository as DataRepository, BaseRepository, PageRequest } from '@axisparkjs/data';
import { Customer } from '../entities/customer';

@DataRepository({ entity: Customer })
export class CustomerRepository extends BaseRepository<Customer> {
    declare findByStatusAndAgeGreaterThanOrEmailOrderByNameAsc: (status: string, age: number, email: string) => Promise<Customer[]>;

    declare findByStatusOrderByAgeDesc: (status: string, page?: PageRequest) => Promise<Customer[]>;

    declare findOneByEmail: (email: string) => Promise<Customer | null>;

    declare countByStatus: (status: string) => Promise<number>;

    declare existsByEmail: (email: string) => Promise<boolean>;
}
