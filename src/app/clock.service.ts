import { Injectable } from "@angular/core";
import { timer } from "rxjs";

function padZero(a: number) {
  return a.toString().padStart(2, "0");
}

@Injectable({
  providedIn: "root"
})
export class ClockService {
  public clock: Date = new Date();
  constructor() {}

  getHtmlDateString(date: Date) {
    const todayString = `${date.getFullYear()}-${padZero(
      date.getMonth()
    )}-${padZero(date.getDay())}T${padZero(date.getHours())}:${padZero(
      date.getMinutes()
    )}`;
    return todayString;
  }

  startClock() {
    timer(0, 1000).subscribe(() => {
      this.clock = new Date();
    });
  }
}
