import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { InputTypes } from '../../forms/input-types';
import { Createform } from './createform';

@Component({
    selector: 'formtype',
    templateUrl: './formtype.component.html',
})
export class FormtypeComponent {
    @Input('group')
    // @Input() public set inputTypes(value: any) {
    //     console.log(value);
    // };
    public formtypeForm: FormGroup;
}