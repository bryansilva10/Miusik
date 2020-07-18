import { Component, OnInit } from '@angular/core';
import { Song } from '../models/song';
import { GLOBAL } from '../services/global';

@Component({
	selector: 'player',
	templateUrl: '../views/player.component.html'
})

export class PlayerComponent implements OnInit {
	//properties
	public url: string;
	public song;

	//constructor
	constructor() {
		this.url = GLOBAL.url;
		this.song = new Song(1, '', '', '', '');
	}

	ngOnInit() {
		//get song info from local storage
		let song = JSON.parse(localStorage.getItem('songPlaying'));
		//if it exists..
		if (song) {
			//assign to song on cmponnet
			this.song = song;
		} else {
			//set a new song
			this.song = new Song(1, "", "", "", "");
		}
	}
}