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
      name: new FormControl(['bonsoir']),
      cardTemplate: new FormControl(['']),
      symbol: new FormControl(['']),
      icon: new FormControl(['']),
      atk: new FormControl(['2000']),
      def: new FormControl(['2000']),
      description: new FormControl(['lorem']),
      type: new FormControl(['Démon'])
    })
  }

  ngOnInit(){
    this.generateCard();
  }

  isMonster(){
    switch(this.cardForm.controls.cardTemplate.value){
      case "Magie":
        return false;
      case "Piège":
        return false;
      default:
        return true;
    }
  }

  setCardTemplate(cardTemplate: string){
    switch(cardTemplate){
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
    const name = this.cardForm.controls.name.value.toString().toUpperCase();
    const cardTemplate = this.cardForm.controls.cardTemplate.value;
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
    this.drawTemplateCard(cardTemplate, context, name, description, atk!, def!);

    // ADD NAME
    //this.addName(name, context);

  }

  drawTemplateCard(
    cardTemplate: string, 
    context: any, 
    name: string, 
    description: string, 
    atk: number, 
    def: number){
    console.log("in draw template")
    const base_image = new Image();
    base_image.src = this.setCardTemplate(cardTemplate);
    base_image.onload = this.loadImageTemplate(base_image, context, name, description, atk, def)
  }

  loadImageTemplate(
    base_image: any, 
    context: any, 
    name: string, 
    description: string,
    atk: number,
    def: number,
    ){
    return () => {
      context.drawImage(base_image, 0,0,421, 614)
      this.addName(name, context)
      this.addDescription(description, context)
      this.addAtkDef(atk, def, context)
      this.addType(context)
    }
  }

  addName(name: string, context: any){
    context.globalCompositeOperation = 'source-over'
    console.log("in addname", name)
    context.font = "25pt Calibri";
    context.fillText(name, 36, 58);
  }

  addDescription(description: string, context: any){
    context.globalCompositeOperation = 'source-over'
    console.log("in add description", description)
    context.font = "15pt Calibri";
    context.fillText(description, 35, 500);
  }

  addAtkDef(atk: number, def: number, context: any){
    console.log('add atk def');
    context.font = "14pt Calibri";
    context.fillText(atk, 265, 577);
    context.fillText(def, 350, 577);
  }

  addType(context: any){
    const type = "[" + this.cardForm.controls.type.value + "]";
    context.font = "15pt Calibri";
    context.fillText(type, 35, 480);
  }


}
