import { FormControl, Validators } from "@angular/forms";

export function makeRequiredControl(defaultValue: any) {
  return new FormControl(defaultValue, {
    nonNullable: true, 
    validators: [Validators.required],
    updateOn: 'blur'
  });
}
