import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Interface pour une notification
interface NotificationItem {
  id: number;
  icon: string;
  message: string;
  time: string;
  read: boolean;
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.html',
  styleUrls: ['./notifications.css']
})
export class NotificationsComponent {
  notifications: NotificationItem[] = [
    {
      id: 1,
      icon: '📦',
      message: 'Nouvelle commande #1245 de Client Alpha',
      time: 'Il y a 10 minutes',
      read: false
    },
    {
      id: 2,
      icon: '✅',
      message: 'Paiement reçu pour la facture #089',
      time: 'Il y a 30 minutes',
      read: false
    },
    {
      id: 3,
      icon: '⚠️',
      message: 'Stock faible : Produit "Tissu coton"',
      time: 'Il y a 2 heures',
      read: true
    },
    {
      id: 4,
      icon: '👤',
      message: 'Nouvel utilisateur inscrit : Jean Martin',
      time: 'Hier',
      read: true
    }
  ];

  marquerCommeLue(id: number): void {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) notif.read = true;
  }

  toutMarquerCommeLu(): void {
    this.notifications.forEach(n => n.read = true);
  }

  get nombreNonLues(): number {
    return this.notifications.filter(n => !n.read).length;
  }
}