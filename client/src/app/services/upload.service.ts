/*SERVICE FOR UPLOADS */

//imports
import { Injectable } from '@angular/core';
import { GLOBAL } from './global';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Artist } from '../models/artist';

//make this service available from the root component
@Injectable({
	providedIn: 'root'
})

export class UploadService {
	//properties
	public url: string;

	//Constructor, inject http client
	constructor(private http: HttpClient) {
		this.url = GLOBAL.url;
	}

	//method to request a file upload
	makeFileRequest(url: string, params: Array<string>, files: Array<File>, token: string, name: string) {

		//return promise with
		return new Promise((resolve, reject) => {
			//instantiante formData object
			const formData: any = new FormData();
			//xhr object for request
			const xhr = new XMLHttpRequest();

			//loop through array of fies and append to form
			for (let i = 0; i < files.length; i++) {
				//append key, file and filename to formData
				formData.append(name, files[i], files[i].name);
			}

			//check status of response
			xhr.onreadystatechange = () => {
				//if request concluded...
				if (xhr.readyState == 4) {
					//if request is succesful
					if (xhr.status == 200) {
						//resolve with parsed responsse
						resolve(JSON.parse(xhr.response));
					} else {
						//reject with response
						reject(xhr.response);
					}
				}
			}

			//configure request
			xhr.open('POST', url, true);
			//set headers for token auth
			xhr.setRequestHeader('Authorization', token);
			//send request
			xhr.send(formData);
		})
	}
}