import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormGroup } from '@angular/forms';
import { FormArray } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormtypeComponent } from './formtype.component';
import { Formdef } from './formdef.interface';
import { InputTypes } from '../../forms/input-types';

@Component({
  selector: 'createform',
  templateUrl: 'createform.html'
})
export class Createform {
  public myForm: FormGroup;
  public inputTypes = InputTypes; 
  
  constructor(
    public navCtrl: NavController,
    private _fb: FormBuilder) {}

  ionViewDidLoad() {
  }

  ngOnInit() {
        this.myForm = this._fb.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            formtypes: this._fb.array([
                this.initFormtype(),
            ])
        });
    }

    initFormtype() {
        return this._fb.group({
            value: [''],
            key: [''],
            label: [''],
            required: [''],
            order: [''],
            controlType: ['',Validators.required]
        });
    }

    addFormtype() {
        const control = <FormArray>this.myForm.controls['formtypes'];
        control.push(this.initFormtype());
    }

    removeAddress(i: number) {
        const control = <FormArray>this.myForm.controls['formtypes'];
        control.removeAt(i);
    }

    save(model: Formdef) {
        // call API to save
        console.log(model);
    }

}
