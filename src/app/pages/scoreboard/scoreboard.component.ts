import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Score } from '../../shared/models/Score';
import { IndexdbService } from '../../shared/services/indexdb.service';
import { ScoreService } from 'src/app/shared/services/score.service';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.scss']
})
export class ScoreboardComponent implements OnInit{

  constructor(protected indexdb: IndexdbService, protected scoreService: ScoreService){}
  scores$!: Observable<Score[]>
  offlineScores$!: Observable<Score[]>

  ngOnInit(): void {
    this.scores$ = this.scoreService.getAll()
    this.offlineScores$ = this.indexdb.scores$
  }
}
