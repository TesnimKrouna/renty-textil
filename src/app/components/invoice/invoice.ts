import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../core/services/client';
import { ProductService } from '../../core/services/product';
import { Client } from '../../core/models/client';
import { Product } from '../../core/models/product';
import { Invoice } from '../../core/models/invoice';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invoice.html',
  styleUrls: ['./invoice.css']
})
export class InvoiceComponent implements OnInit {
  clients: Client[] = [];
  products: Product[] = [];

  // Facture en cours d'édition
  invoice: Invoice = {
    id: 0,
    clientId: 0,
    clientName: '',
    items: [],
    tauxTva: 0.2,
    totalHT: 0,
    totalTTC: 0,
    typeRemise: 'fixed',
    remise: 0,
    signature: '',
    createdAt: new Date(),
    createdBy: 1,
    status: 'draft'
  };

  // Pour le formulaire
  invoiceNumber: string = '';

  // ----- CACHET / TAMPON -----
  cachetUrl: string | ArrayBuffer | null = null;  // image du cachet (data URL)
  cachetFileName: string = '';                     // nom du fichier affiché

  constructor(
    private clientService: ClientService,
    private productService: ProductService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadClients();
      this.loadProducts();
    }
  }

  loadClients(): void {
    this.clientService.getAll().subscribe({
      next: (data) => (this.clients = data),
      error: (err) => console.error('Erreur chargement clients', err)
    });
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => (this.products = data),
      error: (err) => console.error('Erreur chargement produits', err)
    });
  }

  // Sélection d'un client dans le select
  onClientChange(clientId: number): void {
    const client = this.clients.find(c => c.id == clientId);
    if (client) {
      this.invoice.clientId = client.id;
      this.invoice.clientName = client.name;
    }
  }

  // Ajouter une ligne de produit
  addLine(): void {
    this.invoice.items.push({
      produitId: 0,
      produitNom: '',
      quantite: 1,
      prixUnitaire: 0,
      total: 0
    });
  }

  // Supprimer une ligne
  removeLine(index: number): void {
    this.invoice.items.splice(index, 1);
    this.calculateTotals();
  }

  // Quand un produit est sélectionné dans une ligne
  onProductChange(index: number, productId: number): void {
    const product = this.products.find(p => p.id == productId);
    if (product) {
      const line = this.invoice.items[index];
      line.produitId = product.id;
      line.produitNom = product.name;
      line.prixUnitaire = product.price;
      line.total = line.quantite * product.price;
      this.calculateTotals();
    }
  }

  // Mise à jour du total d'une ligne quand la quantité ou le prix change
  updateLineTotal(index: number): void {
    const line = this.invoice.items[index];
    line.total = line.quantite * line.prixUnitaire;
    this.calculateTotals();
  }

  // Calcul du total HT, TTC et application de la remise
  calculateTotals(): void {
    const totalHT = this.invoice.items.reduce((sum, item) => sum + item.total, 0);

    let remiseAmount = 0;
    if (this.invoice.typeRemise === 'percentage') {
      remiseAmount = totalHT * (this.invoice.remise / 100);
    } else {
      remiseAmount = this.invoice.remise;
    }

    this.invoice.totalHT = totalHT - remiseAmount;
    const taxAmount = this.invoice.totalHT * this.invoice.tauxTva;
    this.invoice.totalTTC = this.invoice.totalHT + taxAmount;
  }

  // ----- GESTION DU CACHET -----
  onCachetSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.cachetFileName = file.name;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.cachetUrl = e.target?.result ?? null;
      };
      reader.readAsDataURL(file);
    }
  }

  removeCachet(): void {
    this.cachetUrl = null;
    this.cachetFileName = '';
    const fileInput = document.getElementById('cachet-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  // Génération PDF (import dynamique pour éviter l'erreur SSR)
  async generatePDF(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    const element = document.getElementById('invoice-preview');
    if (!element) return;

    const html2pdf = (await import('html2pdf.js')).default;

    const options = {
      margin: [10, 10, 10, 10] as [number, number, number, number],
      filename: `facture-${this.invoice.clientName || 'sans-nom'}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, logging: true },
      jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
    };

    html2pdf().set(options).from(element).save();
  }
}