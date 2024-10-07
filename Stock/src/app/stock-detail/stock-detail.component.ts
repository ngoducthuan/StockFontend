import { StockServiceService } from './../stock-service.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataServiceService } from '../data-service.service';
import { ChartOptions } from '../dashboard/dashboard.component';
import { ChartComponent } from 'ng-apexcharts';
import { ActivatedRoute, Router } from '@angular/router';
import { concatMap, tap, forkJoin, of } from 'rxjs';
import { saveAs } from 'file-saver';
import { ThisReceiver } from '@angular/compiler';
import { SearchData } from 'igniteui-angular-charts';
const sparkLineData = [
  47, 45, 54, 38, 56, 24, 65, 31, 37, 39, 54, 38, 56, 24, 65, 31, 37, 39, 62,
  51, 35, 41, 35, 27, 93, 53, 61, 27, 54, 43, 19, 54, 38, 56, 24, 65, 31, 37,
  39, 62, 51, 35, 41, 35, 27, 93, 53, 61, 27, 54, 43, 19, 62, 51, 35, 41, 35,
  27, 93, 53, 61, 27, 54, 43, 19, 46,
];
let firstStockHistoryData: any;
let secondStockHistoryData: any;
let firstStockCode: string;
let secondStockCode: string;
let listTopStockName: string[] = ['FPT', 'GVR', 'PLX', 'SSI', 'VCB'];
let top5Stocks: any[];
// Khai báo biến predictStock ngoài các hàm
const predictStock = [
{
    "time": "2024-09-13T17:00:00.000Z",
    "open": 0,
    "high": 0,
    "low": 0,
    "close": 23.70,
    "volume": 0
},
{
    "time": "2024-09-14T17:00:00.000Z",
    "open": 0,
    "high": 0,
    "low": 0,
    "close": 23.70,
    "volume": 0
},
{
    "time": "2024-09-15T17:00:00.000Z",
    "open": 0,
    "high": 0,
    "low": 0,
    "close": 23.55,
    "volume": 0
},
{
    "time": "2024-09-16T17:00:00.000Z",
    "open": 0,
    "high": 0,
    "low": 0,
    "close": 23.95,
    "volume": 0
},
{
    "time": "2024-09-17T17:00:00.000Z",
    "open": 0,
    "high": 0,
    "low": 0,
    "close": 24.35,
    "volume": 0
},
{
    "time": "2024-09-18T17:00:00.000Z",
    "open": 0,
    "high": 0,
    "low": 0,
    "close": 24.60,
    "volume": 0
},
{
    "time": "2024-09-19T17:00:00.000Z",
    "open": 0,
    "high": 0,
    "low": 0,
    "close": 24.90,
    "volume": 0
},
{
    "time": "2024-09-20T17:00:00.000Z",
    "open": 0,
    "high": 0,
    "low": 0,
    "close": 25.10,
    "volume": 0
}
];
@Component({
selector: 'app-stock-detail',
templateUrl: './stock-detail.component.html',
styleUrls: ['./stock-detail.component.css'],
})

export class StockDetailComponent implements OnInit {
    public legend: any[] = [
        { name: 'FinancialPridict', brush: 'orange' },
        { name: 'ACB', brush: 'blue' }
    ];
    //Data source start
    firstStockHistoryData: any[] = [];
    formattedPredictData: any[] = [];
    predictDataFinal: any[] = [];
    //Data source end
    userInfo: any;
    allSymStocks: string[] = [];
    selectedStock1: string = '';
    selectedStock2: string = '';
    display = 'none';
    stockToday: any;
    topStocks: any[] = [];
    isPopupOpen: boolean = false;
    predictData: any;
    public listTopStockInfo: any[] = [];
    public topStockChart: Partial<ChartOptions>[] = [];
    @ViewChild('chart') chart?: ChartComponent;
    @ViewChild('stockInput') stockInput!: ElementRef;
    public chartAreaSparkline3Options?: Partial<ChartOptions>;
    public chartAreaSparkline3Options1?: Partial<ChartOptions>;
    public chartAreaSparkline3Options2?: Partial<ChartOptions>;
    public chartAreaSparkline3Options3?: Partial<ChartOptions>;
    public chartAreaSparkline3Options4?: Partial<ChartOptions>;
    public commonAreaSparlineOptions: Partial<ChartOptions> = {
        chart: {
            type: 'area',
            height: 60,
            sparkline: {
                enabled: true,
        },
        },
            stroke: {
            curve: 'straight',
        },
            fill: {
            opacity: 0.3,
        },
            yaxis: {
            min: 0,
        },
    };

public data: any;
constructor(
    private dataService: DataServiceService,
    private stockService: StockServiceService,
    private route: ActivatedRoute,
    private router: Router
    
) {
    //this.getTopStock();
}
//public chartOptions?: Partial<ChartOptions>;
public chartOptions?: Partial<ChartOptions> = {
    series: [{ data: [] }, { data: [] }],
    colors: ['#67D0BF', '#FF5733'],
    xaxis: {
    type: 'datetime',
    },
    stroke: {
    curve: 'smooth',
    },
    title: {
    text: 'Stock Price Over Time',
    align: 'left',
    },
    yaxis: {
    title: {
        text: 'Price',
    },
    },
    legend: {
    position: 'top',
    horizontalAlign: 'left',
    }
};
  

