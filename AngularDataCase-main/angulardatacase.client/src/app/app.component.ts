import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

interface DataSetResponse {
  id: number,
  displayName: string
}
interface AnalyticResponse {
  id: string,
  displayName: string
}

interface GroupingResponse {
  id: string,
  displayName: string
}

interface NodeResponse {
  id: string,
  displayName: string
}

interface CalculateNodeResponse {
  id: string,
  result: number
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
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

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getDataSets();
    this.getGroupings();
    this.getAnalytics();
    this.getNodeNames();
    this.calculate();
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

  getNodeNames() {
    this.http.get<NodeResponse[]>('/api/data/getnodenames?grouping=SECURITY').subscribe(
      (result) => {
        this.groupingNodes = result;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  onDataSetChange(id: string) {
    this.selectedDataSet = this.dataSets.find(ds => ds.id.toString() === id) || null;
    console.log('onDataSetChange()', this.selectedDataSet?.displayName);
    // this.calculate();
  }

  onGroupingChange(id: string) {
    this.selectedGrouping = this.groupings.find(g => g.id.toString() === id) || null;
    console.log('onGroupingChange()', this.selectedGrouping?.displayName);
    // this.calculate();
  }

  isAnalyticSelected(analytic: AnalyticResponse): boolean {
    return this.selectedAnalytic.some(a => a.id === analytic.id);
  }

  onAnalyticsCheckboxSelectChange(analytic: AnalyticResponse) {
    console.log('onAnalyticsCheckboxSelectChange()', analytic);
    const index = this.analytics.findIndex(a => a.id === analytic.id);
    if (index >= 0) 
      this.selectedAnalytic[index] = analytic;
    else 
      this.selectedAnalytic.push(analytic);
    console.log('Updated Analytics:', this.selectedAnalytic);
    // this.calculate();
  }

  calculate() {
    this.http.get<CalculateNodeResponse[]>('/api/data/calculate?grouping=SECURITY&analytic=A1&dataSet=0').subscribe(
      (result) => {
        this.calculatedAnalytics = result;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  title = 'angulardatacase.client';
}
