import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { 
  TaskService, 
  AuthService, 
  Task, 
  TaskFilters, 
  User 
} from '../../core';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatMenuModule,
    MatDividerModule,
    MatBadgeModule,
    MatListModule,
    MatDialogModule
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly taskService = inject(TaskService);
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly dialog = inject(MatDialog);
  private readonly http = inject(HttpClient);

  tasks = signal<Task[]>([]);
  loading = signal<boolean>(false);
  currentUser = signal<User | null>(null);

  filterForm: FormGroup;

  completedTasks = computed(() => 
    this.tasks().filter(task => task.completed).length
  );
  
  pendingTasks = computed(() => 
    this.tasks().filter(task => !task.completed).length
  );
  
  totalTasks = computed(() => this.tasks().length);

  priorityOptions = [
    { value: '', label: 'Todas as prioridades' },
    { value: 'low', label: 'Baixa' },
    { value: 'medium', label: 'Média' },
    { value: 'high', label: 'Alta' }
  ];

  statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'pending', label: 'Pendentes' },
    { value: 'completed', label: 'Concluídas' }
  ];

  sortOptions = [
    { value: 'createdAt', label: 'Data de criação' },
    { value: 'title', label: 'Título' },
    { value: 'priority', label: 'Prioridade' },
    { value: 'dueDate', label: 'Data de vencimento' }
  ];

  constructor() {
    this.filterForm = this.fb.group({
      search: [''],
      priority: [''],
      status: [''],
      category: [''],
      sortBy: ['createdAt'],
      sortOrder: ['DESC']
    });

    this.setupFilterSubscription();
  }

  ngOnInit(): void {
    console.log('🚀 TaskList component initialized');
    this.loadCurrentUser();
    
    setTimeout(() => {
      console.log('⏰ Calling loadTasks after timeout');
      this.forceLoadTasks();
    }, 1000);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

 
  private loadCurrentUser(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser.set(user);
      });
  }


  forceLoadTasks(): void {
    console.log('💪 FORCE LOADING TASKS');
    
    this.tasks.set([]);
    this.loading.set(true);
    
    const token = this.authService.getAccessToken();
    console.log('🔑 Token exists:', !!token);
    
    if (!token) {
      console.error('❌ No token found!');
      this.loading.set(false);
      return;
    }

    console.log('📡 Making direct HTTP call to load tasks');
    
    this.http.get<any>('http://localhost:3000/api/v2/tasks', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).subscribe({
      next: (response: any) => {
        console.log('✅ FORCE LOAD RESPONSE:', response);
        if (response.status === 'success' && response.data) {
          console.log('📝 Setting tasks from force load:', response.data.length, 'tasks');
          this.tasks.set(response.data);
        }
        this.loading.set(false);
      },
      error: (error: any) => {
        console.error('❌ FORCE LOAD ERROR:', error);
        this.loading.set(false);
      }
    });
  }

  loadTasks(): void {
    console.log('📋 LoadTasks called - FORÇANDO CARREGAMENTO');
    
    
    this.tasks.set([]);
    this.loading.set(true);
    
    const filters: TaskFilters = {
      page: 1,
      limit: 50
    };

    console.log('🔍 Filters:', filters);
    console.log('🌐 Making direct HTTP request to get tasks');

    const token = this.authService.getAccessToken();
    console.log('🔑 Token exists:', !!token);
    
    if (!token) {
      console.error('❌ No token found!');
      this.loading.set(false);
      return;
    }

    import('@angular/common/http').then(({ HttpHeaders }) => {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });

      console.log('� Making direct HTTP call');
      
      this.http.get<any>('http://localhost:3000/api/v2/tasks', { headers })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            console.log('✅ DIRECT HTTP RESPONSE:', response);
            if (response.status === 'success' && response.data) {
              console.log('📝 Setting tasks directly:', response.data);
              this.tasks.set(response.data);
            } else {
              console.warn('⚠️ Response não tem data:', response);
            }
            this.loading.set(false);
          },
          error: (error) => {
            console.error('❌ DIRECT HTTP ERROR:', error);
            this.loading.set(false);
          }
        });
    });
  }

  private subscribeToTasksState(): void {
    console.log('🔗 Subscribing to tasks state');
    this.taskService.tasks$
      .pipe(takeUntil(this.destroy$))
      .subscribe(tasks => {
        console.log('📨 Tasks from service:', tasks);
        this.tasks.set(tasks);
      });

    this.taskService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        console.log('⏳ Loading state:', loading);
        this.loading.set(loading);
      });
  }

  
  private setupFilterSubscription(): void {
    this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.loadTasks();
      });
  }

  toggleTaskStatus(task: Task): void {
    this.taskService.toggleTaskStatus(task)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.status === 'success') {
            console.log('Status da tarefa alterado com sucesso!');
          }
        },
        error: (error) => {
          console.error('Erro ao alterar status da tarefa:', error);
        }
      });
  }

  editTask(task: Task): void {
    console.log('✏️ Editando tarefa:', task);
    
    const dialogRef = this.dialog.open(TaskCreateDialogComponent, {
      width: '500px',
      data: {
        title: 'Editar Tarefa',
        task: { ...task } 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('💾 Salvando alterações da tarefa:', result);
        
        const taskId = task.id || task._id!;
        const token = this.authService.getAccessToken();
        
        if (!token) {
          console.error('❌ Token não encontrado!');
          return;
        }

        this.http.put(`http://localhost:3000/api/v2/tasks/${taskId}`, result, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }).subscribe({
          next: (response: any) => {
            console.log('✅ Tarefa editada com sucesso:', response);
            this.forceLoadTasks();
          },
          error: (error) => {
            console.error('❌ Erro ao editar tarefa:', error);
          }
        });
      }
    });
  }

  deleteTask(task: Task): void {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      console.log('🗑️ Iniciando exclusão da tarefa:', task);
      
      const taskId = task.id || task._id!;
      const token = this.authService.getAccessToken();
      
      console.log('🔑 TaskID:', taskId);
      console.log('🔑 Token exists:', !!token);
      
      if (!token) {
        console.error('❌ Token não encontrado!');
        return;
      }

      console.log('🌐 Fazendo DELETE para:', `http://localhost:3000/api/v2/tasks/${taskId}`);
      
      this.http.delete(`http://localhost:3000/api/v2/tasks/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).subscribe({
        next: (response: any) => {
          console.log('✅ Tarefa excluída com sucesso:', response);
          console.log('🔄 Recarregando lista de tarefas...');
          this.forceLoadTasks();
        },
        error: (error) => {
          console.error('❌ Erro ao excluir tarefa:', error);
          console.error('📄 Error details:', error.error);
          alert('Erro ao excluir tarefa: ' + (error.error?.message || error.message));
        }
      });
    }
  }

  clearFilters(): void {
    this.filterForm.reset({
      search: '',
      priority: '',
      status: '',
      category: '',
      sortBy: 'createdAt',
      sortOrder: 'DESC'
    });
  }

  logout(): void {
    this.authService.logout()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          console.log('Logout realizado com sucesso!');
        },
        error: () => {
          console.log('Logout realizado!');
        }
      });
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high': return 'warn';
      case 'medium': return 'accent';
      case 'low': return 'primary';
      default: return '';
    }
  }

  getPriorityIcon(priority: string): string {
    switch (priority) {
      case 'high': return 'priority_high';
      case 'medium': return 'remove';
      case 'low': return 'low_priority';
      default: return 'help';
    }
  }

  createTask(): void {
    const dialogRef = this.dialog.open(TaskCreateDialogComponent, {
      width: '500px',
      disableClose: true,
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('🚀 Creating task with data:', result);
        
     
        const token = this.authService.getAccessToken();
        if (!token) {
          console.error('❌ No token for creating task');
          return;
        }

        this.http.post<any>('http://localhost:3000/api/v2/tasks', result, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }).subscribe({
          next: (response: any) => {
            console.log('✅ Task created successfully:', response);
            if (response.status === 'success' && response.data) {
              const currentTasks = this.tasks();
              this.tasks.set([response.data, ...currentTasks]);
              console.log('📝 Task added to list, new count:', this.tasks().length);
            }
          },
          error: (error: any) => {
            console.error('❌ Error creating task:', error);
          }
        });
      }
    });
  }

  debugReloadTasks(): void {
    console.log('🔄 DEBUG: Forçando reload das tarefas');
    console.log('🔑 Current token:', this.authService.getAccessToken());
    console.log('👤 Current user:', this.currentUser());
    
    this.tasks.set([]);
    this.loading.set(true);
    
    setTimeout(() => {
      this.loadTasks();
    }, 100);
  }

  formatDate(date: string | Date): string {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('pt-BR');
  }
}


@Component({
  selector: 'app-task-create-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule
  ],
  template: `
    <div class="task-dialog">
      <h2 mat-dialog-title>{{ data?.title || 'Nova Tarefa' }}</h2>
      
      <mat-dialog-content>
        <form [formGroup]="taskForm" class="task-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Título</mat-label>
            <input matInput formControlName="title" placeholder="Digite o título da tarefa">
            <mat-error *ngIf="taskForm.get('title')?.hasError('required')">
              Título é obrigatório
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Descrição</mat-label>
            <textarea matInput formControlName="description" rows="3" placeholder="Descreva a tarefa"></textarea>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Prioridade</mat-label>
            <mat-select formControlName="priority">
              <mat-option value="low">Baixa</mat-option>
              <mat-option value="medium">Média</mat-option>
              <mat-option value="high">Alta</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Data de Vencimento</mat-label>
            <input matInput type="date" formControlName="dueDate">
          </mat-form-field>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">Cancelar</button>
        <button mat-raised-button color="primary" (click)="onSave()" [disabled]="taskForm.invalid">
          {{ isEditing ? 'Salvar' : 'Criar Tarefa' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .task-dialog {
      min-width: 450px;
    }
    
    .task-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px 0;
    }
    
    .full-width {
      width: 100%;
    }
    
    mat-dialog-content {
      padding: 0 24px !important;
    }
    
    mat-dialog-actions {
      padding: 16px 24px !important;
    }
  `]
})
export class TaskCreateDialogComponent {
  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<TaskCreateDialogComponent>);
  public data = inject(MAT_DIALOG_DATA);

  isEditing = !!this.data?.task; 

  taskForm = this.fb.group({
    title: [this.data?.task?.title || '', [Validators.required]],
    description: [this.data?.task?.description || ''],
    priority: [this.data?.task?.priority || 'medium'],
    dueDate: [this.data?.task?.dueDate ? this.formatDateForInput(this.data.task.dueDate) : '']
  });

  private formatDateForInput(date: string | Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      const taskData = {
        title: formValue.title!,
        description: formValue.description || undefined,
        priority: formValue.priority || 'medium',
        dueDate: formValue.dueDate || undefined
      };
      this.dialogRef.close(taskData);
    }
  }
}