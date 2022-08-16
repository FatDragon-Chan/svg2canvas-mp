import SvgPath from '../utils/svg-path-to-canvas.nobrowser';
import { idToRgba } from '../helpers';
import Base from './Base';

interface RectProps {
  fillColor?: string;
  d: string;
  translate: Array<string | number>;
}

export default class Path extends Base {
  constructor(private props: RectProps) {
    super();
    this.props.fillColor = this.props.fillColor || '#fff';
  }

  draw(ctx: any) {
    const {
      fillColor, d, translate = ['0', '0'],
    } = this.props;
    // @ts-ignore
    const sp = new SvgPath(d);
    sp.save()
      .beginPath()
      .translate(translate[0], translate[1])
      .scale(0.5)
      .fillStyle(fillColor)
      .to(ctx)
      .fill();
  }

  clone() {
    const [r, g, b, a] = idToRgba(this.id);
    return new Path({
      ...this.props,
      fillColor: `rgba(${r}, ${g}, ${b}, ${a})`,
    });
  }
}
