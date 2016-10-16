import { Component, Input, OnInit }  from '@angular/core';
import { FormGroup }                 from '@angular/forms';
import { QuestionBase }              from './question-base';
import { QuestionControlService }    from './question-control.service';
/**
 * DynamicFormComponent is the entry point and the main container for the form.
 * Create components to represent the dynamic form.
 * It presents a list of questions, each question bound to 
 * a <df-question> component element. 
 * The <df-question> tag matches the DynamicFormQuestionComponent, 
 * the component responsible for rendering the details of each individual 
 * question based on values in the data-bound question object.
 */
@Component({
  // moduleId: module.id,
  selector: 'dynamic-form',
  templateUrl: './dynamic-form.component.html',
  providers: [ QuestionControlService ]
})
export class DynamicFormComponent implements OnInit {
  @Input() questions: QuestionBase<any>[] = [];
  form: FormGroup;
  payLoad = '';
  constructor(private qcs: QuestionControlService) {  }
  
  /**
   * (property) DynamicFormComponent.qcs: QuestionControlService  
   */
  ionViewDidLoad() {
    this.form = this.qcs.toFormGroup(this.questions);
    console.log('DynamicFormComponent.ionViewDidLoad:got form',this.form);
  }
  ngOnInit() {
    this.form = this.qcs.toFormGroup(this.questions);
    console.log('DynamicFormComponent.ngOnInit:got form',this.form);
  }
  onSubmit() {
    this.payLoad = JSON.stringify(this.form.value);
  }
}
