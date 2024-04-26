import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { setFullDate } from 'ngx-bootstrap/chronos';
import { setFullYear } from 'ngx-bootstrap/chronos/utils/date-setters';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent {
  @Output() cancelRegister = new EventEmitter();
  registerForm: FormGroup = new FormGroup({});
  maxDate: Date = new Date();
  validationErrors: string[] | undefined;

  constructor(
    private accountService: AccountService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  private initializeForm() {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      gender: ['male'],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(8)]],
      confirmPassword: ['', [
        Validators.required,
        this.matchValues('password')]]
    });
    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () => {
        this.registerForm.controls['confirmPassword'].updateValueAndValidity()
      }
    })
  }

  private matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return (control.value === control.parent?.get(matchTo)?.value) ? null : { notMatching: true }
    }
  }

  public register() {
    const dateOfBirth = this.getDateOnly(this.registerForm.controls['dateOfBirth'].value);

    const registerValues = { ...this.registerForm.value, dateOfBirth: dateOfBirth };

    this.accountService.register(registerValues).subscribe({
      next: () => {
        this.router.navigateByUrl('/members');
      },
      error: error => {
        this.validationErrors = error;
      }
    });
  }

  public cancel() {
    this.cancelRegister.emit(false);
  }

  private getDateOnly(dateOfBirth: string | undefined) {
    if (!dateOfBirth) {
      return;
    }

    let dateOfdob = new Date(dateOfBirth);

    return new Date(dateOfdob.setMinutes(dateOfdob.getMinutes() - dateOfdob.getTimezoneOffset()))
      .toISOString()
      .slice(0, 10);
  }
}
