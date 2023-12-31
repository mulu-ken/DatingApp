import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';
import { CommonModule } from '@angular/common';
import {TabDirective, TabsModule, TabsetComponent } from 'ngx-bootstrap/tabs';
import {GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TimeagoModule }  from "ngx-timeago";
import { MemberMessagesComponent } from '../member-messages/member-messages.component';
import { MessageService } from 'src/app/_services/message.service';
import { Message } from 'src/app/_models/Message';


@Component({
  selector: 'app-member-detail',
  standalone: true,
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
  imports: [CommonModule, TabsModule, GalleryModule,TimeagoModule,
  MemberMessagesComponent]
})
export class MemberDetailComponent implements OnInit {
  @ViewChild('memberTabs', {static: true}) memberTabs?: TabsetComponent;
  member: Member = {} as Member
  images: GalleryItem[] = [];
  activeTab?: TabDirective;
  messages: Message[] = [];

  constructor(private memberService:MembersService, private route:ActivatedRoute,
              private messageService:MessageService) { }

  ngOnInit() {
    // this.loadMember();

    this.route.data.subscribe({
      next:data => this.member = data['member']
    })

    this.route.queryParams.subscribe({
      next: params => {
        params['tab'] && this.selecTab(params['tab'])
      }
    })
    this.getImages();
  }




  selecTab(heading:string){
    if(this.memberTabs){
      this.memberTabs.tabs.find(x => x.heading === heading)!.active = true;
    }
  }

  OnTabActivated(data: TabDirective){
    this.activeTab = data;
    if(this.activeTab.heading === 'Messages'){
      this.loadMessages();
    }
  }
  loadMessages(){
    if(this.member){
      this.messageService.getMessageThread(this.member.userName).subscribe({
        next:messages => this.messages = messages
      })
    }
  }
  // loadMember() {
  //   const username = this.route.snapshot.paramMap.get('username');
  //   if(!username) return;
  //   this.memberService.getMember(username).subscribe({
  //     next: member => {
  //         this.member = member,
  //         this.getImages();
  //     }
  //   })
  // }

  getImages() {
    if(!this.member) return;
    for (const photo of this.member.photos){
      this.images.push(new ImageItem({src:photo.url, thumb:photo.url}));
    }
  }
}
