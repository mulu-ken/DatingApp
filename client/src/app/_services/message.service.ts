import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {getPaginatedResult, getPaginationHeaders } from './getPaginationHeaders';
import { Message } from '../_models/Message';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { User } from '../_models/user';
import { BehaviorSubject, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MessageService implements OnDestroy  {
baseUrl = environment.apiurl;
hubUrl = environment.huburl;
private hubConnection?: HubConnection;
private messageThreadSource = new BehaviorSubject<Message[]>([]);
messageThread$ = this.messageThreadSource.asObservable();
  constructor(private http: HttpClient) { }

  ngOnDestroy(): void {
        if (this.hubConnection) {
          this.stopHubConnection();
        }
    }

    createHubConnection(user:User, otherUsername:string){
     this.hubConnection = new HubConnectionBuilder().withUrl(this.hubUrl + 'message?user=' + otherUsername, {
       accessTokenFactory: () => user.token
     }).withAutomaticReconnect().build();

     this.hubConnection.start().catch(error => console.log(error));
     this.hubConnection.on('ReceiveMessageThread', messages =>{
       this.messageThreadSource.next(messages)

     })

      this.hubConnection.on('NewMessage', message => {
        this.messageThread$.pipe(take(1)).subscribe({
          next: messages => {
            this.messageThreadSource.next([...messages, message]);
          }
        })
      })
    }

    stopHubConnection(){
      if(this.hubConnection){
        this.hubConnection.stop();
      }
    }

    getMessages(pageNummber: number, pageSize:number, container:string){
    let params = getPaginationHeaders(pageNummber, pageSize);
    params = params.append('Container', container);
    return getPaginatedResult<Message[]>(this.baseUrl + 'messages', params, this.http);

    }

    getMessageThread(username: string){
    return this.http.get<Message[]>(this.baseUrl + 'messages/thread/' + username);
    }

    async sendMessage(username:string, content:string){
    return this.hubConnection?.invoke('SendMessage', {recipientUsername:username, content})
      .catch(err => console.log(err));
    }

    deleteMessage(id:number) {
      return this.http.delete(this.baseUrl + 'messages/' + id);
    }



}

