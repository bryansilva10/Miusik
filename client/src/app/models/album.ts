/*ALBUM MODEL */

//export a class for album model
export class Album {
	//constructor for class
	constructor(
		// public _id: string,
		public title: string,
		public description: string,
		public year: number,
		public image: string,
		public artist: string
	) { }
}