    togglePopup(): void {
        this.stockService.predict(firstStockCode).subscribe((data) => {
        this.predictData = data;
        console.log(this.predictData);
        });
        this.isPopupOpen = !this.isPopupOpen;
    }
    //Search handle
    private validStockCodes: string[] = [
        'ACB',
        'BCM',
        'BID',
        'BVH',
        'CTG',
        'FPT',
        'GAS',
        'GVR',
        'HDB',
        'HPG',
        'MBB',
        'MSN',
        'MWG',
        'PLX',
        'POW',
        'SAB',
        'SHB',
        'SSB',
        'SSI',
        'STB',
        'TCB',
        'TPB',
        'VCB',
        'VHM',
        'VIB',
        'VIC',
        'VJC',
        'VNM',
        'VPB',
        'VRE',
    ];

    // Search handing
    onSearchKeyup(event: KeyboardEvent): void {
        const inputElement = event.target as HTMLInputElement;
        const searchTerm = inputElement.value.trim();

        // If user type Enter
        if (event.key === 'Enter' && searchTerm) {
        const upcaseSearchTerm = searchTerm.toUpperCase();

        if (this.checkStockExists(upcaseSearchTerm)) {
            this.router.navigate(['/stock-detail', upcaseSearchTerm]);
        } else {
            this.showNoResultModal(upcaseSearchTerm);
        }
        }
    }
    //Check whether stock exist
    checkStockExists(stockCode: string): boolean {
        return this.validStockCodes.includes(stockCode);
    }
    //Show alert not found
    showNoResultModal(stockCode: string): void {
        const modal = document.getElementById('noResultModal') as HTMLDivElement;
        const modalBody = modal.querySelector(
        '.modal-body p'
        ) as HTMLParagraphElement;

        // Hiển thị modal
        modal.style.display = 'block';
    }
    //Hidden alert not found form
    hideNoResultModal(): void {
        const modal = document.getElementById('noResultModal') as HTMLDivElement;
        modal.style.display = 'none';
    }
    //Close Modal
    closeModal(): void {
        this.hideNoResultModal();
        this.stockInput.nativeElement.focus();
    }

