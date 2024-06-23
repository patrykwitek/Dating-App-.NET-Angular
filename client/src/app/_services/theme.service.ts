import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = false;
  private renderer: Renderer2;

  constructor(
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  public toggleMode() {
    this.darkMode = !this.darkMode;
    this.refreshPage();
  }

  public refreshPage() {
    if (this.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  public setMode(isDarkMode: boolean) {
    this.darkMode = isDarkMode;
  }

  public isDarkMode(): boolean {
    return this.darkMode;
  }
}
