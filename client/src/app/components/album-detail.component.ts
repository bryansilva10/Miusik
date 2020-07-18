import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { AlbumService } from 'src/app/services/album.service';
import { SongService } from 'src/app/services/song.service';
import { GLOBAL } from '../services/global';
import { Album } from '../models/album';
import { Song } from '../models/song';


@Component({
	selector: 'album-detail',
	templateUrl: '../views/album-detail.component.html'
})

export class AlbumDetailComponent implements OnInit {
	//component properties
	public album: Album;
	public songs: Song[];
	public identity;
	public token;
	public url: string;
	public alertMessage;
	public confirmed;

	//constructor, inject services
	constructor(private route: ActivatedRoute, private router: Router, private userService: UserService, private albumService: AlbumService, private songService: SongService) {
		//set properties
		this.identity = this.userService.getIdentity();
		this.token = this.userService.getToken();
		this.url = GLOBAL.url;
	}

	ngOnInit() {
		//call api to get album
		this.getAlbum();
	}

	//method to get artist from api
	getAlbum() {
		//retrieve id from url
		this.route.params.forEach((params: Params) => {
			//retrieve id param
			let id = params['id'];

			//retrieve artist using service
			this.albumService.getAlbum(this.token, id)
				//subscribe to response of service method
				.subscribe(
					response => {
						//if artist is not retrieve correctly
						if (!response.album) {
							//redirect
							this.router.navigate(['/']);
						} else {
							//retrieve artist and assign to component prop
							this.album = response.album;


							//RETRIEVE SONGS
							this.songService.getSongs(this.token, response.album._id)
								//subscribe to response
								.subscribe(
									response => {
										//if there is not a resonse
										if (!response.songs) {
											this.alertMessage = 'This Album has no Songs';
										} else {
											//response with songs assinged to component prop
											this.songs = response.songs;
										}
									},
									error => {
										//create message
										const errorMessage = <any>error;

										//If ther is an error, log it
										if (errorMessage != null) {
											//parse body of error to json
											// let body = JSON.parse(error._body);
											//assign error on body to errormessage property
											// this.alertMessage = error.error.message;
											console.log(errorMessage);
										}
									});
						}
					},
					//in case of error
					error => {
						//create message
						const errorMessage = <any>error;

						//If ther is an error, log it
						if (errorMessage != null) {
							//parse body of error to json
							// let body = JSON.parse(error._body);
							//assign error on body to errormessage property
							// this.alertMessage = error.error.message;
							console.log(errorMessage);
						}
					}
				)
		})
	}

	//method to confirm deletion
	onDeleteConfirm(id) {
		//asign id to confirmed
		this.confirmed = id;
	}

	//method to cancel deletion
	onCancelSong() {
		this.confirmed = null;
	}

	//method to delete song
	onDeleteSong(id) {
		//use service
		this.songService.deleteSong(this.token, id)
			//subscribe to response
			.subscribe(
				response => {
					//if there is no song
					if (!response.song) {
						//alert
						alert('Error on Server');
					}

					//refresh list
					this.getAlbum();
				},
				//in case of error
				error => {
					//create message
					const errorMessage = <any>error;

					//If ther is an error, log it
					if (errorMessage != null) {
						//parse body of error to json
						// let body = JSON.parse(error._body);
						//assign error on body to errormessage property
						// this.alertMessage = error.error.message;
						console.log(errorMessage);
					}
				}
			)
	}

	//method to play de song
	startPlayer(song) {
		//convert song object to JSON
		let songPlayer = JSON.stringify(song);
		//file url
		let filePath = this.url + 'get-song-file/' + song.file;
		//image url
		let imagePath = this.url + 'get-image-album/' + song.album.image;

		//use local storage to persist song being played
		localStorage.setItem('songPlaying', songPlayer);

		//set src attribute in player to current song
		document.getElementById('mp3-source').setAttribute('src', filePath);

		//type cast player to force it to load with current song and play it using audio feature html5
		(document.getElementById('player') as any).load();
		(document.getElementById('player') as any).play();

		//set props in DOM
		document.getElementById('play-song-title').innerHTML = song.name;
		document.getElementById('play-song-artist').innerHTML = song.album.artist.name;
		document.getElementById('play-image-album').setAttribute('src', imagePath);
	}
}