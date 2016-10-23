## Styling the forms

On the [Sliding List](https://ionicframework.com/docs/v2/components/#sliding-list) demo
There are grey areas with titles, and white content bars.
We want to use this style for the forms.
What are the ionic tags for this style?

[Here is the source](https://github.com/driftyco/ionic-preview-app/blob/master/src/pages/lists/sliding/template.html) for that example.
```
<ion-content class="outer-content">
  <ion-list>
    <ion-list-header>Busters</ion-list-header>
        <ion-item-sliding>
          <ion-item>
            <ion-avatar item-left>
              <img src="assets/img/venkman.jpg">
            </ion-avatar>
            <h2>Venkman</h2>
            <p>Back off man, I'm a scientist.</p>
          </ion-item>
```

Our sections are less defined than that, and we don't need the sliding functionality.

This currently is not working as expected.  Needs some more restructuring.
First probably should make the inputs more appropriate.
Like a selector for the input types.
Let the user drag the sections to create the order,
or at least a selector for the number, with the numbers pre-filled by the number of sections available.

