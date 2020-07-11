import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ArtistService } from 'src/app/services/artist.service';
import { User } from '../models/user';
import { Artist } from '../models/artist';
import { GLOBAL } from '../services/global';


@Component({
	selector: 'artist-list',
	templateUrl: '../views/artist-list.component.html'
})

export class ArtistListComponent implements OnInit {
	//component properties
	public title: string;
	public artists: Artist[];
	public identity;
	public token;
	public url: string;
	public nextPage;
	public prevPage;

	//constructor, inject services
	constructor(private route: ActivatedRoute, private router: Router, private userService: UserService, private artistService: ArtistService) {
		//set properties
		this.title = 'Artists';
		this.identity = this.userService.getIdentity();
		this.token = this.userService.getToken();
		this.url = GLOBAL.url;
		this.nextPage = 1;
		this.prevPage = 1;
	}

	ngOnInit() {
		//get artists

		this.getArtists();
	}

	//methd to get artists
	getArtists() {
		//retrieve url params
		this.route.params.forEach((params: Params) => {
			//page
			let page = +params['page'];

			//if there is no page
			if (!page) {
				//default to 1
				page = 1;
			} else {
				//assing next page value
				this.nextPage = page + 1;
				//asign prev page value
				this.prevPage = page - 1;

				//if prev page is 0
				if (this.prevPage == 0) {
					//prevent from going below 0
					this.prevPage = 1;
				}
			}

			//user artist service to get artist
			this.artistService.getArtists(this.token, page)
				//subscribe to response of service method
				.subscribe(
					response => {
						//if artist is not retrieve correctly
						if (!response.artists) {
							//redirect
							this.router.navigate(['/']);
						} else {
							//retrieve artist and assign to component prop
							this.artists = response.artists;
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