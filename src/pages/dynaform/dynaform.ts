import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { QuestionService } from '../../forms/question.service';

@Component({
  selector: 'page-dynaform',
  templateUrl: 'dynaform.html',
  providers: [
    QuestionService],
})
export class Dynaform {
  
  questions: any[];
  constructor(
    public navCtrl: NavController,
    private service: QuestionService) {
      this.questions = service.getQuestions();
      console.log('Dynaform:questions',this.questions);
    }

  ionViewDidLoad() {
    console.log('Hello Dynaform Page');
  }
}
