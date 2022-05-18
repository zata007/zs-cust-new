import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

export const BROWSERS = {
  CHROME: 'Chrome',
  FIREFOX: 'Firefox',
  SAFARI: 'Safari',
  OPERA: 'Opera',
  IE: 'IE',
  MS_EDGE: 'MS-Edge',
  MS_EDGE_CHROMIUM: 'MS-Edge-Chromium',
  FB_MESSANGER: 'FB-Messanger',
  SAMSUNG: 'Samsung',
  UCBROWSER: 'UC-Browser',
  UNKNOWN: 'Unknown',
};
@Component({
  selector: 'app-location-dialog',
  templateUrl: './location-dialog.component.html',
  styleUrls: ['./location-dialog.component.scss'],
})
export class LocationDialogComponent implements OnInit {
  selectedBrowser = [];
  stepsMap = {
    [BROWSERS.CHROME]: [
      {
        step: '1',
        image:
          'https://password-managers.bestreviews.net/files/six-web-browsers.png',
        text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's.",
      },
      {
        step: '2',
        image:
          'https://password-managers.bestreviews.net/files/six-web-browsers.png',
        text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's.",
      },
      {
        step: '3',
        image:
          'https://password-managers.bestreviews.net/files/six-web-browsers.png',
        text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's.",
      },
    ],
    [BROWSERS.MS_EDGE]: [
      {
        step: '1',
        image:
          'https://password-managers.bestreviews.net/files/six-web-browsers.png',
        text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's.",
      },
      {
        step: '2',
        image:
          'https://password-managers.bestreviews.net/files/six-web-browsers.png',
        text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's.",
      },
      {
        step: '3',
        image:
          'https://password-managers.bestreviews.net/files/six-web-browsers.png',
        text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's.",
      },
    ],
    [BROWSERS.FIREFOX]: [
      {
        step: '1',
        image:
          'https://password-managers.bestreviews.net/files/six-web-browsers.png',
        text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's.",
      },
      {
        step: '2',
        image:
          'https://password-managers.bestreviews.net/files/six-web-browsers.png',
        text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's.",
      },
      {
        step: '3',
        image:
          'https://password-managers.bestreviews.net/files/six-web-browsers.png',
        text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's.",
      },
    ],
    [BROWSERS.SAFARI]: [
      {
        step: '1',
        image:
          'https://password-managers.bestreviews.net/files/six-web-browsers.png',
        text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's.",
      },
      {
        step: '2',
        image:
          'https://password-managers.bestreviews.net/files/six-web-browsers.png',
        text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's.",
      },
      {
        step: '3',
        image:
          'https://password-managers.bestreviews.net/files/six-web-browsers.png',
        text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's.",
      },
    ],
    [BROWSERS.UNKNOWN]: [
      {
        step: '1',
        image:
          'https://password-managers.bestreviews.net/files/six-web-browsers.png',
        text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's.",
      },
      {
        step: '2',
        image:
          'https://password-managers.bestreviews.net/files/six-web-browsers.png',
        text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's.",
      },
      {
        step: '3',
        image:
          'https://password-managers.bestreviews.net/files/six-web-browsers.png',
        text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's.",
      },
    ],
  };

  chrome = [
    {
      step: '1',
      image:
        'https://password-managers.bestreviews.net/files/six-web-browsers.png',
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's.",
    },
    {
      step: '2',
      image:
        'https://password-managers.bestreviews.net/files/six-web-browsers.png',
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's.",
    },
    {
      step: '3',
      image:
        'https://password-managers.bestreviews.net/files/six-web-browsers.png',
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's.",
    },
  ];
  deviceInfo: any;

  constructor(private bottomRef: MatBottomSheetRef<LocationDialogComponent>) {}

  ngOnInit() {
    this.deviceInfo = this.browserDetect;
    this.selectedBrowser = this.stepsMap[this.deviceInfo.browser];
  }

  closePage() {
    this.bottomRef.dismiss();
  }

  browserDetect() {
    let userAgent = navigator.userAgent;
    let browserName;

    if (userAgent.match(/chrome|chromium|crios/i)) {
      browserName = 'Chrome';
    } else if (userAgent.match(/firefox|fxios/i)) {
      browserName = 'Firefox';
    } else if (userAgent.match(/safari/i)) {
      browserName = 'Safari';
    } else if (userAgent.match(/opr\//i)) {
      browserName = 'Opera';
    } else if (userAgent.match(/edg/i)) {
      browserName = 'Edge';
    } else {
      browserName = 'No browser detection';
    }

    return browserName;
  }
}
