import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-successful-registration',
  templateUrl: './successful-registration.component.html',
  styleUrls: ['./successful-registration.component.scss']
})
export class SuccessfulRegistrationComponent implements OnInit {

  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer, private router: Router) {
    this.matIconRegistry.addSvgIcon(
      'success_check',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/img/core/checked.svg')
    );
   }

  ngOnInit() {
  }

  onSubmitButtonClick(){
    this.router.navigate(['/customer']);

  }

}
