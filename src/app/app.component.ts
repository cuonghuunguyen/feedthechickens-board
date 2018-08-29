import { ClockService } from "./clock.service";
import { FeedingService } from "./shared/feeding.service";
import { Component } from "@angular/core";
import * as moment from "moment";
import axios from "axios";
import { Feeding } from "./shared/feeding";

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
    setInterval(() => this.checkFeeding(), 5000);
  }

  checkFeeding() {
    const notFedList = this.feedingService.feedingList.filter(feeding => {
      return new Date(feeding.time).getTime() < new Date().getTime();
    });
    Promise.all(
      notFedList.map(feeding => {
        return this.processFeeding(feeding);
      })
    );
  }

  async processFeeding(feeding: Feeding) {
    axios.get(`http://localhost/project.php?seconds=${feeding.duration}`);
    const temp = Object.assign({}, feeding);
    if (feeding.loop) {
      temp.fed = true;
      temp.time = this.clockService.getHtmlDateString(new Date());
      temp.id = "";
      this.feedingService.insertData(temp);
      feeding.time = this.clockService.getHtmlDateString(
        moment()
          .add(1, "days")
          .toDate()
      );
      this.feedingService.updateData(feeding);
    } else {
      feeding.fed = true;
      feeding.time = this.clockService.getHtmlDateString(new Date());
      this.feedingService.updateData(feeding);
    }
  }
}
