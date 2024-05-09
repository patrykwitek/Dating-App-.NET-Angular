import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TimeagoModule } from 'ngx-timeago';
import { take } from 'rxjs';
import { Message } from 'src/app/_models/message';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-member-messages',
  standalone: true,
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.scss'],
  imports: [
    CommonModule,
    TimeagoModule,
    MatIconModule,
    FormsModule
  ]
})
export class MemberMessagesComponent implements OnInit {
  @ViewChild('messageForm') messageForm?: NgForm;
  @Input() username?: string;
  // note: starsza wersja bez SignalR
  // @Input() messages: Message[] = [];
  currentUser: User | undefined;
  messageContent: string = '';
  messages?: Message[];

  constructor(
    private messageService: MessageService,
    private accountService: AccountService
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) {
          this.currentUser = user;
        }
      }
    });
  }

  ngOnInit(): void { }

  public sendMessage() {
    if (!this.username) {
      return;
    }

    // note: starsza wersja bez SignalR
    // this.messageService.sendMessage(this.username, this.messageContent).subscribe({
    //   next: message => {
    //     this.messages.push(message);
    //     this.messageForm?.reset();
    //   }
    // });

    // note: przy Promise jest then, przy Observable subscribe
    this.messageService.sendMessage(this.username, this.messageContent).then(() => {
      this.messageForm?.reset();
    });
  }

  public areNoMessages(): boolean {
    let noMessages: boolean = false;

    this.messageService.messageThread$.pipe(take(1)).subscribe({
      next: messages => {
        if (messages.length === 0) {
          noMessages = true;
        }
      }
    });

    return noMessages;
  }

  public getMessages(): Message[] {
    let messages: Message[] = [];

    this.messageService.messageThread$.pipe(take(1)).subscribe({
      next: messagesResponse => {
        if (messagesResponse) {
          messages = messagesResponse;
        }
      }
    });

    return messages;
  }
}
