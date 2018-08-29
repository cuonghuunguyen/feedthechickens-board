import { ClockService } from "./../clock.service";
import { Injectable } from "@angular/core";
import { Feeding } from "./feeding";
import { AngularFirestore } from "angularfire2/firestore";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class FeedingService {
  feedingList: Feeding[];
  fedList: Feeding[];
  selectedFeeding: Feeding = new Feeding();

  constructor(public afs: AngularFirestore, private clock: ClockService) {
    this.feedingList = [];
    this.getNotFedData();
  }
  getNotFedData() {
    let tempList: Feeding[];
    this.afs
      .collection<Feeding>("schedule", ref => ref.where("fed", "==", false))
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            data.id = a.payload.doc.id;
            return data;
          });
        })
      )
      .subscribe(data => {
        tempList = data;
        this.feedingList = tempList;
      });

    return tempList;
  }

  getFedData() {
    let tempList: Feeding[];
    this.afs
      .collection<Feeding>("schedule", ref =>
        ref.where("fed", "==", true).orderBy("time")
      )
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            data.id = a.payload.doc.id;
            return data;
          });
        })
      )
      .subscribe(data => {
        tempList = data;
        this.fedList = tempList;
      });

    return tempList;
  }

  insertData(feeding: Feeding) {
    const tempObj = {
      id: "",
      time: feeding.time,
      duration: feeding.duration,
      fed: feeding.fed,
      loop: feeding.loop
    };
    return this.afs.collection("schedule").add(tempObj);
  }

  updateData(feeding: Feeding) {
    return this.afs
      .doc("schedule/" + feeding.id)
      .update(Object.assign(feeding, {}));
  }

  deleteData(key: string) {
    return this.afs.doc("schedule/" + key).delete();
  }
}
