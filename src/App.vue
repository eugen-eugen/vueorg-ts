<template>
 
  <div id="app" class="container">

    <Selector/>
    <Calendar/>
    <Organizer/>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator';
import { DateService } from './shared/date.service';
import Selector from './components/Selector.vue';
import { Moment } from 'moment';
import Calendar from './components/Calendar.vue';
import { TaskService } from './shared/tasks.service.onoff';
import Organizer from './components/Organizer.vue';
export {TaskService};

Vue.filter('month', function (moment: Moment) {
  return moment.format('MMMM YYYY')
})

Vue.filter('date', function (moment: Moment) {
  return moment.format('DD.MM.YYYY')
}) 

@Component({
  components: {
    //   HelloWorld,
    Selector,
    Calendar,
    Organizer
  }

})
export default class App extends Vue {
    @Provide('dateService') public dataService: DateService=new DateService();
    @Provide('taskService') public taskService: TaskService=new TaskService();
    
    created(){
        if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./service-worker.js')
                .then((reg) => {
                console.log('Service worker registered.', reg);
                });
        });

    }
    }
}
</script>

<style lang="scss">

@import url('https://fonts.googleapis.com/css?family=Roboto&display=swap');
:root {
    --primary-color: #dc3545;
    --dark-color: #333333;
    --light-color: #f4f4f4;
}
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Roboto', sans-serif;
    font-size: 1rem;
    line-height: 1.6;
    background: #fff;
    color: #333;
}

a {
    color: var(--primary-color);
    text-decoration: none;
    &:hover{
        color: #666;
    }
}

ul {
    list-style: none;
}

input {

    width: 100%;
    padding: 0.4rem;
    font-size: 1.2rem;
    border:1px solid #cccc;
    outline: none;
    margin-bottom: 0.5rem;
}

.container{
    max-width: 1100px;
    margin:auto;
    overflow: hidden;
    padding: 0 2rem;
}

table{
    &th{
      background: var(--light-color);
    }
}
.btn {
    display: inline-block;
    background: var(--light-color);
    color: #333;
    padding: 0.4rem 1.3rem;
    font-size: 1rem;
    border: none;
    cursor: pointer;
    margin-right: 0.5rem;
    transition: opacity 0.2rem;
    outline: none;
    &:disabled{
        background: var(--dark-color);
        color: #fff;
        cursor:not-allowed
    }
    &:hover:not(:disabled){
        opacity: 0.8;
    }
}
.btn-block{
    display: block;
    width: 100%;
}
.btn-primary{
    background: var(--primary-color);
    color: #fff;
}

.text-center {
    text-align: center;
}

</style>
