
import { Observable, of, merge } from 'rxjs';
import * as moment from 'moment';
import { Task, ResponseMap } from './Interfaces';
import * as Lockr from 'lockr';
import  {TaskService  as TaskServiceLocal }  from './tasks.service.local';
import { TaskService as TaskServiceRemote } from './tasks.service';
import { distinct } from 'rxjs/operators';


export class TaskService{
  
  create(task: Task): Observable<Task>{
    TaskServiceLocal.create(task).subscribe(res => {
      TaskServiceRemote.create(task).subscribe((id) => {console.log(id); 
        
        TaskServiceLocal.remove(task);
        console.log('created remote ', id["name"])
        task.id = id["name"];
        task.online = true;
        TaskServiceLocal.create(task).subscribe();
        return {}});
    })
    return of (task);
  }

  load(date: moment.Moment): Observable<Task>{
    const remoteTasks= TaskServiceRemote.load(date)
    remoteTasks.subscribe(task => {
      TaskServiceLocal.create(task)
    })
    return merge (remoteTasks, TaskServiceLocal.load(date)).
           pipe(distinct (task => {console.log(task.id); return task.id}))
  }

  remove(task: Task): Observable<Task> {
    TaskServiceLocal.remove(task).subscribe();
    TaskServiceRemote.remove(task).subscribe();
    return of (task);
  }
}
