import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
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
    MatListModule
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly taskService = inject(TaskService);
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  // Signals para estado reativo
  tasks = signal<Task[]>([]);
  loading = signal<boolean>(false);
  currentUser = signal<User | null>(null);
  
  // Form para filtros
  filterForm: FormGroup;
  
  // Computed values
  completedTasks = computed(() => 
    this.tasks().filter(task => task.completed).length
  );
  
  pendingTasks = computed(() => 
    this.tasks().filter(task => !task.completed).length
  );
  
  totalTasks = computed(() => this.tasks().length);

  // Opções para filtros
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
    this.loadCurrentUser();
    this.loadTasks();
    this.subscribeToTasksState();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carrega o usuário atual
   */
  private loadCurrentUser(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser.set(user);
      });
  }

  /**
   * Carrega as tarefas com filtros aplicados
   */
  loadTasks(): void {
    const filters: TaskFilters = {
      ...this.filterForm.value,
      page: 1,
      limit: 50
    };

    // Remove campos vazios
    Object.keys(filters).forEach(key => {
      if (filters[key as keyof TaskFilters] === '' || 
          filters[key as keyof TaskFilters] === null) {
        delete filters[key as keyof TaskFilters];
      }
    });

    this.taskService.getTasks(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.tasks.set(response.data);
          }
        },
        error: (error) => {
          console.error('Erro ao carregar tarefas:', error);
        }
      });
  }

  /**
   * Subscreve ao estado das tarefas no serviço
   */
  private subscribeToTasksState(): void {
    this.taskService.tasks$
      .pipe(takeUntil(this.destroy$))
      .subscribe(tasks => {
        this.tasks.set(tasks);
      });

    this.taskService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.loading.set(loading);
      });
  }

  /**
   * Configura a subscription para mudanças nos filtros
   */
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

  /**
   * Toggle do status da tarefa
   */
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

  /**
   * Remove uma tarefa
   */
  deleteTask(task: Task): void {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      const taskId = task.id || task._id!;
      
      this.taskService.deleteTask(taskId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.status === 'success') {
              console.log('Tarefa removida com sucesso!');
            }
          },
          error: (error) => {
            console.error('Erro ao remover tarefa:', error);
          }
        });
    }
  }

  /**
   * Limpa todos os filtros
   */
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

  /**
   * Faz logout do usuário
   */
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

  /**
   * Retorna a cor da prioridade
   */
  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high': return 'warn';
      case 'medium': return 'accent';
      case 'low': return 'primary';
      default: return '';
    }
  }

  /**
   * Retorna o ícone da prioridade
   */
  getPriorityIcon(priority: string): string {
    switch (priority) {
      case 'high': return 'priority_high';
      case 'medium': return 'remove';
      case 'low': return 'low_priority';
      default: return 'help';
    }
  }

  /**
   * Formata a data
   */
  formatDate(date: string | Date): string {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('pt-BR');
  }
}