import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { TabDirective, TabsModule, TabsetComponent } from 'ngx-bootstrap/tabs';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TimeagoModule } from 'ngx-timeago';
import { MemberMessagesComponent } from '../member-messages/member-messages.component';
import { MessageService } from 'src/app/_services/message.service';
import { Message } from 'src/app/_models/message';

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
export class MemberDetailComponent implements OnInit {
  @ViewChild('memberTabs', { static: true }) memberTabs: TabsetComponent | undefined; // note: pobieramy cały tabset dzięki deklaracji #memberTabs, static: true sprawia, że okno memberTabs renderuje przy inicjaliazacji komponentu
  member: Member = {} as Member;
  images: GalleryItem[] = [];
  activeTab: TabDirective | undefined;
  messages: Message[] = [];

  constructor(
    private memberService: MembersService,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) { }

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

  public selectTab(heading: string) {
    if (this.memberTabs) {
      this.memberTabs.tabs.find(tab => tab.heading === heading)!.active = true; // note: ! deaktywuje błąd, gdy jesteśmy pewni rozwiązania
    }
  }

  public onTabActivated(data: TabDirective) {
    this.activeTab = data;
    if (this.activeTab.heading === 'Messages') {
      this.loadMessages();
    }
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
