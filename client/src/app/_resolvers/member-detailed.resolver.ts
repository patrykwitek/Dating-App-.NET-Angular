import { ResolveFn } from '@angular/router';
import { Member } from '../_models/member';
import { inject } from '@angular/core';
import { MembersService } from '../_services/members.service';

export const memberDetailedResolver: ResolveFn<Member> = (route, state) => {
  // note: resolver pozwala wczytać dane (w tym przypadku member z serwera) na poziomie app routing, a nie w komponencie
  const memberService = inject(MembersService);

  return memberService.getMember(route.paramMap.get('username')!);
};
