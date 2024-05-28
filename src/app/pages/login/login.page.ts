/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NAVIGATION } from 'src/app/helpers/navigation.helper';
import { GENERIC, INVALID_USER, NOT_FOUND, UNAUTHORIZED } from 'src/app/helpers/error.helper';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AlertController, ToastController } from '@ionic/angular';
import { CryptoService } from 'src/app/services/crypto/crypto.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { Router } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
import { FavoriteService } from 'src/app/services/favorite/favorite.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, ViewWillEnter {
  @ViewChild('IonContent') content;

  public nav = NAVIGATION;
  public showLoader: boolean;
  public formLogin: FormGroup;
  public formRecovery: FormGroup;
  public remindChecked = false;
  public showForgotPassword = false;

  constructor(
    public authService: AuthService,
    public cryptoService: CryptoService,
    public utils: UtilsService,
    public router: Router,
    public fb: FormBuilder,
    public alertController: AlertController,
    public toastController: ToastController,
    public favorite: FavoriteService,
  ) { }

  ngOnInit() {
    this.initForm();
    this.recoveryUserEmail();
  }

  public ionViewWillEnter(): void {
    this.utils.setPageTitle('Entrar');
  }

  public initForm() {
    this.formLogin = this.fb.group({
      userEmail: this.fb.control('', [Validators.required]),
      userPassword: this.fb.control('', [Validators.required, Validators.minLength(4)])
    });
  }

  public initRecoveryForm() {
    this.formRecovery = this.fb.group({
      userEmail: this.fb.control('', [Validators.required])
    });
  }

  public authUser(): void {
    this.showLoader = true;

    const data = {
      email: this.formLogin.value.userEmail,
      password: this.formLogin.value.userPassword
    };

    const jwtData = { data: this.cryptoService.encondeJwt(data)};

    const subCustomers = this.authService.authUser(jwtData).subscribe(
      res => {
        if (!subCustomers.closed) { subCustomers.unsubscribe(); }
        this.showLoader = false;

        this.formLogin.reset();
        this.utils.localStorageSetItem('userSession', this.cryptoService.encondeJwt(res.authorized));
        this.remindChecked
          ? this.utils.localStorageSetItem('userEmail', res.authorized.email)
          : this.utils.localStorageRemoveItem('userEmail');
        this.utils.returnLoggedUser();
        this.favorite.syncFavorites();
        this.router.navigate([`/${this.nav.garage.route}`]);
      },
      err => {
        this.showErrorToast(err);
      }
    );
  }

  public recoveryUserEmail(): void {
    const recovered = this.utils.localStorageGetItem('userEmail');

    if (recovered) {
      this.formLogin.controls.userEmail.patchValue(recovered);
      this.remindChecked = true;
    }
  }

  public forgotPassword(): void {
    this.initRecoveryForm();
    this.formRecovery.controls.userEmail.patchValue(this.formLogin.controls.userEmail.value);
    this.showForgotPassword = true;
  }

  public sendRecovery(): void {
    this.showRecoveryToast();
    this.backToLogin();
  }

  public backToLogin(): void {
    this.formLogin.controls.userEmail.patchValue(this.formRecovery.controls.userEmail.value);
    this.showForgotPassword = false;
  }

  public showErrorAlert(err) {
    console.error(err);

    const alertObj = {
      header: 'Ops...',
      message: err.status === 404 ? NOT_FOUND : GENERIC,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          id: 'cancel-button'
        }
      ]
    };

    this.showLoader = false;

    this.alertController.create(alertObj).then(alert => {
      alert.present();
    });
  }

  public showErrorToast(err) {
    let response;

    switch (err.status) {
      case 404:
        response = INVALID_USER;
        break;
      case 401:
        response = UNAUTHORIZED;
        break;
      default:
        response = GENERIC;
    }

    this.showLoader = false;
    console.error(err);

    this.toastController.create({
      header: 'Atenção!',
      message: response,
      duration: 4000,
      position: 'middle',
      icon: 'warning-outline',
      color: 'danger'
    }).then(toast => {
      toast.present();
    });
  }

  public showRecoveryToast() {
    this.showLoader = false;

    this.toastController.create({
      header: 'Senha enviada com sucesso!',
      message: 'Verifique a sua caixa de email e retorne aqui posteriormente.',
      duration: 4000,
      position: 'middle',
      icon: 'paper-plane-outline',
      color: 'success'
    }).then(toast => {
      toast.present();
    });
  }
}
