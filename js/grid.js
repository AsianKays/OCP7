class Grid {

    constructor(size, nb_walls) {
        this.size = size
        this.nb_walls = nb_walls
    }

    getSize() {
        return this.size
    }

    /**
     * Generate grid
     * Dimensions : 900px*900px
     */
    generate() {
        for (var rows = 0; rows < this.size; rows++) {
            for (var columns = 0; columns < this.size; columns++) {
                $("#grid_container").append("<div class='grid'></div>");
            };
        };
        $(".grid").width(600/this.size);
        $(".grid").height(600/this.size);
    }

    /**
     * Generate randoms walls
     * It only generate on odd lines of the grid
     * Simpliest way to avoid inaccessibles cases
     */
    generateWalls() {
        var current = 0

        do {
            var rand_position = new Position(this.giveRandomCase())
            if((rand_position.getPosition(this.size).y % 2) == 0 && this.isEmpty(rand_position.getNumber())) {
                $('.grid').eq(rand_position.getNumber()).addClass('grid-inactive')
                current++
            }
        } while(current < this.nb_walls)
    }

    /**
     * Generate player
     * Cannot generate on an non empty case or right next to another player
     * @param {string} player 
     */
    generatePlayer(player) {
        var position = this.giveRandomCase()
        if(this.isEmpty(position) && !this.isNextToPlayer(position)) {
            $('.grid').eq(position).addClass('grid-player'+player)
            return position
        } else {
            return -1
        }
    }

    /**
     * Generate weapon
     * Cannot generate on an non empty case
     * @param {string} weapon 
     * @param {number} position 
     */
    generateWeapon(weapon, position) {
        if(this.isEmpty(position)) {
            $('.grid').eq(position).addClass('weapon')
            // $('.grid').eq(position).addClass(weapon)
            $('.grid').eq(position).append("<img class='weapons' src='imgs/weapons/"+weapon+".png'>")
            return position
        } else {
            this.generateWeapon(weapon, this.giveRandomCase())
        }
    }

    /**
     * Return if position gave in arg has the class 'grid-inactive' (wall)
     * @param {number} position 
     */
    isWall(position) {
        if(position > this.size * this.size || position < 0) {
            return true
        } else {
            return $('.grid').eq(position).hasClass('grid-inactive')
        }
    }

    /**
     * Return if position gave in arg has the class 'weapon'
     * @param {number} position 
     */
    isWeapon(position) {
        if(position > this.size * this.size || position < 0) {
            return false
        } else {
            return $('.grid').eq(position).hasClass('weapon')
        }
    }

    /**
     * Return if position gave in arg has only one class, wich is 'grid'
     * @param {number} position 
     */
    isEmpty(position) {
        if(position > this.size * this.size || position < 0) {
            return false
        } else {
            return $('.grid').eq(position).hasClass('grid') && $('.grid').eq(position)[0].classList.length == 1
        }
    }
    
    /**
     * Compares x and y from the two objects gave in args
     * If both x and y are the same, return true
     * If not, return false
     * @param {Position} obj1 
     * @param {Position} obj2 
     */
    isSamePosition(obj1, obj2) {
        if(obj1.x == obj2.x && obj1.y == obj2.y) {
            return true
        } else {
            return false
        }
    }
    
    /**
     * Return true or false
     * Compare x and y from the two objects gave in args
     * If x or y superior or inferior by 1 while the other propertie have to be the same, it will return true
     * If not, it will return false
     * Example : if x superior/inferior, then y have to be the same
     * @param {Position} obj1 
     * @param {Possiton} obj2 
     */
    isAdjacent(obj1, obj2) {
        if(obj1.x == obj2.x && obj1.y == obj2.y-1 || obj1.x == obj2.x && obj1.y == obj2.y+1 || obj1.x == obj2.x-1 && obj1.y == obj2.y || obj1.x == obj2.x+1 && obj1.y == obj2.y) {
            return true
        } else {
            return false
        }
    }

    /**
     * Return if the case gave in arg is surrounded by walls
     * @param {number} position 
     */
    isStuck(position) {
        if(this.isWall(position+1) && this.isWall(position-1) && this.isWall(position-this.size) && this.isWall(position+this.size)) {
            return true
        } else {
            return false
        }
    }

    // Return random case
    giveRandomCase() {
        return Math.floor(Math.random() * (this.size * this.size))
    }

    /**
     * Return an array with all the possible moves from the position gave in args and the number of movements able to do
     * @param {number} pos 
     * @param {number} mp 
     */
    getPossibleMoves(pos, mp) {
        var position = pos.getPosition(this.size)

        var moves = []
        var res = []

        var bool_droite = true
        var bool_gauche = true
        var bool_haut = true
        var bool_bas = true

        for(var i=1; i<=mp; i++) {

            // ________________________ DROITE ________________________
            if(position.x+i > 0 && position.x+i < this.size && bool_droite)  {
                if(this.isEmpty(position.y * this.size + position.x+i) || this.isWeapon(position.y * this.size + position.x+i)) {
                    moves.push({x: position.x+i, y: position.y})
                } else {
                    bool_droite = false
                }
            }

            // ________________________ GAUCHE ________________________
            if(position.x-i < 0) {
                bool_gauche = false
            } else {
                var x = position.x-i
            }
            if(bool_gauche && x < this.size) {
                if(this.isEmpty(position.y * this.size + x) || this.isWeapon(position.y * this.size + x)) {
                    moves.push({x: x, y: position.y})
                } else {
                    bool_gauche = false
                }
            }

            // ________________________ BAS ________________________
            if(bool_bas && position.y+i < this.size) {
                if(this.isEmpty(((position.y+i) * this.size) + position.x) || this.isWeapon(((position.y+i) * this.size) + position.x)) {
                    moves.push({x: position.x, y: position.y+i})
                } else {
                    bool_bas = false
                }
            }

            // ________________________ HAUT ________________________
            if(position.y-i < 0) {
                bool_haut = false
            } else {
                var y = position.y-i
            }
            if(bool_haut && y < this.size) {
                if(this.isEmpty(y * this.size + position.x) || this.isWeapon(y * this.size + position.x)) {
                    moves.push({x: position.x, y: y})
                } else {
                    bool_haut = false
                }
            }
        }

        moves.forEach(move => {
            var pos = new Position(0)
            res.push(pos.getNumberFromPosition(move, this.size))
        });
        
        return res
    }

    /**
     * Iterate the array gave in arg then add the class 'possible-move'
     * @param {array} moves 
     */
    showPossibleMoves(moves) {
        moves.forEach(move => {
            if(this.isEmpty(move) || this.isWeapon(move)) {
                $('.grid').eq(move).addClass('possible-move')
            }
        });
    }

    /**
     * Return if a player is on the case gave in args
     * @param {number} pos 
     */
    isPlayerOnCase(pos) {
        return $('.grid').eq(pos).is('[class*="grid-player"]')
    }

    /**
     * Return if the current position is next to a player
     * @param {number} pos_current_player 
     */
    isNextToPlayer(pos_current_player) {
        if(pos_current_player == -1) {
            return false
        }
        var array_pos = []

        var pos = new Position(pos_current_player).getPosition(this.size)

        if(pos.y - 1 >= 0) {
            array_pos.push({x: pos.x, y: pos.y - 1})
        }

        if(pos.x - 1 >= 0) {
            array_pos.push({x: pos.x - 1, y: pos.y})
        }

        if(pos.y +1 < this.size) {
            array_pos.push({x: pos.x, y: pos.y + 1})
        }

        if(pos.x + 1 <= this.size) {
            array_pos.push({x: pos.x + 1, y: pos.y})
        }

        var res = false

        array_pos.some(pos => {
            let temp = new Position(-1)
            var temp_case_number = temp.getNumberFromPosition(pos, this.size)

            if(this.isPlayerOnCase(temp_case_number)) {
                res = true
                return true
            }
        });
        
        return res
    }
}