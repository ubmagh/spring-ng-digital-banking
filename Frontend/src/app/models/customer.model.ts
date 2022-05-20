export interface Customer {
    id: string;
    name: string;
    email: string;
} 

export interface CustomersPaginated {
    currentPage :number,
    totalPages :number,
    pageSize :number,
    customers :Customer[]
}