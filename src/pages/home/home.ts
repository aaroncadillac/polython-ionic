import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {	
  constructor(public navCtrl: NavController,private qrScanner: QRScanner,private alertCtrl:AlertController ) {

  }
  showError(text) {    
 
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }
  readQR(){
  	this.qrScanner.prepare()
  	  .then((status: QRScannerStatus) => {
  	     if (status.authorized) {
  	       // camera permission was granted


  	       // start scanning
  	       let scanSub = this.qrScanner.scan().subscribe((text: string) => {
  	         console.log('Scanned something', text);
  	         this.showError("Leido : "+text)
  	         this.qrScanner.hide(); // hide camera preview
  	         scanSub.unsubscribe(); // stop scanning
  	       });

  	       // show camera preview
  	       this.qrScanner.show();

  	       // wait for user to scan something, then the observable callback will be called

  	     } else if (status.denied) {
  	       // camera permission was permanently denied
  	       // you must use QRScanner.openSettings() method to guide the user to the settings page
  	       // then they can grant the permission from there
  	       console.log("no permission")
  	       this.showError("no permission")
  	     } else {
  	     	this.showError("no permission momently")
  	     	console.log("no permission momently")
  	       // permission was denied, but not permanently. You can ask for permission again at a later time.
  	     }
  	  })
  	  .catch((e: any) => {
  	  	this.showError("Error : "+JSON.stringify(e))
  	  	console.log('Error is', e)
  	});
  }
}
