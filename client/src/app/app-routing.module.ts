//imports necessary for routing
// import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { UserEditComponent } from './components/user-edit.component';

//array for all routes
const appRoutes: Routes = [
	{
		path: '',
		component: UserEditComponent
	},
	{
		path: 'my-info',
		component: UserEditComponent
	},
	{
		path: '**',
		component: UserEditComponent
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
