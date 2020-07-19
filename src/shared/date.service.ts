import moment from 'moment';
import { BehaviorSubject } from 'rxjs';


export class DateService{
 
  date: BehaviorSubject<moment.Moment> = new BehaviorSubject(moment())
  changeMonth(dir: number){
     const value =this.date.value.add(dir, 'month');
     this.date.next(value);
  }

  changeDate(newDate: moment.Moment){
    this.date.next(newDate);
  }
}
