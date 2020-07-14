//imports necessary for routing
// import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

//import components
import { UserEditComponent } from './components/user-edit.component';
import { ArtistListComponent } from './components/artist-list.component';
import { ArtistAddComponent } from './components/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-detail.component';
import { AlbumAddComponent } from './components/album-add.component';
import { HomeComponent } from './components/home.component';


//array for all routes
const appRoutes: Routes = [
	{
		path: '',
		component: HomeComponent
	},
	{
		path: 'artists/:page',
		component: ArtistListComponent
	},
	{
		path: 'create-artist',
		component: ArtistAddComponent
	},
	{
		path: 'edit-artist/:id',
		component: ArtistEditComponent
	},
	{
		path: 'artist/:id',
		component: ArtistDetailComponent
	},
	{
		path: 'create-album/:artist',
		component: AlbumAddComponent
	},
	{
		path: 'my-info',
		component: UserEditComponent
	},
	{
		path: '**',
		component: HomeComponent
	}
];

//ng module to import and export modules
@NgModule({
	//import router moule for app Routes
	imports: [RouterModule.forRoot(appRoutes)],
	//export this router module to be used in app module
	exports: [RouterModule]
})

//expor the routing class
export class AppRoutingModule {

}
