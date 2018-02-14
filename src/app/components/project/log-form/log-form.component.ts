import { Component, OnInit, Input } from '@angular/core';

// Services
import { ProjectsService } from "../../../services/projects.service";
import { UuidService } from "../../../services/uuid.service";

@Component({
  selector: 'app-log-form',
  templateUrl: './log-form.component.html',
  styleUrls: ['./log-form.component.css']
})
export class LogFormComponent implements OnInit {

  @Input() currentRouteId: string;

  isNew: boolean = true;

  id: string;
  text: string;
  date: string;

  constructor(
    public projectsService: ProjectsService,
    public uuid: UuidService
  ) { }

  ngOnInit() {

    // подписываемся на выбор лога
    this.projectsService.selectedLog.subscribe( log => {
      console.log(log);
      if ( log.id !== null ){
        this.isNew = false;
        this.id = log.id;
        this.text = log.text;
        this.date = log.date;
      }
    })

  }

  onSubmit() {

    if( this.isNew ) {
      const newLog = {
        id: this.uuid.generate(),
        text: this.text,
        date: new Date()
      };

      this.projectsService.addLog(newLog, this.currentRouteId);
    } else {

      const updlog = {
        id: this.id,
        text: this.text,
        date: this.date
      };

      this.projectsService.updateLog(updlog, this.currentRouteId);
    }

    this.clearState();

  }

  clearState(){
    this.isNew = true;
    this.id = '';
    this.text = '';
    this.date = '';

    this.projectsService.clearState();
  }

}
