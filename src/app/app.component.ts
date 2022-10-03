import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild('cardCanvas', {static: false}) 
  cardCanvas: ElementRef<HTMLCanvasElement>;

  cardTemplates = [
    "Normal",
    "Effet",
    'Magie',
    'Piège',
    "Synchro",
    "Rituel"
  ]

  symbols = [
    'Feu',
    'Eau',
    'Magie',
    'Terre',
    'Vent',
    'Piège',
    'Ténèbres',
    "Lumière"
  ]

  icons = [
    'Jeu-Rapide',
    'Continu',
    'Equipement',
    'Terrain',
    'Aucun',
    'Contre-piège',
    'Rituel'
  ]

  cardForm: FormGroup;

  constructor(private _formBuilder: FormBuilder){
    this.cardForm = this._formBuilder.group({
      name: new FormControl(['']),
      cardType: new FormControl(['']),
      symbol: new FormControl(['']),
      icon: new FormControl(['']),
      atk: new FormControl(['']),
      def: new FormControl(['']),
      description: new FormControl([''])
    })
  }

  ngOnInit(){

  }

  isMonster(){
    switch(this.cardForm.controls.cardType.value){
      case "Magie":
        return false;
      case "Piège":
        return false;
      default:
        return true;
    }
  }

  setCardTemplate(cardType: string){
    switch(cardType){
      case "Normal":
        return '../assets/templates/normal.jpg'
      case "Effet":
        return '../assets/templates/effect.jpg'
      case "Magie":
        return '../assets/templates/spell.jpg'
      case "Piège":
        return '../assets/templates/trap.jpg'
      default:
        return '../assets/templates/normal.jpg'
    }
  }

  generateCard(){
    // VARIABLES
    const name = this.cardForm.controls.name.value;
    const cardType = this.cardForm.controls.cardType.value;
    const symbol = this.cardForm.controls.symbol.value;
    const icon = this.cardForm.controls.icon.value;
    let atk: number;
    let def: number;
    if(this.isMonster()){
      atk = this.cardForm.controls.atk.value;
      def = this.cardForm.controls.def.value;
    }
    const description = this.cardForm.controls.description.value;

    // CANVAS
    const canvas = this.cardCanvas.nativeElement
    const context = canvas.getContext('2d');

    // DRAW TEMPLATE
    this.drawTemplateCard(cardType, context);

    // ADD NAME
    this.addName(name, context);

  }

  drawTemplateCard(cardType: string, context: any){
    console.log("in draw template")
    const base_image = new Image();
    base_image.src = this.setCardTemplate(cardType);
    base_image.onload = function(){context.drawImage(base_image, 0,0,421, 614)}
  }

  addName(name: string, context: any){
    context.globalCompositeOperation = 'source-over'
    console.log("in addname", name)
    context.font = "60pt Calibri";
    context.fillText(name, 50, 60);
  }

}
