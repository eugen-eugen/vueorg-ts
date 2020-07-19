
import { Observable, of } from 'rxjs';
import * as moment from 'moment';
import { Task, ResponseMap } from './Interfaces';
import * as Lockr from 'lockr';
import {v4 as uuid} from 'uuid';


export class TaskService{
  
  
  create(task: Task): Observable<Task>{
    task.id = uuid();
    let tasksAday: ResponseMap = Lockr.get(task.date);
     
    tasksAday = tasksAday?tasksAday: {};
    tasksAday[task.id] = task;

    Lockr.set(task.date, tasksAday); 
    return of (task);
  }

  load(date: moment.Moment): Observable<Task[]>{
    let tasksAday: ResponseMap = Lockr.get(date.format('DD-MM-YYYY'));
    tasksAday = tasksAday?tasksAday: {};
    return of (Object.values(tasksAday));
  }

  remove(task: Task): Observable<Task> {
    const tasksAday: ResponseMap = Lockr.get(task.date);
    delete tasksAday[task.id];
    Lockr.set(task.date, tasksAday);
    return of (task);
  }
}