    //Predict form handing
    showPredictForm(): void {
        const predict = document.getElementById('predictForm') as HTMLDivElement;
        predict.style.display = 'block';
    }
    hiddenPredictForm(): void {
        const predict = document.getElementById('predictForm') as HTMLDivElement;
        predict.style.display = 'none';
    }
    closePredictForm(): void {
        this.hiddenPredictForm();
    }
    predictNavigation(stockName: string, user_id: number){
        // Open new window and direct to website predict
        this.hiddenPredictForm();
        this.stockService.handlePurchase(user_id).subscribe(
        user => {
            alert("Cập nhật thành công")
            console.error('Cập nhật thành công:', user);
            this.stockService.setUserInfo(user); //Update user information to local storage
            this.predictStock(stockName);
        },
        error => {
            alert("Lỗi")
            console.error('Đã xảy ra lỗi:', error);
        }
        );
        //const url = `http://localhost:8501/?stock=${stockName}.VN`; // Create URL
        //window.open(url, '_blank'); // Mở cửa sổ mới với URL
    }
    //Check number of data
    brushes: string[] = ["#0000FF"];
    ngOnInit(): void {
        this.userInfo = this.stockService.getUserInfo();
        this.route.params
        .pipe(
            concatMap((params: any) => {
            let numberOfParams: number = Object.keys(params).length;
            //alert(numberOfParams);
            if (numberOfParams == 0) {
                firstStockCode = 'FPT';
                this.stockService
                .getStockByCode(firstStockCode)
                .subscribe((data) => {
                    firstStockHistoryData = data.map((data: any) => {
                    return { ...data, time: new Date(data.time) };
                    });
                    firstStockHistoryData.title = firstStockCode;
                    this.getStockToday(firstStockCode);
                    //console.log("Chart data"+this.getStockToday);
                    this.data = [firstStockHistoryData];
                });
            }
            if (numberOfParams == 1) {
                //alert(params['stockCode']);
                //firstStockCode = params['param'];
                firstStockCode = params['stockCode'];
                this.stockService
                .getStockByCode(firstStockCode)
                .subscribe((data) => {
                    firstStockHistoryData = data.map((data: any) => {
                    return { ...data, time: new Date(data.time) };
                    });
                    firstStockHistoryData.title = firstStockCode;
                    
                    // Chuyển đổi thời gian trong predictData và kết hợp
                    //this.formattedPredictData = predictStock.map((item: any) => ({
                    //  ...item,
                    //  time: new Date(item.time)
                    //}));
                    this.getStockToday(firstStockCode);
                    //console.log('Stock History Data:', JSON.stringify(firstStockHistoryData, null, 2));
                    //console.log('Stock Predict Data:', JSON.stringify(this.formattedPredictData, null, 2));
                    //this.data = [firstStockHistoryData];
                    //this.data = [formattedPredictData];
                    this.firstStockHistoryData = firstStockHistoryData;
                    //this.predictDataFinal = [...this.firstStockHistoryData, ...this.formattedPredictData]
                    this.data = [this.firstStockHistoryData];
                });
            }
            // if (numberOfParams == 2 && params['stockCode1'] == 'predictStock') {
            //     //alert(params['stockCode']);
            //     //firstStockCode = params['param'];
            //     alert("oKE1")
            //     alert(params['stockCode2'])
            //     firstStockCode = params['stockCode2'];
            //     this.stockService
            //     .getStockByCode(firstStockCode)
            //     .subscribe((data) => {
            //         firstStockHistoryData = data.map((data: any) => {
            //             return { ...data, time: new Date(data.time) };
            //         });
            //         firstStockHistoryData.title = firstStockCode;
                    
            //         // Chuyển đổi thời gian trong predictData và kết hợp
            //         this.formattedPredictData = predictStock.map((item: any) => ({
            //             ...item,
            //             time: new Date(item.time),
            //         }));

            //         this.getStockToday(firstStockCode);
            //         //console.log('Stock History Data:', JSON.stringify(firstStockHistoryData, null, 2));
            //         //console.log('Stock Predict Data:', JSON.stringify(this.formattedPredictData, null, 2));
            //         //this.data = [firstStockHistoryData];
            //         //this.data = [formattedPredictData];
            //         this.firstStockHistoryData = firstStockHistoryData;
            //         this.predictDataFinal = [...this.firstStockHistoryData, ...this.formattedPredictData];
            //         console.log('Stock Predict Data:', JSON.stringify(data, null, 2));
            //         this.data = [this.predictDataFinal, this.firstStockHistoryData];
            //         this.brushes = ['#FF4500', '#0000FF'];
            //     });
            // }
            //test
            if (numberOfParams == 2 && params['stockCode1'] == 'predictStock') {
                firstStockCode = params['stockCode2'];
                //secondStockCode = params['stockCode2'];

                return forkJoin({
                    data1: this.stockService.getStockByCode(firstStockCode),
                    data2: this.stockService.getStockByCode(firstStockCode),
                }).pipe(
                tap(({ data1, data2 }) => {
                    firstStockHistoryData = data1.map((data: any) => {
                        return { ...data, time: new Date(data.time) };
                    });
                    firstStockHistoryData.title = firstStockCode;
                    this.getStockToday(firstStockCode);

                    // Xử lý secondStockHistoryData và kết hợp với predictStock
                    const formattedPredictStock = predictStock.map((item: any) => ({
                        ...item,
                        time: new Date(item.time),
                    }));

                    secondStockHistoryData = [...data2.map((data: any) => {
                        return { ...data, time: new Date(data.time) };
                    }), ...formattedPredictStock];

                    secondStockHistoryData.title = "PredictPrice";

                    this.data = [secondStockHistoryData, firstStockHistoryData];
                    this.brushes = ['#FF4500', '#0000FF'];
                })
                );
            }
            if (numberOfParams == 2  && params['stockCode1'] != 'predictStock') {
                //alert("Oke");
                firstStockCode = params['stockCode1'];
                secondStockCode = params['stockCode2'];
                return forkJoin({
                    data1: this.stockService.getStockByCode(firstStockCode),
                    data2: this.stockService.getStockByCode(secondStockCode),
                }).pipe(
                tap(({ data1, data2 }) => {
                    firstStockHistoryData = data1.map((data: any) => {
                        return { ...data, time: new Date(data.time) };
                    });
                    firstStockHistoryData.title = firstStockCode;
                    this.getStockToday(firstStockCode);
                    secondStockHistoryData = data2.map((data: any) => {
                        return { ...data, time: new Date(data.time) };
                    });
                    secondStockHistoryData.title = secondStockCode;
                    this.data = [firstStockHistoryData, secondStockHistoryData];
                    this.brushes = ['#90EE90', '#D8BFD8'];
                })
                );
            } 
            else {
                return of(null);
            }
            })
        )
        .subscribe((data) => {});
    }

