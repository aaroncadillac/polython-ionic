import { Component } from '@angular/core';
import { NavController, AlertController, Loading, LoadingController } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { ApiProvider } from '../../providers/api/api';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {	
  loading:Loading
  store:boolean=false
  items:Array<{
    "name": string,
    "price": number
  }>
  constructor(public navCtrl: NavController,
              private qrScanner: QRScanner,
              private alertCtrl:AlertController,
              public apiService: ApiProvider,           
              private loadingCtrl: LoadingController) {
    this.showLoading()
    this.apiService.getStore('4bd56f7c-532d-45e0-b593-652db9b4ab96').then(res=>{
      this.items=res.products
      this.loading.dismiss()
    })
    .catch(e=>{
      this.loading.dismiss()
      console.log(e)
    })

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
  	        window.document.querySelector('ion-app').classList.add('transparentBody')

  	       // start scanning
  	       let scanSub = this.qrScanner.scan().subscribe((text: string) => {
  	         console.log('Scanned something', text);
  	         this.apiService.getStore(text).then(res=>{
                   this.items=res.products
                   this.loading.dismiss()
                 })
                 .catch(e=>{
                   this.loading.dismiss()
                   console.log(e)
                 })
  	         this.qrScanner.hide(); // hide camera preview
  	         scanSub.unsubscribe(); // stop scanning
  	       });

  	       // show camera preview
  	       this.qrScanner.show().then(()=>{
  	       	window.document.querySelector('ion-app').classList.remove('transparentBody')
  	       });

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
  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Cargando...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }
}
