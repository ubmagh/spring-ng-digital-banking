import { Customer } from "./customer.model";


export interface BankAccount {
    type: string;
    id: string;
    balance: number;
    createdAt: Date;
    customer: Customer;
    status: string;
    interestRate?: number;
    overDraft?: number;
}

export interface CustomerAccountResponse {
    customerId: string;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    accounts: BankAccount[];
}
