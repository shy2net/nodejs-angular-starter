import { Injectable } from '@angular/core';
import { ToastyService, ToastOptions, ToastData } from 'ng2-toasty';

@Injectable()
export class ToastyHelperService {
  constructor(private toastyService: ToastyService) { }

  showSuccess(title: string, msg: string) {
    const toastOptions = this.getToastOptions(title, msg);
    this.toastyService.success(toastOptions);
  }

  showError(title: string, msg: string) {
    const toastOptions = this.getToastOptions(title, msg);
    this.toastyService.error(toastOptions);
  }

  showInfo(title: string, msg: string) {
    const toastOptions = this.getToastOptions(title, msg);
    this.toastyService.info(toastOptions);
  }

  showWait(title: string, msg: string) {
    const toastOptions = this.getToastOptions(title, msg);
    this.toastyService.wait(toastOptions);
  }

  showWarning(title: string, msg: string) {
    const toastOptions = this.getToastOptions(title, msg);
    this.toastyService.warning(toastOptions);
  }

  getToastOptions(title: string, msg: string): ToastOptions {
    return {
      title: title,
      msg: msg,
      showClose: true,
      theme: 'bootstrap',
      timeout: 8000
    };
  }
}
