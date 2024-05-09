import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.scss']
})
export class MemberCardComponent implements OnInit {
  @Input() member: Member | undefined;

  constructor(
    private memberService: MembersService,
    private toastr: ToastrService,
    private presenceService: PresenceService
  ) { }

  ngOnInit(): void {
  }

  public addLike(member: Member) {
    this.memberService.addLike(member.userName).subscribe({
      next: () => {
        this.toastr.success("You kave liked " + member.knownAs);
      }
    })
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

}
