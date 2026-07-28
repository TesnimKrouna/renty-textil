import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product';
import { Product } from '../../core/models/product';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrls: ['./products.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  searchTerm = '';
  editingId: number | null = null;
  editProduct: Product = {} as Product;

  showAddForm = false;

  newProduct: Product = {
    id: 0,
    name: '',
    price: 0,
    stock: 0,
    description: '',
    image: ''
  };

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => (this.products = data),
      error: (err) => console.error('Erreur chargement produits', err)
    });
  }

  get filteredProducts(): Product[] {
    if (!this.searchTerm.trim()) return this.products;
    const term = this.searchTerm.toLowerCase();
    return this.products.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.description?.toLowerCase().includes(term)
    );
  }

  // ---------- AJOUT ----------
  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
  }

  addProduct(): void {
    if (!this.newProduct.name) return;
    this.productService.createProduct(this.newProduct).subscribe({
      next: (product) => {
        this.products.push(product);
        this.resetNewProduct();
        this.showAddForm = false;
      },
      error: (err) => console.error('Erreur ajout produit', err)
    });
  }

  resetNewProduct(): void {
    this.newProduct = {
      id: 0,
      name: '',
      price: 0,
      stock: 0,
      description: '',
      image: ''
    };
  }

  // ---------- ÉDITION ----------
  startEdit(product: Product): void {
    this.editingId = product.id;
    this.editProduct = { ...product };
  }

  cancelEdit(): void {
    this.editingId = null;
  }

  saveEdit(): void {
    if (!this.editProduct.id) return;
    this.productService.updateProduct(this.editProduct.id, this.editProduct).subscribe({
      next: (updated) => {
        const index = this.products.findIndex(p => p.id === updated.id);
        if (index !== -1) this.products[index] = updated;
        this.editingId = null;
      },
      error: (err) => console.error('Erreur mise à jour', err)
    });
  }
}