import {Component, DestroyRef, inject} from '@angular/core';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {FormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {AsyncPipe, NgOptimizedImage} from "@angular/common";
import {HttpCardsService} from "../../shared/card/http-cards.service";
import {ApplicationMode} from "../../constants/ApplicationMode";
import {map} from "rxjs";
import {PrefetchState} from "../../constants/PrefetchState";


@Component({
    selector: 'app-header',
    standalone: true,
    imports: [
        MatSlideToggleModule,
        FormsModule,
        MatButton,
        NgOptimizedImage,
        AsyncPipe
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent {
    destroyRef: DestroyRef = inject(DestroyRef);
    starshipsMode: boolean = false;
    appReadyForPlay$ = this.httpCardsService.selectReadyForAction$().pipe(map((state: PrefetchState) => {
        return state === PrefetchState.DONE;
    }))

    constructor(
        private readonly httpCardsService: HttpCardsService
    ) {
    }

    getCardsForDuel(): void {
        let mode: ApplicationMode = ApplicationMode.PEOPLE
        if (this.starshipsMode) {
            mode = ApplicationMode.STARSHIPS
        }
        this.httpCardsService.notify(mode);
    }
}
