<template>
  <div v-if="calendar">
    <table>
      <thead>
        <tr>
          <th
            v-for="(dayOfWeek, index) in calendar[0].days"
            :key="index"
          >{{dayOfWeek.value.format("ddd")}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(week, index) in calendar" :key="index">
          <td
            v-for="(day, ino) in week.days"
            :key="ino"
            :class="day.disabled && 'disabled'"
            v-on:click="select(day.value)"
          >
            <span
              :class="[day.selected && 'selected', day.active && 'active']"
            >{{day.value.format('DD')}}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { Component, Inject, Vue } from "vue-property-decorator";
import { DateService } from "../shared/date.service";
import { Moment } from "moment";
import moment from "moment";
import { Week, Day } from "../shared/Interfaces";

@Component
export default class Calendar extends Vue {
  @Inject("dateService") 
  private dateService!: DateService;  private calendar: Week[] = [];

  //Lifecycle

  created() {
    this.dateService.date.subscribe(this.generate.bind(this));
  }

  //

  go(dir: number) {
    this.dateService.changeMonth(dir);
  }


  select(selectedDate: Moment) {
    this.dateService.changeDate(selectedDate);
  }

  generate(selectedDate: moment.Moment) {
    const startDay = selectedDate
      .clone()
      .startOf("month")
      .startOf("week");
    const endDay = selectedDate
      .clone()
      .endOf("month")
      .endOf("week");
    const date = startDay.clone().subtract(1, "day");

    this.calendar = [];
    while (date.isBefore(endDay, "day")) {
      this.calendar.push({
        days: new Array<Day>(7)
          .fill({
            value: moment(),
            active: false,
            disabled: false,
            selected: false
          })
          .map(() => {
            const value = date.add(1, "day").clone();
            const active = moment().isSame(value, "day");
            const disabled = !selectedDate.isSame(value, "month");
            const selected = this.dateService.date.value.isSame(value, "day");
            return { value, active, disabled, selected };
          })
      });
    }
  }
}
</script>
<style lang="scss">
table {
  width: 100%;
  margin-bottom: 1rem;
  td,
  th {
    border: 1px solid black;
  }
  td {
    text-align: center;
    transition: all 0.2s;
    &.disabled {
      opacity: 0.5;
    }
    &:hover:not(.disabled) {
      background: #eee;
      cursor: pointer;
    }
  }
  .active {
    color: var(--primary-color);
    font-weight: bold;
  }
  .selected {
    color: blue;
  }
}
</style>