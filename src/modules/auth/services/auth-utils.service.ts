import { tokenName } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UtilityService } from '@common/services';
import { Token } from '@start-bootstrap/sb-clean-blog-shared-types';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { User } from '../models';

const _isLoggedIn$ = new BehaviorSubject(false);

@Injectable()
export class AuthUtilsService {
    jwtHelperService: JwtHelperService = new JwtHelperService();
    constructor(private util: UtilityService) {}

    isLoggedIn$(): Observable<boolean> {
        return _isLoggedIn$;
    }

    bearerToken(): string | false {
        const token = this._jwtIsValid();
        if (token) {
            return `${token}`;
        }
        return false;
    }

    checkToken() {
        this._jwtIsValid();
    }

    checkToken$(): Observable<string> {
        const token = this._jwtIsValid();

        if (token) {
            return of(token as string);
        }

        return throwError(new Error('INVALID_JWT'));
    }

    processToken$(token: Observable<String>): Observable<User> {
        if (!token) {
            return throwError(new Error('NO_TOKEN'));
        }

       return token.pipe(
  map(data=>{
                
                const tokenPayload = this._decodeToken(data.toString());
                this._storeToken(data.toString());

return tokenPayload
            })
  
        )


    }

    _decodeToken(token: Token): User {
        const user = this.jwtHelperService.decodeToken(token);
        return user;
    }

    decodeToken$(token: Token): Observable<User> {
        return of(this._decodeToken(token));
    }

    postOptionsAuthHeaders() {
        return {
            headers: {
                Authorization: this.bearerToken(),
            },
        };
    }

    _jwtIsValid(): string | boolean {
        const token = this.util.localStorage.getItem('sb-clean-blog|token');
        console.log(token)

        if (!token) {
            _isLoggedIn$.next(false);
            return false;
        }

        const expired = this.jwtHelperService.isTokenExpired(token);

        if (expired) {
            this.util.localStorage.removeItem('sb-clean-blog|token');
            _isLoggedIn$.next(false);
            return false;
        }

        _isLoggedIn$.next(true);
        return token;
    }
    
    _storeToken(token: string) {
    this.util.localStorage.setItem('sb-clean-blog|token',token);

}

}
 
