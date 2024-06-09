import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CounterService {

    private leftCounter: BehaviorSubject<number> = new BehaviorSubject(0)
    private rightCounter: BehaviorSubject<number> = new BehaviorSubject(0)

    constructor() {
    }

    addPointToLeft() {
        this.leftCounter.next(this.leftCounter.value + 1)
    }

    addPointToRight() {
        this.rightCounter.next(this.rightCounter.value + 1)
    }

    draw() {
        this.addPointToRight();
        this.addPointToLeft();
    }

    selectLeftCounterValue$(): Observable<number> {
        return this.leftCounter.asObservable()
    }

    selectRightCounterValue$(): Observable<number> {
        return this.rightCounter.asObservable()
    }
}
