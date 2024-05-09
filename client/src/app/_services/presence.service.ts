import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import { ToastrService } from 'ngx-toastr';
import { User } from '../_models/user';
import { TextService } from './text.service';
import { BehaviorSubject, take } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl = environment.hubUrl;
  private hubConnection?: HubConnection;
  private onlineUsersSource = new BehaviorSubject<string[]>([]);
  onlineUsers$ = this.onlineUsersSource.asObservable();

  constructor(
    private toastr: ToastrService,
    private textService: TextService,
    private router: Router
  ) { }

  public createHubConnection(user: User) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'presence', {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch(error => console.error(error));

    this.hubConnection.on('UserIsOnline', username => {
      // note: starza wersja powiadamiania użytkownika o nowo zalogowanym użytkowniku
      // this.toastr.info(this.textService.capitalizeFirstLetter(username) + ' has connected');

      this.onlineUsers$.pipe(take(1)).subscribe({
        next: usernames => {
          this.onlineUsersSource.next([...usernames, username]);
        }
      });
    });

    this.hubConnection.on('UserIsOffline', username => {
      // note: starza wersja powiadamiania użytkownika o nowo wylogowaniu użytkownika
      // this.toastr.warning(this.textService.capitalizeFirstLetter(username) + ' has disconnected');

      this.onlineUsers$.pipe(take(1)).subscribe({
        next: usernames => {
          this.onlineUsersSource.next(usernames.filter(user => user !== username));
        }
      });
    });

    this.hubConnection.on('GetOnlineUsers', usernames => {
      this.onlineUsersSource.next(usernames);
    });

    this.hubConnection.on('NewMessageReceived', ({ username, knownAs }) => {
      this.toastr.info(knownAs + ' has sent you a new message')
        .onTap
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.router.navigateByUrl('/members/' + username + '?tab=Messages')
          }
        })
    });
  }

  public stopHubConnection() {
    this.hubConnection?.stop().catch(error => console.error(error));
  }
}
