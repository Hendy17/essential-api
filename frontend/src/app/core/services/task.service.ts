import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, map, tap, catchError, throwError } from 'rxjs';
import { 
  Task, 
  CreateTaskRequest, 
  UpdateTaskRequest, 
  TaskFilters, 
  TasksResponse, 
  TaskStats,
  ApiResponse 
} from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl;
  
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();
  
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

 
  getTasks(filters?: TaskFilters): Observable<TasksResponse> {
    console.log('🌐 TaskService.getTasks called with filters:', filters);
    this.setLoading(true);
    
    let params = new HttpParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }

    console.log('📡 Making request to:', `${this.API_URL}/v2/tasks`);
    console.log('🔐 With params:', params.toString());

    return this.http.get<TasksResponse>(`${this.API_URL}/v2/tasks`, { params })
      .pipe(
        tap(response => {
          console.log('📥 Raw API response:', response);
          if (response.status === 'success') {
            console.log('💾 Updating tasks subject with:', response.data);
            this.tasksSubject.next(response.data);
          }
          this.setLoading(false);
        }),
        catchError(error => {
          console.error('❌ Error in getTasks:', error);
          this.setLoading(false);
          return this.handleError(error);
        })
      );
  }

  getTaskById(id: string): Observable<ApiResponse<Task>> {
    return this.http.get<ApiResponse<Task>>(`${this.API_URL}/v2/tasks/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  createTask(taskData: CreateTaskRequest): Observable<ApiResponse<Task>> {
    this.setLoading(true);
    
    return this.http.post<ApiResponse<Task>>(`${this.API_URL}/v2/tasks`, taskData)
      .pipe(
        tap(response => {
          if (response.status === 'success' && response.data) {
            this.addTaskToLocal(response.data);
          }
          this.setLoading(false);
        }),
        catchError(error => {
          this.setLoading(false);
          return this.handleError(error);
        })
      );
  }

  updateTask(id: string, taskData: UpdateTaskRequest): Observable<ApiResponse<Task>> {
    this.setLoading(true);
    
    return this.http.put<ApiResponse<Task>>(`${this.API_URL}/v2/tasks/${id}`, taskData)
      .pipe(
        tap(response => {
          if (response.status === 'success' && response.data) {
            this.updateTaskInLocal(response.data);
          }
          this.setLoading(false);
        }),
        catchError(error => {
          this.setLoading(false);
          return this.handleError(error);
        })
      );
  }

  deleteTask(id: string): Observable<ApiResponse<any>> {
    this.setLoading(true);
    
    return this.http.delete<ApiResponse<any>>(`${this.API_URL}/v2/tasks/${id}`)
      .pipe(
        tap(response => {
          if (response.status === 'success') {
            this.removeTaskFromLocal(id);
          }
          this.setLoading(false);
        }),
        catchError(error => {
          this.setLoading(false);
          return this.handleError(error);
        })
      );
  }

  completeTask(id: string): Observable<ApiResponse<Task>> {
    this.setLoading(true);
    
    return this.http.patch<ApiResponse<Task>>(`${this.API_URL}/v2/tasks/${id}/complete`, {})
      .pipe(
        tap(response => {
          if (response.status === 'success' && response.data) {
            this.updateTaskInLocal(response.data);
          }
          this.setLoading(false);
        }),
        catchError(error => {
          this.setLoading(false);
          return this.handleError(error);
        })
      );
  }

  uncompleteTask(id: string): Observable<ApiResponse<Task>> {
    this.setLoading(true);
    
    return this.http.patch<ApiResponse<Task>>(`${this.API_URL}/v2/tasks/${id}/uncomplete`, {})
      .pipe(
        tap(response => {
          if (response.status === 'success' && response.data) {
            this.updateTaskInLocal(response.data);
          }
          this.setLoading(false);
        }),
        catchError(error => {
          this.setLoading(false);
          return this.handleError(error);
        })
      );
  }

  getTaskStats(): Observable<ApiResponse<TaskStats>> {
    return this.http.get<ApiResponse<TaskStats>>(`${this.API_URL}/v2/tasks/stats`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getOverdueTasks(): Observable<TasksResponse> {
    return this.http.get<TasksResponse>(`${this.API_URL}/v2/tasks/overdue`)
      .pipe(
        catchError(this.handleError)
      );
  }

  toggleTaskStatus(task: Task): Observable<ApiResponse<Task>> {
    return task.completed 
      ? this.uncompleteTask(task.id || task._id!)
      : this.completeTask(task.id || task._id!);
  }

  clearTasks(): void {
    this.tasksSubject.next([]);
  }

  private addTaskToLocal(task: Task): void {
    const currentTasks = this.tasksSubject.value;
    this.tasksSubject.next([task, ...currentTasks]);
  }

  private updateTaskInLocal(updatedTask: Task): void {
    const currentTasks = this.tasksSubject.value;
    const taskId = updatedTask.id || updatedTask._id;
    
    const updatedTasks = currentTasks.map(task => 
      (task.id === taskId || task._id === taskId) ? updatedTask : task
    );
    
    this.tasksSubject.next(updatedTasks);
  }

  private removeTaskFromLocal(taskId: string): void {
    const currentTasks = this.tasksSubject.value;
    const filteredTasks = currentTasks.filter(task => 
      task.id !== taskId && task._id !== taskId
    );
    
    this.tasksSubject.next(filteredTasks);
  }

  private setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  private handleError = (error: any): Observable<never> => {
    console.error('Task Service Error:', error);
    
    let errorMessage = 'Ocorreu um erro inesperado';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return throwError(() => ({ ...error, userMessage: errorMessage }));
  };
}