
export interface Operation {
    id: number;
    operationDate: Date;
    amount: number;
    type: string;
    description: string;
}

export interface OperationResponseObject {
    accountId: string;
    balance: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    accountOperationDTOS: Operation[];
}

