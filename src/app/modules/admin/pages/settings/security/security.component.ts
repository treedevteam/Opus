import { FuseAlertType } from '@fuse/components/alert';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, NgForm, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from 'app/core/auth/auth.service';




@Component({
    selector       : 'settings-security',
    templateUrl    : './security.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsSecurityComponent implements OnInit
{

    @ViewChild('changePasswordNgForm') changePasswordNgForm: NgForm;
    securityForm: FormGroup;
    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _authService: AuthService,

    )
    {
    }

    get new_confirm_password(): AbstractControl {
        return this.securityForm.controls['new_confirm_password'];
    }

    get password(): AbstractControl {
        return this.securityForm.controls['new_password'];
      }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Create the form
        this.securityForm = this._formBuilder.group({
            current_password: [null, Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(30)])],
            new_password: [null, Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(30)])],
            new_confirm_password: [null, Validators.compose([Validators.required])]
        });
    }

    onPasswordChange(): void{
        if (this.new_confirm_password.value === this.password.value) {
            this.new_confirm_password.setErrors(null);
          } else {
            this.new_confirm_password.setErrors({ incorrect: true });
          }

    }

    changePassword(): void
    {

        // Return if the form is invalid
        if ( this.securityForm.invalid )
        {
            return;
        }

        // Disable the form
        this.securityForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Sign in
        this._authService.changepassword(this.securityForm.value)
            .subscribe(
                (res) => {
                    this.alert = {
                        type   : 'success',
                        message: res.success
                    };

                    // Show the alert
                    this.showAlert = true;
                    console.log(res);
                    this.securityForm.enable();

                    this.securityForm.reset({kodeitem:' '});

                },
                (response) => {

                    // Re-enable the form
                    this.securityForm.enable();

                    // Reset the form

                    // Set the alert
                    this.alert = {
                        type   : 'error',
                        message: response.error.errors.current_password
                    };

                    // Show the alert
                    this.showAlert = true;
                }
            );
    }

}
