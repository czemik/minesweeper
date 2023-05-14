import { Injectable } from '@angular/core';
import { Score } from '../models/Score';
import { AngularFirestore } from '@angular/fire/compat/firestore';
@Injectable({
  providedIn: 'root'
})
export class ScoreService {

  collectionName: string = 'Scores';

  constructor(private afs: AngularFirestore) {  }

  create(score: Score){
    return this.afs.collection<Score>(this.collectionName).add(score);
  }

  getAll(){
    return this.afs.collection<Score>(this.collectionName).valueChanges();
  }

}
