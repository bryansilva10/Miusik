import { Component, OnInit } from '@angular/core';
import { User } from './models/user'; //import user model
import { UserService } from './services/user.service'; //import user service
import { GLOBAL } from './services/global';


@Component({
	selector: 'app-root',
	templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
	//properties of class
	public title = 'Miusik';
	public user: User;
	public user_register: User;
	public identity; //prop for auth
	public token;
	public errorMessage;
	public alertRegister;
	public url: string;

	//cosntructor for component, inject user service
	constructor(private userService: UserService) {
		//instantiate empty user
		this.user = new User('', '', '', '', '', 'ROLE_USER', '');
		this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');
	}

	//method tha initiates component
	ngOnInit() {
		this.identity = this.userService.getIdentity();
		this.token = this.userService.getToken();
		this.url = GLOBAL.url;
	}

	//method to react to submitting form
	onSubmit() {
		//use service, pass user object and subscribe to response
		this.userService.signup(this.user).subscribe(
			//in case of succesful response
			response => {
				//store user identity
				const identity = response.user;
				//store that user object
				this.identity = identity;

				//check if there is NOT user
				if (!this.identity._id) {
					//send alert
					alert("User is not correctly logged in...")
				} else {
					//create element on localstorage
					//use localstorage, pass the whole user identity object
					localStorage.setItem('identity', JSON.stringify(identity));

					//get token to send on request
					//use service, pass user object and subscribe to response
					this.userService.signup(this.user, 'true').subscribe(
						//in case of succesful response
						response => {
							//store user token
							const token = response.token;
							//store that user object
							this.token = token;

							//check if there is NOT user
							if (this.token.length <= 0) {
								//send alert
								alert("Could not generate token for User")
							} else {
								//create element on localstorage for token
								//use localstorage, pass the whole user identity object
								localStorage.setItem('token', JSON.stringify(token));
								//reset user for login
								this.user = new User('', '', '', '', '', 'ROLE_USER', '');
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
								this.errorMessage = error.error.message;
								console.log(errorMessage);
							}
						}
					);
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
					this.errorMessage = error.error.message;
					console.log(errorMessage);
				}
			}
		);
	}

	//method to logout
	logout() {
		//remove user info from localstorage
		localStorage.removeItem('identity');
		localStorage.removeItem('token');
		localStorage.clear();

		//reset identity and token
		this.identity = null;
		this.token = null;
	}

	//method for registration
	onSubmitRegister() {
		//user service to regisster, pass property of user object to register
		this.userService.register(this.user_register)
			.subscribe(
				response => {
					//retrieve user from response
					const user = response.user;
					//store that user into property of class to fill data in model
					this.user_register = user;

					//if user does not exist
					if (!user._id) {
						//show error message
						this.alertRegister = 'Error Signing Up';
					} else {
						//show success message
						this.alertRegister = 'You are signed up, please log in with: ' + this.user_register.email;
						//reset user
						this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');
					}
				},
				error => {
					//create message
					const errorMessage = <any>error;

					//If ther is an error, log it
					if (errorMessage != null) {

						//assign error on body to alertRegister property
						this.alertRegister = error.error.message;
						console.log(error);
					}
				}
			)
	}
}
