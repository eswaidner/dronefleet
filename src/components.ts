function init() {
  customElements.define("build-grid", BuildGrid);
}

export class BuildGrid extends HTMLElement {
  constructor() {
    super();

    const lines: string[] = [];
    for (let i = 1; i < 15; i++) {
      const line = `
        <div class="grid-line"
        style="left: calc((100% / 15) * ${i}); height: 100%; border-left-width: 1px;">
        </div>`;

      lines.push(line);
    }

    for (let i = 1; i < 15; i++) {
      const line = `
        <div class="grid-line"
        style="top: calc((100% / 15) * ${i}); width: 100%; border-top-width: 1px;">
        </div>`;

      lines.push(line);
    }

    this.innerHTML = lines.join("\n");
  }
}

init();
