export interface createCompany {
    name: string;
    address: string;
    phone: string;
    description: string;
    email: string;
    foundedYear?: number;
    npwp?: string;
    sizeEmployee?: number;
    createdBy?: string; 
}

export interface updateCompany {
    id: string;
    name?: string;
    address?: string;
    phone?: string;
    description?: string;
    email?: string;
    foundedYear?: number;
    npwp?: string;
    sizeEmployee?: number;
    createdBy?: string;
}

export interface getCompanyProfile {
    id: string;
}

export interface getCompany {
    search?: string;
    periode: number;
    page: number;
    quantity: number;
}

export interface deleteCompany {
    id: string;
}