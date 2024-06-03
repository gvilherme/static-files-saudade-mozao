import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-heart',
  templateUrl: './heart.component.html',
  styleUrls: ['./heart.component.css']
})
export class HeartComponent implements OnChanges {
  @Input() rosaTokens: number = 0;
  @Input() azulTokens: number = 0;
  rosaPercent: number = 0;
  azulPercent: number = 0;

  ngOnChanges() {
    this.updatePercents();
  }

  updatePercents() {
    const totalTokens = this.rosaTokens + this.azulTokens;
    const maxPercent = 75;
    if (totalTokens > 0) {
      this.rosaPercent = (this.rosaTokens / totalTokens) * maxPercent;
      this.azulPercent = (this.azulTokens / totalTokens) * maxPercent;
    } else {
      this.rosaPercent = 0;
      this.azulPercent = 0;
    }
  }
}
