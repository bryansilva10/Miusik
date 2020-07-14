import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { Album } from '../models/album';

//make this service available from the root component
@Injectable({
	providedIn: 'root'
})

export class AlbumService {
	public url: string;

	//inject http client
	constructor(private http: HttpClient) {
		this.url = GLOBAL.url;
	}

	//method to add/create album
	addAlbum(token, album: Album): Observable<any> {
		//convert object to json to pass as params later
		let params = JSON.stringify(album);

		//set headers
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'Authorization': token
		});

		//return request
		return this.http.post(this.url + 'album', params, { headers: headers });
	}
}