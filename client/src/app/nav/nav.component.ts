import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Observable, of } from 'rxjs';
import { User } from '../_models/user';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  model: any = {};
  showDropdownMenu = false;

  constructor(public accountService: AccountService) { }

  ngOnInit(): void {
  }

  login() {
    this.accountService.login(this.model).subscribe({
      next: response => {
      },
      error: error => console.error(error)
    })
  }

  logout() {
    this.accountService.logout();
  }

  toggleDropdownMenu(): void {
    this.showDropdownMenu = !this.showDropdownMenu;
    this.changeDropdownIcon();
  }

  clickOutside(): void {
    this.showDropdownMenu = false;
    this.changeDropdownIcon();
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
