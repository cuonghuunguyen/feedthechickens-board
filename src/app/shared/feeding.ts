import { Time } from "@angular/common";

function padZero(a: number) {
  return a.toString().padStart(2, "0");
}

export class Feeding {
  id: string;
  time: string;
  duration: number;
  loop: boolean;
  fed: boolean;
  constructor() {
    const today = new Date();
    const todayString = `${today.getFullYear()}-${padZero(
      today.getMonth()
    )}-${padZero(today.getDay())}T${padZero(today.getHours())}:${padZero(
      today.getMinutes()
    )}`;

    this.id = "";
    this.time = todayString;
    this.duration = 0;
    this.loop = false;
    this.fed = false;
  }
}
