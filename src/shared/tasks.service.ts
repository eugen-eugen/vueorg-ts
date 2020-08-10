
import { Observable, of } from 'rxjs';
import * as moment from 'moment';
import { http } from './http.service';
import { AxiosResponse } from 'axios';
import { Task, ResponseMap } from './Interfaces';
import { map } from 'rxjs/operators';

interface StringPair {
  [key: string]: string;
}
export class TaskService {

  static url = 'https://angular-calendar-1ba83.firebaseio.com/tasks'



  static create(task: Task): Observable<StringPair> {
    console.log('creating remote: ' + `${TaskService.url}/${task.date}.json`);
    task.online = true;
    const resObservable = http
      .request<StringPair>({ url: `${TaskService.url}/${task.date}.json`, method: 'post', data: task });
    //resObservable.subscribe(res => console.log(res), err => task.online = false)
    return resObservable.pipe(
      map(res => {task.online=false; return res.data})
    )
  }

  static load(date: moment.Moment): Observable<Task> {
    console.log('loading');
    return new Observable<Task>(subscriber => {
      http.request<ResponseMap>({
        url: `${TaskService.url}/${date.format('DD-MM-YYYY')}.json`,
        method: 'get'
      }).subscribe(response => {
        if (response.data) {
          Object.entries(response.data).forEach(([key, task]) => {
            task.id = key
            subscriber.next(task)
          });
        }
      })
    });

  }

  static remove(task: Task): Observable<AxiosResponse<void>> {
    return http.request<void>({ url: `${TaskService.url}/${task.date}/${task.id}.json`, method: 'delete' })
  }

}


