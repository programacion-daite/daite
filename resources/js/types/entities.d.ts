export interface ClienteItem {
    id_cliente: string | number;
    cliente: string;
    [key: string]: unknown;
}

export interface BeneficiarioItem {
    id_beneficiario: string | number;
    beneficiario: string;
    [key: string]: unknown;
}
