import { ClockService } from "./clock.service";
import { FeedingService } from "./shared/feeding.service";
import { Component } from "@angular/core";
const moment = require("moment");

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  constructor(
    public clockService: ClockService,
    public feedingService: FeedingService
  ) {
    this.clockService.startClock();
    setInterval(() => this.checkFeeding(), 1000);
  }

  checkFeeding() {
    const notFedList = this.feedingService.feedingList.filter(feeding => {
      return new Date(feeding.time).getTime() < new Date().getTime();
    });
    console.log(notFedList);

    notFedList.map(feeding => {
      console.log(`feed in ${feeding.duration} seconds`);
      const temp = Object.assign({}, feeding);
      if (feeding.loop) {
        temp.fed = false;
        temp.time = this.clockService.getHtmlDateString(new Date());
        temp.id = "";
        this.feedingService.insertData(temp);
        feeding.time = this.clockService.getHtmlDateString(
          moment()
            .add(1, "days")
            .calendar()
            .toDate()
        );
        this.feedingService.updateData(feeding);
      } else {
        feeding.fed = true;
        feeding.time = this.clockService.getHtmlDateString(new Date());
        this.feedingService.updateData(feeding);
      }
    });
  }
}
