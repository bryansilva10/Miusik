import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from '../models/user'

@Component({
	selector: 'user-edit',
	templateUrl: '../views/user-edit.component.html'
})

export class UserEditComponent implements OnInit {
	//properties for user editing
	public title: string;
	public user: User;
	public identity;
	public token;

	constructor(private userService: UserService) {
		this.title = 'Update info';
		this.identity = this.userService.getIdentity();
		this.token = this.userService.getToken();
	}

	ngOnInit(): void {

	}

}
