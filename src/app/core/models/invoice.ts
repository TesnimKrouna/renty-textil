export interface Invoice {
  id: number;
  clientId: number;
  clientName: string;
  items: {
    produitId: number;
    produitNom: string;
    quantite: number;
    prixUnitaire: number;
    total: number;
  }[];
  tauxTva: number;
  totalHT: number;
  totalTTC: number;
  typeRemise: 'percentage' | 'fixed';
  remise: number;
  signature: string;
  createdAt: Date;
  createdBy: number;
  status: 'draft' | 'sent' | 'paid';
}