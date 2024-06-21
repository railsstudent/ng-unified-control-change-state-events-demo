import { ChangeDetectionStrategy, Component, OnInit, inject } from "@angular/core";
import { FormGroup, FormGroupDirective, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'app-company-address',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div [formGroup]="formGroup">
      <div>
        <label for="companyName">
          <span>Company Name: </span>
          <input id="companyName" name="companyName" formControlName="name">
        </label>
      </div>
      <div>
        <label for="address">
          <span>Company Address Line 1: </span>
          <input id="line1" name="line1" formControlName="line1">
        </label>
      </div>
      <div>
        <label for="line2">
          <span>Company Address Line 2: </span>
          <input id="line2" name="line2" formControlName="line2">
        </label>
      </div>
      <div>
        <label for="city">
          <span>Company City: </span>
          <input id="city" name="city" formControlName="city">
        </label>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyAddressComponent implements OnInit {
  formGroupDir = inject(FormGroupDirective);
  formGroup!: FormGroup<any>;

  ngOnInit(): void {
    this.formGroup = this.formGroupDir.form.get('company') as FormGroup;
  }
}