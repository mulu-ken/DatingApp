import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { BehaviorSubject, take } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
hubUrl = environment.huburl;
private hubconnection?: HubConnection;
private onlineUsersSource = new BehaviorSubject<string[]>([]);
onlineUsers$ = this.onlineUsersSource.asObservable();

  constructor(private toastr: ToastrService, private router:Router) { }

  createHubConnection(user: User){
    this.hubconnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'presence', {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build();

     this.hubconnection.start().catch(error => console.log(error));

    this.hubconnection.on('UserIsOnline', username => {
      this.toastr.info(username + ' has connected');
    });

    this.hubconnection.on('UserIsOffline', username => {
      this.toastr.warning(username + ' has disconnected');
    })

    this.hubconnection.on('GetOnlineUsers', usernames => {
      this.onlineUsersSource.next(usernames);
    })

    this.hubconnection.on('NewMessageReceived', ({username, knownAs}) =>{
      this.toastr.info(knownAs + ' has sent you a new message! Click me to see it')
        .onTap
        .pipe(take(1))
        .subscribe({
          next: () => this.router.navigateByUrl('/members/' + username + '?tab=Messages')
        })
    })
  }




  stopHubConnection(){
    this.hubconnection?.stop().catch(error => console.log(error));
  }
}
