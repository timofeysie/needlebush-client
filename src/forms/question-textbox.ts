import { QuestionBase } from './question-base';
import { InputTypes } from './input-types';
/**
 * TextboxQuestion supports multiple html5 types like text, email, url etc via the type property.
 */
export class TextboxQuestion extends QuestionBase<string> {
  //controlType = InputType.textbox;
  controlType = 'textbox';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}
