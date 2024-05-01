import { Component, OnInit } from '@angular/core';
import { Member } from '../_models/member';
import { MembersService } from '../_services/members.service';
import { Pagination } from '../_models/pagination';

@Component({
  selector: 'app-lists',
  templateUrl: './sent-likes.component.html',
  styleUrls: ['./sent-likes.component.scss']
})
export class SentLikesComponent implements OnInit {
  members: Member[] | undefined;
  predicate: string = "liked";
  pageNumber: number = 1;
  pageSize: number = 5;
  pagination: Pagination | undefined;

  constructor(
    private membersService: MembersService
  ) { }

  ngOnInit(): void { 
    this.loadLikes();
  }

  public loadLikes() {
    this.membersService.getLikes(this.predicate, this.pageNumber, this.pageSize).subscribe({
      next: response => {
        this.members = response.result;
        this.pagination = response.pagination;
      }
    });
  }

  public pageChanged(event: any) {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.loadLikes();
    }
  }
}
