const SPAWN_ON_STARTUP = false;
const TEXT = "A City\nFull of\nDesign";
const SIZE = 200;

import {
  Component,
} from "react";
import {
  Clock,
} from "three";

import * as OpenType from "opentype.js";

import TextPhysics from "./textPhysics";

import {IGravityConfig} from "../types";

import {overrideWidth, overrideHeight} from "../../overrideSize";

let textStrokeColor = "#000000";

let textFillColor = "#000000";
let textShowFill = false;

export default class StatueViewer extends Component<any, any> {
    private clock: Clock;
    private textPhysics: TextPhysics;

    private frameId: number;

    private font: any;

    private containerRef: HTMLDivElement;

    private svgs: SVGElement[];

    private bottom = true;

  constructor(props: any) {
    super(props);
  }

  public shouldComponentUpdate(nextProps: any, nextState: any): boolean {
    return false;
  }

  public componentDidMount() {

    this.clock = new Clock();
    this.clock.start();

    this.svgs = [];

    OpenType.load(
      "./static/fonts/Linotype - NHaasGroteskTXPro-55Rg.otf",
      (err, font) => {
        if (err) {
          console.error("could not load font", err);
        } else {
          this.font = font;
          this.svgs = [];
          if (SPAWN_ON_STARTUP) {
            this.updateTextSize(SIZE);
            this.newText(TEXT);
          }
        }
      },
    );

    this.textPhysics = new TextPhysics();
    const rect = this.containerRef.getBoundingClientRect();
    this.textPhysics.setup(rect.width / rect.height);
    this.textPhysics.clearBodies();

    // window.addEventListener("resize", this.onResize);
    this.onResize();

    this.animate();
  }

  public updateTextSize = (size) => {
    this.textPhysics.updateTextSize(size);
    // this.onResize();
    const physicsBounds = this.textPhysics.getWorldBounds();

    const svgs = this.containerRef.querySelectorAll("svg");

    svgs.forEach((svg) => {
      svg.setAttribute("viewBox", `${
        physicsBounds.width * -0.5
      } ${
        physicsBounds.height * -0.5
      } ${
        physicsBounds.width
      } ${
        physicsBounds.height
      }`);
    });
  }

  public componentWillUnmount() {
    cancelAnimationFrame(this.frameId);

    // window.removeEventListener("resize", this.onResize);
  }

  public newText = (text) => {
    
    for (let i = 0, l = this.svgs.length; i < l; i++) {
      this.containerRef.removeChild(this.svgs[i]);
    }

    this.svgs = [];

    this.generateSVGs(
      text,
      this.font,
      this.containerRef,
      this.svgs,
    );

    this.onResize();

    // this.textPhysics.resetGravity();
    this.textPhysics.openTop();
    this.textPhysics.closeBottom();
    this.textPhysics.clearBodies();
    if (this.bottom) {
      this.textPhysics.closeBottomBorder();
    } else {
      this.textPhysics.openBottomBorder();
    }

    for (let i = 0, l = this.svgs.length; i < l; i++) {
      this.textPhysics.setFromSVG(
        this.svgs[i],
        i,
        0.6,
        0.5 - i * 0.1,
      );
    }

    // disabled funnel and colliders
    this.textPhysics.openBottomBodies();
    
    // immediately update svg positions, so they don't get drawn in the middle of the screen
    this.textPhysics.update(this.svgs);
  }
  
  
  public clearText() {
    for (let i = 0, l = this.svgs.length; i < l; i++) {
      this.containerRef.removeChild(this.svgs[i]);
    }
    this.svgs = [];
    this.textPhysics.clearBodies();
  }
  

  public updateGravity = (config: IGravityConfig) => {
    this.textPhysics.updateGravity(config);
  }

  public updateFriction = (value: number) => {
    this.textPhysics.updateFriction(value);
  }

  public updateRestitution = (value: number) => {
    this.textPhysics.updateRestitution(value);
  }

  public closeWorldBounds = () => {
    this.textPhysics.closeTop();
    this.textPhysics.closeBottom();
  }

  public updateStrokeColor = (color: string) => {
    textStrokeColor = color;

    this.updateExistingTextStyles();
  }
  public updateFillColor = (color: string) => {
    textFillColor = color;

    this.updateExistingTextStyles();
  }
  public updateTextShowFill = (value: boolean) => {
    textShowFill = value;

    this.updateExistingTextStyles();
  }

