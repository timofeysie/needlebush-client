# Ionic Client for a Role Based Authentication App with Passport

This is the client to the [server program](http://www.joshmorony.com/creating-role-based-authentication-with-passport-in-ionic-2-part-1/) created by Ionic 2 guru Josh Morony.

The server is built with NodeJS, MongoDB, Express, and Passport with a API to 
authenticate a user's role based on JWTs (JSON Web Tokens).

Further development is focusing on creating a nested form which will generate a form type definition json file.
This form type definition is basically a form title with any number of fields.
This definition will then be used to create a dynamic model driven form with CRUD functionality.

The form types will replace the todo list on the home page.
Choosing one will let the user edit the definition.

The main points for the dynamic model driven forms are:
- forms are created from a json file format
- there is data relating to the entire form, such as name, date of creation, disable sumnit until valid, etc.
- the form model then has any number of inputs with a range of attributes like type, order, labels etc.
- validation will also be included in the input form model
- each text input field will be created with the same text input field component
- if we need a different text box, then the definition for that will be added to the form model

The form definition is held in app/pages/createform/formdef.interface.ts

The definition of the input types is in app/forms/question-base.ts

## Using a select input for form-type components

We want to provide a list of available input types for the create form page.
That means adding that to the createform/formtype.component template.
The create form page is a hardwired way to create a dynamic form.
The formdef.interface.ts file is the starting point for changes to that form model.

The current member is:
```
controlType: string;
```

It should be:
```
controlType: string [];
```

As noted above the create from controlType is different from the dynamic form controlType.
The dynamic controlType is tied to the types of widgets it creates in the template switch block.
If the controlType == textbox, it create an input field.
If the controlType == dropdown, then it creates a select.

So it is this functionality that we want to extend to the create form page.
Actually, I'm just thinking out loud here.  I'm not sure what the best way to do this is.
Is it a good idea to have the create form interface have an array where the dynamic form has a single string?
I'm not sure.  It might be a good idea to try that for now.

In createform.ts, controlType is used like this:
```
initFormtype() {
        return this._fb.group({
          ...
            controlType: ['',Validators.required]
```

However, this was derived from the nested form example on scotch.io.
We molded it to the model in forms/question-base.ts:
```
export class QuestionBase<T>{
  ...
  controlType: string;
  constructor(options: {
    ...
      controlType?: string
    } = {}) {
      ...
    this.controlType = options.controlType || '';
``` 

To keep things [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), 
we shouldn't have multiple places where the same type is defined.
The page linked to above says  
    "Every piece of knowledge must have a single, unambiguous, authoritative representation within a system".
In this case, where do we hardwire the choices of indput widget?
To avoid having multiple places where the string can be used, we need a constant or enum type.

What do enums look like in [TypeScript](https://www.typescriptlang.org/docs/handbook/enums.html)?
```
const enum InputType {
    textbox,
    dropdown
}
```

Then use it like this:
```
this.controlType = InputType.textbox;
```

Then we import this into the QuestionBase as use it like this:
```
  ...
  controlType: InputType;
  constructor(options: {
      ...
      controlType?: InputType
    } = {}) {
    ...
    this.controlType = InputType.controlType || '';
```

The last line is not going to work.

If it did, we would then use the enum like this:
```
export class TextboxQuestion extends QuestionBase<string> {
  controlType = InputType.textbox;
```

[This question](http://stackoverflow.com/questions/35923744/pass-enums-in-angular2-view-templates) 
has a good idea on how to use enums in an Angular 2 template.
SO: Create a property for your enum on the parent component to your component class and assign the enum to it, then reference that property in your template.
```
export class Parent {
    public dropdownTypes = DropdownType;        
}
```
Child class:
```
export class Dropdown {       
    @Input() public set dropdownType(value: any) {
        console.log(value);
    };
}
```
This allows you to enumerate the enum as expected in your template:
```
<div class="Dropdown" dropdownType="dropdownTypes.instrument"></div>
```
This is how it gets its context. 

So in our case, createform.ts is the parent:
```
import { InputTypes } from '../../forms/input-types';
...
public inputTypes = InputTypes; 
```

formtype.component.ts is the chile (slight return)?
```
    @Input() public set inputTypes(value: any) {
        console.log(value);
    };
```

And in the formtype.component.html:
```
<ion-select type="select" 
    class="form-control"  
    [formControlName]="controlType">
    <ion-option *ngFor="let opt of inputTypes" 
    [value]="opt.key">{{opt.value}}</ion-option>
</ion-select>
```

A big problem is I don't understand this @Input set fn() {} syntax.
And, the error:
```
Unhandled Promise rejection: Template parse errors:
Can't bind to 'group' since it isn't a known property of 'formtype'. ("
<!-- Formtypes array directive -->
<ion-item>
  <formtype [ERROR ->][group]="myForm.controls.formtypes.controls[i]"></formtype>
</ion-item>
```

So does that mean there is a problem in the formtype.component, so it can't be compiled and used in the createform?
If we roll back those changes one by one, we should be able to tell where it is broken.
If we remove the @Input statement in formtype.component.ts, then the app works.

So the weekend is coming up.  Who wants to guess if we will be reading [this part](https://angular.io/docs/ts/latest/cookbook/component-communication.html) of the Angular 2 docs?
Despite that link which says component communication, the title is component interaction.

In the cheatsheet it says this:
```
@Input() myProperty;	
Declares an input property that you can update via property binding 
(example: <my-cmp [myProperty]="someExpression">).
```

It's time to get just a normal select in the create form page.
Then, we can try and make it use an enum type for its values.

Right now we are getting this error:
```
Error in ./FormtypeComponent class FormtypeComponent - inline template:0:5 caused by: 
formGroup expects a FormGroup instance. Please pass one in.
```

SO: initializing your loginForm inside a .then method. 
Since it's an asynchronous action that gets performed at some time in the future, 
upon component initialization (both the class and the template) - value of loginForm is undefined, 
and ngFormModel doesn't recognize it as a form (hence the error).
So if you move your loginForm initialization (this.loginForm = new ControlGroup(...)) outside .then 
in your constructor`, that should fix it.
And in order to keep the functionality that you are trying to achieve, 
which is displaying user's email when it's returned as part of getCurrentUser() response, 
I would suggest you hide the form (or show some kind of loading state) before getCurrentUser returns. 
You already have a [hidden] = "welcome" specified on your <form> element that you can use.

We hid the form if there is no instance of it.  But still the error.

The solution last time was passing in the arrtibute:
```
<dynamic-form [questions]="questions"></dynamic-form>
```

The selector for form types is:
```
<formtype [group]="myForm.controls.formtypes.controls[i]"></formtype>
```

Another strange thing that's happening, is the format of this is a little strange:
```
    @Input('group')
    public inputTypes = ['textbox','dropdown'];
```    

The 'textbox' is white, when it should be brown like the dropdown.
This indicates a formatting error.  There are no red squiggles however.
If we add a ; after the @Input('group'), then the textbox string turns brown, 
but there is a red squggle on the ;.
The hint for that is: ```[ts] Declaration expected.```

The original was this:
```
export class AddressComponent {
    // we will pass in address from App component
    @Input('group')
    public adressForm: FormGroup;
}
```
That is the same formatting, sans the comment.  SO what is it weird now?

If we do this ```@Input('group') {}```, the textbox turns orange, 
but the red squiggly says ```[ts] '=' expected.```
So what is it, an = or a declaration?
group hasn't changed has it?

When the app is run now there is no error, but there is not formtype form.

There is also a strange error in the termianal or all places:
```
[21:43:58]  bundle dev update failed:  Maximum call stack size exceeded
[21:43:58]  RangeError: Maximum call stack size exceeded
    at deepClone (/Users/tim/angular/ionic/i2/crbawpii/client/node_modules/rollup/dist/rollup.js:163:2)
    at deepClone (/Users/tim/angular/ionic/i2/crbawpii/client/node_modules/rollup/dist/rollup.js:165:18)
...
```

Despite those other two strange errors, you might have notices that the solution to this problem, 
as before, was the correct tag attribute setup.
```
<formtype [group]="myForm.controls.formtypes.controls[i]"></formtype>
```
Should be:
```
<formtype [group]="formtypeForm.controls.formtypes.controls[i]"></formtype>
```

Then, the app will not break.  That feels a lot better.
But, we are not out of the woods yet.
The next error is:
```
error_handler.js:47 EXCEPTION: Error in ./Createform class Createform - inline template:34:24 caused by: 
Cannot read property 'controls' of undefined
```

In the formtype.components.ts file, the second inputTypes has a red squiggly:
```
export class FormtypeComponent {
    @Input('group') 
    @Input() public set inputTypes(value: any) {
        console.log(value);
    };
    public inputTypes = ['textbox','dropdown'];
    public formtypeForm: FormGroup;
}
```
The mouseover info says:
```
[ts] Duplicate identifier 'inputTypes'.
[ts] Subsequent variable declarations must have the same type.  
Variable 'inputTypes' must be of type 'any', but here has type 'string[]'.
(property) FormtypeComponent.inputTypes: any
```

So yeah, I understand the duplicate part.  
But how do we set the value as an array of input types then?

[This answer](http://stackoverflow.com/questions/38178280/how-can-i-pass-an-array-as-input-from-the-component-template) 
recommends doing this:  wrap the property with [] otherwise it is not processed by Angular at all:
```
<my-component [data]="[1, 2, 'test']"></my-component>
```

So then how to compose our select input?
```
        <ion-select type="select" 
            class="form-control"  
            [formControlName]="controlType">
            <ion-option [value]=['textbox','dropdown']>{{value}}</ion-option>
        </ion-select>
```

or like this?:
```
<ion-option [inputTypes]=['textbox','dropdown']>{{value}}</ion-option>
```

The first one had a nameless template error, the second, this error:
```
directive_normalizer.js:92Uncaught Error: Template parse errors:
Unexpected closing tag "ion-option" ("ormControlName]="controlType">
            <ion-option [inputTypes]=['textbox','dropdown']>{{value}}[ERROR ->]</ion-option>
        </ion-select>

"): FormtypeComponent@67:69
```

Try this:
```
<ion-option [inputTypes]=['textbox','dropdown']></ion-option>
```

And it's back to the nameless error:
```
directive_normalizer.js:92Uncaught Error: Template parse errors:(…)
```

Trying this in formtype.component.ts
```
 @Input() inputTypes: any[];
```
And tis inthe formtype.component.html:
```
<ion-option [inputTypes]='inputTypes'></ion-option>
```

Causes this familiar error.
```
polyfills.js:3 Unhandled Promise rejection: Template parse errors:
Can't bind to 'inputTypes' since it isn't a known property of 'ion-option'.
1. If 'ion-option' is an Angular component and it has 'inputTypes' input, then verify that it is part of this module.
2. If 'ion-option' is a Web Component then add 
```

That usually means the component is not configured in the app.module.ts file.
But if we try and add that to the declarations array, we get the old huge error:
```
[ts] Argument of type '{ declarations: (typeof MyApp | typeof HomePage | typeof LoginPage | typeof SignupPage | typeof D...' is not assignable to parameter of type 'NgModule'.
       Types of property 'declarations' are incompatible.
         Type '(typeof MyApp | typeof HomePage | typeof LoginPage | typeof SignupPage | typeof Dynaform | typeof...' is not assignable to type '(any[] | Type<any>)[]'.
           Type 'typeof MyApp | typeof HomePage | typeof LoginPage | typeof SignupPage | typeof Dynaform | typeof ...' is not assignable to type 'any[] | Type<any>'.
             Type 'typeof InputTypes' is not assignable to type 'any[] | Type<any>'.
               Type 'typeof InputTypes' is not assignable to type 'Type<any>'.
                 Property 'apply' is missing in type 'typeof InputTypes'.
import InputTypes
```
So what's up with that?  Something in InputTypes is not right.
Well duh, that's are enum which we are trying to exclude right now.
we should call that InputTypesEnum to distinguish it from the input types which is the value of the input.

OK, nothing is working now.
Time to get it working, and then start playing around with it.
You can't do development on a broken app.
So we rolled back the select to a normal hardwired type:
```
        <ion-select type="select" 
            class="form-control"  
            [formControlName]="controlType">
            <ion-option [value]="textbox">textbox</ion-option>
            <ion-option [value]="dropdown">textbox</ion-option>
        </ion-select>
```
And also got rid of the @Input declaration in the component.

And we STILL have an error:
```
error_handler.js:47 EXCEPTION: Error in ./Createform class Createform - inline template:34:24 caused by: 
Cannot read property 'controls' of undefined
```

There is additional information in the stacktrace.
Near the bottom of all that useful information, there is this:
```
polyfills.js:3 Uncaught 
ViewWrappedError
_nativeError
:
Error: Error in ./Createform class Createform - inline template:34:24 caused by: 
Cannot read property 'controls' of undefined at ViewWrappedError.BaseError [as constructor] 
(http://localhost:8100/build/main.js:1144:34) at ViewWrappedError.WrappedError [as constructor] 
(http://localhost:8100/build/main.js:1173:16) at new ViewWrappedError (http://localhost:8100/build/main.js:5395:16) at _View_Createform2.DebugAppView._rethrowWithContext (http://localhost:8100/build/main.js:10286:23) at _View_Createform2.DebugAppView.detectChanges (http://localhost:8100/build/main.js:10272:18) at _View_Createform0.AppView.detectContentChildrenChanges (http://localhost:8100/build/main.js:10182:19) at _View_Createform0.detectChangesInternal (Createform.ngfactory.js:515:8) at _View_Createform0.AppView.detectChanges (http://localhost:8100/build/main.js:10164:14) at _View_Createform0.DebugAppView.detectChanges (http://localhost:8100/build/main.js:10269:44) at _View_Createform_Host0.AppView.detectViewChildrenChanges (http://localhost:8100/build/main.js:10190:19)
message
...
```

Even without that entire select input, we are getting that error, so something else must be wrong.
But what?  It's in the create form component, that is shown in the error.
Someone else had that error, in a comment on a tutorial page, with no answer four months ago.
That was it.  No more hits on Google, so we are on our own with this one.

If you click on the error handler line in the console, you get generated JavaScript code errors like this:
```
this._console.error("EXCEPTION: " + this._extractMessage(error));
self.renderer.setBindingDebugInfo(self._el_15,'ng-reflect-formtype-form','[ERROR] Exception while trying to serialize the value');
```
Not particularly helpful.

In create forms however, we still had some code from the enum select days:
```
  public inputTypes: any[]; 
```

Another problem in our code versus the example on Scotch.io was that we were not implementing OnInit.
This would mean that thengOnInit was not being called?
But the error still happens without it.

Other than that, we added required to out controlType:
```
controlType: ['',Validators.required]
``` 

This was working at some point.  Before the enums.

The error says "Cannot read property 'controls' of undefined", 
so whatever is coming before controls is undefined.

That is the sub-component of the create form component:
```
<formtype [group]="formtypeForm.controls.formtypes.controls[i]"></formtype>
```

So look at how that is being created next time. 
Out of time today!



## Understanding the nested forms

It's all about the form builder on this one. 
Of the three functions it has, the last is the most mysterious.
- group: construct a new form group. E.g. our myForm and address model
- array: construct a new form array. E.g. our customer's list of addresses
- control: construct a new form control.

They all have the same API:
function(default-value, validator/array-of-validators, async-validator)

Here is the name property:
```
formBuilder.group({name: ['', [Validators.required, Validators.minLength(5)]]
```

Now that's rockin'.

Here comes the (simplified) nesting magic:
```
addresses: formBuilder.array([initAddress()])
```

Blam!  The initAddress function returns another formBuilder:
```
group({ street: ['', Validators.required], postcode: ['']
```

Street required, postcode, is like, whatever you want it to be.

The magic happens when we add an address:
```
    const control = <FormArray>this.myForm.controls['addresses'];
    control.push(this.initAddress());
```

[Shazam!](https://angular.io/docs/ts/latest/guide/forms.html)

It's in the template where the shizm hit's the fasm:
```
<small *ngIf="!myForm.controls.name.valid">
    Name is required (minimum 5 characters).
</small>
```

That's the validation in action.  If you don't know, then pay attention.

This is what's called a ```microsyntax```
```
<div formArrayName="addresses">
  <div *ngFor="let address of myForm.controls.addresses.controls; let i=index">
```

Double up on the control, damn!  No you didn't!

Here's some more of that good validational stuff:
```
<label>street</label>
<input type="text" formControlName="street">
<small [hidden]="myForm.controls.addresses.controls[i].controls.street.valid">
    Street is required
</small>
```

All right trend setters and party people.  It's getting real now.
- ```formControlName``` is an <i>directive</i> baby, the form control name!
- ```formArrayName``` ditto, but fer dem nested biatches.
- ```formGroupName``` array with the index number as the group name thus index i = formGroupName

Now, for our next number, we will split out the nested part.

So we need to get our naming under control pronto.

Dynaform
- name
- input
Formtype
- value
- key
- label
- required
- order
- controlType


### Dynamic model driven validation

Remeber the foolish validation for name:
```
name: ['', [Validators.required, Validators.minLength(5)]
```

We will need to think about how to include this info in our json.

Here be the textbox json:
```
{
    key: 'firstName',
    label: 'Name',
    value: '',
    required: true,
    order: 1
}
```

This will be the way the nested form will have to save its created data.

It will get messy if we just start adding validation methods.
They will get extreme, such as conditional questions,
connected validation (like two password fields that must match).

Now that I think about it, there was a talk at ngSyd which dealt with that.

Anyhow, one step at a time.
First, the more orderly nested model driven form sample from scotch.io.

We'll cakk that nestedmodel.

After adding the page in the usual manner, and then adding [the demo code](https://scotch.io/tutorials/how-to-build-nested-model-driven-forms-in-angular-2),
we are faced with this error:
```
Can't bind to 'group' since it isn't a known property of 'address'. ("div class="panel-body" [formGroupName]="i">
    <!-- address directive -->
    <address [ERROR ->][group]="myForm.controls.addresses.controls[i]"></address>
```
So our new sub-component has a problemo.

Probably because the AddressComponent was not in the app.module.ts declarations array.
Yep, that was it.  Time to commit before the next setp.

## Create the Createfrom component
Merging the dynaform with the nested data model.

Page name: createform

Formdef
- name
- input: Formtype []

Formtype
- value
- key (key: 'firstName', label: 'First name')
- label
- required
- order
- controlType (textbox, dropdown, etc)

textbox json:
```
{
    key: 'firstName',
    label: 'Name',
    value: '',
    required: true,
    order: 1
}
```

The file changes:
- copy nestedmodel folder -> creatform folder
- address.component.html -> formtype.component.html
- address.component.ts -> formtype.component.ts
- nestedmodel.html -> createform.html
- nestedmodel.scss -> createform.css
- nestedmodel.ts -> createform.ts

Inside the file changes
- address.component.html -> formtype.component.html
adressForm -> 

- address.component.ts -> formtype.component.ts
    selector: 'address', -> formtype
    templateUrl: './address.component.html', -> formtype.component.html
export class AddressComponent { -> FormtypeComponent
    @Input('group')
    public adressForm: FormGroup; -> formtypeForm: FormGroup;

- app.module.ts
AddressComponent -> FormtypeComponent
-> import { FormtypeComponent } from '../pages/createform/formtype.component';
-> and in declarations
  selector: 'page-nestedmodel', -> 'page-creatform',
  templateUrl: 'nestedmodel.html' -> 'creatform.html'
export class Nestedmodel -> Createform
ngOnInit() {
...
            addresses: this._fb.array([ -> formtype: this._fb.array([
                this.initAddress(), -> this.initFormtype(),

- nestedmodel.html -> createform.html

- nestedmodel.scss -> createform.css

- nestedmodel.ts -> createform.ts
import { AddressComponent } from './address.component';
->    { FormtypeComponent } from './formtype.component';

addAddress() { -> addAFormtype() {
  addresses -> formtypes

removeAddress(i: number) { -> removeFormtype(i: number) {

It's a little strange, but 
in formtype.component.ts
addressForm -> formtypeForm

After all that, and getting rid of the nestedform and nestedmodel pages and components,
we have this error:
```
error_handler.js:47 
EXCEPTION: Error in ./HomePage class HomePage - 
inline template:8:6 caused by: No component factory found for Createform
```

That was just the home.ts configuration.

Next error, is of course, the control part of the form:
```
error_handler.js:47 EXCEPTION: Error in ./Createform class Createform - 
inline template:16:9 caused by: 
Cannot find control with name: 'formtypes'
```
Now is it formtype or formtypes?
The array is called formtypes, which is an array of formtype.
In the createform.ts, it had to be created liek this:
```
formtypes: this._fb.array([this.initFormtype() ...])
```
Then we are all good.  Time to style the form.

## Creating an Ionic model driven form layout

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

Next, create the interface for the data type.
The demo is a name and multiple addresses.
We will have a name (of the form) and multiple inputs.
The name scheme we have so far is nested-profile.interface.ts:
```
export interface NestedProfile {
    name: string;
    inputs: NestedInput[];
}
export interface NestedInput <T> {
  value: T;
  key: string;
  label: string;
  required: boolean;
  order: number;
  controlType: string;
}
```

The NestedProfile has red squigglies under it with the tool tip:
```
[ts] Generic type 'NestedInput<T>' requires 1 type argument(s).
interface NestedInput<T>
```

So this might be the right way to write it:
```
export interface NestedProfile <T> {
    name: string;
    inputs: T[];
}
```

But this would replace the entire type of the object. 
We want to just replace the type of a member. 
Here's another idea:
```
export interface NestedProfile {
    name: string;
    inputs: NestedInput<any>[];
}
```

Worth giving a try.

The changes made from the customer.interface.ts demo:
```
Customer -> NestedProfile
Address -> NestedInput
addresses -> inputs
```

The old nested form had only two members:
```
street: string;
postcode: string;
```

Our new model has:
```
value: T;
key: string;
label: string;
required: boolean;
order: number;
controlType: string;
```

Probably don't need value at this point. 
Infact, this whole idea needs re-thinking.

We will just leave the customer & address page intact for now as a reference 
and create a new page with a better naming scheme for the form type definition.

Form type defition sounds too much like a DTD.

Formtype is more succint.



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


