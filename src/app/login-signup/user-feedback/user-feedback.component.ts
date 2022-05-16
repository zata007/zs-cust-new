import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { CookieService } from 'src/app/shared/services/cookie.service';
import { IAppState } from 'src/app/store/states/app.states';
import { Store, select } from '@ngrx/store';
import { questionData } from 'src/app/store/selectors/prelaunch.selectors';
import { QuesReply } from 'src/app/store/actions/prelaunch.actions';
import { SignIn } from 'src/app/store/actions/customer.actions';
//import { PrelaunchService } from 'src/app/pre-launch/prelaunch.service';
const questionSet = [
  {
    Question: 'SNACK_PAGE.QUESTION_1.LABEL',
    option: [
      { label: 'SNACK_PAGE.QUESTION_1.LABEL_A', value: '1a' },
      { label: 'SNACK_PAGE.QUESTION_1.LABEL_B', value: '1b' },
      { label: 'SNACK_PAGE.QUESTION_1.LABEL_C', value: '1c' },
      { label: 'SNACK_PAGE.QUESTION_1.LABEL_D', value: '1d' },
      { label: 'SNACK_PAGE.QUESTION_1.LABEL_E', value: '1e' }
    ]
  },
  {
    Question: 'SNACK_PAGE.QUESTION_2.LABEL',
    option: [
      { label: 'SNACK_PAGE.QUESTION_2.LABEL_A', value: '2a' },
      { label: 'SNACK_PAGE.QUESTION_2.LABEL_B', value: '2b' },
      { label: 'SNACK_PAGE.QUESTION_2.LABEL_C', value: '2c' },
      { label: 'SNACK_PAGE.QUESTION_2.LABEL_D', value: '2d' },
      { label: 'SNACK_PAGE.QUESTION_2.LABEL_E', value: '2e' }
    ]
  },
  {
    Question: 'SNACK_PAGE.QUESTION_3.LABEL',
    option: [
      { label: 'SNACK_PAGE.QUESTION_3.LABEL_A', value: '3a' },
      { label: 'SNACK_PAGE.QUESTION_3.LABEL_B', value: '3b' },
      { label: 'SNACK_PAGE.QUESTION_3.LABEL_C', value: '3c' },
      { label: 'SNACK_PAGE.QUESTION_3.LABEL_D', value: '3d' },
      { label: 'SNACK_PAGE.QUESTION_3.LABEL_E', value: '3e' }
    ]
  },
  {
    Question: 'SNACK_PAGE.QUESTION_4.LABEL',
    option: [
      { label: 'SNACK_PAGE.QUESTION_4.LABEL_A', value: '4a' },
      { label: 'SNACK_PAGE.QUESTION_4.LABEL_B', value: '4b' },
      { label: 'SNACK_PAGE.QUESTION_4.LABEL_C', value: '4c' },
      { label: 'SNACK_PAGE.QUESTION_4.LABEL_D', value: '4d' },
      { label: 'SNACK_PAGE.QUESTION_4.LABEL_E', value: '4e' }
    ]
  },
  {
    Question: 'SNACK_PAGE.QUESTION_5.LABEL',
    option: [
      { label: 'SNACK_PAGE.QUESTION_5.LABEL_A', value: '5a' },
      { label: 'SNACK_PAGE.QUESTION_5.LABEL_B', value: '5b' },
      { label: 'SNACK_PAGE.QUESTION_5.LABEL_C', value: '5c' },
      { label: 'SNACK_PAGE.QUESTION_5.LABEL_D', value: '5d' },
      { label: 'SNACK_PAGE.QUESTION_5.LABEL_E', value: '5e' }
    ]
  }
];
@Component({
  selector: 'app-user-feedback',
  templateUrl: './user-feedback.component.html',
  styleUrls: ['./user-feedback.component.scss']
})
export class UserFeedbackComponent implements OnInit {
  constructor(
    private matSnackBar: MatSnackBar,
    private router: Router,
    //private prelaunchService: PrelaunchService,
    private cookieService: CookieService,
    private store: Store<IAppState>
  ) {}
  selectedAnswer: string;
  answers = new Array(5);
  currentQuestion = questionSet[0].Question;
  currentOptions = questionSet[0].option;
  index = 0;
  totalPages = 5;
  selectedPanel = 'questionSet';
  isCompleted = false;

  mobileOTP = '';
  userMobileNumber = null;

  ngOnInit() {
    this.store.pipe(select(questionData)).subscribe(res => {
      this.index = res.curIndex;
      this.answers = [...res.data];
      this.setPageData();
    });

    //const { mobileNumber } = this.prelaunchService.getSignupData();
    //this.userMobileNumber = mobileNumber.slice(3);
  }

  radioChange(data: any) {
    // get the last page from the api
    if (this.index === this.totalPages) {
      return;
    }

    this.answers[this.index] = data.value;
    setTimeout(() => {
      this.index++;
      if (this.index < 5) {
        this.setPageData();
      } else {
        this.selectedPanel = 'lastQuestion';
      }
    }, 400);
  }

  onPrev() {
    if (this.index <= 0) {
      return;
    }
    this.index--;
    this.setPageData();
  }

  onNext() {
    if (!this.answers[this.index]) {
      this.matSnackBar.open('Please select one option');
      return;
    }
    if (this.index >= this.totalPages) {
      return;
    }
    this.index++;
    this.store.dispatch(
      new QuesReply({ curIndex: this.index, data: this.answers })
    );
    this.setPageData();
  }

  setPageData() {
    if (this.index > 4) {
      return;
    }
    this.selectedAnswer = this.answers[this.index];
    this.currentQuestion = questionSet[this.index].Question;
    this.currentOptions = questionSet[this.index].option;
  }

  onVerify() {
    //this.prelaunchService.verifyUser(this.answers, this.mobileOTP).subscribe(
    //   data => {
    //     const userDetails = data.data.userDetails;
    //     userDetails['id'] = userDetails['_id'];
    //     this.store.dispatch(new SignIn(userDetails));
    //     this.cookieService.setUserData(data.data.userDetails);

    //     this.selectedPanel = 'afterOtpValidation';
    //     this.isCompleted = true;
    //   },
    //   err => {
    //     // TODO: Error Handling
    //   }
    // );
  }

  gotoHome() {
    this.router.navigate(['/']);
  }

  onSubmitButtonClick() {
    this.router.navigate(['login-signup/successful']);
  }

  resendOTP(evt: any) {
    // this.prelaunchService.resendOTP().subscribe((data: any) => {
    //   this.matSnackBar.open(data.message);
    // });
  }
}
