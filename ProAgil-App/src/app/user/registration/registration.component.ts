import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/_models/User';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  registerForm!: FormGroup;
  user!: User;

  constructor(public fb: FormBuilder, private toastr: ToastrService, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.validation()
  }

  validation(){
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required, ],
      email: ['', [Validators.required, Validators.email]],
      userName: ['', Validators.required, ],
      passwords: this.fb.group({
        password: ['', [Validators.required, Validators.minLength(4)]],
        confirmPassword: ['', Validators.required, ]
      }, { validator: this.compararSenhas})
    });
  }

  compararSenhas(fb: FormGroup){
    const confirmSenhaCtrl = fb.get('confirmPassword');
    if(confirmSenhaCtrl?.errors == null || 'mismatch' in confirmSenhaCtrl.errors){
      if(fb.get('password')?.value !== confirmSenhaCtrl?.value){
        confirmSenhaCtrl?.setErrors({mismatch: true});
      }else{
        confirmSenhaCtrl?.setErrors(null);
      }
    }
  }

  cadastrarUsuario(){
    if(this.registerForm.valid) {
      this.user = Object.assign(
        {password: this.registerForm.get('passwords.password')?.value},
        this.registerForm.value);
        this.authService.register(this.user).subscribe(
          () => {
            this.router.navigate(['/user/login']);
            this.toastr.success('Cadastrado realizado.');
          }, (error) => {
            const erro = error.error;
            Array.from(erro).forEach((erro:any) => {
              switch (erro.code) {
                case 'DuplicateUserName':
                  this.toastr.error('Cadastro duplicado!')
                  break;

                default:
                  this.toastr.error(`Erro no cadastro! CODE: ${erro.code}`)
                  break;
              }

          });
          }
        )
    }
  }

}
