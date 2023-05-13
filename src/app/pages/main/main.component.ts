import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Cell } from '../../shared/models/Cell';
import { GameService } from 'src/app/shared/services/game.service';
import { Difficulty } from 'src/app/shared/models/Difficulty';
import { FormControl } from '@angular/forms';
import { ScoreService } from 'src/app/shared/services/score.service';
import { UserService } from 'src/app/shared/services/user.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit{
  time: number = 0;
  timerInterval: any;
  inGame: boolean = false;
  username!: string;
  gameLost!: boolean;
  difficulties: Difficulty[] = [{name: 'Easy', rows: 10, cols: 10, mines: 10}, {name: 'Medium', rows: 16, cols: 16, mines: 40}, {name: 'Hard', rows: 16, cols: 30, mines: 99} ];
  difficulty: Difficulty = this.difficulties[0];

  diff: FormControl = new FormControl(this.difficulty)

  constructor(protected game: GameService, private scoreService: ScoreService, private userService: UserService, private auth: AuthService) {
    
  }
  
  ngOnInit(): void {
    console.log("Init")
    const getUsername$ = this.userService.getUserById(JSON.parse(localStorage.getItem('user') as string).uid as string).pipe(first());
    getUsername$.subscribe(val =>{
       this.username = val.data()!.username;
       console.log(this.username)
      })
  }

  newGame(){
    this.game.newGame(this.difficulty.rows, this.difficulty.cols, this.difficulty.mines);
  }

  start(){
    if(!this.inGame){
      this.difficulty = this.diff.value as Difficulty;
      this.newGame()
      console.log("Game started")
      this.time = 1;
      this.inGame = true;
      this.startTimer();
    }
  }

  stop(){
    if(this.inGame){
      console.log("Game stopped");
      this.inGame = false;
      this.stopTimer();
    }
  }

  gameStateChecker(){
    if(this.game.gameWon){
      console.log("Game won")
      this.stop()
      let score = {
        username: this.username,
        difficulty: this.difficulty,
        time: this.time
      }
      this.scoreService.create(score);
    }
    else if(this.game.gameLost)
      this.stop()
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.time++;
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.timerInterval);
  }

}

