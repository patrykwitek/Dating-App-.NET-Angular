import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  busyRequestCount: number = 0;

  constructor(
    private spinnerService: NgxSpinnerService
  ) { }

  public busy() {
    this.busyRequestCount++;
    this.spinnerService.show(undefined, {
      type: 'line-spin-fade',
      bdColor: 'rbga(255,255,255,0)',
      color: 'rgb(62, 18, 91)'
    })
  }

  public idle() {
    this.busyRequestCount--;
    
    if (this.busyRequestCount <= 0) {
      this.busyRequestCount = 0;
      this.spinnerService.hide();
    }
  }
}
