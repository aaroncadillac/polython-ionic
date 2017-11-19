import { Component,ViewChild } from '@angular/core';
import { Nav, IonicPage, NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';
//import { PvapiProvider } from '../../providers/pvapi/pvapi';
import { Events } from 'ionic-angular';
//import { Storage } from '@ionic/storage';
import { HomePage } from '../../pages/home/home';
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
	@ViewChild(Nav) nav: Nav;
	loading: Loading;  	
  	registerCredentials = { email: '', password: '' };
  	isLoggedIn:boolean = false;
  	mailLogin:boolean = false;
  	socialLogin:boolean = true;
    registerForm:boolean = false;    
    signUpCredentials={
      mail:'',
      name:'',
      password:''
    }
  constructor(	public navCtrl: NavController, 
  				public navParams: NavParams, 
  				private loadingCtrl: LoadingController, 
  				public alertCtrl: AlertController, 
  				//public pvService: PvapiProvider,
         	public events: Events,
          //private storage: Storage,
          private fb: Facebook,
          private googlePlus: GooglePlus
          ) {
    this.showLoading()
  	fb.getLoginStatus()
  	   .then(res => {         
  	     console.log(res.status);
  	     if(res.status === "connect") {
  	       this.isLoggedIn = true;
           this.loading.dismiss().
           then(()=>{
             this.navCtrl.push(HomePage)
           })
  	     } else {
  	       this.isLoggedIn = false;
           this.googlePlus.trySilentLogin({})
                 .then(res => {
                    this.loading.dismiss()
                    console.log(res)
                  })                                    
                 .catch(e => {
                   this.loading.dismiss()
                   console.error(e)
                 });
  	     }
  	   })
  	   .catch(e => {         
         this.googlePlus.trySilentLogin({})
               .then(res => {
                  this.loading.dismiss()
                 console.log(res)
               })
               .catch(e => {
                 this.loading.dismiss()
                 console.error(e)
               });
        console.log(e)         
       });
  }

  ionViewDidLoad() {
  }


  public login() {
    this.showLoading()
    /*this.pvService.login(this.registerCredentials.email,this.registerCredentials.password).
    	then(data => { 	    	
 	    	if (typeof data.auth_token==="undefined") { 
 	    		this.showError(data.warning)
 	    	} else {          
 	    		this.pvService.getModules(data.id_user,data.auth_token).
 	    		    	then(data => { 	    		 	    	
 	    		 	    	 	    		 	    	                                                
 	    		 	    })
 	    		 	    .catch(error =>{
 	    		 	      	console.error(error);
 	    		 	      	
 	    		 	    })          
 	    		this.loading.dismiss();
          this.storage.set('data', JSON.stringify(data));
          this.events.publish('userlogin');
 	    		this.navCtrl.setRoot(HomePage,{data:data});
 	    	}
 	    })
 	    .catch(error =>{
 	      	console.error(error);
 	      	this.loading.dismiss();
 	    })*/
  }
 
  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Cargando...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }
 
  showError(text) {
    this.loading.dismiss();
 
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }

  loginMail(){
  	this.mailLogin=true;
  	this.socialLogin=false;
    this.registerForm=false
  }

  loginSocial(){
    this.mailLogin=false;
    this.socialLogin=true;
    this.registerForm=false
  }

  Facebooklogin(){
    this.showLoading()
    this.fb.login(['public_profile', 'user_friends', 'email'])
      .then((res: FacebookLoginResponse) => {
        this.loading.dismiss().then(()=>{
          this.navCtrl.push(HomePage)        
        })
          
        console.log('Logged into Facebook!', res)        
      })
      .catch(e => {
        this.loading.dismiss().then(()=>{
          this.showError("Se presento un error al intentar iniciar sesion con Facebook. Eror presentado :"+e)
        })
        console.log('Error logging into Facebook', e)
      });
  }
  GoogleLogin(){
    this.showLoading()
    this.googlePlus.login({})
      .then(res => {
         this.loading.dismiss().then(()=>{
            this.navCtrl.push(HomePage)          
        })
        console.log(res)
      })
      .catch(e => {
        this.loading.dismiss().then(()=>{
          this.showError("Se presento un error al intentar iniciar sesion con Google. Eror presentado :"+e)
        })
        console.error(e)
      });
  }
  register(){
    this.registerForm=true
    this.socialLogin=false;
    this.mailLogin=false;
  }
}
