import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeService } from '../../core/services/employe';
import { Employe } from '../../core/models/employe';

@Component({
  selector: 'app-employes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employes.html',
  styleUrls: ['./employes.css']
})
export class EmployesComponent implements OnInit {
  items: Employe[] = [];
  searchTerm = '';
  editingId: number | null = null;
  editItem: Employe = {} as Employe;

  
  showAddForm = false;
  newEmploye: Employe = {
    id: 0,
    name: '',
    salary: 0,
    mail: '',
    position: '',
    projectId: 0
  };

  constructor(private employeService: EmployeService) {} // ← nom cohérent

  ngOnInit(): void {
    this.employeService.getAll().subscribe({
      next: (data: Employe[]) => (this.items = data),
      error: (err: any) => console.error('Erreur chargement employés', err)
    });
  }

  get filteredItems(): Employe[] {
    if (!this.searchTerm.trim()) return this.items;
    const term = this.searchTerm.toLowerCase();
    return this.items.filter(emp =>
      emp.name.toLowerCase().includes(term) ||
      emp.position.toLowerCase().includes(term) ||
      emp.mail.toLowerCase().includes(term)
    );
  }

  // ---------- AJOUT ----------
  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
  }

  addEmploye(): void {
    if (!this.newEmploye.name) return;
    this.employeService.create(this.newEmploye).subscribe({
      next: (created: Employe) => {
        this.items.push(created);
        this.resetNewEmploye();
        this.showAddForm = false;
      },
      error: (err: any) => console.error('Erreur ajout employé', err)
    });
  }

  resetNewEmploye(): void {
    this.newEmploye = {
      id: 0,
      name: '',
      salary: 0,
      mail: '',
      position: '',
      projectId: 0
    };
  }

  // ---------- ÉDITION ----------
  startEdit(item: Employe): void {
    this.editingId = item.id;
    this.editItem = { ...item };
  }

  cancelEdit(): void {
    this.editingId = null;
  }

  saveEdit(): void {
    if (!this.editItem.id) return;
    this.employeService.update(this.editItem.id, this.editItem).subscribe({
      next: (updated: Employe) => {
        const index = this.items.findIndex(i => i.id === updated.id);
        if (index !== -1) this.items[index] = updated;
        this.editingId = null;
      },
      error: (err: any) => console.error('Erreur mise à jour employé', err)
    });
  }
}