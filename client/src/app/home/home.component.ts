import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  registerMode = false;
  users: any;

  constructor() {}
  ngOnInit() {

  }

  registerToggle() {
    this.registerMode =!this.registerMode;
  }


  cancelRegistrationMode(event: boolean) {
    this.registerMode = event;
  }
}
