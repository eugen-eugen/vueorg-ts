import {map} from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { http } from './http.service';
import { AxiosResponse } from 'axios';
import { Task } from './Interfaces';


interface ResponseMap {
  [key: string]: Task;
}
export class TaskService{

  static  url='https://angular-calendar-1ba83.firebaseio.com/tasks'
  
  
  create(task: Task): Observable<AxiosResponse<Task>>{
    return http
     .request<Task>({url: `${TaskService.url}/${task.date}.json`, method: 'post', data:task}) 
  }

  load(date: moment.Moment): Observable<Task[]>{
    console.log('loading');
    return http.request<ResponseMap>({url: `${TaskService.url}/${date.format('DD-MM-YYYY')}.json`, 
                                         method:'get'})
    .pipe(
      map( response=>{
        const tasks = response.data;

        if (!tasks){
          return new Array<Task>();
        }
        return Object.keys(tasks).map (key =>{

          return {...tasks[key], id:key}
        });
      })
    )
  }

  remove(task: Task): Observable<AxiosResponse<void>> {
    return http.request<void>({url: `${TaskService.url}/${task.date}/${task.id}.json`, method: 'delete'})
  }
}
