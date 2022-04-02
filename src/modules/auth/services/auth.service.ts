import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from '@common/services';
import { User } from '@modules/auth/models';
import { LoginPayload, TokenResponse } from '@start-bootstrap/sb-clean-blog-shared-types';
import { from, Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from 'firebase/app';

import { AuthUtilsService } from './auth-utils.service';

@Injectable()
export class AuthService {
    constructor(
        private http: HttpClient,
        private configService: ConfigService,
        private authUtilsService: AuthUtilsService,
        private router: Router
    ) {}

    login$(loginPayload: LoginPayload): Observable<boolean> {




        var firebaseConfig = {
            apiKey: "AIzaSyA_1jea7amqdh6sor8qpjHWQf-ckAnkWpM",
            authDomain: "portfoliof-c75fd.firebaseapp.com",
            // The value of `databaseURL` depends on the location of the database
            databaseURL: "https://portfoliof-c75fd-default-rtdb.europe-west1.firebasedatabase.app",
            projectId: "portfoliof-c75fd",
            storageBucket: "portfoliof-c75fd.appspot.com",
            messagingSenderId: "453637072092",
     
          };
        const app = initializeApp(firebaseConfig);

        const auth = getAuth();
let authd = signInWithEmailAndPassword(auth, "claudeclodi@hotmail.co.uk", loginPayload.password)

            return from(authd)
            .pipe(
                switchMap(
                    (loginResults): Observable<User> =>
                    {
                     return this.authUtilsService.processToken$(from(loginResults.user.getIdToken()))
                    }),
                switchMap(user => {
                    return from(this.router.navigate(['/']));
                }),
                catchError((error: Error) => throwError(error))
            );
    }
}
