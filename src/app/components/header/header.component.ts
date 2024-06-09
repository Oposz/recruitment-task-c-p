import {Component, DestroyRef, inject} from '@angular/core';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {FormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {AsyncPipe, NgOptimizedImage} from "@angular/common";
import {HttpCardsService} from "../../shared/card/http-cards.service";
import {ApplicationMode} from "../../constants/ApplicationMode";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";


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
    appReadyForPlay$ = this.cardsService.observeReadyForAction$().pipe(takeUntilDestroyed(this.destroyRef))

    constructor(
        private readonly cardsService: HttpCardsService
    ) {
    }

    getCardsForDuel(): void {
        let mode: ApplicationMode = ApplicationMode.PEOPLE
        if (this.starshipsMode) {
            mode = ApplicationMode.STARSHIPS
        }
        this.cardsService.notify(mode);
    }
}
