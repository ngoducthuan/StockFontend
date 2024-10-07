import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private router: Router) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Danh sách các endpoint mà bạn không muốn thêm token vào
        const excludedUrls = ['/login', '/register'];

        const token = localStorage.getItem('authToken');

        if (!excludedUrls.some(url => req.url.includes(url))) {
            const token = localStorage.getItem('authToken');
      
            if (token) {
                try {
                    const decodedToken: any = jwtDecode(token);
                    const expirationDate = new Date(decodedToken.exp * 1000); // exp là số giây
                    const now = new Date();
        
                    if (expirationDate < now) {
                    // Token đã hết hạn, xóa token và điều hướng đến trang đăng nhập
                    localStorage.removeItem('authToken');
                    this.router.navigate(['/login']);
                    return throwError('Token has expired. Please log in again.');
                    }
        
                    // Nếu token còn hiệu lực, thêm vào header của request
                    req = req.clone({
                        setHeaders: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                } catch (error) {
                    // Xử lý lỗi nếu có
                    localStorage.removeItem('authToken');
                    this.router.navigate(['/login']);
                    return throwError('Invalid token. Please log in again.');
                }
            }else{
                this.router.navigate(['/login']);
                alert("You must login");
            }
        }
      
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) { // 401 Unauthorized
                    // Xử lý khi nhận được mã lỗi 401 từ API
                    localStorage.removeItem('authToken');
                    this.router.navigate(['/login']);
                }
                return throwError(error);
            })
        );
    }
}
