class Component {
    constructor(id, stroke, strokeWidth, fillColor, group) {
        this.id = id;
        this.stroke = stroke;
        this.strokeWidth = strokeWidth;
        this.fillColor = fillColor;
        this.group = group;
    }

    attr(parameter, value) {
        if (value === undefined) {
            return this[parameter];
        } else {
            this[parameter] = value;
        }
    }
}
