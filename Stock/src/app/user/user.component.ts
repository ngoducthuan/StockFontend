import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { StockServiceService } from '../stock-service.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
    userInfo: any;

    constructor(private authService: StockServiceService, private router: Router) {}

    ngOnInit(): void {
        //alert("POke");
        //this.userInfo = this.authService.getUserInfo(); // Get user info
        //alert(this.userInfo.firstname); Check whether you get
        
        const token = this.authService.getToken(); // Lấy token từ localStorage
        if (token) {
            const decodedToken: any = jwtDecode(token); // Decode token
            this.userInfo = this.authService.getUserInfo();
            
            // Kiểm tra thời gian hết hạn của token
            const currentTime = Math.floor(Date.now() / 1000); // Curent time
            //alert(currentTime + " "+decodedToken.exp)
            if (decodedToken.exp < currentTime) {
                // Token đã hết hạn, điều hướng người dùng tới trang đăng nhập
                alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                this.authService.logout();
                this.router.navigate(['/login']);
            }
        } else {
            // No token, fowarding to login page
            this.router.navigate(['/login']);
        }
    }
    //Logout process
    isLogoutFormOpen: boolean = false;
    // Function to toggle the logout form
    openLogoutForm(): void {
        this.isLogoutFormOpen = !this.isLogoutFormOpen; // Toggle trạng thái giữa mở và đóng
    }
    //Move to home
    moveToHome() {
        this.router.navigate(['/dashboard']);
    }
    //Move stock detail
    //Logout
    logout(){
        this.authService.logout();
        this.router.navigate(['/login']);
    }
    //Move to home
    moveStockDetail() {
        this.router.navigate(['/stock-detail']);
    }
    formatDate(dateString: string): string {
        if (!dateString) return '';
      
        const date = new Date(dateString);
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        const year = date.getFullYear();
      
        return `${month}/${day}/${year}`;
    }
    /*Payment form handle*/
    //Predict form handing
    showPaymentForm(): void {
        const predict = document.getElementById('paymentForm') as HTMLDivElement;
        predict.style.display = 'block';
    }
    hiddenPaymentForm(): void {
        const predict = document.getElementById('paymentForm') as HTMLDivElement;
        this.qrImageUrl = `https://img.vietqr.io/image/MB-0386037685-compact.png`;
        predict.style.display = 'none';
        window.location.reload();
    }
    closePaymentForm(): void {
        this.hiddenPaymentForm();
    }
    /* Creat QR payment */
    /*paymentAmount: number = 0;*/
    /* ID payment */
    private qrIdCounter: number = 1;
    qrImageUrl: string = 'https://img.vietqr.io/image/MB-0386037685-compact.png';

    /*Payment handing*/
    paymentData: { paymentAmount: number; qrId: string } | null = null;
    generateQRPayment(userMoney: string, userMoneyInput: HTMLInputElement): { paymentAmount: number; qrId: string } | void{
        const paymentAmount = parseFloat(userMoney);
        if (paymentAmount > 0) {
            const qrId = this.qrIdCounter++;
            this.qrImageUrl = `https://img.vietqr.io/image/MB-0386037685-print.png?amount=${paymentAmount}&addInfo=THANH%20TOAN%20TO%20NGO%20DUC%20THUAN%20ID%20${qrId}&accountName=NGO%20DUC%20THUAN`;
            userMoneyInput.value = '';

            const responseJson = {
                paymentAmount: paymentAmount,
                qrId: `NGO DUC THUAN ID ${qrId}`
            };
            this.paymentData = responseJson;
            //return responseJson;
        } else {
            alert('Please enter a valid amount');
        }
    }

    /*Get data from google sheet*/
    data: any;

    getDataFromGoogleSheetApi() {
        //alert("Google Sheet Data");
        this.authService.getGoogleSheetData().subscribe(
        (response) => {
            //this.data = response;
            console.log('Dữ liệu nhận được',response.data); 
            if (response.data && Array.isArray(response.data)) {
                this.data = response.data;
      
                setTimeout(() => {
                    let found = false;

                    this.data.forEach((item: any) => {
                        if (item['Giá trị'] === 10000 && item['Mô tả'].includes('NGUYEN BINH NAM')) {
                            // alert('Thành công: Đã tìm thấy giá trị 10000 và mô tả chứa "NGUYEN BINH NAM"');
                            found = true; // Đánh dấu là đã tìm thấy
                        }
                    });

                    if (found) {
                        alert('Hoàn tất: Đã kiểm tra xong các phần tử và tìm thấy kết quả mong muốn.');
                    } else {
                        alert('Hoàn tất: Đã kiểm tra xong các phần tử nhưng không tìm thấy kết quả mong muốn.');
                    }
                }, 120000);
            } else {
                console.error('Dữ liệu không phải là một mảng hoặc không tồn tại:', response);
                alert("Error: Dữ liệu không hợp lệ");
            }
        },
        (error) => {
            console.error('Có lỗi xảy ra!', error);
        }
        );
    }
    /* Check data from google sheet */
    checkDataFromGoogleSheetApi(paymentAmount: number | undefined, qrID: string | undefined, user_id: number) {
        //alert(paymentAmount)
        //alert(qrID)
        //alert(user_id)
        if(paymentAmount != undefined && paymentAmount != null) {
            //When user update successful, we will update database 
            this.authService.handlePayment(user_id, paymentAmount).subscribe(
                user => {
                  console.log('Cập nhật thành công:', user);
                  this.authService.setUserInfo(user); //Update user information to local storage
                },
                error => {
                  console.error('Đã xảy ra lỗi:', error);
                }
            );
        }
        
        //alert("Google Sheet Data check");
        this.authService.getGoogleSheetData().subscribe(
        (response) => {
            //this.data = response;
            console.log('Dữ liệu nhận được',response.data); 
            if (response.data && Array.isArray(response.data) && paymentAmount !== undefined && qrID !== undefined && paymentAmount !== null && qrID !== null) {
                this.data = response.data;
      
                setTimeout(() => {
                    let found = false;

                    this.data.forEach((item: any) => {
                        if (item['Giá trị'] === paymentAmount && item['Mô tả'].includes(qrID)) {
                            alert('Thành công: Nạp tiền thành công."');
                            found = true;
                        }
                    });

                    if (found) {
                        alert('Hoàn tất: Đã kiểm tra xong các phần tử và tìm thấy kết quả mong muốn.');
                        this.paymentData = null;
                    } else {
                        alert('Hoàn tất: Đã kiểm tra xong các phần tử nhưng không tìm thấy kết quả mong muốn.');
                        this.paymentData = null;
                    }
                }, 5000);
            } else {
                console.error('Dữ liệu không phải là một mảng hoặc không tồn tại:', response);
                alert("Error: Dữ liệu không hợp lệ");
                this.paymentData = null;
            }
        },
        (error) => {
            console.error('Có lỗi xảy ra!', error);
        }
        );
    }
}
