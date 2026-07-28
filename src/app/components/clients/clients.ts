import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../core/services/client';
import { Client } from '../../core/models/client';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clients.html',
  styleUrls: ['./clients.css']
})
export class ClientsComponent implements OnInit {
  items: Client[] = [];
  searchTerm = '';
  editingId: number | null = null;
  editItem: Client = {} as Client;
  editProjectIds: string = '';

  // Pour l'ajout
  showAddForm = false;
  newProjectIds: string = '';   
  newClient: Client = {
    id: 0,
    name: '',
    email: '',
    phone: '',
    company: '',
    domain: '',
    projectid: []
  };

  constructor(private clientService: ClientService) {}   // ← injection nommée clientService

  ngOnInit(): void {
    this.clientService.getAll().subscribe({
      next: (data: Client[]) => (this.items = data),
      error: (err: any) => console.error('Erreur chargement clients', err)
    });
  }

  // Filtre
  get filteredItems(): Client[] {
    if (!this.searchTerm.trim()) return this.items;
    const term = this.searchTerm.toLowerCase();
    return this.items.filter(item =>
      item.name.toLowerCase().includes(term) ||
      item.company?.toLowerCase().includes(term) ||
      item.domain?.toLowerCase().includes(term)
    );
  }

  // ---------- AJOUT ----------
  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
  }

  addClient(): void {
    if (!this.newClient.name) return;

    // Convertit la chaîne des IDs projets en tableau de nombres
    if (this.newProjectIds.trim()) {
      this.newClient.projectid = this.newProjectIds
        .split(',')
        .map(s => +s.trim())
        .filter(n => !isNaN(n));
    } else {
      this.newClient.projectid = [];
    }

    this.clientService.create(this.newClient).subscribe({
      next: (client: Client) => {
        this.items.push(client);
        this.resetNewClient();
        this.showAddForm = false;
      },
      error: (err: any) => console.error('Erreur ajout client', err)
    });
  }

  resetNewClient(): void {
    this.newClient = {
      id: 0,
      name: '',
      email: '',
      phone: '',
      company: '',
      domain: '',
      projectid: []
    };
    this.newProjectIds = '';
  }

  // ---------- ÉDITION ----------
  startEdit(item: Client): void {
    this.editingId = item.id;
    this.editItem = { ...item };
    this.editProjectIds = item.projectid ? item.projectid.join(',') : '';
  }

  cancelEdit(): void {
    this.editingId = null;
  }

  saveEdit(): void {
    if (!this.editItem.id) return;

    // Convertit la chaîne des IDs projets en tableau de nombres
    if (this.editProjectIds.trim()) {
      this.editItem.projectid = this.editProjectIds
        .split(',')
        .map(s => +s.trim())
        .filter(n => !isNaN(n));
    } else {
      this.editItem.projectid = [];
    }

    this.clientService.update(this.editItem.id, this.editItem).subscribe({
      next: (updated: Client) => {
        const index = this.items.findIndex(i => i.id === updated.id);
        if (index !== -1) this.items[index] = updated;
        this.editingId = null;
      },
      error: (err: any) => console.error('Erreur mise à jour client', err)
    });
  }
}