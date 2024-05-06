import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { User } from '../_models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) { }

  public login(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map((response: User) => {
        const user = response;

        if (user) {
          this.setCurrentUser(user);
        }
      })
    )
  }

  public register(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      map(user => {
        if (user) {
          this.setCurrentUser(user);
        }
      })
    );
  }

  public setCurrentUser(user: User) {
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;

    if (Array.isArray(roles)) {
      // note: z tokena role może być tablicą jeżeli jest kilka ról, bądź stringiem, jeżeli jest jedna
      user.roles = roles;
    }
    else {
      user.roles.push(roles);
    }

    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  public logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }

  private getDecodedToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }
}
