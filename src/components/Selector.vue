<template>
<p>
  <i class="material-icons" v-on:click="go(-1)">arrow_left</i>
  <span> {{ dateX | month }}</span>
  <i class="material-icons" v-on:click="go(1)">arrow_right</i>
</p>
    
</template>
<script lang="ts">

import { Component, Inject, Vue } from 'vue-property-decorator'
import { DateService } from '../shared/date.service';
import { Moment} from 'moment';
import moment from 'moment'


@Component
export default class Selector extends Vue {
    private dateX: Moment = moment();
    @Inject('dateService') private dateService!: DateService;
    go(dir: number){
        this.dateService.changeMonth(dir);
        console.log(this.dateService.date.value)
    }

    created(){
        console.log('created');
        this.dateService.date.subscribe((pdate: Moment)=>{
            console.log('changed: '+ pdate);
            this.dateX = pdate.clone();
        });
    }

}
</script>

<style lang= "scss" scoped>

p{
  display: flex;
  align-items: center;
  justify-content: center;
  span {
    margin: 0 2rem;
    text-align: center;
    width: 200px;
  }
  i{
    cursor: pointer;
  }
}
</style>