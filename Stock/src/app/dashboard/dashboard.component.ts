import { DataServiceService } from './../data-service.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexFill,
  ApexTooltip,
  ApexXAxis,
  ApexLegend,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexPlotOptions,
  ApexYAxis
} from "ng-apexcharts";
import { StockServiceService } from '../stock-service.service';
import { Router } from '@angular/router';


export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  markers: any; //ApexMarkers;
  stroke: any; //ApexStroke;
  yaxis: ApexYAxis | ApexYAxis[];
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  colors: string[];
  labels: string[] | number[];
  title: ApexTitleSubtitle;
  subtitle: ApexTitleSubtitle;
  legend: ApexLegend;
  fill: ApexFill;
  tooltip: ApexTooltip;
};

declare global {
  interface Window {
    Apex: any;
  }
}

const sparkLineData = [
  47,
  45,
  54,
  38,
  56,
  24,
  65,
  31,
  37,
  39,
  62,
  51,
  35,
  41,
  35,
  27,
  93,
  53,
  61,
  27,
  54,
  43,
  19,
  46
];


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isError: boolean = true;
  public stockList : any[] = [];
  @ViewChild("chart") chart?: ChartComponent;
  public chartOptions?: Partial<ChartOptions>;
  public chartAreaSparkline1Options: Partial<ChartOptions>;
  public chartAreaSparkline2Options: Partial<ChartOptions>;
  public chartAreaSparkline3Options: Partial<ChartOptions>;
  public chartLineSparkline3Options: Partial<ChartOptions>;
  public chartBarSparkline3Options: Partial<ChartOptions>;
  public commonAreaSparlineOptions: Partial<ChartOptions> = {
    chart: {
      type: "area",
      height: 50,
      sparkline: {
        enabled: true
      }
    },
    stroke: {
      curve: "straight"
    },
    fill: {
      opacity: 0.3
    },
    yaxis: {
      min: 0
    }
  };
  public commonLineSparklineOptions: Partial<ChartOptions> = {
    chart: {
      type: "line",
      width: 100,
      height: 35,
      sparkline: {
        enabled: true
      }
    },
    tooltip: {
      fixed: {
        enabled: false
      },
      x: {
        show: false
      },
      y: {
        title: {
          formatter: function(seriesName) {
            return "";
          }
        }
      },
      marker: {
        show: false
      }
    }
  };
  public commonBarSparklineOptions: Partial<ChartOptions> = {
    chart: {
      type: "bar",
      width: 100,
      height: 35,
      sparkline: {
        enabled: true
      }
    },
    plotOptions: {
      bar: {
        columnWidth: "80%"
      }
    },
    tooltip: {
      fixed: {
        enabled: false
      },
      x: {
        show: false
      },
      y: {
        title: {
          formatter: function(seriesName) {
            return "";
          }
        }
      },
      marker: {
        show: false
      }
    }
  };

  constructor(private  stockService:StockServiceService, private router:Router) {
    // setting global apex options which are applied on all charts on the page
    window.Apex = {
      stroke: {
        width: 3
      },
      markers: {
        size: 0
      },
      tooltip: {
        fixed: {
          enabled: true
        }
      }
    };

    this.chartAreaSparkline1Options = {
      series: [
        {
          name: "chart-big-sparkline",
          data: this.randomizeArray(sparkLineData)
        }
      ],
      colors: ["#DCE6EC"],
      title: {
        text: "$424,652",
        offsetX: 0,
        style: {
          fontSize: "24px"
        }
      },
      subtitle: {
        text: "Sales",
        offsetX: 0,
        style: {
          fontSize: "14px"
        }
      }
    };

    this.chartAreaSparkline2Options = {
      series: [
        {
          name: "Stock",
          data: this.randomizeArray(sparkLineData)
        }
      ],
      colors: ["#DCE6EC"],
      title: {
        text: "$235,312",
        offsetX: 0,
        style: {
          fontSize: "24px"
        }
      },
      subtitle: {
        text: "Expenses",
        offsetX: 0,
        style: {
          fontSize: "14px"
        }
      }
    };

    this.chartAreaSparkline3Options = {
      series: [
        {
          data: this.randomizeArray(sparkLineData)
        }
      ],
      title: {
        text: "$135,965",
        offsetX: 0,
        style: {
          fontSize: "24px",

        }
      },
      subtitle: {
        text: "Profits",
        offsetX: 0,
        style: {
          fontSize: "14px"
        }
      }
    };


    this.chartLineSparkline3Options = {
      series: [
        {
          name: "chart-line-sparkline",
          data: this.randomizeArray(sparkLineData.slice(0, 10))
        }
      ]
    };


    this.chartBarSparkline3Options = {
      series: [
        {
          name: "chart-bar-sparkline",
          data: this.randomizeArray(sparkLineData.slice(0, 10))
        }
      ]
    };


  }
  ngOnInit(): void {
    this.userInfo = this.stockService.getUserInfo();
    let stockG1:any;

    this.stockService.getStocksToday().subscribe((data : any[]) => {
      data.forEach((dataItem : any) => {
        let m1 = dataItem.g1.split("|");
        let m2 = dataItem.g2.split("|");
        let m3 = dataItem.g3.split("|");
        let b1 = dataItem.g4.split("|");
        let b2 = dataItem.g5.split("|");
        let b3 = dataItem.g6.split("|");
        this.stockList.push({
          stockCode:dataItem.sym,
          tc:dataItem.r,
          tran:dataItem.c,
          san:dataItem.f,
          mua1 : m1[0],
          klm1 : m1[1],
          mua2 : m2[0],
          klm2 : m2[1],
          mua3 : m3[0],
          klm3 : m3[1],
          ban1 : b1[0],
          klb1 : b1[1],
          ban2 : b2[0],
          klb2 : b2[1],
          ban3 : b3[0],
          klb3 : b3[1],
          tongKL : dataItem.lot,
        });
      })
      console.log(this.stockList)
      console.log("Test Ok")
    });


  }

  public randomizeArray(arg:any): number[] {
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

  getStockHistory(event: MouseEvent, rowIndex: number){
    const stockCode = this.stockList[rowIndex].stockCode;
    // Alert tất cả dữ liệu của mã cổ phiếu
    const stockData = this.stockList[rowIndex];
    //alert(JSON.stringify(stockData, null, 2)); // Chuyển đổi đối tượng thành chuỗi JSON
    //this.router.navigate(['/stock-detail',stockCode]);
    // Điều hướng đến trang chi tiết cổ phiếu
    this.router.navigate(['/stock-detail', stockCode]).then(() => {
    // Thông báo sau khi điều hướng thành công
    //alert(stockCode);
    });
  }
  userInfo: any;
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
      this.stockService.logout();
      this.router.navigate(['/login']);
  }
}
