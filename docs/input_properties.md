## Input Properties

### input property setter to intercept and act upon a value from the parent.
```
@Input() set name(name: string) {
    this._name = (name && name.trim()) || '<no name set>';
}
get name() { return this._name; }
```

### a parent child with two shared values example.
parent
```
@Component({
  selector: 'parent',
  template: `
    <button (click)="newMinor()">New minor version</button>
    <button (click)="newMajor()">New major version</button>
    <child [major]="major" [minor]="minor"></child>`
})
export class ParentComponent {
  major: number = 1;
  minor: number = 23;
  newMinor() { this.minor++; }
  newMajor() { this.major++; this.minor = 0; }
}
```

child
```
@Component({
  selector: 'child',
  template: `<h3>Version {{major}}.{{minor}}</h3>`
})
export class ChildComponent implements OnChanges {
  @Input() major: number;
  @Input() minor: number;
}
```

### The child with EventEmitter property
The parent binds to the child's EventEmitter property is an output property, 
typically adorned with an @Output decoration as seen in this VoterComponent.
Clicking a button triggers emission of a true or false (the boolean payload).
The parent VoteTakerComponent binds an event handler (onVoted) that responds 
to the child event payload ($event) and updates a counter.
The framework passes the event argument — represented by $event — to the handler method, 
and the method processes it
```
@Component({
  selector: 'vote-taker', // PARENT
  template: `
    <h2>Should mankind colonize the Universe?</h2>
    <h3>Agree: {{agreed}}, Disagree: {{disagreed}}</h3>
    <my-voter *ngFor="let voter of voters"
      [name]="voter"
      (onVoted)="onVoted($event)">
    </my-voter>
  `
})
export class VoteTakerComponent {
  agreed = 0;
  disagreed = 0;
  voters = ['Mr. IQ', 'Ms. Universe', 'Bombasto'];
  onVoted(agreed: boolean) {
    agreed ? this.agreed++ : this.disagreed++;
  }
}
@Component({
  selector: 'my-voter', // CHILD
  template: `<h4>{{name}}</h4>
    <button (click)="vote(true)"  [disabled]="voted">Agree</button>
    <button (click)="vote(false)" [disabled]="voted">Disagree</button>`
})
export class VoterComponent {
  @Input()  name: string;
  @Output() onVoted = new EventEmitter<boolean>();
  voted = false;
  vote(agreed: boolean) {
    this.onVoted.emit(agreed);
    this.voted = true;
  }
}
```

### template reference variable for the child element
then reference that variable within the parent template 
```
@Component({
  selector: 'countdown-parent-lv',
  template: `
  <h3>Countdown to Liftoff (via local variable)</h3>
  <button (click)="timer.start()">Start</button>
  <button (click)="timer.stop()">Stop</button>
  <div class="seconds">{{timer.seconds}}</div>
  <countdown-timer #timer></countdown-timer>
  `,
  styleUrls: ['demo.css']
})
```
 local variable (#timer) on the tag (<countdown-timer>) representing the child component. 
 That gives us a reference to the child component itself and the ability to access any of 
 its properties or methods from within the parent template.