  private updateExistingTextStyles = () => {
    const svgs = this.containerRef.querySelectorAll("svg");

    svgs.forEach((svg) => {
        const paths = svg.querySelectorAll("path");
        paths.forEach((path) => {
          path.setAttribute("stroke", textStrokeColor);
          path.setAttribute("fill", textShowFill ? textFillColor : "none");
      });
    });
  }

  public openBottom = () => {
    this.bottom = false;
    this.textPhysics.openBottomBorder();
  }

  public closeBottom = () => {
    this.bottom = true;
    this.textPhysics.closeBottomBorder();
  }

  public dropText = () => {
    // this.textPhysics.resetGravity();
    this.textPhysics.openBottom();
    this.textPhysics.closeTop();
  }

  private generateSVGs(
    text: string,
    font: any,
    container: HTMLDivElement,
    svgs: SVGElement[],
  ) {
    const physicsBounds = this.textPhysics.getWorldBounds();

    const lines = text.split("\n");

    for (let i = 0, l = lines.length; i < l; i++) {
      const svg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg",
      );
      svg.style.position = "absolute";
      svg.style.top = "0";
      svg.style.left = "0";
      svg.style.width = "100%";
      svg.style.height = "100%";

      svg.style.transform = "";

      if (overrideWidth > 0) {
        svg.style.width = `${overrideWidth}px`;
        svg.style.left = "50vw";
        svg.style.transform += "translateX(-50%)";
      }
      if (overrideHeight > 0) {
        svg.style.width = `${overrideHeight}px`;
        svg.style.top = "50vh";
        svg.style.transform += "translateY(-50%)";
      }

      const charPath = font.getPath(lines[i], 0, 60);
      const pathBounds = charPath.getBoundingBox();

      // console.log(pathBounds);

      svg.setAttribute(
        "boxsize",
        `0 0 ${pathBounds.x2 - pathBounds.x1} 60`, // descenders stick out
        // `${0} ${0} ${pathBounds.x2 - pathBounds.x1} ${(pathBounds.y2 - pathBounds.y1)}`, // bounding box includes descenders
      );
      svg.setAttribute("viewBox", `${
        physicsBounds.width * -0.5
      } ${
        physicsBounds.height * -0.5
      } ${
        physicsBounds.width
      } ${
        physicsBounds.height
      }`);

      svg.innerHTML = `<g><path
          fill="${textShowFill ? textFillColor : "none"}"
          stroke-width="1.5"
          stroke="${textStrokeColor}"
          d="${charPath.toPathData(3)}"
          transform="translate(${-pathBounds.x1} ${pathBounds.y1})"
        /></g>`;
      svgs.push(svg);

      container.appendChild(svg);
    }
  }

  private onResize = () => {
    const rect = this.containerRef.getBoundingClientRect();

    if (overrideWidth > 0 && overrideHeight > 0) {
      this.textPhysics.onResize(
        overrideWidth / overrideHeight,
      );

      const svgs = this.containerRef.querySelectorAll("svg");

      const windowAspectRatio = rect.width / rect.height;
      const aspectRatio = overrideWidth / overrideHeight;

      svgs.forEach((svg) => {
        if (aspectRatio < windowAspectRatio) {
          // window is wider
          svg.style.width = "auto";
          svg.style.height = "100%";
        } else {
          // window is higher
          svg.style.width = "100%";
          svg.style.height = "auto";
        }
      });
    } else {
      this.textPhysics.onResize(
        rect.width / rect.height,
      );

      const physicsBounds = this.textPhysics.getWorldBounds();
      const svgs = this.containerRef.querySelectorAll("svg");
      svgs.forEach((svg) => {
        svg.setAttribute("viewBox", `${
          physicsBounds.width * -0.5
        } ${
          physicsBounds.height * -0.5
        } ${
          physicsBounds.width
        } ${
          physicsBounds.height
        }`);
      });
    }
  }

  private animate = () => {
    // const delta = Math.min(1.0 / 20.0, this.clock.getDelta());
    this.textPhysics.update(this.svgs);
    this.draw();

    this.frameId = requestAnimationFrame(this.animate);
  }

  private draw = () => {
  }

  public render() {
    return (
      <div
        className="container"
        ref={(ref) => {this.containerRef = ref!; }}
      >
        <style jsx>{`
          .container {
            width: 100%;
            height: 100%;

            position: absolute;
            top: 0;
            left: 0;
          }

          svg path {
            stroke: red;
            fill: black;
          }
        `}</style>
      </div>
    );
  }
}
