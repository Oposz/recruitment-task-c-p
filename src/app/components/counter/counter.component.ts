import {Component} from '@angular/core';
import {CounterService} from "../../shared/counter/counter.service";
import {AsyncPipe} from "@angular/common";

@Component({
    selector: 'app-counter',
    standalone: true,
    imports: [
        AsyncPipe
    ],
    templateUrl: './counter.component.html',
    styleUrl: './counter.component.scss'
})
export class CounterComponent {
    leftCounter = this.counterService.selectLeftCounterValue$()
    rightCounter = this.counterService.selectRightCounterValue$()

    constructor(
        private readonly counterService: CounterService
    ) {
    }


}
