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
	public alertUpdate;

	constructor(private userService: UserService) {
		this.title = 'Update info';


		//get from local storage
		this.identity = this.userService.getIdentity();
		this.token = this.userService.getToken();
		//set user to info retrieed from localstorage
		this.user = this.identity;
	}

	ngOnInit(): void {

	}

	onSubmit() {
		//user service to update user info
		this.userService.updateUser(this.user)
			//subscribe to response
			.subscribe(
				response => {

					//if no user was found
					if (!response.user) {
						this.alertUpdate = 'User could not be updated';
					} else {
						//assing value from db to user in component
						//this.user = response.user;

						//modify in local storage
						localStorage.setItem('identity', JSON.stringify(this.user));

						//select name from DOM
						document.getElementById('identity_name').innerHTML = this.user.name;

						this.alertUpdate = 'Info updated correctly!';
					}
				},
				error => {
					//create message
					const errorMessage = <any>error;

					//If ther is an error, log it
					if (errorMessage != null) {
						//parse body of error to json
						// let body = JSON.parse(error._body);
						//assign error on body to errormessage property
						this.alertUpdate = error.error.message;
						console.log(errorMessage);
					}
				}
			)
	}
}
