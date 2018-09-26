import {
  Component,
} from "react";

export default class NextUp extends Component<any, any> {

  private containerRef: HTMLDivElement;

  public show = () => {
    this.containerRef.style.display = "inline";
  }

  public hide = () => {
    this.containerRef.style.display = "none";
  }

  public render() {
    return (
      <div
        ref={(ref) => {this.containerRef = ref; }}
      >
        <img src="./static/coming-up.svg" />

        <style jsx>{`
          div {
            position: absolute;
            right: 3%;
            top: 3%;
            width: 4.3%;
          }

          img {
            width: 100%;
            height: auto
          }
        `}</style>
      </div>
    );
  }
}
