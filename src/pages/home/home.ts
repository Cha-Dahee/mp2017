import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {FirebaseListObservable, AngularFireDatabase} from 'angularfire2/database';

import {Member} from './member';
import { EditMeetingInfoPage} from '../edit-meeting-info/edit-meeting-info';
import { EditMeetingRulePage} from '../edit-meeting-rule/edit-meeting-rule';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  members:FirebaseListObservable<any[]>;

  constructor(public navCtrl: NavController, public af:AngularFireDatabase) {
    this.members = af.list('/member');
  }

  //DB 읽기용 mock function
  addMember(){
      this.members.push({name:'하은',id:'Haeun', password:'1234'});
      this.members.push({name:'다희',id:'Dahee', password:'1234'});
      this.members.push({name:'민우',id:'Minwoo', password:'1234'});
      this.members.push({name:'소정',id:'Sojung', password:'1234'});
    
  }

  removeMember(member:Member){
    let toBeDeleted:string = prompt("누굴 삭제할까요");
    if(toBeDeleted !=''){
      this.members.remove(toBeDeleted);
    }
  }

  goEditMeetingInfoPage(){
    this.navCtrl.push(EditMeetingInfoPage);
  }

  goEditMeetingRulePage(){
    this.navCtrl.push(EditMeetingRulePage);
  }
  
}
