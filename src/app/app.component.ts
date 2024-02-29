import { CommonModule } from '@angular/common';
import { Component, Inject, ViewChild } from '@angular/core';
import { GoogleMapsModule, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { RouterOutlet } from '@angular/router';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatRadioModule} from '@angular/material/radio';

export interface DialogData {
  name: string;
  imageUrl: string
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GoogleMapsModule, CommonModule, MatFormFieldModule, MatInputModule, MatRadioModule, FormsModule, MatButtonModule, MatToolbarModule, MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow | undefined;

  center: google.maps.LatLngLiteral = {lat: 53, lng: -9};
  markerPositions: any[] = [];
  zoom = 6;
  options: google.maps.MarkerOptions  = {
    animation: google.maps.Animation.DROP,
          icon: {
            scaledSize: new google.maps.Size(30, 30),
            url: 'https://lh3.googleusercontent.com/pw/AP1GczNQtMKZZPbum82vFg0-B78nDfFqGSIs-ahF5djAw6B5sToby5_TyvmJkISSOGB4SbRE4s2K36xXtgyNik2_fsx0XC-sPM5kkMXpkjg7d4P0Z_8vjD9eeq0mGc1FSy6QstA-KTQIMLS-U2EVxo2B94PJ=w247-h255-s-no-gm',
          }
  }
 
  constructor(public dialog: MatDialog) {}

  addMarker(event: google.maps.MapMouseEvent) {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      data: {name: "", imageUrl: ""},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.saveImageToLocalStorage(result.imageUrl)
      if (event && event.latLng)
      this.markerPositions.push(event.latLng.toJSON());
    });
    
  }

  openInfoWindow(marker: MapMarker) {
    if (this.infoWindow)
    this.infoWindow.open(marker);
  }

  getOptions(pa: any) {
    console.log(pa);
    return this.options;
  }

  
  saveImageToLocalStorage(imageUrl: any): void {
    if (imageUrl) {
      localStorage.setItem('imageData', imageUrl);
      alert('Image saved to local storage!');
    } else {
      alert('Please upload an image first!');
    }
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './dialog-overview-example-dialog.html',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
})
export class DialogOverviewExampleDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}
  imageUrl: string = "";

  onNoClick(): void {
    this.dialogRef.close();
  }

  csvInputChange(fileInputEvent: any) {
    const file = fileInputEvent.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.imageUrl = reader.result as string;
      this.data.imageUrl = this.imageUrl;
    };
  }
}
