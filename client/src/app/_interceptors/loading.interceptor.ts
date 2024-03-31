import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, delay, finalize } from 'rxjs';
import { BusyService } from '../_services/busy.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  // note: wykonuje sięza każdym razem, gdy jest wysyłane żądanie na serwer

  constructor(
    private busyService: BusyService
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.busyService.busy()

    return next.handle(request).pipe(
      delay(1000), finalize(() => {
        this.busyService.idle();
      })
    );
  }
}
