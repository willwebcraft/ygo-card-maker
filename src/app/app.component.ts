import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild('canvas', {static: true}) 
  canvas: ElementRef<HTMLCanvasElement>;
  private _context: CanvasRenderingContext2D;

  title = 'ygo-card-maker';

  cardForm: FormGroup;

  constructor(private _formBuilder: FormBuilder){
    this.cardForm = this._formBuilder.group({
      name: new FormControl([''])
    })
  }

  ngOnInit(){
    this._context = this.canvas.nativeElement.getContext('2d');
  }

  ngAfterViewInit(){
    this._context.fillStyle = 'red';
    this._context.fillRect(0,0,5,5);
  }

}
