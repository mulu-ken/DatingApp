import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-roles-modal',
  templateUrl: './roles-modal.component.html',
  styleUrls: ['./roles-modal.component.css']
})
export class RolesModalComponent implements OnInit {
  username = '';
  availableRoles: any[] = [];
  selectedRoles: any[] = [];

    constructor(public bsModalRef:BsModalRef) { }

  ngOnInit(): void {
        throw new Error('Method not implemented.');
    }

    updateChecked(checkedvalue: string): void {
      const index = this.selectedRoles.indexOf(checkedvalue);
      index !== -1 ? this.selectedRoles.splice(index,1) : this.selectedRoles.push(checkedvalue);
    }

}
