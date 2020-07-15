import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AlbumService } from 'src/app/services/album.service';
import { UserService } from 'src/app/services/user.service';
import { UploadService } from 'src/app/services/upload.service';
import { Artist } from '../models/artist';
import { Album } from '../models/album';
import { GLOBAL } from '../services/global';


@Component({
	selector: 'album-edit',
	templateUrl: '../views/album-add.component.html'
})

export class AlbumEditComponent implements OnInit {
	//component properties
	public componentTitle: string;
	public album: Album;
	public identity;
	public token;
	public url: string;
	public alertMessage;
	public isEdit;
	public filesToUpload: Array<File>;

	//constructor, inject services
	constructor(private route: ActivatedRoute, private router: Router, private userService: UserService, private albumService: AlbumService, private uploadService: UploadService) {
		//set properties
		this.componentTitle = 'Edit Album';
		this.identity = this.userService.getIdentity();
		this.token = this.userService.getToken();
		this.url = GLOBAL.url;
		//initialize album object
		this.album = new Album('', '', 2020, '', '');
		this.isEdit = true;
	}

	ngOnInit() {
		//Retrieve Album
		this.getAlbum();
	}

	//method to get album
	getAlbum() {
		//retrieve params
		this.route.params.forEach((params: Params) => {
			//rtrieve id from url
			let id = params['artist'];
			console.log("Id is: " + id);
			this.albumService.getAlbum(this.token, id)
				//subscribe to response
				.subscribe(
					response => {
						//if there is no response
						if (!response.album) {
							//redirect to home
							this.router.navigate(['/']);
						} else {
							//success message
							// this.alertMessage = 'Album created successfully';
							//assign data from db to component property
							this.album = response.album;
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

	onSubmit() {
		//retrieve params
		this.route.params.forEach((params: Params) => {
			//retriev id
			let id = params['artist'];

			//use service to add album
			this.albumService.editAlbum(this.token, id, this.album)
				//subscribe to response
				.subscribe(
					response => {
						//if there is no response
						if (!response.album) {
							//show error
							this.alertMessage = 'Error on server';
						} else {
							//success message
							this.alertMessage = 'Album updated successfully';
							//if there are NOT files to upload
							if (!this.filesToUpload) {
								//reddirect
								this.router.navigate(['/artist', response.album.artist]);
							} else {
								//upload image with method from service
								this.uploadService.makeFileRequest(this.url + 'upload-image-album/' + id, [], this.filesToUpload, this.token, 'image')
									.then(
										(result) => {
											//redirect 
											this.router.navigate(['/artist', response.album.artist]);
										},
										(error) => {
											console.log(error);
										}
									);
							}

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

	//method for file upload
	fileChangeEvent(fileInput: any) {
		this.filesToUpload = <Array<File>>fileInput.target.files;
	}
}