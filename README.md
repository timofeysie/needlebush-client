# Ionic Client for a Role Based Authentication App with Passport

This is the client to the [server program](http://www.joshmorony.com/creating-role-based-authentication-with-passport-in-ionic-2-part-1/) created by Ionic 2 guru Josh Morony.

## Creating an Ionic model driven form

The items are in a form that begins in dynamic-form.component.html.

```
<form  *ngIf="form" (ngSubmit)="onSubmit()" 
  [formGroup]="form">
  <ion-list *ngFor="let question of questions" 
    class="form-row">
    <ion-item>
      <df-question [question]="question" 
        [form]="form"></df-question>
```

Then, in the dynamic-form-question.component.html, we have the inputs:
```
<div [formGroup]="form">
  <ion-label [attr.for]="question.key">{{question.label}}</ion-label>
  <div [ngSwitch]="question.controlType">
    <ion-input *ngSwitchCase="'textbox'"></ion-input>
```

The default inputs need some work.
The border points out how the native input elements don't match the Ionic styles, 
but the form from the demo is working now.

Next we can either go deeper into the validation, 
or create a nested form example to create the model for the dynaforms.

## Local development

Running the app locally, replace:
```
https://git.heroku.com/needlebush.git
```

With 
```
http://localhost:8080
```

The node-mongodb-native/connection will time out in the server.js file after a bit of inactivity.
This app is in a different project that is deployed to Heroku only.

## Setting up the Nested form

We start by using the CLI again:
```
$ ionic g page nestedform
```
Add the imnport in src/app/app.module.ts:
```
import { Nestedform } from '../pages/nestedform/nestedform';
```
Add the page to the declarations and entryComponents arrays.
Also add the import in home.ts and add a goto function.

## Setting up the Dynaform

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

The only [StackOverflow answer](http://stackoverflow.com/questions/38444778/formgroup-expects-a-formgroup-instance) of note gives this advice:
- <div [formGroup]="form"> outside of a <form> tag
- <form [formGroup]="form"> but the name of the property containing the FormGroup is loginForm therefore it should be <form [formGroup]="loginForm">
- [formControlName]="dob" which passes the value of the property dob which doesn't exist. What you need is to pass the string dob like [formControlName]="'dob'" or simpler formControlName="dob"

None of this is relevant.
We may as well step through the control flow with our [rubber duckie](https://en.wikipedia.org/wiki/Rubber_duck_debugging):

```
<dynamic-form></dynamic-form> 
```
is the entry point to the dynamic-form-component.ts

And there it is!  Rubber duckie does it again! 
It should be:
```
<dynamic-form [questions]="questions"></dynamic-form>
```
No wonder there were no form elements, we weren't passing in any!


