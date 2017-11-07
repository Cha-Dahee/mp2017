import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditMeetingInfoPage } from './edit-meeting-info';

@NgModule({
  declarations: [
    EditMeetingInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(EditMeetingInfoPage),
  ],
})
export class EditMeetingInfoPageModule {}
