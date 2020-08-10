
import { Observable, of } from 'rxjs';
import * as moment from 'moment';
import { Task, ResponseMap } from './Interfaces';
import * as Lockr from 'lockr';
import {v4 as uuid} from 'uuid';


export class TaskService{
  
  
  static create(task: Task): Observable<Task>{
    console.log('creating local');
    task.id = task.id ? task.id:uuid();
    let tasksAday: ResponseMap = Lockr.get(task.date);
     
    tasksAday = tasksAday?tasksAday: {};
    tasksAday[task.id] = task;

    Lockr.set(task.date, tasksAday); 
    return of (task);
  }

  static load(date: moment.Moment): Observable<Task>{
    let tasksAday: ResponseMap = Lockr.get(date.format('DD-MM-YYYY'));
    tasksAday = tasksAday?tasksAday: {};
    return new Observable<Task>(subscriber => {
      Object.entries(tasksAday).forEach(([key, task]) => {
        subscriber.next(task)
      })
    })
  }

  static remove(task: Task): Observable<Task> {
    const tasksAday: ResponseMap = Lockr.get(task.date);
    if (tasksAday) {
      delete tasksAday[task.id];
       Lockr.set(task.date, tasksAday);
    }
    return of (task);
  }
}
