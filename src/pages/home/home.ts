import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {FirebaseListObservable, AngularFireDatabase, FirebaseObjectObservable} from 'angularfire2/database';

import {Member} from './member';
import {MeetingInfo} from './meetingInfo';

import { EditMeetingInfoPage} from '../edit-meeting-info/edit-meeting-info';
import { EditMeetingRulePage} from '../edit-meeting-rule/edit-meeting-rule';

import {Geolocation} from '@ionic-native/geolocation';
import {CurrentLoc} from '../../app/interfaces/current-loc';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  members:FirebaseListObservable<any[]>;
  meetingInfo:FirebaseListObservable<any[]>;
  memberTobeDeleted:FirebaseObjectObservable<any[]>;
  
  //imgAddress: Array<string>;

  //로그인한 사용자의 이름, 현재 위치
  userName: string;
  myCurrentLoc: CurrentLoc = {lat:0, lon:0};

  constructor(public navCtrl: NavController, public af:AngularFireDatabase, public geolocation:Geolocation) {
    this.members = af.list('/member');
    this.meetingInfo = af.list('/meetingInfo');

    this.userName='다희';
    
    geolocation.getCurrentPosition().then(pos=>{
      //console.log('lat: '+pos.coords.latitude +
      //', lon: '+ pos.coords.longitude);

      this.myCurrentLoc.lat = pos.coords.latitude;
      this.myCurrentLoc.lon = pos.coords.longitude;
      this.myCurrentLoc.timestamp = pos.timestamp;
    })

  }

  //출석 위해 자기 이름 클릭시 발생하는 이벤트
  attendanceCheck(member:Member){
    if(member.name==this.userName){
      console.log("alright");
    }
    
    let DBurl = this.af.database;
    DBurl.ref('/member').once('value', (snapshot)=>{
      if(snapshot.exists()){
        snapshot.forEach(snap =>{
          if(snap.val().name==this.userName){
            this.af.object('/member/'+snap.key).update({LanLoc:{lan:0.0, loc: 0.0}});
            return false;
          }
        });
      }
    });
  }
  //시간, 장소 수정용 mock function
  updateMeetingInfo(){
    this.meetingInfo.push({place:'오석관 상상랩 7번',dateTime:'2017-11-05 20:00'});
  }
  //DB 읽기용 mock function
  addMember(){
      this.members.push({name:'하은',id:'Haeun', password:'1234', LanLon:{"lan": "0.1","lon": "0.5"}});
      //this.members.push({name:'다희',id:'Dahee', password:'1234'});
      //this.members.push({name:'민우',id:'Minwoo', password:'1234'});
      //this.members.push({name:'소정',id:'Sojung', password:'1234'});
  }

  removeMember(){
    let test = this.af.database;
    let memTobeDeleted:FirebaseObjectObservable<any[]>;
    let toBeDeleted:string = prompt("누굴 삭제할까요");

    test.ref('/member').once('value', (snapshot)=>{
      if(snapshot.exists()){
        snapshot.forEach(snap =>{
          if(snap.val().name==toBeDeleted){
            memTobeDeleted = this.af.object('/member/'+snap.key);
            memTobeDeleted.remove();
            return false;
          }
        });
      }
    });
  }

  goEditMeetingInfoPage(){
    this.navCtrl.push(EditMeetingInfoPage);
    this.updateMeetingInfo();
  }

  goEditMeetingRulePage(){
    this.navCtrl.push(EditMeetingRulePage);
  }
  
}
