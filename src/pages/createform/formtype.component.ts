import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Createform } from './createform';

@Component({
    selector: 'formtype',
    templateUrl: './formtype.component.html',
})
export class FormtypeComponent {
    @Input('group') 
    //@Input() inputTypes: any[];
    //public inputTypes = ['textbox','dropdown'];
    public formtypeForm: FormGroup;
}