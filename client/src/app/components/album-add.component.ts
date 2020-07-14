import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArtistService } from 'src/app/services/artist.service';
import { AlbumService } from 'src/app/services/album.service';
import { UserService } from 'src/app/services/user.service';
import { Artist } from '../models/artist';
import { Album } from '../models/album';
import { GLOBAL } from '../services/global';


@Component({
	selector: 'album-add',
	templateUrl: '../views/album-add.component.html'
})

export class AlbumAddComponent implements OnInit {
	//component properties
	public componentTitle: string;
	public artist: Artist;
	public album: Album;
	public identity;
	public token;
	public url: string;
	public alertMessage;

	//constructor, inject services
	constructor(private route: ActivatedRoute, private router: Router, private userService: UserService, private artistService: ArtistService, private albumService: AlbumService) {
		//set properties
		this.componentTitle = 'Add New Album';
		this.identity = this.userService.getIdentity();
		this.token = this.userService.getToken();
		this.url = GLOBAL.url;
		//initialize album object
		this.album = new Album('', '', 2020, '', '');
	}

	ngOnInit() {

	}

	onSubmit() {
		//retrieve params
		this.route.params.forEach((params: Params) => {
			//retriev id
			let artistId = params['artist'];
			//store artist id into album artist
			this.album.artist = artistId;

			//use service to add album
			this.albumService.addAlbum(this.token, this.album)
				//subscribe to response
				.subscribe(
					response => {
						//if there is no response
						if (!response.album) {
							//show error
							this.alertMessage = 'Error on server';
						} else {
							//success message
							this.alertMessage = 'Album created successfully';
							//assign data from db to component property
							this.album = response.album;
							//redirect
							// this.router.navigate(['./edit-artist', response.artist._id]);
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
							this.alertMessage = error.error.message;
							console.log(errorMessage);
						}
					}
				)
		})
		console.log(this.album);
	}
}