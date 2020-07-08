import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from '../models/user';
import { GLOBAL } from '../services/global';

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
	public filesToUpload: Array<File>;
	public url: string;

	constructor(private userService: UserService) {
		this.title = 'Update info';


		//get from local storage
		this.identity = this.userService.getIdentity();
		this.token = this.userService.getToken();
		//set user to info retrieed from localstorage
		this.user = this.identity;
		this.url = GLOBAL.url;
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

						//if there are no file upload
						if (!this.filesToUpload) {
							//redirect
						} else {
							//make request
							this.makeFileRequest(this.url + 'upload-image-user/' + this.user._id, [], this.filesToUpload)
								.then(
									(result: any) => {
										//set user property
										this.user.image = result.image;
										//modify in local storage
										localStorage.setItem('identity', JSON.stringify(this.user));

										//define image path
										let imagePath = this.url + 'get-image-user/' + this.user.image;
										//set src for user image on DOM
										document.getElementById('imageLogged').setAttribute('src', imagePath)
									}
								)
						}

						//show message
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

	//method to get image when selected
	fileChangeEvent(fileInput: any) {
		//retrieve selected files from input and assign to property
		this.filesToUpload = <Array<File>>fileInput.target.files;
	}

	//method to request a file upload
	makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
		//retrieve token so only auth users can upload
		const token = this.token;

		//return promise with
		return new Promise((resolve, reject) => {
			//instantiante formData object
			const formData: any = new FormData();
			//xhr object for request
			const xhr = new XMLHttpRequest();

			//loop through array of fies and append to form
			for (let i = 0; i < files.length; i++) {
				//append key, file and filename to formData
				formData.append('image', files[i], files[i].name);
			}

			//check status of response
			xhr.onreadystatechange = () => {
				//if request concluded...
				if (xhr.readyState == 4) {
					//if request is succesful
					if (xhr.status == 200) {
						//resolve with parsed responsse
						resolve(JSON.parse(xhr.response));
					} else {
						//reject with response
						reject(xhr.response);
					}
				}
			}

			//configure request
			xhr.open('POST', url, true);
			//set headers for token auth
			xhr.setRequestHeader('Authorization', token);
			//send request
			xhr.send(formData);
		})
	}
}
