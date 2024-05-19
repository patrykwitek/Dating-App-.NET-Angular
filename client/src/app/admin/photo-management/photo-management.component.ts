import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-photo-management',
  templateUrl: './photo-management.component.html',
  styleUrls: ['./photo-management.component.scss']
})
export class PhotoManagementComponent implements OnInit {
  users: any[] | undefined;

  constructor(
    private adminService: AdminService
  ) { }

  ngOnInit(): void {
    this.getUsersWithPhotos();
  }

  private getUsersWithPhotos() {
    this.adminService.getUsersWithPhotos().subscribe({
      next: users => {
        this.users = users;
      }
    });
  }
}
