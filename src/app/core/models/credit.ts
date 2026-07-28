export interface Credit { 
    clientId:number;
    projectId:number;
    totalAmount: number;
    paidParts: number;
    unpaidParts: number;
    paymentMethod: string;      
}