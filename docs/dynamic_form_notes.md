### QuestionBase
```JavaScript
export class QuestionBase<T>{
  value: T;
  required: boolean;
  order: number;
  controlType: string;
  constructor(options: { value?: T, ...
    } = {}) { // set defaults}
}
```
### DropdownQuestion
```JavaScript
export class DropdownQuestion extends QuestionBase<string> {
  controlType = 'dropdown';
  options: {key: string, value: string}[] = [];
  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
  }
}
```
### TextboxQuestion
```JavaScript
export class TextboxQuestion extends QuestionBase<string> {
  controlType = 'textbox';
  type: string;
  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}
```
### DynamicFormComponent
```JavaScript
@Component({
  selector: 'dynamic-form',
  templateUrl: './dynamic-form.component.html',
  providers: [ QuestionControlService ]
})
export class DynamicFormComponent implements OnInit {
  @Input() questions: QuestionBase<any>[] = [];
  form: FormGroup;
  constructor(private qcs: QuestionControlService) {  }
```
### DynamicFormComponent Template
```html
<form  *ngIf="form" 
        (ngSubmit)="onSubmit()" 
        [formGroup]="form">
  <ion-list *ngFor="let question of questions" 
        class="form-row">
      <ion-item>
        <df-question [question]="question" 
                     [form]="form"></df-question>
      </ion-item>
  </ion-list>
  <div class="form-row">
    <button type="submit" 
            [disabled]="!form.valid">Save</button>
  </div>
</form>
```
### DynamicFormQuestionComponent
```JavaScript
@Component({
  selector: 'df-question',
  templateUrl: './dynamic-form-question.component.html',
})
export class DynamicFormQuestionComponent {
  @Input() question: QuestionBase<any>;
  @Input() form: FormGroup;
  get isValid() { return this.form.controls[this.question.key].valid; }
}
```
### DynamicFormQuestionComponent Template
```html<div [formGroup]="form">
  <ion-label [attr.for]="question.key"
    floating>{{question.label}}</ion-label>
  <div [ngSwitch]="question.controlType">
    <ion-input *ngSwitchCase="'textbox'" 
        [formControlName]="question.key"
        [id]="question.key" 
        [type]="question.type"></ion-input>
    <ion-select *ngSwitchCase="'dropdown'" 
        [formControlName]="question.key"
        [id]="question.key">
      <ion-option *ngFor="let opt of question.options" 
        [value]="opt.key">{{opt.value}}</ion-option>
    </ion-select>
  </div> 
  <div class="errorMessage" 
    *ngIf="!isValid">{{question.label}} is required</div>
</div>
```
### QuestionService
```JavaScript
@Injectable()
export class QuestionService {
  getQuestions() {
    let questions: QuestionBase<any>[] = [
      new DropdownQuestion({
        key: 'brave',
        label: 'Favorite character',
        options: [
          {key: 'myra',  value: 'Myra'},
          {key: 'hakea',  value: 'Hakea Blossumn'},
          {key: 'stingray',   value: 'The Stringray'},
        ],
        order: 2
      }),
      new TextboxQuestion({
        key: 'firstName',
        label: 'Name',
        value: '',
        required: true,
        order: 1
      })
    ];
    console.log('questions',questions);
    return questions.sort((a, b) => a.order - b.order);
  }
```
### Dynaform
```JavaScript
@Component({
  selector: 'page-dynaform',
  templateUrl: 'dynaform.html',
  providers: [
    QuestionService],
})
export class Dynaform {
  questions: any[];
  constructor(private service: QuestionService) {
      this.questions = service.getQuestions();
    }
}
### Dynaform Template
```html
<dynamic-form [questions]="questions"></dynamic-form>
```
