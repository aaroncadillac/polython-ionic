import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiProvider {

  public  base_url="https://polython.herokuapp.com/";
  	constructor(public http: Http) {
  	}

  	login(username,password) {
  		let headers = new Headers(
  		  		{
  		  		  'Access-Control-Allow-Origin' : true ,
  		  		  'Content-type':'application/json'
  		  		});
  		  		let options = new RequestOptions({ headers: headers });
    	return this.http.post(this.base_url+'users/login/',{username:username,password:password},options)
    	.map(res => res.json())
    	.toPromise();
  	}

  	register(username,password,mail) {
  		let headers = new Headers(
  		  		{
  		  		  'Access-Control-Allow-Origin' : true ,
  		  		  'Content-type':'application/json'
  		  		});
  		  		let options = new RequestOptions({ headers: headers });
    	return this.http.post(this.base_url+'users/create/',{username:username,password:password,email:mail},options)
    	.map(res => res.json())
    	.toPromise();
  	}

  	getStore(id){  		  		  		
    	return this.http.get(this.base_url+'stores/'+id+'/')
    	.map(res => res.json())
    	.toPromise();
  	}
}
