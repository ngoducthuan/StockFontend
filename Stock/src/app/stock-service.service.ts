import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class StockServiceService {
    /* Handle stock detail */
    constructor(private http: HttpClient) {}
    baseUrl = 'http://103.145.63.232:1234/';

    getHeaders(): HttpHeaders {
        const token = localStorage.getItem('authToken');
        return token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();
    }

    getStocksToday(): Observable<any> {
        return this.http.get<any>(this.baseUrl + 'getall/VN30', { headers: this.getHeaders() });
    }

    getStockByCode(code: string): Observable<any> {
        return this.http.get<any>(this.baseUrl + code, { headers: this.getHeaders() });
    }

    getExport(name: string): Observable<any> {
        return this.http.get<any>(this.baseUrl + name, { headers: this.getHeaders() });
    }

    export(name: string): Observable<any> {
        return this.http.get(
        this.baseUrl + 'StockAnalysis/api/export?ids=' + name,
        { headers: this.getHeaders() , responseType: 'blob' }
    );
    }

    predict(name: string): Observable<any> {
        return this.http.get(this.baseUrl + 'StockAnalysis/api/predict?id=' + name, { headers: this.getHeaders() });
    }
    /* Handle authentication */
    //private apiUrl = 'https://localhost:7047/api/Authentication/login'
    private apiUrl = 'http://103.145.63.232:1234/api/Authentication/';
    private userInfo: any;
    login(username: string, password: string): Observable<any> {
        return this.http.post<any>(this.apiUrl+'login', { username, password });
    }

    setUserInfo(userInfo: any) {
        this.userInfo = userInfo;
        localStorage.setItem('userInfo', JSON.stringify(userInfo)); // Stored user info to localStorage
    }
    
    getUserInfo() {
        const storedUserInfo = localStorage.getItem('userInfo');
        return storedUserInfo ? JSON.parse(storedUserInfo) : this.userInfo; // Get user info from localStorage
    }

    setToken(token: string) {
        localStorage.setItem('authToken', token);
    }

    getToken(): string | null {
        return localStorage.getItem('authToken');
    }

    logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo'); // Delete user info localStorage
    }
    /* Handle register */
    register(user: any): Observable<any> {
        return this.http.post<any>(this.apiUrl+'register', user).pipe(
            catchError(error => {
                // Check error
                const errorMessage = error.error || 'Error occurred during registration';
                return new Observable(observer => {
                    observer.error(errorMessage);
                });
            })
        );
    }   
    /*Handle purchase */
    handlePurchase(userId: number){
        return this.http.put(`${this.apiUrl}purchase/${userId}`, null, { headers: this.getHeaders() });
    }

    /*Handle payment online */
    private apiGoogleSheetUrl = 'https://script.google.com/macros/s/AKfycby7YGqt5_I-6H64_OK0aVNHsAN_GUCoZ_fBu1hffFsB94PVbei_zPRfqIfwUQXyl_2hrg/exec'; // Link API

    getGoogleSheetData(): Observable<any> {
        return this.http.get<any>(this.apiGoogleSheetUrl, { headers: this.getHeaders() });
    }
    //Update payment using api
    handlePayment(userId: number, amountPayment: number): Observable<any>{
        //alert('stock service')
        const paymentData = {
            userId: userId,
            depositMoney: amountPayment
        };
        return this.http.post<any>(this.apiUrl+'deposit', paymentData);
    }
}
