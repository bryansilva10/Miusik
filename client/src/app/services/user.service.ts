/*SERVICE FOR USER RELATED OPERATIONS */

//imports
import { Injectable } from '@angular/core';
import { GLOBAL } from './global';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs';

//make this service available from the root component
@Injectable({
	providedIn: 'root'
})

export class UserService {
	//properties
	public url: string;
	public identity;
	public token;

	//cosntructor, injeting http client
	constructor(private http: HttpClient) {
		//assign url
		this.url = GLOBAL.url;
	}

	//method to sign up pasing user and optional hash
	signup(user, getHash = null): Observable<any> {
		//if there is a hash being passed
		if (getHash != null) {
			//add get hash property, before converting object to string...and store whatever was passed in getHash
			user.getHash = getHash;
		}

		let params = JSON.stringify(user);

		//define headers
		const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

		//send request
		return this.http.post(this.url + 'login', params, { headers: headers })
	}

	//method to register a user
	register(userToRegister): Observable<any> {
		//stringify the user to pass as param later
		let params = JSON.stringify(userToRegister);

		//define headers
		const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

		//send request
		return this.http.post(this.url + 'register', params, { headers: headers });
	}

	//method to update user info
	updateUser(userToUpdate) {
		//stringify the user to pass as param later
		let params = JSON.stringify(userToUpdate);

		//define headers
		const headers = new HttpHeaders({
			'Content-Type': 'application/json',
			//pass auth header to validate token (get token from localstorage)
			'Authorization': this.getToken()
		});

		//send request
		return this.http.put(this.url + 'update-user/' + userToUpdate._id, params, { headers: headers });
	}

	//method to get identity from local storage
	getIdentity() {
		//parse to obcjet
		const identity = JSON.parse(localStorage.getItem('identity'));

		//if identity is defined
		if (identity != "undefined") {
			//assign to class property
			this.identity = identity;
		} else {
			//set to null
			this.identity = null;
		}

		//return the identity
		return this.identity;
	}

	//method to get token from local storage
	getToken() {
		const token = JSON.parse(localStorage.getItem('token'));

		//if token is defined
		if (token != "undefined") {
			//assign to class property
			this.token = token;
		} else {
			//set to null
			this.token = token;
		}

		//return the token
		return this.token;
	}
}
