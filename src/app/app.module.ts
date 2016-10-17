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
import { FormtypeComponent } from '../pages/createform/formtype.component';
import { Createform } from '../pages/createform/createform';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage,
    Dynaform,
    DynamicFormComponent, 
    DynamicFormQuestionComponent,
    FormtypeComponent,
    Createform
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
    Createform
  ],
  providers: [
    Storage, 
    Todos, 
    Auth,
    ]
})
export class AppModule {}
