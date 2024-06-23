import { ChangeDetectionStrategy, Component, VERSION } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { FormControl, FormGroup, FormResetEvent, FormSubmittedEvent, PristineChangeEvent, ReactiveFormsModule, TouchedChangeEvent, Validators } from '@angular/forms';
import { CompanyAddressComponent } from './company-address/company-address.component';
import { makeRequiredControl } from './reactive-form.util';
import { combineLatest, filter, map, scan, Subject } from 'rxjs';
import { controlStatus } from './control-status.operator';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe, AsyncPipe, CompanyAddressComponent],
  template: `
     <div class="container">
      <h1>Angulara Version: {{ version }}!</h1>
      <h3>Form Unified Control State Change Events</h3>
      <h4>Type Pikachu in the name field to trigger valueChanges</h4>

      <form [formGroup]="formGroup" (reset)="resetMyForm($event)" (submit)="formSubmit.next()">
        <div>
          <label for="name">
            <span [style.color]="isNamePristine$ | async"
              [style.fontWeight]="isNameTouched$ | async"
            >Name: </span>
            <input id="name" name="name" formControlName="name">
          </label>
        </div>
        <div>
          <label for="email">
            <span>Email: </span>
            <input id="email" name="email" formControlName="email">
          </label>
        </div>
        <app-company-address />
        <div>
          <button type="submit">Submit</button>
          <button type="reset">Reset</button>
        </div>
      </form>

      <div>
        @if (fields$ | async; as fields) {
          <p>
          Number of completed fields: {{ fields.completed }},
          Percentage: {{ fields.percentage }}
          </p>
        }
        @if (isPikachu$ | async; as isPikachu) {
          <p>Pikachu is my favorite Pokemon.</p>
        }
        @if(formReset$ | async; as formReset) {
          <p>Form reset occurred at {{ formReset.timestamp }}. Form reset occurred {{ formReset.count }} times.</p>
        }
        @if(formSubmit$ | async; as formSubmit) {
          <p>Form submit occurred at {{ formSubmit.timestamp }}.</p>
          <pre>Form Values: {{ formSubmit.values | json }}</pre>
        }
      <div>
    <div>
  `,
  styles: `
    :host {
      display: block;
    }

    div.container {
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
      padding-left: 1rem;
      padding-right: 1rem;
    }

    button {
      margin-right: 1rem;
    }

    form {
      border: 1px solid black;
      margin-top: 0.5rem;
      border-radius: 4px;
      padding: 1rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  version = VERSION.full;

  formGroup = new FormGroup({
    name: makeRequiredControl('Test me'),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.email, Validators.required],
      updateOn: 'blur',
    }),  
    company: new FormGroup({
      name: makeRequiredControl(''),
      line1: makeRequiredControl(''),
      line2: makeRequiredControl(''),
      city: makeRequiredControl(''),
    })
  });

  formSubmit = new Subject<void>();

  formControls = this.formGroup.controls;
  companyControls = this.formControls.company.controls;
  isEmailValid$ = this.formControls.email.events.pipe(controlStatus());
  isNameValid$ = this.formControls.name.events.pipe(controlStatus(1));
  isCompanyNameValid$ = this.companyControls.name.events.pipe(controlStatus());
  isLine1Valid$ = this.companyControls.line1.events.pipe(controlStatus());
  isLine2Valid$ = this.companyControls.line2.events.pipe(controlStatus());
  isCityValid$ = this.companyControls.city.events.pipe(controlStatus());
  isPikachu$ = this.formGroup.controls.name.valueChanges
    .pipe(map((e) => e.toLowerCase() === 'pikachu'));

  isNamePristine$ = this.formControls.name.events.pipe(
    filter((e) => e instanceof PristineChangeEvent),
    map((e) => e as PristineChangeEvent),
    map(({ pristine }) => pristine ? 'black' : 'blue'),
  )

  isNameTouched$ = this.formControls.name.events.pipe(
    filter((e) => e instanceof TouchedChangeEvent),
    map((e) => e as TouchedChangeEvent),
    map(({ touched }) => touched ? 'bold' : 'normal'),
  )  

  fields$ = combineLatest([
    this.isEmailValid$, 
    this.isNameValid$,
    this.isCompanyNameValid$,
    this.isLine1Valid$,
    this.isLine2Valid$,
    this.isCityValid$,
  ])
    .pipe(
      map((validArray) => {
        const completed = validArray.reduce((acc, item) => acc + item);
        const percentage = ((completed / validArray.length) * 100).toFixed(2);
        return {
          completed,
          percentage,
        }
      }),
    );
 
  formReset$ = this.formGroup.events.pipe(
    filter((e) => e instanceof FormResetEvent),
    map(() => new Date().toISOString()),
    scan((acc, timestamp) => ({
        timestamp,
        count: acc.count + 1,
      }), { timestamp: '', count: 0 }),
  );

  formSubmit$ = this.formGroup.events.pipe(
    filter((e) => e instanceof FormSubmittedEvent),
    map(({ source }) => ({ 
      timestamp: new Date().toISOString(),
      values: source.valid ? source.value: {} 
    })),
  );

  resetMyForm(e: Event) {
    e.preventDefault();
    this.formGroup.reset();
  }
}
