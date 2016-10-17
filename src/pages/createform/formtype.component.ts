import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'formtype',
    templateUrl: './formtype.component.html',
})
export class FormtypeComponent {
    @Input('group')
    public formtypeForm: FormGroup;
}