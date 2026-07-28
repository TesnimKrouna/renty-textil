import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../models/project';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private apiUrl =environment.apiUrl + '/project'; // adapte l'URL à ton backend

  constructor(private http: HttpClient) {}

  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }
  update(id: number, project: Project): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/${id}`, project);
  }

  create(project: Project): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, project);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
}