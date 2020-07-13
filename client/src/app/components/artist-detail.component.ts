import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ArtistService } from 'src/app/services/artist.service';
import { Artist } from '../models/artist';
import { GLOBAL } from '../services/global';


@Component({
	selector: 'artist-detail',
	templateUrl: '../views/artist-detail.component.html'
})

export class ArtistDetailComponent implements OnInit {
	//component properties
	public artist: Artist;
	public identity;
	public token;
	public url: string;
	public alertMessage;

	//constructor, inject services
	constructor(private route: ActivatedRoute, private router: Router, private userService: UserService, private artistService: ArtistService) {
		//set properties
		this.identity = this.userService.getIdentity();
		this.token = this.userService.getToken();
		this.url = GLOBAL.url;
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




}