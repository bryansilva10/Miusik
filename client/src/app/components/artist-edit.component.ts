import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ArtistService } from 'src/app/services/artist.service';
import { UploadService } from 'src/app/services/upload.service';
import { Artist } from '../models/artist';
import { GLOBAL } from '../services/global';


@Component({
	selector: 'artist-edit',
	templateUrl: '../views/artist-add.component.html'
})

export class ArtistEditComponent implements OnInit {
	//component properties
	public title: string;
	public artist: Artist;
	public identity;
	public token;
	public url: string;
	public alertMessage;
	public isEdit;
	public filesToUpload: Array<File>;

	//constructor, inject services
	constructor(private route: ActivatedRoute, private router: Router, private userService: UserService, private artistService: ArtistService, private uploadService: UploadService) {
		//set properties
		this.title = 'Edit Artist';
		this.identity = this.userService.getIdentity();
		this.token = this.userService.getToken();
		this.url = GLOBAL.url;
		//initialize artist object
		this.artist = new Artist('', '', '', '');
		this.isEdit = true;

	}

	ngOnInit() {
		//call api to get artist by id
		this.getArtist();
	}

	//method to get artist from api
	getArtist() {
		//retrieve id from url
		this.route.params.forEach((params: Params) => {
			//retrieve id param
			let id = params['id'];

			//retrieve artist using service
			this.artistService.getArtist(this.token, id)
				//subscribe to response of service method
				.subscribe(
					response => {
						//if artist is not retrieve correctly
						if (!response.artist) {
							//redirect
							this.router.navigate(['/']);
						} else {
							//retrieve artist and assign to component prop
							this.artist = response.artist;
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

	onSubmit() {
		console.log(this.artist);
		this.route.params.forEach((params: Params) => {
			//retrieve id param
			let id = params['id'];
			//use service to add artist on submit
			this.artistService.editArtist(this.token, id, this.artist)
				//subscribe to response
				.subscribe(
					response => {
						//if there is no response
						if (!response.artist) {
							//show error
							this.alertMessage = 'Error on server';
						} else {
							//success message
							this.alertMessage = 'Artist updated successfully';

							//upload image with method
							this.uploadService.makeFileRequest(this.url + 'upload-image-artist/' + id, [], this.filesToUpload, this.token, 'image')
								.then(
									(result) => {
										//redirect 
										this.router.navigate(['/artists', 1]);
									},
									(error) => {
										console.log(error);
									}
								);

							//assign data from db to component property
							// this.artist = response.artist;
							//redirect
							// this.router.navigate(['./edit-artist'], response.artist._id);
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
	}

	//method for file change event
	fileChangeEvent(fileInput: any) {
		//grab files selected and store in component prop
		this.filesToUpload = <Array<File>>fileInput.target.files;
	}

}