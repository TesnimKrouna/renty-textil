import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupplierService } from '../../core/services/supplier';
import { Supplier } from '../../core/models/supplier';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './suppliers.html',
  styleUrls: ['./suppliers.css']
})
export class Suppliers implements OnInit {
  items: Supplier[] = [];
  searchTerm = '';
  editingId: number | null = null;
  editItem: Supplier = {} as Supplier;

  constructor(private supplierService: SupplierService) {}

  ngOnInit(): void {
    this.supplierService.getAllSuppliers().subscribe({
      next: (data: Supplier[]) => (this.items = data),
      error: (err: any) => console.error('Erreur chargement fournisseurs', err)
    });
  }

  
  get filteredItems(): Supplier[] {
    if (!this.searchTerm.trim()) {
      return this.items;
    }
    const term = this.searchTerm.toLowerCase();
    return this.items.filter(item =>
      item.name.toLowerCase().includes(term) ||
      item.mail?.toLowerCase().includes(term) ||
      item.adress?.toLowerCase().includes(term)
    );
  }
  showAddForm = false;

newSupplier: Supplier = {
  id: 0,
  name: '',
  mail: '',
  phone: '',
  adress: '',
  amountDue: 0
};

toggleAddForm(): void {
  this.showAddForm = !this.showAddForm;
}

addSupplier(): void {
  if (!this.newSupplier.name) return;
  this.supplierService.create(this.newSupplier).subscribe({
    next: (supplier) => {
      this.items.push(supplier);
      this.resetNewSupplier();
      this.showAddForm = false;
    },
    error: (err) => console.error('Erreur ajout fournisseur', err)
  });
}

resetNewSupplier(): void {
  this.newSupplier = { id: 0, name: '', mail: '', phone: '', adress: '', amountDue: 0 };
}

  startEdit(item: Supplier): void {
    this.editingId = item.id;
    this.editItem = { ...item }; // clone
  }

  cancelEdit(): void {
    this.editingId = null;
  }

  saveEdit(): void {
    if (!this.editItem.id) return;
    this.supplierService.update(this.editItem.id, this.editItem).subscribe({
      next: (updated: Supplier) => {
        const index = this.items.findIndex(i => i.id === updated.id);
        if (index !== -1) this.items[index] = updated;
        this.editingId = null;
      },
      error: (err: any) => console.error('Erreur mise à jour fournisseur', err)
    });
  }
}