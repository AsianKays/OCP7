class Position {

    constructor(number){
        this.number = number
    }

    setNumber(number) {
        this.number = number
    }

    getNumber() {
        return this.number
    }

    getPosition(size) {
        if( (this.number % size) < 0) {
            var pos_x = 0
        } else {
            var pos_x = (this.number % size)
        }

        var pos_y = Math.trunc(this.number/size)

        let pos = {
            x: pos_x,
            y: pos_y
        }
        return pos
    }

    getNumberFromPosition(position, size) {
        return position.y * size + position.x
    }
}
