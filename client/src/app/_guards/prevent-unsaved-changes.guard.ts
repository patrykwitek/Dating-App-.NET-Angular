import { CanDeactivateFn } from '@angular/router';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';
import { inject } from '@angular/core';
import { ConfirmService } from '../_services/confirm.service';

export const preventUnsavedChangesGuard: CanDeactivateFn<MemberEditComponent> = (component) => {
  const confirmService = inject(ConfirmService);

  if (component.editForm?.dirty) {
    // note: starsza wersja z domyślnym przeglądarkowym promptem
    // return confirm('Are you sure you want to continue? Any unsaved changes will be lost');

    return confirmService.confirm();
  }

  return true;
};
