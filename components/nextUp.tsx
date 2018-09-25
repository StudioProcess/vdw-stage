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
        Next Up

        <style jsx>{`
          div {
            font-size: 20px;
            text-position: right;
            position: absolute;
            right: 3%;
            top: 3%;
            width: 10%;
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
