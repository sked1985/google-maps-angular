import { CommonModule } from '@angular/common';
import { Component, Inject, QueryList, ViewChild, ViewChildren } from '@angular/core';
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
import ImageHelper from './image-helper';
import { ImageUploadService } from './image-upload.service';

export interface DialogData {
  about: string;
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
  @ViewChildren(MapMarker) markers: QueryList<MapMarker> | undefined;

  center: google.maps.LatLngLiteral = {lat: 53, lng: -9};
  markerPositions: any[] = [{lat: 53.336997813251976, lng: -6.273000240325928}, {lat: 53.99332786725599, lng: -7.379516601562508}, {lat: 51.88167052358272, lng: -8.406738281250007}, {lat: 53.3793001185126, lng: -6.599628724121791}, 
    {lat: 54.02054321865513, lng: -8.347636350013829}];
  zoom = 7;
  optionsDictionary: { [key: string]: any } = {
    0: {
      animation: google.maps.Animation.DROP,
            icon: {
              scaledSize: new google.maps.Size(30, 30),
              url: ImageHelper.getImage("clio")
            }
    },
    1: {
      animation: google.maps.Animation.DROP,
            icon: {
              scaledSize: new google.maps.Size(30, 30),
              url: "https://googlemapsimagestorage.blob.core.windows.net/images/images/dave.png"
            }
    },
    2: {
      animation: google.maps.Animation.DROP,
            icon: {
              scaledSize: new google.maps.Size(30, 30),
              url: "https://googlemapsimagestorage.blob.core.windows.net/images/images/tim.png"
            }
    },
    3: {
      animation: google.maps.Animation.DROP,
            icon: {
              scaledSize: new google.maps.Size(30, 30),
              url: "https://googlemapsimagestorage.blob.core.windows.net/images/images/sofia.png"
            }
    },
    4: {
      animation: google.maps.Animation.DROP,
            icon: {
              scaledSize: new google.maps.Size(30, 30),
              url: "https://googlemapsimagestorage.blob.core.windows.net/images/images/david.png"
            }
    },
};

infoDictionary:  { [key: string]: { name: string; about: string; image: string} } = {
  0: { name: "Clio EMEA head office", about: "The head office for Clio EMEA", image: ImageHelper.getImage("clio")},
  1: { name: "Dave Hogan", about: "Development Manager at Clio", image: "https://googlemapsimagestorage.blob.core.windows.net/images/images/dave.png"},
  2: { name: "Tim O'Mahony", about: "Software Developer at Clio", image: "https://googlemapsimagestorage.blob.core.windows.net/images/images/tim.png"},
  3: { name: "Sofia Tzima", about: "Senior Software Developer at Clio", image: "https://googlemapsimagestorage.blob.core.windows.net/images/images/sofia.png"},
  4: { name: "David Keanrney", about: "Software Developer at Clio", image: "https://googlemapsimagestorage.blob.core.windows.net/images/images/david.png"}
};
infoContent: any = "";

 
  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position);
      console.log("position");
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    });
  }

  addMarker(event: google.maps.MapMouseEvent) {
    console.log(event?.latLng?.toJSON())
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      data: {about: "", name: "", imageUrl: ""},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.name) {
        const maxKey = Math.max(...Object.keys(this.infoDictionary).map(Number));

        // Generate the new key
        const newKey = (maxKey + 1);

        // Add a new entry with the new key
        this.infoDictionary[newKey] = { name: result.name, about: result.about, image: result.imageUrl };
        this.optionsDictionary[newKey] = {
          animation: google.maps.Animation.DROP,
                icon: {
                  scaledSize: new google.maps.Size(30, 30),
                  url: this.infoDictionary[newKey].image,
                }
        }
      }

      if (event && event.latLng)
      this.markerPositions.push(event.latLng.toJSON());
    });
    
  }

  openInfoWindow(windowIndex: number, content: any) {
    this.markers?.forEach((marker: MapMarker, ix: number) => {
        if (windowIndex === ix) {
            this.infoContent = this.infoDictionary[ix];
            this.infoWindow?.open(marker);
        }
    });
}

  getOptions(index: number) {
    return this.optionsDictionary[index];
  }

  getImage(index: number) {
    return this.optionsDictionary[index]?.icon.url;
  }

getName(index: number) {
  console.log(index);
  return this.infoDictionary[index]?.name;
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
    private imageUploadService: ImageUploadService
  ) {}
  imageUrl: string = "";
  showImage = false;

  onNoClick(): void {
    this.dialogRef.close();
  }

  async csvInputChange(fileInputEvent: any) {
    const file = fileInputEvent.target.files[0];
    await this.imageUploadService.uploadFile(file);
      console.log('Image uploaded successfully.');
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.imageUrl = `https://googlemapsimagestorage.blob.core.windows.net/images/images/${file.name}`;
      this.data.imageUrl = this.imageUrl;
      this.showImage = true;
    };
  }
}
