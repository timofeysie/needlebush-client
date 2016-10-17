import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormGroup } from '@angular/forms';
import { FormArray } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { AddressComponent } from './address.component';
import { Customer } from '../../pages/nestedform/customer.interface';

@Component({
  selector: 'page-nestedmodel',
  templateUrl: 'nestedmodel.html'
})
export class Nestedmodel {
  public myForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    private _fb: FormBuilder) {}

  ionViewDidLoad() {
    console.log('Nestedmodel.ionViewDidLoad');
  }

  ngOnInit() {
    console.log('Nestedmodel.ngOnInit');
        this.myForm = this._fb.group({
            name: ['', [Validators.required, Validators.minLength(5)]],
            addresses: this._fb.array([
                this.initAddress(),
            ])
        });
    }

    initAddress() {
        return this._fb.group({
            street: ['', Validators.required],
            postcode: ['']
        });
    }

    addAddress() {
        const control = <FormArray>this.myForm.controls['addresses'];
        control.push(this.initAddress());
    }

    removeAddress(i: number) {
        const control = <FormArray>this.myForm.controls['addresses'];
        control.removeAt(i);
    }

    save(model: Customer) {
        // call API to save
        console.log(model);
    }

}
