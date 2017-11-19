import { Component } from '@angular/core';
import { NavController, AlertController, Loading, LoadingController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { ApiProvider } from '../../providers/api/api';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {	
  loading:Loading
  store:boolean=false
  storeName:string
  items:Array<{
    "id":string,
    "name": string,
    "price": number,
    "checked":boolean
  }>
  constructor(public navCtrl: NavController,
              private barcodeScanner: BarcodeScanner,
              private alertCtrl:AlertController,
              public apiService: ApiProvider,           
              private loadingCtrl: LoadingController) {
    this.showLoading()
    this.apiService.getStore('4bd56f7c-532d-45e0-b593-652db9b4ab96').then(res=>{
      this.items=res.products
      this.storeName=res.name
      this.loading.dismiss()
      this.store=true
    })
    .catch(e=>{
      
      this.store=false
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
    this.barcodeScanner.scan().then((barcodeData) => {
     this.apiService.getStore(barcodeData).then(res=>{
                   this.items=res.products
                   this.storeName=res.name
                   this.store=true
                   this.loading.dismiss()
                 })
                 .catch(e=>{
                   this.store=false

                   this.loading.dismiss()
                   console.log(e)
                 })
    }, (err) => {
      this.loading.dismiss()
                   console.log(err)
        // An error occurred
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
