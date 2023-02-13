import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ITask } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private readonly API_URL = `${environment.apiURL}/tasks`;

  constructor(private http: HttpClient) { }

  getTasks(): Observable<Array<ITask>> {
    return this.http.get<Array<ITask>>(this.API_URL);
  }

  getTask(id: string): Observable<ITask> {
    return this.http.get<ITask>(`${this.API_URL}/${id}`);
  }

  addTask(task: ITask): Observable<any> {
    return this.http.post(this.API_URL, task);
  }

  editTask(task: any): Observable<any> {
    return this.http.put(`${this.API_URL}/${task.id}`, task);
  }

  deleteTast(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}
