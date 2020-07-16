/*SONG MODEL */

//export a class for song model
export class Song {
	//constructor for class
	constructor(
		public number: number,
		public name: string,
		public duration: string,
		public file: string,
		public album: string
	) { }
}