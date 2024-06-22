import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Language } from 'src/app/_models/language';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  public selectedLanguage: string | undefined = 'en';

  constructor(
    private bsModalRef: BsModalRef,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.selectedLanguage = this.translateService.currentLang;
  }

  public close() {
    this.selectedLanguage = undefined;
    this.bsModalRef.hide()
  }

  public submit() {
    this.bsModalRef.hide()
  }

  public selectLanguage(language: Language) {
    this.selectedLanguage = language;
    this.translateService.use(this.selectedLanguage);
    localStorage.setItem('datingAppLanguage', JSON.stringify(this.selectedLanguage));
  }
}
