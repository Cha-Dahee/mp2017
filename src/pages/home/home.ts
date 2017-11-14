import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FirebaseListObservable, AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';

import { Member } from './member';
import { MeetingInfo } from './meetingInfo';

import { EditMeetingInfoPage } from '../edit-meeting-info/edit-meeting-info';
import { EditMeetingRulePage } from '../edit-meeting-rule/edit-meeting-rule';

import { Geolocation } from '@ionic-native/geolocation';
import { CurrentLoc } from '../../app/interfaces/current-loc';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  members: FirebaseListObservable<any[]>;
  meetingInfo: FirebaseListObservable<any[]>;
  memberTobeDeleted: FirebaseObjectObservable<any[]>;

  //imgAddress: Array<string>;

  //로그인한 사용자의 이름, 현재 위치
  userName: string;
  myCurrentLoc: CurrentLoc = { lat: 0, lon: 0 };

  constructor(public navCtrl: NavController, public af: AngularFireDatabase, public geolocation: Geolocation) {
    this.members = af.list('/member');
    this.meetingInfo = af.list('/meetingInfo');

    this.userName = '다희';


  }

  //출석 위해 자기 이름 클릭시 발생하는 이벤트
  //미팅은 하루에 한번만 있는 걸로 가정. 
  attendanceCheck(member: Member) {

    //본인 이름 클릭
    if (member.name == this.userName) {

      let DBurl = this.af.database;

      //현재 시간 얻기
      var meetingDate;
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth() + 1;
      var yyyy = today.getFullYear();
      var hrs = today.getHours();
      var mins = today.getMinutes();
      var todayTemp = new Date(yyyy, mm, dd, hrs, mins);
      var timeLeft;

      var mtLat = null;
      var mtLon = null;

      var meetingNum = 0;

      //오늘 날짜에 해당하는 미팅이 있는지 확인
      DBurl.ref('/meetingInfo').once('value', (snapshot) => {

        snapshot.forEach(snap => {

          if (snap.val().dateTime.indexOf(yyyy + "-" + mm + "-" + dd) != -1) {

            // 있으면 미팅 장소 좌표 얻어오기. 
            mtLat = snap.val().LatLon.lat;
            mtLon = snap.val().LatLon.lon;

            //정해진 미팅시간 받아오기. 
            var dtSplit = snap.val().dateTime.split(" ");
            var tSplit = dtSplit[1].split(":");
            meetingDate = new Date(2017, 11, 14, tSplit[0], tSplit[1]);
            timeLeft = (meetingDate.getTime() - todayTemp.getTime()) / 60000;

            alert("해당 모임은 오늘 약속이 있습니다.");

            meetingNum++;
            return false;
          }
        });

        if (meetingNum == 0) {
          alert("해당 모임은 오늘 약속이 없습니다.");
        }

        return false;
    
      }).then(result => {

        if (meetingNum != 0) {
          //지각 여부 체크
          if (timeLeft < 0) {
            alert("당신은 " + Math.abs(timeLeft) + "분 지각하셨습니다.");
          }
          else if (timeLeft > 10) {
            alert("출석은 모임 시간 10분 전 부터 가능합니다.");
          } else {
            
            //현재 위치 얻어서 출석체크
            //현재 위치 얻기
            this.geolocation.getCurrentPosition().then(pos => {
              this.myCurrentLoc.lat = pos.coords.latitude;
              this.myCurrentLoc.lon = pos.coords.longitude;
              this.myCurrentLoc.timestamp = pos.timestamp;

              console.log(this.myCurrentLoc.lat);
              console.log(this.myCurrentLoc.lon);
              return 1;

            }).then(temp => {

              //위도 좌표 값 비교해서 진짜 그 자리에 있는지 확인. 
              DBurl.ref('/member').once('value', (snapshot) => {
                snapshot.forEach(snap => {
                  if (snap.val().name == this.userName) {

                    DBurl.ref('/member/' + snap.key + '/LatLonDiff/').set({
                      //미팅장소와 현재 장소와의 차이 절대값 계산
                      lat: Math.abs(this.myCurrentLoc.lat - mtLat),
                      lon: Math.abs(this.myCurrentLoc.lon - mtLon)
                    });
                    if(Math.abs(this.myCurrentLoc.lat - mtLat)>0.03||Math.abs(this.myCurrentLoc.lon - mtLon)>0.03)
                    {
                      alert("당신은 모임 장소가 아닙니다. :( 어서 가세요!");
                    }
                    return false;
                  }
                  
                });
              });
            });
          }
        }
      });



    }
  }


  //시간, 장소 수정용 mock function
  updateMeetingInfo() {
    this.meetingInfo.push({ LatLon: { lat: "0.1", lon: "0.5" }, place: '오석관 상상랩 7번', dateTime: '2017-11-05 20:00' });
  }
  //DB 읽기용 mock function
  addMember() {
    this.members.push({ name: '하은', id: 'Haeun', password: '1234', LatLon: { lat: "0.1", lon: "0.5" } });
    this.members.push({ name: '다희', id: 'Dahee', password: '1234', LatLon: { lat: "0.1", lon: "0.5" } });
    this.members.push({ name: '민우', id: 'Minwoo', password: '1234', LatLon: { lat: "0.1", lon: "0.5" } });
    this.members.push({ name: '소정', id: 'Sojung', password: '1234', LatLon: { lat: "0.1", lon: "0.5" } });
  }

  removeMember() {
    let test = this.af.database;
    let memTobeDeleted: FirebaseObjectObservable<any[]>;
    let toBeDeleted: string = prompt("누굴 삭제할까요");

    test.ref('/member').once('value', (snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach(snap => {
          if (snap.val().name == toBeDeleted) {
            memTobeDeleted = this.af.object('/member/' + snap.key);
            memTobeDeleted.remove();
            return false;
          }
        });
      }
    });
  }

  goEditMeetingInfoPage() {
    this.navCtrl.push(EditMeetingInfoPage);
    this.updateMeetingInfo();
  }

  goEditMeetingRulePage() {
    this.navCtrl.push(EditMeetingRulePage);
  }

}