    public randomizeArray(arg: any): number[] {
        var array = arg.slice();
        var currentIndex = array.length,
        temporaryValue,
        randomIndex;
        while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
        }
        return array;
    }

  // public getStockToday(name: string): void {
  //   this.stockService.getStocksToday().subscribe((stock) => {
  //     this.allSymStocks = stock.map((stock: any) => stock.sym);
  //     this.stockToday = stock.find((item: any) => item.sym == name);

  //     for (let i = 0; i < 5; i++) {
  //       let sym = this.randomStock(this.allSymStocks);
  //       alert(sym);
  //       this.listTopStockInfo?.push(stock.find((item: any) => item.sym == sym));
  //       this.stockService.getStockByCode(sym).subscribe((data) => {
  //         this.topStocks.push(
  //           data.slice(Math.max(data.length - 20, 0)).map((item: any) => {
  //             return item.close;
  //           })
  //         );
  //         //console.log(this.topStocks);
  //         if (this.topStocks[i] != null) {
  //           let chartAreaSparklineItemOptions: Partial<ChartOptions> = {
  //             series: [
  //               {
  //                 data: this.topStocks[i],
  //               },
  //             ],
  //             colors: ['#67D0BF'],
  //             title: {
  //               text: '$135,965',
  //               offsetX: 0,
  //               style: {
  //                 fontSize: '24px',
  //               },
  //             },
  //             subtitle: {
  //               text: 'Profits',
  //               offsetX: 0,
  //               style: {
  //                 fontSize: '14px',
  //               },
  //             },
  //           };
  //           this.topStockChart?.push(chartAreaSparklineItemOptions);
  //         }
  //         //console.log(this.topStockChart);
  //         //console.log(this.topStocks);
  //       });
  //     }
  //   });
  // }
    public getStockToday(name: string): void {
        this.stockService.getStocksToday().subscribe((stock) => {
        this.allSymStocks = stock.map((stock: any) => stock.sym);
        this.stockToday = stock.find((item: any) => item.sym == name);
        this.listTopStockInfo = [];
        let promises = [];

        for (let i = 0; i < 5; i++) {
            let sym = this.randomStock(this.allSymStocks);
            this.listTopStockInfo?.push(stock.find((item: any) => item.sym == sym));

            promises.push(
            this.stockService
                .getStockByCode(sym)
                .toPromise()
                .then((data) => {
                return data
                    .slice(Math.max(data.length - 20, 0))
                    .map((item: any) => item.close);
                })
            );
        }

        // Chờ tất cả các promise hoàn thành
        Promise.all(promises).then((results) => {
            //this.topStocks = results;
            
            this.topStocks = results.slice(0, 5);
            this.topStockChart = [];
            // Tạo biểu đồ cho 5 giá cổ phiểu random sau khi nhận được tất cả dữ liệu
            this.topStocks.forEach((data, i) => {
            let chartAreaSparklineItemOptions: Partial<ChartOptions> = {
                series: [
                {
                    data: data,
                },
                ],
                colors: ['#67D0BF'],
                title: {
                text: '$135,965',
                offsetX: 0,
                style: {
                    fontSize: '24px',
                },
                },
                subtitle: {
                text: 'Profits',
                offsetX: 0,
                style: {
                    fontSize: '14px',
                },
                },
            };
            this.topStockChart?.push(chartAreaSparklineItemOptions);
            });
            // Cập nhật giao diện sau khi hoàn tất
        });
        });
    }

    exportStockReport() {
        this.exportPdf();
    }

    exportPdf() {
        this.stockService
        .export(firstStockCode)
        .subscribe((data) => saveAs(data, `report.csv`));
    }

    getTopStock(): any {
        listTopStockName.forEach((item: any) => {
        this.stockService.getStockByCode(item).subscribe((data) => {
            this.topStocks.push(
            data.slice(Math.max(data.length - 20, 0)).map((item: any) => {
                return item.close;
            })
            );
            console.log(this.topStocks);
            console.log(this.topStocks);
            this.setUpTopStocks();
        });
        });
    }

    // async initialSparrAreaChart() {
    //   await this.getTopStock();
    //   await this.setUpTopStocks();
    //   // Code after the first and second async operations
    // }

    setUpTopStocks(): any {
        console.log(2222222222);
        console.log(this.topStocks[0]);
        window.Apex = {
        stroke: {
            width: 2,
        },
        markers: {
            size: 0,
        },
        tooltip: {
            fixed: {
            enabled: true,
            },
        },
        };

        this.chartAreaSparkline3Options = {
        series: [
            {
            data: this.topStocks[0],
            },
        ],
        colors: ['#67D0BF'],
        title: {
            text: '$135,965',
            offsetX: 0,
            style: {
            fontSize: '24px',
            },
        },
        subtitle: {
            text: 'Profits',
            offsetX: 0,
            style: {
            fontSize: '14px',
            },
        },
        };

        this.chartAreaSparkline3Options1 = {
        series: [
            {
            data: this.topStocks[1],
            },
        ],
        colors: ['#67D0BF'],
        title: {
            text: '$135,965',
            offsetX: 0,
            style: {
            fontSize: '24px',
            },
        },
        subtitle: {
            text: 'Profits',
            offsetX: 0,
            style: {
            fontSize: '14px',
            },
        },
        };

        this.chartAreaSparkline3Options2 = {
        series: [
            {
            data: this.topStocks[2],
            },
        ],
        colors: ['#67D0BF'],
        title: {
            text: '$135,965',
            offsetX: 0,
            style: {
            fontSize: '24px',
            },
        },
        subtitle: {
            text: 'Profits',
            offsetX: 0,
            style: {
            fontSize: '14px',
            },
        },
        };

        this.chartAreaSparkline3Options3 = {
        series: [
            {
            data: this.topStocks[3],
            },
        ],
        colors: ['#67D0BF'],
        title: {
            text: '$135,965',
            offsetX: 0,
            style: {
            fontSize: '24px',
            },
        },
        subtitle: {
            text: 'Profits',
            offsetX: 0,
            style: {
            fontSize: '14px',
            },
        },
        };

        this.chartAreaSparkline3Options4 = {
        series: [
            {
            data: this.topStocks[4],
            },
        ],
        colors: ['#67D0BF'],
        title: {
            text: '$135,965',
            offsetX: 0,
            style: {
            fontSize: '24px',
            },
        },
        subtitle: {
            text: 'Profits',
            offsetX: 0,
            style: {
            fontSize: '14px',
            },
        },
        };
    }

        openModal() {
            this.display = 'block';
        }
        onCloseHandled() {
            this.display = 'none';
        }

        compareStock() {
            if (this.selectedStock1 != null && this.selectedStock2 != null) {
                this.router.navigate([
                    '/stock-detail',
                    this.selectedStock1,
                    this.selectedStock2,
                ]);
            } else {
            alert('Please enter choosing 2 stock to compare');
            }
        }

        predictStock(stockCode: String){
            //alert("Oke");
            //alert(stockCode)
            this.router.navigate([
                '/stock-detail',
                'predictStock',
                stockCode,
            ]);
        }

    moveToHome() {
        this.router.navigate(['/dashboard']);
    }

    randomStock(listStock: string[]): string {
        const randomIndex = Math.floor(Math.random() * listStock.length);
        return listStock[randomIndex];
    }
    //Logout process
    isLogoutFormOpen: boolean = false;
    // Function to toggle the logout form
    openLogoutForm(): void {
        this.isLogoutFormOpen = !this.isLogoutFormOpen; // Toggle trạng thái giữa mở và đóng
    }

    // Function to confirm logout
    confirmLogout(): void {
        console.log('Logging out...');
        this.isLogoutFormOpen = false;
    }

    // Function to cancel logout
    cancelLogout(): void {
        this.isLogoutFormOpen = false; // Close the logout form
    }
    //Change compare when click
    isCompareVisible: boolean = false;

    toggleCompare() {
        this.isCompareVisible = !this.isCompareVisible;
    }

    logout() {
        this.stockService.logout();
        this.router.navigate(['/login']);
    }
}
