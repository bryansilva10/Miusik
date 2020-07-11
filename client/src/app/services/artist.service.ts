/*SERVICE FOR ARTIST RELATED OPERATIONS */

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

export class ArtistService {
	//properties
	public url: string;

	//Constructor, inject http client
	constructor(private http: HttpClient) {
		this.url = GLOBAL.url;
	}

	//method to add artist
	addArtist(token, artist: Artist): Observable<any> {
		//convert object to json to pass as params later
		let params = JSON.stringify(artist);

		//set headers
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'Authorization': token
		});

		//return request
		return this.http.post(this.url + 'artist', params, { headers: headers });
	}

	//method to get artists
	getArtists(token, page): Observable<any> {
		//set headers
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'Authorization': token
		});

		return this.http.get(this.url + 'artists/' + page, { headers: headers });
	}

	//method to get single artist
	getArtist(token, id: string): Observable<any> {
		//set headers
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'Authorization': token
		});

		return this.http.get(this.url + 'artist/' + id, { headers: headers });
	}

	//method to update artist
	editArtist(token, id: string, artist: Artist): Observable<any> {
		//convert object to json to pass as params later
		let params = JSON.stringify(artist);

		//set headers
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'Authorization': token
		});

		//return request
		return this.http.put(this.url + 'artist/' + id, params, { headers: headers });
	}

	//delete artist
	deleteArtist(token, id: string): Observable<any> {
		//set headers
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'Authorization': token
		});

		return this.http.delete(this.url + 'artist/' + id, { headers: headers });
	}
}
