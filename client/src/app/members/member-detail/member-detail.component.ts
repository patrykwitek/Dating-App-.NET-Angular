import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TimeagoModule } from 'ngx-timeago';

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
    TimeagoModule
  ]
})
export class MemberDetailComponent implements OnInit {
  member: Member | undefined;
  images: GalleryItem[] = [];

  constructor(
    private memberService: MembersService,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.loadMember();
  }

  private loadMember() {
    const username = this.route.snapshot.paramMap.get("username");

    if (!username) {
      return;
    }

    this.memberService.getMember(username).subscribe({
      next: member => {
        this.member = member;
        this.getImages();
      }
    });
  }

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
