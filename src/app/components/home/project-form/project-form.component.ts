import { Component, OnInit } from '@angular/core';

// service
import { ProjectsService } from "../../../services/projects.service";
import { UuidService } from "../../../services/uuid.service";

// Models
import { Log} from "../../../models/Log";
import { Project } from "../../../models/Project";

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {

  isNew: boolean = true;

  projectName: string;
  projectId: string;
  logs: object;

  constructor(
    public projectsService: ProjectsService,
    public uuid: UuidService
  ) { }

  ngOnInit() {
    this.projectsService.projectOnSelect.subscribe(project => {
      console.log(project);
      if( project.projectId !== null ) {
        this.isNew = false;
        this.projectName = project.name;
        this.projectId = project.projectId;
        this.logs = project.logs;
      }
    })
  }

  onSubmit(){
    if ( this.isNew ) {
      this.projectsService.addProject( {
        projectId: this.uuid.generate(),
        name: this.projectName,
        logs: []
      })
    } else {
      this.projectsService.updateProject( {
        projectId: this.projectId,
        name: this.projectName,
        logs: this.logs
      })
    }

    this.clearState();
  }

  clearState(){
    this.isNew = true;
    this.projectName = '';
    this.projectId = '';
    this.logs = [];

    this.projectsService.clearProjectState();
  }

}
