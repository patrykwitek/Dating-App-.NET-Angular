import { Component, OnInit } from '@angular/core';
import { AccountService } from './_services/account.service';
import { User } from './_models/user';
import { TranslateService } from '@ngx-translate/core';
import { Language } from './_models/language';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private accoutService: AccountService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.setCurrentUser();
    this.translateService.setDefaultLang('en');

    const languageString = localStorage.getItem('datingAppLanguage');
    if (!languageString) {
      this.translateService.use('en');
    }
    else {
      const language: Language = JSON.parse(languageString);
      this.translateService.use(language);
    }

  }

  setCurrentUser() {
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user: User = JSON.parse(userString);
    this.accoutService.setCurrentUser(user);
  }
}
