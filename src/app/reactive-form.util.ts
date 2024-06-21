import { FormControl, FormGroup, Validators } from "@angular/forms";

export function countTotalFields(formGroup: FormGroup): number {
  const keys = Object.keys(formGroup.controls);
  let acc = 0;
  for (const key of keys) {
    const control = formGroup.controls[key];
    if (control instanceof FormGroup) {
      acc = acc + countTotalFields(control);
    } else {
      acc = acc + 1;
    }
  }
  return acc;
}

export function makeRequiredControl(defaultValue: any) {
  return new FormControl(defaultValue, {
    nonNullable: true, 
    validators: [Validators.required],
    updateOn: 'blur'
  });
}
