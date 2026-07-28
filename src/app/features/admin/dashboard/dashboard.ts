import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth'; // adapte le chemin

// Importe tous les composants standalone
import { ProductsComponent } from '../../../components/products/products';
import { ProjectsComponent } from '../../../components/project/project';
import { Suppliers } from '../../../components/suppliers/suppliers';
import { ClientsComponent } from '../../../components/clients/clients';
import { CreditsComponent } from '../../../components/credits/credits';
import { UsersComponent } from '../../../components/users/users';
import { EmployesComponent } from '../../../components/employes/employes';
import { InvoiceComponent } from '../../../components/invoice/invoice';
import { ProfileComponent } from '../../../components/profile/profile';
import { NotificationsComponent } from '../../../components/notifications/notifications';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProductsComponent,
    ProjectsComponent,
    Suppliers,
    ClientsComponent,
    CreditsComponent,
    UsersComponent,
    EmployesComponent,
    InvoiceComponent,
    ProfileComponent,        
    NotificationsComponent 
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  selectedSection = 'products';
  sidebarOpen = true;
  searchQuery = '';
  showProfileMenu = false;
  showNotificationsPanel = false;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.canShow(this.selectedSection)) {
      this.selectFirstAvailableSection();
    }
  }



  canShow(section: string): boolean {
    const user = this.authService.getCurrentUser();
    if (!user) return false;
    switch (section) {
      case 'products':
        return user.role === 'ADMIN' || user.role === 'PRODUCT_MANAGER';
      case 'projects':
        return user.role === 'ADMIN' || user.role === 'PRODUCT_MANAGER' || user.role === 'FINANCE_MANAGER';
      case 'suppliers':
        return user.role === 'ADMIN' || user.role === 'PRODUCT_MANAGER';
      case 'clients':
        return user.role === 'ADMIN' || user.role === 'FINANCE_MANAGER';
      case 'credits':
        return user.role === 'ADMIN' || user.role === 'FINANCE_MANAGER';
      case 'employes':
        return user.role === 'ADMIN' || user.role === 'FINANCE_MANAGER';
      case 'users':
        return user.role === 'ADMIN';
      case 'invoice':
        return user.role === 'ADMIN';
        case 'profile':
  return true; 
case 'notifications':
  return true;
      default:
        return false;
    }
  }

  show(section: string): void {
    if (this.canShow(section)) {
      this.selectedSection = section;
    }
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onSearch(): void {
    const query = this.searchQuery.trim().toLowerCase();
    const sectionMap: { [key: string]: string } = {
      'produit': 'products',
      'produits': 'products',
      'projet': 'projects',
      'projets': 'projects',
      'fournisseur': 'suppliers',
      'fournisseurs': 'suppliers',
      'client': 'clients',
      'clients': 'clients',
      'crédit': 'credits',
      'credits': 'credits',
      'employé': 'employes',
      'employes': 'employes',
      'employe': 'employes',
      'utilisateur': 'users',
      'utilisateurs': 'users',
      'facture': 'invoice',
      'factures': 'invoice'
    };

    const section = sectionMap[query];
    if (section) {
      this.show(section);
    }
    this.searchQuery = '';
  }

  toggleProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
    if (this.showProfileMenu) this.showNotificationsPanel = false;
  }

  toggleNotifications(): void {
    this.showNotificationsPanel = !this.showNotificationsPanel;
    if (this.showNotificationsPanel) this.showProfileMenu = false;
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  private selectFirstAvailableSection(): void {
    const sections = ['products', 'projects', 'suppliers', 'clients', 'credits', 'employes', 'users', 'invoice'];
    const first = sections.find(s => this.canShow(s));
    if (first) {
      this.selectedSection = first;
    }
  }
}