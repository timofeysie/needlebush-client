# Ionic Client for a Role Based Authentication App with Passport

This is the client to the [server program](http://www.joshmorony.com/creating-role-based-authentication-with-passport-in-ionic-2-part-1/) created by Ionic 2 guru Josh Morony.


## Local development

Running the app locally, replace
```
https://git.heroku.com/needlebush.git
```
With http://localhost:8080
```
The node-mongodb-native/connection will time out in the server.js file after a bit of inactivity.
This app is in a different project that is deployed to Heroku only.


## Dynaforms

Trying to use the [dynamic model driven forms example](https://angular.io/docs/ts/latest/cookbook/dynamic-form.html#!#top)
in the Angular 2 cookbook in Ionic.
Starting off by generating a page that will hold the form.

```
$ ionic g page dynaform
```

Then, in src/app/app.module.ts:
```
import { Dynaform } from '../pages/dynaform/dynaform';
```

Add the page to the declarations and entryComponents arrays.

Add all the dynamic model driven forms stuff to a forms directory.

The first problem:
```
[ts] Cannot find name 'module'. any
```

Had to add './' to the template urls and get rid of the moduleId: module.id
which allows for relative paths to the template.

In the Angular sample, to add the questions to a page, we had to do this:
```
import { QuestionService } from './question.service';
@Component({
    providers: [QuestionService],
})
export class Wherever { 
  questions: any[];
  constructor(service: QuestionService) {
    this.questions = service.getQuestions();
  }
}
```

Also need to add imports and declarations in app.module.ts?

After doing all this, we get this error:
```
EXCEPTION: Error in ./Dynaform class Dynaform_Host - 
inline template:0:0 caused by: No provider for QuestionControlService!
```

So add this to the providers in app.module.ts like this:
```
Dynaform,
    DynamicFormComponent, 
    DynamicFormQuestionComponent 
```
and then we have the next error:
```
Unhandled Promise rejection: No provider for QuestionControlService! ; Zone: <root> ; Task: Promise.then ; Value: 
```

Importing the QuestionControlService, and forgetting to put it into the providers caused this error:
```
metadata_resolver.js:275Uncaught Error: Unexpected value 'QuestionControlService' declared by the module 'AppModule'(…)
```

SO: One component can only be in directives of a single @NgModule

If the QuestionControlService isn't configured in the app.modul.ts, then where is it configured?

The solution was to import and provide the QuestionControlService in our dynaforms page component.

However, no form elements show up.

They are created alright in the question.service.ts,
but don't make it into the troublesome question-control.service.ts
Where is the disconnect?  Where is our diagram?

Those valuse are populated in the dynamic-form.component.ts via ngOnInit.
Remember, that Ionic has different lifecycle hooks.
So what was it called?
ionViewDidLoad.

So, making that change reveals the next error:
```
error_handler.js:47 EXCEPTION: 
Error in ./DynamicFormComponent class DynamicFormComponent - 
inline template:3:9 caused by: 
formGroup expects a FormGroup instance. Please pass one in.
       Example:
    <div [formGroup]="myGroup">
      <input formControlName="firstName">
    </div>
    In your class:
    this.myGroup = new FormGroup({
       firstName: new FormControl()
    });
```

Quite a little tutorial there in the error.
Maybe we need to replace all the ngOnInits?
There are no other occurances of it.

SO: You need to set this.businessForm instance before angular2 renders view. 
- Solution_1: Use *ngIf to show form only after you set instance of formBuilder.
- Solution_2: Set formbuilder this.businessForm with default values and then update 
your form when you get response from API.

However, doing this:
```
*ngIf="form"
```
the form will never show.
I think the problem is, all the functionality that is in the dynamic-form.component should be in the dynaform page component.

Since this is like a directive/component, with a selector, 
it is not like a page component/controller, in the language of the old people.

ionViewDidLoad never gets called but ngOnInit() does.
It just doesn't have anything in the form.

Solution_2 wont work becuase we don't know what the shape of the form will be.
It looks like there is a blank form there already, just there are no elements in it.

So what's next?
