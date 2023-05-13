import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  collectionName: string = 'Users';

  constructor(private afs: AngularFirestore) {  }

  create(user: User){
    return this.afs.collection<User>(this.collectionName).doc(user.id).set(user);
  }

  getUserById(id: string){
    return this.afs.collection<User>(this.collectionName).doc(id).get();
  }

}
