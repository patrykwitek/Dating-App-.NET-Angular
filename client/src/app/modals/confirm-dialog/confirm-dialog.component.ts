import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
  title: string = '';
  message: string = '';
  btnOkText: string = '';
  btnCancelText: string = '';
  result: boolean = false;

  constructor(
    public bsModalRef: BsModalRef
  ) {}

  public confirm() {
    this.result = true;
    this.bsModalRef.hide();
  }

  public decline() {
    this.bsModalRef.hide();
  }
}
