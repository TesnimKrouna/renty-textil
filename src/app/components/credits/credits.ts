import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreditService } from '../../core/services/credit';
import { Credit } from '../../core/models/credit';

@Component({
  selector: 'app-credits',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './credits.html',
  styleUrls: ['./credits.css']
})
export class CreditsComponent implements OnInit {
  items: Credit[] = [];
  searchTerm = '';

  // Identifiants de la ligne en cours d'édition
  editingClientId: number | null = null;
  editingProjectId: number | null = null;
  editItem: Credit = {} as Credit;

  // Pour l'ajout
  showAddForm = false;
  newCredit: Credit = {
    clientId: 0,
    projectId: 0,
    totalAmount: 0,
    paidParts: 0,
    unpaidParts: 0,
    paymentMethod: ''
  };

  constructor(private creditService: CreditService) {}   // ← injection correcte

  ngOnInit(): void {
    this.creditService.getAll().subscribe({
      next: (data: Credit[]) => (this.items = data),
      error: (err: any) => console.error('Erreur chargement crédits', err)
    });
  }

  // Filtre local
  get filteredItems(): Credit[] {
    if (!this.searchTerm.trim()) return this.items;
    const term = this.searchTerm.toLowerCase();
    return this.items.filter(c =>
      c.clientId.toString().includes(term) ||
      c.projectId.toString().includes(term) ||
      c.paymentMethod.toLowerCase().includes(term)
    );
  }

  // Vérifie si une ligne est en édition
  isEditing(item: Credit): boolean {
    return this.editingClientId === item.clientId && this.editingProjectId === item.projectId;
  }

  // ---------- AJOUT ----------
  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
  }

  addCredit(): void {
    if (!this.newCredit.clientId || !this.newCredit.projectId) return;

    this.creditService.create(this.newCredit).subscribe({
      next: (credit: Credit) => {
        this.items.push(credit);
        this.resetNewCredit();
        this.showAddForm = false;
      },
      error: (err: any) => console.error('Erreur ajout crédit', err)
    });
  }

  resetNewCredit(): void {
    this.newCredit = {
      clientId: 0,
      projectId: 0,
      totalAmount: 0,
      paidParts: 0,
      unpaidParts: 0,
      paymentMethod: ''
    };
  }

  // ---------- ÉDITION ----------
  startEdit(item: Credit): void {
    this.editingClientId = item.clientId;
    this.editingProjectId = item.projectId;
    this.editItem = { ...item };
  }

  cancelEdit(): void {
    this.editingClientId = null;
    this.editingProjectId = null;
  }

  saveEdit(): void {
    if (this.editingClientId == null || this.editingProjectId == null) return;

    this.creditService.update(this.editingClientId, this.editingProjectId, this.editItem).subscribe({
      next: (updated: Credit) => {
        const index = this.items.findIndex(
          i => i.clientId === updated.clientId && i.projectId === updated.projectId
        );
        if (index !== -1) {
          this.items[index] = updated;
        }
        this.cancelEdit();
      },
      error: (err: any) => console.error('Erreur mise à jour crédit', err)
    });
  }
}