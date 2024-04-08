import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  // note: dzięki lokalnej tablicy użytkowników w serwisie nie musimy za każdym razem wysyłać żądania
  members: Member[] = [];

  constructor(private http: HttpClient) { }

  public getMembers() {
    if (this.members.length > 0) {
      // note: musimy zwrócić observable, na co pozwala of
      return of(this.members);
    }
    return this.http.get<Member[]>(this.baseUrl + 'users').pipe(
      map(members => {
        this.members = members
        return members;
      })
    );
  }

  public getMember(username: string) {
    const member = this.members.find(member => member.userName === username);
    if (member) return of(member);
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
}
