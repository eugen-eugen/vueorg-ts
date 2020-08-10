<template>
<section>
  <header>Organizer: <strong>{{ dateService.date.value | date }}</strong>
    <hr/>
  </header>

  <main>
    <ul>
      <li class="task" v-for="(task, id) in tasks" :key="id">
        <span>
          <strong>{{id +1 }}</strong>
          {{task.title}}
          <br/>
          {{task.date}}
        </span>
        <button class="btn btn-primary" v-on:click="remove(task)">Remove</button>

      </li>
    </ul>
  </main>
  <footer>
    <form v-on:submit.prevent="submit">
      <input v-model="title" type="text" required>
      <button 
      :class = "['btn', 'btn-primary', 'btn-block', ]"
      :disabled = 'invalid'
      >Add</button>
    </form>
  </footer>
</section>
    
</template>

<script lang="ts">
import { Component, Inject, Vue, Watch } from "vue-property-decorator";
import { DateService } from "../shared/date.service";
import { switchMap }  from 'rxjs/operators'
import { Task } from '../shared/Interfaces';
import { TaskService } from '@/App.vue';

@Component
export default class Organizer extends Vue {
   
  tasks: Task[] = [];
  title = '';
  invalid = true;

  @Inject("dateService") private dateService!: DateService;
  @Inject("taskService") private taskService!: TaskService;

  // Lifecyle

  created() {
    this.dateService.date.pipe(
      switchMap( value => {this.tasks=[]; return this.taskService.load(value)})
    ).subscribe(_task => {console.log('subscriptor'); 
        this.tasks.push (_task);
    });
    this.$on("offline", ()=>{
        console.log('offline')
    })
  }

  //

  submit(){
    const task: Task ={
      title: this.title,
      date: this.dateService.date.value.format('DD-MM-YYYY'),
      id: '',
      online: false,
      version: 0
    };

    this.taskService.create(task).subscribe(() => {
      this.tasks.push(task);
      this.title=''; 
      this.invalid = true;
    }, err => {
      console.error(err);
    });
  }
  remove(task: Task): void{
    this.taskService.remove(task).subscribe(() => {
      this.tasks = this.tasks.filter(t => t.id !== task.id);
    }, err => console.error(err));
  }

  @Watch('title')
  checkTitle(pTitle: string){
     this.invalid = pTitle ? false : true;
  }

}
</script>

<style lang="scss">
section {
  border: 1px solid #000;
  padding: 1rem;

  header {
    margin-bottom: 1rem;
  }
}

.task {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: .5rem 1rem;
  border: 1px solid #ccc;
  margin-bottom: .5rem;
}

</style>