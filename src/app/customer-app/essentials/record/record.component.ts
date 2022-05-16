import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from "@angular/core";
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { CustomerStateService } from "../../customer-state.service";
import { OrderService } from "../../order.service";
import { CustomerService } from "../../customer.service";
import { ECustomerServiceType } from "src/app/shared/constants/constants";
import {
  ZATAAKSE_JWT_TOKEN,
  ZATAAKSE_PREF_LANG,
  LOCAL_STORAGE_FINGERPRINT,
} from "../../../shared/constants/constants";
import { ISampleFile } from "../../../shared/models/common-model";
import { NgxImageCompressService, DOC_ORIENTATION } from "ngx-image-compress";

declare var MediaRecorder: any;
@Component({
  selector: "app-record",
  templateUrl: "./record.component.html",
  styleUrls: ["./record.component.scss"],
})
export class RecordComponent implements OnInit, OnDestroy {
  @ViewChild("recordedPlayer", { static: false }) recordedPlayer: ElementRef;
  uploadedImg: any = null;
  mediaRecorder = null;
  hasRecorded = false;
  previewMode = false;
  hasRecordingStarted = false;
  recordedAudio: HTMLAudioElement;
  audioUrl: string;
  businessId: any;
  businessName: any;
  audioChunks: any;
  audio: string;
  image: string;
  position: { lat: number; lng: number };
  recordingRemaining = 0;
  recordingIntervalRef: any;
  imagePreview: any;
  imageFile: any;
  photo: string;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private customerStateService: CustomerStateService,
    private router: Router,
    private orderService: OrderService,
    private customerService: CustomerService,
    private imageCompress: NgxImageCompressService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (!params.id) {
        this.router.navigate(["customer"]);
      }
      this.businessId = params.id;
      this.businessName = params.name;
      this.position = {
        lat: params.lat,
        lng: params.lng,
      };
      this.photo = params.photo;
    });

    if (localStorage.getItem(LOCAL_STORAGE_FINGERPRINT)) {
      this.customerService
        .getSampleFile(
          localStorage.getItem(LOCAL_STORAGE_FINGERPRINT),
          this.position,
          localStorage.getItem(ZATAAKSE_PREF_LANG)
        )
        .subscribe((res: ISampleFile) => {
          // console.log(res);
          if (res && res.data) {
            (this.audio = res.data.audio), (this.image = res.data.image);
            // console.log(this.audio, this.image);
          }
        });
    } else {
      this.router.navigate(["/login-signup"]);
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.recordingIntervalRef);
  }

  onMicClick() {
    if (this.hasRecordingStarted) {
      // need to stop and save
      this.mediaRecorder.stop();
      clearInterval(this.recordingIntervalRef);
    } else {
      // start recording
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: false })
        .then((stream) => {
          this.hasRecordingStarted = true;
          this.mediaRecorder = new MediaRecorder(stream, {
            mimeType: "audio/webm",
          });
          this.mediaRecorder.start();
          this.recordingRemaining = 60;
          this.recordingIntervalRef = setInterval(() => {
            this.recordingRemaining -= 1;
            if (this.recordingRemaining < 1) {
              // clear interval and stop recording
              if (this.mediaRecorder.state !== "inactive") {
                this.mediaRecorder.stop();
              }
              clearInterval(this.recordingIntervalRef);
            }
          }, 1000);

          const audioChunks = [];
          this.mediaRecorder.addEventListener("dataavailable", (event) => {
            audioChunks.push(event.data);
          });

          this.mediaRecorder.addEventListener(
            "stop",
            () => {
              stream.getTracks().forEach((t) => t.stop());
              this.audioChunks = audioChunks;
              this.audioUrl = URL.createObjectURL(new Blob(audioChunks));
              this.recordedAudio = new Audio(this.audioUrl);
              // TODO: This recorded audio can be sent to backend
              this.hasRecorded = true;
              this.previewMode = true;
              setTimeout(() => {
                this.recordedPlayer.nativeElement.src = this.audioUrl;
              }, 100);
            },
            { once: true }
          );
        });
    }
  }

  onSaveClick() {
    this.customerStateService.updateCurrentService(
      ECustomerServiceType.Essential
    );
    // Set data to be used in cart-view page
    let recordingFile;
    if (this.hasRecorded) {
      const recording = new Blob(this.audioChunks, { type: "audio" });
      recordingFile = new File([recording], "test.wav", { type: "audio/wav" });
    }

    this.customerStateService.currentEssentialServiceData = {
      displayName: this.businessName,
      id: this.businessId,
      file: this.hasRecorded ? recordingFile : this.uploadedImg, // TODO: Attach file
      isRecording: this.hasRecorded,
    };
    this.router.navigate(["customer/cart-view"]);
  }

  onRecordingClear() {
    this.hasRecorded = false;
    this.hasRecordingStarted = false;
    this.previewMode = false;
  }

  onBackClick() {
    this.location.back();
  }

  onCancelClick() {
    if (this.hasRecorded) {
      this.onRecordingClear();
    } else {
      this.cancelPhoto();
    }
    this.resetState();
  }

  resetState() {
    this.previewMode = false;
    this.hasRecorded = false;
    this.hasRecordingStarted = false;
    this.mediaRecorder = null;
    this.uploadedImg = null;
    this.imagePreview = null;
  }

  cancelPhoto() {
    this.uploadedImg = null;
  }

  seeSample(link: string) {
    window.open(link);
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      this.imageFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (onloadEvent: any) => {
        this.imagePreview = reader.result;
        this.previewMode = true;
        this.compressFile(onloadEvent.target.result, this.imageFile.name);
      };
      reader.readAsDataURL(this.imageFile);
    }
  }

  compressFile(image, fileName) {
    this.imageCompress
      .compressFile(image, DOC_ORIENTATION.NotDefined, 100, 20)
      .then((result) => {
        // create file from byte
        // call method that creates a blob from dataUri
        const imageBlob = this.dataURItoBlob(result.split(",")[1]);
        const imageFile = new File([imageBlob], fileName, {
          type: "image/jpeg",
        });
        this.uploadedImg = imageFile;
      });
  }

  dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: "image" });
    return blob;
  }
}
