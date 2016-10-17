import { NgModule }    from '@angular/core';
import { IonicApp }    from 'ionic-angular';
import { IonicModule } from 'ionic-angular';
import { MyApp }       from './app.component';
import { Storage }     from '@ionic/storage';
import { HomePage }    from '../pages/home/home';
import { LoginPage }   from '../pages/login-page/login-page';
import { SignupPage }  from '../pages/signup-page/signup-page';
import { Todos }       from '../providers/todos';
import { Auth }        from '../providers/auth';
import { Dynaform }    from '../pages/dynaform/dynaform';
import { DynamicFormComponent }         from '../forms/dynamic-form.component';
import { DynamicFormQuestionComponent } from '../forms/dynamic-form-question.component';
import { Nestedform } from '../pages/nestedform/nestedform';
import { Nestedmodel } from '../pages/nestedmodel/nestedmodel';
import { AddressComponent } from '../pages/nestedmodel/address.component';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage,
    Dynaform,
    DynamicFormComponent, 
    DynamicFormQuestionComponent,
    Nestedform,
    Nestedmodel,
    AddressComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage,
    Dynaform,
    Nestedform,
    Nestedmodel
  ],
  providers: [
    Storage, 
    Todos, 
    Auth,
    ]
})
export class AppModule {}
