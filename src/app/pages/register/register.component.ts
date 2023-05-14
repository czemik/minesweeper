import { Component } from '@angular/core';
import { User } from '../../shared/models/User';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  loading: boolean = false;
  registerForm = new FormGroup({
    username: new FormControl('', Validators.required),
    email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
    password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(8)])),
    rePassword: new FormControl('', Validators.compose([Validators.required, Validators.minLength(8)])),
  });

  constructor(private authService: AuthService, private router: Router, private userService: UserService, private snackBar: MatSnackBar){

  }

  onSubmit(){
    if (this.registerForm.get('email')!.value === '' || this.registerForm.get('password')!.value === '' 
          || this.registerForm.get('rePassword')!.value === '' || this.registerForm.get('username')!.value === ''){
      this.snackBar.open("Fill the fields!", "Cancel")
      this.loading = false;
      return
    }
    this.loading = true;
    const emailReg: string = this.registerForm.get('email')?.value || '';
    const pwReg: string = this.registerForm.get('password')?.value || '';
    const pwRegRe: string = this.registerForm.get('rePassword')?.value || '';
    
    if(pwReg !== pwRegRe){
      this.snackBar.open("The passwords don't match!", 'Cancel');
      this.loading = false;
      return
    } 
    this.authService.register(emailReg, pwReg).then(cred=>{
      const user: User = {
        id: cred.user?.uid as string,
        email: emailReg,
        username: this.registerForm.get('username')?.value as string
      }
      this.userService.create(user).then(_ => {
        console.log("Successful");
        this.loading = false;
        //console.log(user);
      }).catch(err =>{
        this.snackBar.open("Something's wrong", 'Cancel');
      this.loading = false;
        this.loading = false;
      })
      this.router.navigateByUrl('/login');

    }).catch(err => {
      this.snackBar.open("Something's wrong", 'Cancel');
      this.loading = false;
    });
  }


}
