import { Injectable } from '@angular/core';
import { of } from "rxjs/observable/of";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

// Models
import { Log } from "../models/Log";
import { Project } from "../models/Project";
import {Observable} from "rxjs/Observable";

@Injectable()
export class ProjectsService {

  projects: Project[];
  selectedProject: Project;

  private logSource = new BehaviorSubject<Log>({
    id: null,
    text: null,
    date: null
  });
  selectedLog = this.logSource.asObservable();

  private stateSource = new BehaviorSubject<boolean>(true);
  stateClear = this.stateSource.asObservable();

  private projectSource = new BehaviorSubject<Project>({
    projectId: null,
    name: null,
    logs: null
  });

  projectOnSelect = this.projectSource.asObservable();

  constructor() {

    this.projects = JSON.parse(localStorage.getItem('projects')) || [];

  }

  getAllProjects(): Observable<Project[]> {
    return of(this.projects);
    // оператор of из rxjs позволяет переводить любые данные в объект observable
  }

  getProject(id) {
    this.projects.forEach( (current) => {
      if ( current.projectId === id ){
        this.selectedProject = current;
      }
    });

    return of(this.selectedProject);

  }

  addProject(project) {
    this.projects.unshift(project);
    localStorage.setItem('projects', JSON.stringify(this.projects));
  }

  setFormProject(project) {
    this.projectSource.next(project);
  }

  updateProject(project){
    this.projects.forEach( (oldProject, i) => {
      if ( oldProject.projectId === project.projectId ) {
        this.projects.splice(i, 1);
      }
    });

    this.projects.unshift(project);
    localStorage.setItem('projects', JSON.stringify(this.projects));
  }

  clearProjectState(){
    this.projectSource.next({
      projectId: null,
      name: null,
      logs: null
    });

    // обнуляем данные на главной странице, т.к. в behaviour subject они остались прежними
  }

  deleteProject(deletedProject: Project){

    this.projects.forEach( (project, i) => {
      if(project.projectId === deletedProject.projectId) {
        this.projects.splice(i, 1);
      }
    });

    localStorage.setItem('projects', JSON.stringify(this.projects));
  }

  addLog(log: Log, projectId) {

      this.projects.forEach( project => {
        if ( project.projectId === projectId ) {
          project.logs.unshift(log);
          console.log(project);
        }
      });

      localStorage.setItem('projects', JSON.stringify(this.projects));
  }

  updateLog(log: Log, projectId) {

    this.projects.forEach( project => {
      if ( project.projectId === projectId ) {

        project.logs.forEach( (value, i) => {
          if ( value.id === log.id ) {
            project.logs.splice( i, 1 );
          }
        });

        project.logs.unshift(log);
      }
    });

    localStorage.setItem('projects', JSON.stringify(this.projects));
  }

  setFormLog(log: Log){
    this.logSource.next(log);
    // при помощи метода next мы эмитим событие в logSource
  }

  clearState(){
    this.stateSource.next(true);
    this.logSource.next({
      id: null,
      text: null,
      date: null
    });

    // обнуляем данные на главной странице, т.к. в behaviour subject они остались прежними
  }

  deleteLog(log, projectId){
    this.projects.forEach( project => {
      if ( project.projectId === projectId ) {

        project.logs.forEach( (value, i) => {
          if ( value.id === log.id ) {
            project.logs.splice( i, 1 );
          }
        });
      }
    });

    localStorage.setItem('projects', JSON.stringify(this.projects));
  }

}
