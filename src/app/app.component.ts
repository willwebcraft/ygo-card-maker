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
    context.fillText(name, 29, 58, 330);
  }

  addDescription(description: string, context: any){
    context.globalCompositeOperation = 'source-over'
    console.log("in add description", description)
    context.font = "15pt Calibri";
    //context.fillText(description, 35, 500, 350, 300);
    this.drawTextMultiLne(context, description, 35, 500, 350, 85, "", "", 15)
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

  drawTextMultiLne(context, text, x, y, w, h, hAlign, vAlign, lineheight){
    // The objective of this part of the code is to generate an array of words. 
    // There will be a special word called '\n' that indicates a separation of paragraphs.
    if (!text){
      console.log(`text = ${text}`);
      return {};
    }
    if (typeof(text) === "object"){
      text = text[0]
    }
    text = text.replace(/\r/g, '');
    var words = [];
    var inLines = text.split('\n');
    var emptyLine = [];
    var removeEmptyLine = Object.assign([], inLines);
    for (var index = inLines.length - 1; index >= 0; index--) {
      if (inLines[index].length === 0){
        removeEmptyLine.splice(index, 1)
      }
    }
    inLines = removeEmptyLine;

    var i;
    for (i=0; i < inLines.length; i++)
    {
    	if (i) words.push('\n');
    	words = words.concat( inLines[i].split(' ') );
    }
    // words now contains the array.


    // Next objective is generate an array of lines where each line has a property 
    // called Words with all the words that fits in the line. Each word contains 2 fields:
    // .word for the actual word and .l for the length o the word.
    // If the line is the last line of a paragraps, the property EndOfParagraph will be true
    var sp = context.measureText(' ').width;
    console.log(`sp = ${sp}`);
    var lines = [];
    var actualline = 0;
    var actualsize = 0;
    var wo;
    lines[actualline] = {};
    lines[actualline].Words = [];
    i = 0;
    while (i < words.length) {
      var word = words[i];
      if (word == "\n") {
          lines[actualline].EndParagraph = true;
          actualline++;
          actualsize = 0;
          lines[actualline] = {};
          lines[actualline].Words = [];
          i++;
      } else {
          wo = {};
          wo.l = context.measureText(word).width;
          if (actualsize === 0) {

              // If the word does not fit in one line, we split the word
              while (wo.l > w) {
                  word = word.slice(0, word.length - 1);
                  wo.l = context.measureText(word).width;
              }

              wo.word = word;
              lines[actualline].Words.push(wo);
              actualsize = wo.l;
              if (word != words[i]) {
                  // if a single letter does not fit in one line, just return without painting nothing.
                  /*if (word === "") {
                    return {};
                  }*/
                  words[i] = words[i].slice(word.length, words[i].length);
              } else {
                  i++;
              }
          } else {
              if (actualsize + sp + wo.l > w) {
                  lines[actualline].EndParagraph = false;
                  actualline++;
                  actualsize = 0;
                  lines[actualline] = {};
                  lines[actualline].Words = [];
              } else {
                  wo.word = word;
                  lines[actualline].Words.push(wo);
                  actualsize += sp + wo.l;
                  i++;
              }
          }
      }
    }
    if (actualsize === 0) lines.pop(); // We remove the last line if we have not added any thing here.

    // The last line will be allways the last line of a paragraph even if it does not end with a  /n
    lines[actualline].EndParagraph = true;


    // Now we remove any line that does not fit in the heigth.
    var totalH = lineheight * lines.length;
    sp = context.measureText(' ').width;

    while (totalH > h) {
      lineheight = lineheight - 2;
      context.font = `${lineheight}pt Calibri`;
      totalH = lineheight * lines.length;
    }
    context.font = `${lineheight}pt Calibri`;
    sp = context.measureText(' ').width;
    console.log(`sp 2 = ${sp}`);

    // we need to reparse the line with the new font
    var sp = context.measureText(' ').width;
    console.log(`sp = ${sp}`);
    var lines = [];
    var actualline = 0;
    var actualsize = 0;
    var wo;
    lines[actualline] = {};
    lines[actualline].Words = [];
    i = 0;
    while (i < words.length) {
      var word = words[i];
      if (word == "\n") {
          lines[actualline].EndParagraph = true;
          actualline++;
          actualsize = 0;
          lines[actualline] = {};
          lines[actualline].Words = [];
          i++;
      } else {
          wo = {};
          wo.l = context.measureText(word).width;
          if (actualsize === 0) {

              // If the word does not fit in one line, we split the word
              while (wo.l > w) {
                  word = word.slice(0, word.length - 1);
                  wo.l = context.measureText(word).width;
              }

              wo.word = word;
              lines[actualline].Words.push(wo);
              actualsize = wo.l;
              if (word != words[i]) {
                  // if a single letter does not fit in one line, just return without painting nothing.
                  /*if (word === "") {
                    return {};
                  }*/
                  words[i] = words[i].slice(word.length, words[i].length);
              } else {
                  i++;
              }
          } else {
              if (actualsize + sp + wo.l > w) {
                  lines[actualline].EndParagraph = false;
                  actualline++;
                  actualsize = 0;
                  lines[actualline] = {};
                  lines[actualline].Words = [];
              } else {
                  wo.word = word;
                  lines[actualline].Words.push(wo);
                  actualsize += sp + wo.l;
                  i++;
              }
          }
      }
    }
    if (actualsize === 0) lines.pop(); // We remove the last line if we have not added any thing here.
    lines[actualline].EndParagraph = true;

    // Now we calculete where we start draw the text.
    var yy;
    if (vAlign == "bottom") {
        yy = y + h - totalH + lineheight;
    } else if (vAlign == "center") {
        yy = y + h / 2 - totalH / 2 + lineheight;
    } else {
        yy = y;
    }

    var oldTextAlign = context.textAlign;
    context.textAlign = "left"; // we will draw word by word.

	var maxWidth = 0;
    for (var li in lines) {
    	if (!lines.hasOwnProperty(li)) continue;
        var totallen = 0;
        var xx, usp;


        for (wo in lines[li].Words) {
            if (!lines[li].Words.hasOwnProperty(wo)) continue;
            totallen += lines[li].Words[wo].l;
        }
        // Here we calculate the x position and the distance betwen words in pixels 
        if (hAlign == "center") {
            usp = sp;
            xx = x + w / 2 - (totallen + sp * (lines[li].Words.length - 1)) / 2;
        } else if ((hAlign == "justify") && (!lines[li].EndParagraph)) {
            xx = x;
            usp = (w - totallen) / (lines[li].Words.length - 1);
        } else if (hAlign == "right") {
            xx = x + w - (totallen + sp * (lines[li].Words.length - 1));
            usp = sp;
        } else { // left
            xx = x;
            usp = sp;
            console.log(`usp 3 = ${usp}`);
        }
        console.log(`usp 3 = ${usp}`);
        for (wo in lines[li].Words) {
	    	if (!lines[li].Words.hasOwnProperty(wo)) continue;
            context.fillText(lines[li].Words[wo].word, xx, yy);
            xx += lines[li].Words[wo].l + usp;
        }
        maxWidth = Math.max(maxWidth, xx);
        yy += lineheight;
    }
    context.textAlign = oldTextAlign;

    return {
    	width: maxWidth,
    	height: totalH,
    };
  }
}
