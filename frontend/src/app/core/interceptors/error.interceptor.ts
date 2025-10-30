import { Injectable } from '@angular/core';
import { 
  HttpInterceptor, 
  HttpRequest, 
  HttpHandler, 
  HttpEvent,
  HttpErrorResponse 
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = this.getErrorMessage(error);
        
        console.error('HTTP Error:', {
          status: error.status,
          message: errorMessage,
          url: request.url,
          error: error.error
        });
        
        return throwError(() => ({
          ...error,
          userMessage: errorMessage
        }));
      })
    );
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.';
    }
    
    if (error.status >= 500) {
      return 'Erro interno do servidor. Tente novamente mais tarde.';
    }
    
    if (error.status === 401) {
      return 'Sessão expirada. Faça login novamente.';
    }
    
    if (error.status === 403) {
      return 'Você não tem permissão para realizar esta ação.';
    }
    
    if (error.status === 404) {
      return 'Recurso não encontrado.';
    }
    
    if (error.status === 400) {
      if (error.error?.errors?.length > 0) {
        return error.error.errors.map((err: any) => err.message || err.msg).join(', ');
      }
      
      return error.error?.message || 'Dados inválidos fornecidos.';
    }
    
    if (error.status === 409) {
      return error.error?.message || 'Conflito de dados. O recurso já existe.';
    }
    
    if (error.status === 408) {
      return 'Tempo limite excedido. Tente novamente.';
    }
    
    return error.error?.message || 'Ocorreu um erro inesperado. Tente novamente.';
  }
}