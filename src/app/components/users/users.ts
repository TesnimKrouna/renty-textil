import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user';
import { User } from '../../core/models/user';

const AVAILABLE_TASKS: string[] = [
  'Gestion des produits',
  'Gestion des fournisseurs',
  'Gestion des commandes',
  'Suivi des salaires',
  'Rapport financier'
];

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrls: ['./users.css']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  searchTerm = '';
  selectedRole: User['role'] | '' = '';
  editingId: number | null = null;
  editUser: User = {} as User;
  editTasks: string[] = [];

  // Formulaire d'ajout
  showAddForm = false;
  newUser: User = {
    id: 0,
    name: '',
    email: '',
    role: 'PRODUCT_MANAGER',
    tasks: []
  };
  // Tâches cochées pour le nouvel utilisateur (tableau temporaire)
  newUserTasks: string[] = [];

  roles: User['role'][] = ['FINANCE_MANAGER', 'PRODUCT_MANAGER'];
  availableTasks = AVAILABLE_TASKS;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getAll().subscribe({
      next: (data: User[]) => (this.users = data),
      error: (err: any) => console.error('Erreur chargement utilisateurs', err)
    });
  }

  get filteredUsers(): User[] {
    let result = this.users;
    if (this.selectedRole) {
      result = result.filter(u => u.role === this.selectedRole);
    }
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(u =>
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        u.role.toLowerCase().includes(term)
      );
    }
    return result;
  }

  // ---------- AJOUT ----------
  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
  }

  onNewUserTaskChange(task: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.newUserTasks.push(task);
    } else {
      this.newUserTasks = this.newUserTasks.filter(t => t !== task);
    }
  }

  addUser(): void {
    if (!this.newUser.name || !this.newUser.email) return;
    this.newUser.tasks = [...this.newUserTasks]; // assigne les tâches cochées
    this.userService.create(this.newUser).subscribe({
      next: (created: User) => {
        this.users.push(created);
        this.resetNewUser();
        this.showAddForm = false;
      },
      error: (err: any) => console.error('Erreur ajout utilisateur', err)
    });
  }

  resetNewUser(): void {
    this.newUser = {
      id: 0,
      name: '',
      email: '',
      role: 'PRODUCT_MANAGER',
      tasks: []
    };
    this.newUserTasks = [];
  }

  // ---------- ÉDITION INLINE ----------
  startEdit(user: User): void {
    this.editingId = user.id;
    this.editUser = { ...user };
    this.editTasks = user.tasks ? [...user.tasks] : [];
  }

  cancelEdit(): void {
    this.editingId = null;
  }

  onEditTaskChange(task: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.editTasks.push(task);
    } else {
      this.editTasks = this.editTasks.filter(t => t !== task);
    }
  }

  saveEdit(): void {
    if (!this.editUser.id) return;
    this.editUser.tasks = [...this.editTasks];
    this.userService.update(this.editUser.id, this.editUser).subscribe({
      next: (updated: User) => {
        const index = this.users.findIndex(u => u.id === updated.id);
        if (index !== -1) this.users[index] = updated;
        this.editingId = null;
      },
      error: (err: any) => console.error('Erreur mise à jour', err)
    });
  }
}