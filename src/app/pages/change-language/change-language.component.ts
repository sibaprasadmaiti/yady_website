import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-change-language',
  templateUrl: './change-language.component.html',
  styleUrls: ['./change-language.component.css']
})
export class ChangeLanguageComponent implements OnInit {
  logtoken = localStorage.getItem('LoginToken');
  user_type = Number(localStorage.getItem('user_type'));
  lang;
  message: any = "";

  constructor(private translateService: TranslateService) {
    // this.translateService.setDefaultLang('en');
    // this.translateService.use(localStorage.getItem('lang') || 'en');
  }

  ngOnInit() {
    this.lang = localStorage.getItem('lang') || 'en';
  }

  changeLang(lang: any){
    this.lang = lang;
  }
  changeLangSubmit(){
    localStorage.setItem('lang', this.lang);
    window.location.reload();
    // this.message = "Language change successfully.";
    // ($('#successMsg') as any).modal('show');
  }

}
