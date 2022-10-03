import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild('cardCanvas', {static: true}) 
  cardCanvas: ElementRef<HTMLCanvasElement>;
  private _context: CanvasRenderingContext2D;

  title = 'ygo-card-maker';

  cardForm: FormGroup;

  constructor(private _formBuilder: FormBuilder){
    this.cardForm = this._formBuilder.group({
      name: new FormControl(['BONSOIR'])
    })
  }

  ngOnInit(){
    this.drawTest()
  }

  drawTest(){

    const canvas = this.cardCanvas.nativeElement;
    if(canvas.getContext){
      let context = canvas.getContext('2d');
      context.clearRect(0,0, canvas.width, canvas.height);
      context.fillStyle = 'rgb(200,0,0)';
      context.fillRect(10,10,55,50)
    }

  }

  loadImage(){
    const canvas = this.cardCanvas.nativeElement;
    if(canvas.getContext){
      let context = canvas.getContext('2d');
      const base_image = new Image();
      base_image.src = '../assets/templates/normal.jpg';
      base_image.onload = function(){context.drawImage(base_image, 0,0,421, 614)}
    }  
  }

  addName(){
    const canvas = this.cardCanvas.nativeElement;
    if(canvas.getContext){
      let context = canvas.getContext('2d');
      const name = this.cardForm.controls.name.value;
      context.font = "60pt Calibri black";
      context.fillText(name, 50, 60);
    }  
  }

}
