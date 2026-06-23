// src/app/app.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet],
    template: `
        <div class="app-container">
            <router-outlet></router-outlet>
        </div>
    `,
    styles: [`
        .app-container {
            min-height: 100vh;
            background: #f5f5f5;
        }
    `]
})
export class App {  // ← Exporte App pour le test
    title = 'renty-textil';
}