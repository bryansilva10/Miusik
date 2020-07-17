import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { Album } from '../models/album';
import { Song } from '../models/song';

//make this service available from the root component
@Injectable({
	providedIn: 'root'
})

export class SongService {
	public url: string;

	//inject http client
	constructor(private http: HttpClient) {
		this.url = GLOBAL.url;
	}

	//method to get all songs
	getSongs(token, albumId = null): Observable<any> {

		//set headers
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'Authorization': token
		});

		//if album id is null
		if (albumId == null) {
			//return request to get ALL songs
			return this.http.get(this.url + 'songs', { headers: headers });
		} else {
			//return request to get only songs from album
			return this.http.get(this.url + 'songs/' + albumId, { headers: headers });
		}
	}

	//method to get a single song
	getSong(token, id: string): Observable<any> {
		//set headers
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'Authorization': token
		});

		//return request
		return this.http.get(this.url + 'song/' + id, { headers: headers });
	}

	//method to add/create album
	addSong(token, song: Song): Observable<any> {
		//convert object to json to pass as params later
		let params = JSON.stringify(song);

		//set headers
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'Authorization': token
		});

		//return request
		return this.http.post(this.url + 'song', params, { headers: headers });
	}

	//method to edit a song
	editSong(token, id: string, song: Song): Observable<any> {
		//convert object to json to pass as params later
		let params = JSON.stringify(song);

		//set headers
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'Authorization': token
		});

		//return request
		return this.http.put(this.url + 'song/' + id, params, { headers: headers });
	}

	//method to delete a single song
	deleteSong(token, id: string): Observable<any> {
		//set headers
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'Authorization': token
		});

		//return request
		return this.http.delete(this.url + 'song/' + id, { headers: headers });
	}

}