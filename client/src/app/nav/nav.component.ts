import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Observable, of } from 'rxjs';
import { User } from '../_models/user';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SettingsComponent } from '../modals/settings/settings.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  model: any = {};
  showDropdownMenu = false;
  bsModalRef: BsModalRef<SettingsComponent> = new BsModalRef<SettingsComponent>();

  constructor(
    public accountService: AccountService,
    private router: Router,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private translateService: TranslateService
  ) { }

  login() {
    this.accountService.login(this.model).subscribe({
      next: () => {
        this.router.navigateByUrl('/members');
      }
    });

    this.showDropdownMenu = false;
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
    this.showDropdownMenu = false;
  }

  toggleDropdownMenu(): void {
    this.showDropdownMenu = !this.showDropdownMenu;
    this.changeDropdownIcon();
  }

  clickOutside(): void {
    this.showDropdownMenu = false;
    this.changeDropdownIcon();
  }

  chooseMenuOption(): void {
    this.showDropdownMenu = false;
  }

  openSettings(): void {
    this.chooseMenuOption();
    const config = {
      class: 'modal-dialog-centered'
    };

    this.bsModalRef = this.modalService.show(SettingsComponent, config);
  }

  changeDropdownIcon() {
    const icon: Element | null = document.querySelector(".icon");

    if (icon !== null) {
      if (this.showDropdownMenu) {
        icon.innerHTML = "keyboard_arrow_up";
      }
      else {
        icon.innerHTML = "keyboard_arrow_down";
      }
    }
  }
}
