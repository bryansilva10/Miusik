import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
	selector: 'home',
	templateUrl: '../views/home.component.html'
})

export class HomeComponent implements OnInit {
	//component properties
	public title: string;

	//constructor, inject services
	constructor(private route: ActivatedRoute, private router: Router) {
		//set properties
		this.title = 'Home';
	}

	ngOnInit() {

	}
}