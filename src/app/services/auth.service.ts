import { Injectable } from '@angular/core';
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  public isLogged$: Subject<boolean> = new Subject<boolean>();
  private isLogged = false;

  logIn() {
    this.isLogged = true;
    this.isLogged$.next(this.isLogged);
    // Сохраняем в localStorage, чтобы при обновлении страницы не сбрасывалось
    localStorage.setItem('isLogged', 'true');
  }

  logOut() {
    this.isLogged = false;
    this.isLogged$.next(this.isLogged);
    localStorage.removeItem('isLogged');
  }

  getToken() {
    return 'test';
  }

  isLoggedIn(): boolean {
    // Проверяем localStorage при загрузке
    const saved = localStorage.getItem('isLogged');
    if (saved === 'true' && !this.isLogged) {
      this.isLogged = true;
      this.isLogged$.next(true);
    }
    return this.isLogged;
  }
}
