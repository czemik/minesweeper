import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Score } from '../models/Score';
import { ScoreService } from './score.service';


@Injectable({
  providedIn: 'root'
})
export class IndexdbService {

  private db!: IDBDatabase;
  private objectStoreName = 'scores';
  public scores$!: Observable<Score[]>;

  constructor(private scoreService: ScoreService){
    const request = indexedDB.open('scores-db', 2);

    request.onerror = (event: any) => {
      console.error('Database error:', event.target.error);
    };

    request.onupgradeneeded = (event: any) => {
      this.db = event.target.result;
      this.createObjectStore();
    };

    request.onsuccess = (event: any) => {
      this.db = event.target.result;
      this.loadItems();
    };
  }

  private createObjectStore() {
    const objectStore =
      this.db.createObjectStore(this.objectStoreName, {
        keyPath: 'id',
        autoIncrement: true,
      });

    objectStore.createIndex('name', 'name', { unique: false });
  }

  private loadItems() {
    const objectStore = this.db.transaction(this.objectStoreName).objectStore(this.objectStoreName);

    this.scores$ = new Observable<Score[]>((observer) => {
      const items: Score[] = [];

      objectStore.openCursor().onsuccess = (event: any) => {
        const cursor = event.target.result;
        if (cursor) {
          items.push(cursor.value);
          cursor.continue();
        } else {
          observer.next(items);
        }
      };
    });
  }

  public addItem(newItem: Score) {
    const objectStore = this.db.transaction(this.objectStoreName, 'readwrite').objectStore(this.objectStoreName);
    const request = objectStore.add(newItem);

    request.onsuccess = () => this.loadItems();
    request.onerror = (event) => console.error('Error adding item:', (event.target as any).error);
  }

  public clearScores() {
    const objectStore = this.db.transaction(this.objectStoreName, 'readwrite').objectStore(this.objectStoreName);
    const request = objectStore.clear();

    request.onsuccess = () => this.loadItems();
    request.onerror = (event) => console.error('Error clearing items:', (event.target as any).error);
  }


}
