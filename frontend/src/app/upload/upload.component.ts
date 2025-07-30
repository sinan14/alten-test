import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-upload',
  imports: [],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css',
})
export class UploadComponent {
  file: any;
  @Output() onUpload = new EventEmitter<any>();
  @ViewChild('fileInput') fileInputRef!: ElementRef;
  constructor(private http: HttpClient) {}

  onChangeFile(event: any) {
    this.file = event.target.files[0];
  }
  upload() {
    if (!this.file) return;
    const formData = new FormData();
    formData.append('file', this.file);
    this.http
      .post('http://localhost:3000/upload', formData)
      .subscribe((res: any) => {
        alert(res.message);
        this.onUpload.emit(res.data);
        this.clearFileInput();
      });
  }
  clearFileInput() {
    this.file = null;
    if (this.fileInputRef && this.fileInputRef.nativeElement) {
      this.fileInputRef.nativeElement.value = null;
    }
  }
}
