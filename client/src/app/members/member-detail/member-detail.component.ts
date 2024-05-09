import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { TabDirective, TabsModule, TabsetComponent } from 'ngx-bootstrap/tabs';
import { Member } from 'src/app/_models/member';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TimeagoModule } from 'ngx-timeago';
import { MemberMessagesComponent } from '../member-messages/member-messages.component';
import { MessageService } from 'src/app/_services/message.service';
import { Message } from 'src/app/_models/message';
import { PresenceService } from 'src/app/_services/presence.service';
import { take } from 'rxjs';
import { AccountService } from 'src/app/_services/account.service';
import { User } from 'src/app/_models/user';
import { MembersService } from 'src/app/_services/members.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.scss'],
  imports: [
    CommonModule,
    TabsModule,
    MatIconModule,
    GalleryModule,
    TimeagoModule,
    MemberMessagesComponent
  ]
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  @ViewChild('memberTabs', { static: true }) memberTabs: TabsetComponent | undefined; // note: pobieramy cały tabset dzięki deklaracji #memberTabs, static: true sprawia, że okno memberTabs renderuje przy inicjaliazacji komponentu
  member: Member = {} as Member;
  images: GalleryItem[] = [];
  activeTab: TabDirective | undefined;
  messages: Message[] = [];
  user?: User;

  constructor(
    private accountService: AccountService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private presenceService: PresenceService,
    private memberService: MembersService,
    private toastr: ToastrService
  ) {
    accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) {
          this.user = user;
        }
      }
    });
  }

  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => {
        // note: pobieramy membera z resolvera, ze zmiennej, którą zdefiniowaliśmy w routing module jako member
        this.member = data['member'];
      }
    });

    this.route.queryParams.subscribe({
      next: params => {
        if (params['tab']) {
          this.selectTab(params['tab']);
        }
      }
    });

    this.getImages();
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

  public selectTab(heading: string) {
    if (this.memberTabs) {
      this.memberTabs.tabs.find(tab => tab.heading === heading)!.active = true; // note: ! deaktywuje błąd, gdy jesteśmy pewni rozwiązania
    }
  }

  public onTabActivated(data: TabDirective) {
    this.activeTab = data;
    if (this.activeTab.heading === 'Messages' && this.user) {
      // note: starsza wersja bez SignalR
      // this.loadMessages();

      this.messageService.createHubConnection(this.user, this.member.userName)
    }
    else {
      this.messageService.stopHubConnection();
    }
  }

  public isUserOnline(): boolean {
    let isOnline: boolean = false;

    this.presenceService.onlineUsers$.pipe(take(1)).subscribe({
      next: users => {
        if (this.member && users.includes(this.member?.userName)) {
          isOnline = true;
        }
        else {
          isOnline = false;
        }
      }
    });

    return isOnline;
  }

  public addLike(member: Member) {
    this.memberService.addLike(member.userName).subscribe({
      next: () => {
        this.toastr.success("You kave liked " + member.knownAs);
      }
    })
  }

  private loadMessages() {
    if (this.member) {
      this.messageService.getMessageThread(this.member.userName).subscribe({
        next: messages => {
          this.messages = messages;
        }
      })
    }
  }

  // note: starsza wersja przed użyciem resolvera
  // private loadMember() {
  //   const username = this.route.snapshot.paramMap.get("username");

  //   if (!username) {
  //     return;
  //   }

  //   this.memberService.getMember(username).subscribe({
  //     next: member => {
  //       this.member = member;
  //       this.getImages();
  //     }
  //   });
  // }

  private getImages() {
    if (!this.member) return;
    for (let photo of this.member.photos) {
      this.images.push(new ImageItem({
        src: photo.url,
        thumb: photo.url
      }));
    }
  }

}
