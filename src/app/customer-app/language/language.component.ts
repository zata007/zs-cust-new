import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../shared/services/data.service';
import { IProfileData } from '../../shared/models/common-model';
import { ZATAAKSE_PROFILE_DATA, ZATAAKSE_PREF_LANG } from '../../shared/constants/constants';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss']
})
export class LanguageComponent implements OnInit {
  profile : IProfileData = null;
  selectedLanguage: string;
  updateProfile: any = [];
  profileForm: FormGroup;
  langs: Array<{value: String; viewValue: String}> = [
    {value: 'en', viewValue: 'English'},
    {value: 'hi', viewValue: 'Hindi'},
    {value: 'bn', viewValue: 'Bengali'},
    {value: 'mr', viewValue: 'Marathi'},
    {value: 'gu', viewValue: 'Bengali'}
  ]

  constructor(
    private router: Router,
    private dataService: DataService,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.profileForm = new FormGroup ({
      language: new FormControl(''),
    })

    if(localStorage.getItem(ZATAAKSE_PROFILE_DATA)) {
      this.profile = JSON.parse(localStorage.getItem(ZATAAKSE_PROFILE_DATA));
    }
  }

  onBackClick() {
    this.router.navigate(['/customer'])
  }

  language() {
    this.updateProfile = {
      indLanPref: this.profileForm.value['language']
    }

    this.translate.setDefaultLang(this.updateProfile.indLanPref);
    this.translate.use(this.updateProfile.indLanPref);
    localStorage.setItem(ZATAAKSE_PREF_LANG, this.updateProfile.indLanPref);

    if(this.profile) {
      this.dataService.updateProfile(this.updateProfile).subscribe((res:any) => {
        this.snackBar.open(res.message)
      });
    }
  }

}
