import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

interface DataSetResponse {
  id: number;
  displayName: string;
}
interface AnalyticResponse {
  id: string;
  displayName: string;
}

interface GroupingResponse {
  id: string;
  displayName: string;
}

interface NodeResponse {
  id: string;
  displayName: string;
}

interface CalculateNodeResponse {
  id: string;
  result: number;
}

interface Result {
  id: string;
  displayName: string;
  data: AnalyticData | null;
}

interface AnalyticData {
  x: number;
  y: number;
  differential: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  public selectedDataSet: DataSetResponse | null = null;
  public dataSets: DataSetResponse[] = [];

  public selectedGrouping: GroupingResponse | null = null;
  public groupings: GroupingResponse[] = [];

  public selectedAnalytic: AnalyticResponse[] = [];
  public analytics: AnalyticResponse[] = [];

  public groupingNodes: NodeResponse[] = [];
  public calculatedAnalytics: CalculateNodeResponse[] = [];

  public results: Result[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getDataSets();
    this.getGroupings();
    this.getAnalytics();
  }

  getDataSets() {
    this.http.get<DataSetResponse[]>('/api/data/getdatasets').subscribe(
      (result) => {
        this.dataSets = result;
        if (this.dataSets.length > 0) {
          this.selectedDataSet = this.dataSets[0];
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getGroupings() {
    this.http.get<GroupingResponse[]>('/api/data/getgroupings').subscribe(
      (result) => {
        this.groupings = result;
        if (this.groupings.length > 0) {
          this.selectedGrouping = this.groupings[0];
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getAnalytics() {
    this.http.get<AnalyticResponse[]>('/api/data/getanalytics').subscribe(
      (result) => {
        this.analytics = result;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  onDataSetChange(id: string) {
    this.selectedDataSet =
      this.dataSets.find((ds) => ds.id.toString() === id) || null;
    // console.log('onDataSetChange()', this.selectedDataSet?.displayName);
    this.getNodeNames();
  }

  onGroupingChange(id: string) {
    this.selectedGrouping =
      this.groupings.find((g) => g.id.toString() === id) || null;
    // console.log('onGroupingChange()', this.selectedGrouping?.displayName);
    this.getNodeNames();
  }

  isAnalyticSelected(analytic: AnalyticResponse): boolean {
    return this.selectedAnalytic.some((a) => a.id === analytic.id);
  }

  onAnalyticsCheckboxSelectChange(analytic: AnalyticResponse) {
    // console.log('onAnalyticsCheckboxSelectChange()', analytic);
    const index = this.selectedAnalytic.findIndex((a) => a.id === analytic.id);
    if (index >= 0) this.selectedAnalytic.splice(index, 1);
    else this.selectedAnalytic.push(analytic);
    // console.log('Updated Analytics:', this.selectedAnalytic);
    this.getNodeNames();
  }

  getNodeNames() {
    if (!this.selectedGrouping) {
      console.warn('No grouping selected');
      return;
    }
    this.http
      .get<NodeResponse[]>(
        `/api/data/getnodenames?grouping=${this.selectedGrouping.id}`
      )
      .subscribe(
        (result) => {
          this.groupingNodes = result;
          // console.log('getNodeNames()', this.groupingNodes);

          this.groupingNodes.forEach((node) => {
            this.results.push({
              id: node.id,
              displayName: node.displayName,
              data: null,
            });
          });

          this.calculate();
        },
        (error) => {
          console.error(error);
        }
      );
  }

  calculate() {

    this.selectedAnalytic.forEach((analytic) => {
      if (!this.selectedGrouping) {
        console.warn('No grouping selected');
        return;
      }

      this.http
        .get<CalculateNodeResponse[]>(
          `/api/data/calculate?grouping=${this.selectedGrouping.id}&analytic=${analytic.id}&dataSet=${this.selectedDataSet?.id}`
        )
        .subscribe(
          (result) => {
            this.calculatedAnalytics = result;
            // console.log('calculate()', this.calculatedAnalytics);
            this.evaluate(analytic);
          },
          (error) => {
            console.error(error);
          }
        );
    });
  }

  evaluate(analytic: AnalyticResponse) {
    this.calculatedAnalytics.forEach((calc) => {
      const result = this.results.find((r) => r.id === calc.id);
      if (result) {

        switch(analytic.id) {
          case 'A1':
            result.data = {
              x: calc.result,
              y: 0,
              differential: 0,
            };
            break;
          case 'A2':
            result.data = {
              x: 0,
              y: calc.result,
              differential: 0,
            };
            break;
          case 'A3':
            result.data = {
              x: 0,
              y: 0,
              differential: calc.result,
            };
            break;
          default:
            console.warn('Unknown analytic type:', this.selectedAnalytic);
            return;
        }
      }
    });

    console.log('evaluate()', this.results);
  }

  title = 'angulardatacase.client';
}
