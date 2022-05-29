import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SecurityService } from 'src/app/services/security.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  loginForm !: FormGroup;
  submitting=false;

  constructor(
    private fb:FormBuilder,
    private securityService: SecurityService,
    private toastr : ToastrService,
    private router:Router
  ) { 

    this.loginForm = this.fb.group({
      username : this.fb.control("",[
        Validators.required, Validators.minLength(3)
      ]),
      password: this.fb.control("", [
        Validators.required, Validators.minLength(4)
      ])
    })

  }

  ngOnInit(): void {
  }

  handleLoginSubmit(){
    this.submitting=true
    this.securityService.loginRequest( this.loginForm.value.username, this.loginForm.value.password)
    .then(bol=>{
      if( bol){
        this.toastr.success( '', 'Successfully logged-in !', { closeButton: true, positionClass: "toast-top-center" });
        this.router.navigate(["/"]);
      }    
    }).catch(any=>{
      this.toastr.warning( '', 'incorrect username or password !', { closeButton: true, positionClass: "toast-top-center" });
    }).finally(()=>{
      this.submitting=false
    })
  }

}
