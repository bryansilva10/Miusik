import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
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

	//constructor, inject services
	constructor(private route: ActivatedRoute, private router: Router, private userService: UserService) {
		//set properties
		this.title = 'Artists';
		this.identity = this.userService.getIdentity();
		this.token = this.userService.getToken();
		this.url = GLOBAL.url;
	}

	ngOnInit() {

	}
}