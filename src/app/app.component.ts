import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {CardComponent} from "./components/card/card.component";
import {HeaderComponent} from "./components/header/header.component";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ApplicationMode} from "./constants/ApplicationMode";
import {type CardDetails, CardType} from "./constants/CardDetails";
import {HttpCardsService} from "./shared/card/http-cards.service";
import {forkJoin, take} from "rxjs";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {CounterComponent} from "./components/counter/counter.component";
import {AsyncPipe} from "@angular/common";
import {CounterService} from "./shared/counter/counter.service";
import {PrefetchState} from "./constants/PrefetchState";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, CardComponent, HeaderComponent, MatProgressSpinner, CounterComponent, AsyncPipe],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
    PrefetchState = PrefetchState;

    loader: boolean = false;
    initialState: boolean = true;
    destroyRef: DestroyRef = inject(DestroyRef);
    cardsDetails: CardDetails[] = [];
    appPrefetched$ = this.httpCardsService.selectReadyForAction$()


    constructor(
        private readonly httpCardsService: HttpCardsService,
        private readonly changeDetectorRef: ChangeDetectorRef,
        private readonly counterService: CounterService
    ) {
    }

    ngOnInit(): void {
        this.httpCardsService.prefetchIds();
        this.observeForDuelBeginning();
    }

    private observeForDuelBeginning(): void {
        this.httpCardsService.selectFetchData$().pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe((appMode: ApplicationMode) => {
                this.initialState = false;
                this.assignCardDetail(appMode)
            }
        )
    }

    private assignCardDetail(mode: ApplicationMode): void {
        if (this.loader) return;
        this.loader = true;
        if (mode === ApplicationMode.STARSHIPS) {
            this.observeStarshipDetails();
        } else {
            this.observePeopleDetails();
        }
    }

    private observeStarshipDetails(): void {
        const starshipCardsDetails = forkJoin([
                this.httpCardsService.selectNewStarship$(),
                this.httpCardsService.selectNewStarship$()
            ]
        )
        starshipCardsDetails.pipe(take(1)).subscribe((cardDetails) => {
            this.cardsDetails = cardDetails.map((details) => ({
                type: CardType.STARSHIP,
                data: details.result,
                comparable: details.result.properties.crew === 'unknown' ? '1' : details.result.properties.crew,
                winner: false
            }));
            this.refreshViewAfterFetch();
        })
    }

    private observePeopleDetails(): void {
        const peopleCardsDetails = forkJoin([
                this.httpCardsService.selectNewPerson$(),
                this.httpCardsService.selectNewPerson$()
            ]
        )
        peopleCardsDetails.pipe(take(1)).subscribe((cardDetails) => {
            this.cardsDetails = cardDetails.map((details) => ({
                type: CardType.PERSON,
                data: details.result,
                comparable: details.result.properties.mass === 'unknown' ? '1' : details.result.properties.mass,
                winner: false
            }));
            this.refreshViewAfterFetch();
        })
    }

    private refreshViewAfterFetch(): void {
        this.duel()
        this.loader = false;
        this.changeDetectorRef.detectChanges();
    }

    private duel() {
        const comparableSet = new Set(this.cardsDetails.map((card) => parseInt(card.comparable)))
        if (comparableSet.size === 1) {
            this.cardsDetails.forEach(card => card.winner = true)
            this.counterService.draw();
        } else {
            const winnerComparableValue = Math.max(...comparableSet)
            const winnerCardDetails = this.cardsDetails.find(cardDetail => parseInt(cardDetail.comparable) === winnerComparableValue)!
            winnerCardDetails.winner = true;
            this.addPoints(this.cardsDetails.indexOf(winnerCardDetails))
        }
    }

    private addPoints(winnerIndex: number) {
        if (winnerIndex === 0) {
            this.counterService.addPointToLeft();
        } else {
            this.counterService.addPointToRight();
        }
    }
}
