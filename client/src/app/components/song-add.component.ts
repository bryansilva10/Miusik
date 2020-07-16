import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { SongService } from 'src/app/services/song.service';
import { Song } from '../models/song';
import { GLOBAL } from '../services/global';


@Component({
	selector: 'song-add',
	templateUrl: '../views/song-add.component.html'
})

export class SongAddComponent implements OnInit {
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
	constructor(private route: ActivatedRoute, private router: Router, private userService: UserService, private songService: SongService) {
		//set properties
		this.componentTitle = 'Add New Song';
		this.identity = this.userService.getIdentity();
		this.token = this.userService.getToken();
		this.url = GLOBAL.url;
		//initialize album object
		this.song = new Song(1, '', '', '', '');
		this.isEdit = false;
	}

	ngOnInit() {

	}

	onSubmit() {
		//retrieve params
		this.route.params.forEach((params: Params) => {
			//retriev id
			let albumId = params['album'];
			//store album id into album of the song
			this.song.album = albumId;
			console.log(this.song);

			//use service to add album
			this.songService.addSong(this.token, this.song)
				//subscribe to response
				.subscribe(
					response => {
						//if there is no response
						if (!response.song) {
							//show error
							this.alertMessage = 'Error on server';
						} else {
							//success message
							this.alertMessage = 'Song added successfully';
							//assign data from db to component property
							this.song = response.song;
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