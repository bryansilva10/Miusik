import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ArtistService } from 'src/app/services/artist.service';
import { User } from '../models/user';
import { Artist } from '../models/artist';
import { GLOBAL } from '../services/global';


@Component({
	selector: 'artist-add',
	templateUrl: '../views/artist-add.component.html'
})

export class ArtistAddComponent implements OnInit {
	//component properties
	public title: string;
	public artist: Artist;
	public artists: Artist[];
	public identity;
	public token;
	public url: string;
	public alertMessage;
	public isEdit;

	//constructor, inject services
	constructor(private route: ActivatedRoute, private router: Router, private userService: UserService, private artistService: ArtistService) {
		//set properties
		this.title = 'Create New Artist';
		this.identity = this.userService.getIdentity();
		this.token = this.userService.getToken();
		this.url = GLOBAL.url;
		//initialize artist object
		this.artist = new Artist('', '', '');
		this.isEdit = false;
	}

	ngOnInit() {

	}

	onSubmit() {
		console.log(this.artist);
		//use service to add artist on submit
		this.artistService.addArtist(this.token, this.artist)
			//subscribe to response
			.subscribe(
				response => {
					//if there is no response
					if (!response.artist) {
						//show error
						this.alertMessage = 'Error on server';
					} else {
						//success message
						this.alertMessage = 'Artist created successfully';
						//assign data from db to component property
						this.artist = response.artist;
						//redirect
						this.router.navigate(['./edit-artist', response.artist._id]);
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
	}

	//for file change event
	public filesToUpload: Array<File>;
	fileChangeEvent(fileInput: any) {
		this.filesToUpload = <Array<File>>fileInput.target.files;
	}
}