import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { SongService } from 'src/app/services/song.service';
import { UploadService } from 'src/app/services/upload.service';
import { Song } from '../models/song';
import { GLOBAL } from '../services/global';


@Component({
	selector: 'song-edit',
	templateUrl: '../views/song-add.component.html'
})

export class SongEditComponent implements OnInit {
	//component properties
	public componentTitle: string;
	public song: Song;
	public identity;
	public token;
	public url: string;
	public alertMessage;
	public isEdit;
	public filesToUpload: Array<File>;

	//constructor, inject services
	constructor(private route: ActivatedRoute, private router: Router, private userService: UserService, private songService: SongService, private uploadService: UploadService) {
		//set properties
		this.componentTitle = 'Edit Song';
		this.identity = this.userService.getIdentity();
		this.token = this.userService.getToken();
		this.url = GLOBAL.url;
		//initialize album object
		this.song = new Song(1, '', '', '', '');
		this.isEdit = true;
	}

	ngOnInit() {
		//retrieve song to edit
		this.getSong();
	}

	//method to get song
	getSong() {
		//retrieve params
		this.route.params.forEach((params: Params) => {
			//retrieve id
			let id = params['id'];

			//use service
			this.songService.getSong(this.token, id)
				//subscribe to response
				.subscribe(//
					response => {
						//if no response
						if (!response.song) {
							//redirect
							this.router.navigate(['/']);
						} else {
							//assign value from response to component prop
							this.song = response.song;
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
		});
	}

	onSubmit() {
		//retrieve params
		this.route.params.forEach((params: Params) => {
			//retriev id
			let id = params['id'];
			console.log(this.song);

			//use service to add album
			this.songService.editSong(this.token, id, this.song)
				//subscribe to response
				.subscribe(
					response => {
						//if there is no response
						if (!response.song) {
							//show error
							this.alertMessage = 'Error on server';
						} else {
							//success message
							this.alertMessage = 'Song updated successfully';

							//check if there are files to upload
							if (!this.filesToUpload) {
								//redirect 
								this.router.navigate(['/album', response.song.album]);
							} else {
								//upload audio file using service method
								this.uploadService.makeFileRequest(this.url + 'upload-file-song/' + id, [], this.filesToUpload, this.token, 'file')
									.then(
										(result) => {
											//redirect 
											this.router.navigate(['/album', response.song.album]);
										},
										(error) => {
											console.log(error);
										}
									);
							}
							//redirect
							//this.router.navigate(['/edit-album', response.album._id]);
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

	//method to deal with file selection as input
	fileChangeEvent(fileInput: any) {
		this.filesToUpload = <Array<File>>fileInput.target.files;
	}
}