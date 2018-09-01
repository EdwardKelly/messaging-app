import { Injectable } from "@angular/core";
import { LoadingController, AlertController } from "ionic-angular";

@Injectable()
export class Alert {
  private loading: any;

  constructor(private loadingCtrl: LoadingController, public alertCtrl: AlertController) {

  }
  displayLoading(message) {
    this.loading = this.loadingCtrl.create({
      content: message
    });
    this.loading.present();
  }

  dismissLoading() {
    this.loading.dismiss();
  }
  
  displayOkMessage(title, subtitle) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present();
  }
}