import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../core/services/project';
import { Project } from '../../core/models/project';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project.html',
  styleUrls: ['./project.css']
})
export class ProjectsComponent implements OnInit {
  items: Project[] = [];
  searchTerm = '';
  editingId: number | null = null;
  editItem: Project = {} as Project;

  showAddForm = false;

  newProject: Project = {
    id: 0,
    name: '',
    startDate:  new Date(),
    endDate:  new Date(),
    employeeId: 0,
    clientId: 0,
    description: ''
  };

  constructor(private projectService: ProjectService) {} // <-- nom correct

  ngOnInit(): void {
    this.projectService.getAllProjects().subscribe({
      next: (data: Project[]) => (this.items = data),
      error: (err: any) => console.error('Erreur chargement projets', err)
    });
  }

  get filteredItems(): Project[] {
    if (!this.searchTerm.trim()) return this.items;
    const term = this.searchTerm.toLowerCase();
    return this.items.filter(item =>
      item.name.toLowerCase().includes(term) ||
      item.description?.toLowerCase().includes(term)
    );
  }

  // ---------- AJOUT ----------
  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
  }

  addProject(): void {
    if (!this.newProject.name) return;
    this.projectService.create(this.newProject).subscribe({
      next: (project: Project) => {
        this.items.push(project);
        this.resetNewProject();
        this.showAddForm = false;
      },
      error: (err: any) => console.error('Erreur ajout projet', err)
    });
  }

  resetNewProject(): void {
    this.newProject = {
      id: 0,
      name: '',
      startDate:  new Date(),
      endDate:  new Date(),
      employeeId: 0,
      clientId: 0,
      description: ''
    };
  }

  // ---------- ÉDITION ----------
  startEdit(item: Project): void {
    this.editingId = item.id;
    this.editItem = { ...item };
  }

  cancelEdit(): void {
    this.editingId = null;
  }

  saveEdit(): void {
    if (!this.editItem.id) return;
    this.projectService.update(this.editItem.id, this.editItem).subscribe({
      next: (updated: Project) => {
        const index = this.items.findIndex(i => i.id === updated.id);
        if (index !== -1) this.items[index] = updated;
        this.editingId = null;
      },
      error: (err: any) => console.error('Erreur mise à jour', err)
    });
  }
}