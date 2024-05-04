import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { map, of, take } from 'rxjs';
import { PaginatedResult } from '../_models/pagination';
import { response } from 'express';
import { UserParams } from '../_models/userParams';
import { AccountService } from './account.service';
import { User } from '../_models/user';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  // note: dzięki lokalnej tablicy użytkowników w serwisie nie musimy za każdym razem wysyłać żądania
  members: Member[] = [];
  // note: po wprowadzeniu funkcjonalności stronnicowania utraciliśmy możliwość pobierania danych z members, więc trzeba zaimplementować zmienną przechowującą parametry do przekazania stronnicowania
  memberCache = new Map<any, any>();
  user: User | undefined;
  // note: dzięki zaimplementowaniu userParams w membersService zapamiętujemy stan stronnicowania i po wróceniu do komponentu listy użytkowników nie tracimy poprzedniego stronnicowania
  userParams: UserParams | undefined;

  constructor(
    private http: HttpClient,
    private accountService: AccountService
  ) {
    accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) {
          this.userParams = new UserParams(user);
          this.user = user;
        }
      }
    });
  }

  public getUserParams() {
    return this.userParams;
  }

  public setUserParams(userParams: UserParams) {
    this.userParams = userParams;
  }

  public resetUserParams() {
    if (this.user) {
      this.userParams = new UserParams(this.user);
      return this.userParams;
    }

    return;
  }

  public getMembers(userParams: UserParams) {
    const response = this.memberCache.get(Object.values(userParams).join('-'));

    if (response) {
      return of(response);
    }

    let params: HttpParams = getPaginationHeaders(userParams.pageNumber, userParams.pageSize);

    params = params.append('minAge', userParams.minAge);
    params = params.append('maxAge', userParams.maxAge);
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    return getPaginatedResult<Member[]>(this.baseUrl + 'users', params, this.http).pipe(
      map(response => {
        this.memberCache.set(Object.values(userParams).join('-'), response);
        return response;
      })
    );

    // note: poprzednia wersja bez stronnicowania
    /*if (this.members.length > 0) {
      // note: musimy zwrócić observable, na co pozwala of
      return of(this.members);
    }

    return this.http.get<Member[]>(this.baseUrl + 'users').pipe(
      map(members => {
        this.members = members
        return members;
      })
    );*/
  }

  public getMember(username: string) {
    // note: starsza wersja bez stronnicowania:
    // const member = this.members.find(member => member.userName === username);
    // if (member) return of(member);

    const member = [...this.memberCache.values()]
      .reduce((arr, elem) => arr.concat(elem.result), []) //note: reduce memberCache z nowo otwartym memberChache przy otwarciu nowego profilu użytkownika
      .find((member: Member) => member.userName === username);

    if (member) {
      return of(member);
    }

    return this.http.get<Member>(this.baseUrl + 'users/' + username)
  }

  public updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        // note: łatwiejszy sposób na zaktualizowanie
        this.members[index] = { ...this.members[index], ...member }
      })
    );
  }

  // note:
  // interceptor JWT
  // zamiast:
  // return this.http.get<Member>(this.baseUrl + 'users/' + username, this.getHttpOptions())
  // jest JWT Interceptor

  /*
  getHttpOptions() {
    const userString = localStorage.getItem('user');
    if(!userString) return;
    const user = JSON.parse(userString);

    return {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + user.token
      })
    };
  }
  */

  public setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  }

  public deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }

  public addLike(username: string) {
    return this.http.post(this.baseUrl + 'likes/' + username, {});
  }

  public getLikes(predicate: string, pageNumber: number, pageSize: number) {
    let params = getPaginationHeaders(pageNumber, pageSize);

    params = params.append('predicate', predicate);
    
    return getPaginatedResult<Member[]>(this.baseUrl + 'likes', params, this.http);
  }
}
