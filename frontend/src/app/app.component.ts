import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FilterComponent } from './filter/filter.component';
import { TableComponent } from './table/table.component';
import { UploadComponent } from './upload/upload.component';

@Component({
  selector: 'app-root',
  imports: [TableComponent, FilterComponent, UploadComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'alten';
  logs: any[] = [];
  constructor(private http: HttpClient) {}

  getLogs(filters: any) {
    let params = new HttpParams();
    for (const key in filters) {
      if (filters[key]) params = params.set(key, filters[key]);
    }
    console.log('params ', params);

    return this.http.get<any[]>('http://localhost:3000/logs', { params });
  }

  onFilterChange(filters: any) {
    this.getLogs(filters).subscribe((data: any) => (this.logs = data.data));
  }
  onUpload(data: any) {
    this.logs = data;
  }
}
