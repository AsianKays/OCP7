class Manager {

    constructor(grid, player1, player2) {
        this.grid = grid,
        this.player1 = player1,
        this.player2 = player2,
        this.shears = {},
        this.sword = {},
        this.axe = {},
        this.pickaxe = {},
        this.rod = {}
    }
    
    /**
     * Generate grid, walls and players
     * Set players position on grid and class
     */
    launchGame() {
        this.grid.generate()
        this.grid.generateWalls()
        this.grid.generateWeapon('axe', this.grid.giveRandomCase())
        this.grid.generateWeapon('pickaxe', this.grid.giveRandomCase())
        this.grid.generateWeapon('sword', this.grid.giveRandomCase())
        this.grid.generateWeapon('rod', this.grid.giveRandomCase())
        
        this.shears = new Weapon('shears', 10)
        this.sword = new Weapon('sword', 20)
        this.axe = new Weapon('axe', 30)
        this.pickaxe = new Weapon('pickaxe', 40)
        this.rod = new Weapon('rod', 50)

        var position_player1 = -1
        var position_player2 = -1

        do {
            position_player1 = this.grid.generatePlayer('1')
            this.player1.setPosition(position_player1)
        } while (position_player1 == -1)

        do {
            position_player2 = this.grid.generatePlayer('2')
            this.player2.setPosition(position_player2)
        } while (position_player2 == -1 || this.grid.isNextToPlayer(position_player2))

        this.game_status = $('#game_status')
        this.game_status.html('Recherche d\'armes pour les deux joueurs...')
    }

    /**
     * Start the battle between players
     * @param {string} player_start 
     */
    launchBattle(player_start) {
        var current_player = player_start

        var btn_attack = $('#btn_attack')
        var btn_defend = $('#btn_defend')

        btn_attack.css('visibility', 'visible')
        btn_defend.css('visibility', 'visible')

        

        btn_attack.click(() => {
            var current_weapon = this[current_player].getWeapon()
            var current_dmg = this[current_weapon].getDmg()
            var ennemy = this.switchCurrentPlayer(current_player)
            
            this[current_player].attack(this[ennemy], current_dmg)

            var hp_player1 = this.player1.getHP()
            var hp_player2 = this.player2.getHP()

            if(hp_player1 < 0) {
                hp_player1 = 0
            }

            if(hp_player2 < 0) {
                hp_player2 = 0
            }

            $('#pdv_player1').html(hp_player1)
            $('#pdv_player2').html(hp_player2)
            $('#bar_player1').css('width', hp_player1+'%')
            $('#bar_player2').css('width', hp_player2+'%')

            if(hp_player1 > 0 && hp_player2 > 0) {
                current_player = this.switchCurrentPlayer(current_player)
            } else {
                btn_attack.off('click')
                btn_defend.off('click')
                $('#endgame').css('visibility', 'visible')
            }
        })

        btn_defend.click(() => {
            this[current_player].defend()
            current_player = this.switchCurrentPlayer(current_player)
        })
    }

    /**
     * Show in the grid the possible moves for the current player
     * @param {string} current_turn_player 
     */
    manageMoves(current_turn_player) {
        var pos = new Position(this[current_turn_player].getPosition())
        var moves = this.grid.getPossibleMoves(pos, this[current_turn_player].getMP())
        this.grid.showPossibleMoves(moves)
        this.managePossibleMoves(current_turn_player)
    }

    /**
     * Add listener on every cases where the current player can move
     * After click, remove class 'possible-move' and change player's position
     * Call findWeaponOnTheWay from manager.js
     * Call getPossibleMoves from grid.js
     * Call showPossibleMoves from grid.js
     * @param {string} player 
     */
    managePossibleMoves(player) {
        $('.possible-move').on('click', (event) => {

            var current_player = player

            event.stopPropagation()
            event.stopImmediatePropagation()
            
            var pos = $('.grid').index(event.currentTarget)

            $('.possible-move').off("click")
            $('.possible-move').removeClass('possible-move')
            $('.grid-'+current_player).removeClass('grid-'+current_player)
            $('.grid').eq(pos).addClass('grid-'+current_player)

            var array_weapon_pos = []
            array_weapon_pos = this.findWeaponOnTheWay(this[current_player].getPosition(), pos)
            this.manageWeaponOnSameCaseOfPlayer(this[current_player].getPosition(), pos)

            if(array_weapon_pos.length != 0) {
                
                array_weapon_pos.forEach(weapon_pos => {
                    var current_weapon = this[current_player].getWeapon()
                    var old_weapon_source = this.getSrcWeapon(current_weapon)
                    var new_weapon = this.getWeaponOnCurrentCase(weapon_pos)
                    var new_weapon_source = this.getSrcWeapon(new_weapon)
                    this[current_player].setWeapon(new_weapon)
                    
                    $( '#weapon_'+current_player).attr('src', new_weapon_source)

                    $('.grid').eq(weapon_pos).children().attr('src', old_weapon_source)
                });

            }

            this[current_player].setPosition(pos)

            if(this.grid.isNextToPlayer(pos)) {
                this.game_status.html('Phase de combat !')
                this.launchBattle(current_player)
            } else {
                current_player = this.switchCurrentPlayer(current_player)
                this.grid.getPossibleMoves(new Position(this[current_player].getPosition()), this[current_player].getMP())
                this.grid.showPossibleMoves(this.grid.getPossibleMoves(new Position(this[current_player].getPosition()), this[current_player].getMP()))
                this.managePossibleMoves(current_player)
            }
        })
    }

    /**
     * Return the opposite player
     * @param {string} player 
     */
    switchCurrentPlayer(player) {
        var current_player_img = $('#current_player_img')
        if(player == 'player1') {
            current_player_img.attr('src', 'imgs/avatars/mccree.png')
            return 'player2'
        } else {
            current_player_img.attr('src', 'imgs/avatars/roadhog.png')
            return 'player1'
        }
    }

    /**
     * Return position >= 0 if weapon exists on the way
     * @param {number} pos_start 
     * @param {number} pos_end 
     */
    findWeaponOnTheWay(pos_start, pos_end) {
        var size = this.grid.getSize()
        var start = new Position(pos_start)
        var end = new Position(pos_end)
        var position_start = start.getPosition(size)
        var position_end = end.getPosition(size)
        var direction = this.whichDirection(position_start, position_end)
        var current_case = new Position(-1)

        var array_res = []

        if(direction == 'right') {
            ++position_start.x
            for(position_start.x; position_start.x <= position_end.x; position_start.x++) {
                var pos = current_case.getNumberFromPosition({x: position_start.x, y: position_start.y}, size)
                if($('.grid').eq(pos).hasClass('weapon')) {
                    array_res.push(pos)
                }
            }
        }
        else if(direction == 'left') {
            --position_start.x
            for(position_start.x; position_start.x >= position_end.x; position_start.x--) {
                var pos = current_case.getNumberFromPosition({x: position_start.x, y: position_start.y}, size)
                if($('.grid').eq(pos).hasClass('weapon')) {
                    array_res.push(pos)                    
                }
            }
        }
        else if(direction == 'down') {
            ++position_start.y
            for(position_start.y; position_start.y <= position_end.y; position_start.y++) {
                var pos = current_case.getNumberFromPosition({x: position_start.x, y: position_start.y}, size)
                if($('.grid').eq(pos).hasClass('weapon')) {
                    array_res.push(pos)
                }
            }
        }
        else if(direction == 'up') {
            --position_start.y
            for(position_start.y; position_start.y >= position_end.y; position_start.y--) {
                var pos = current_case.getNumberFromPosition({x: position_start.x, y: position_start.y}, size)
                if($('.grid').eq(pos).hasClass('weapon')) {
                    array_res.push(pos)
                }
            }
        }

        return array_res
    }

    /**
     * Return the direction choose from the current player
     * @param {Object} start 
     * @param {Object} end 
     */
    whichDirection(start, end) {
        if(start.x != end.x) {
            if(start.x < end.x) {
                return 'right'
            } else {
                return 'left'
            }
        }

        if(start.y != end.y) {
            if(start.y < end.y) {
                return 'down'
            } else {
                return 'up'
            }
        }
    }

    /**
     * Return the source image of the weapon gave in parameter
     * @param {string} weapon 
     */
    getSrcWeapon(weapon) {
        let new_src_weapon = 'imgs/weapons/'+weapon+'.png'
        return new_src_weapon
    }

    /**
     * Return the current weapon on the case
     * @param {number} position 
     */
    getWeaponOnCurrentCase(position) {
        let current_src_weapon = $('.grid').eq(position).children().attr('src')
        let array = current_src_weapon.split('/')
        let weapon = array[2]
        weapon = weapon.replace('.png', '')
        return weapon
    }

    /**
     * If the player is on the same case of a weapon, it will hide the weapon
     * @param {number} pos_start 
     * @param {number} pos_end 
     */
    manageWeaponOnSameCaseOfPlayer(pos_start, pos_end) {
        var start = $('.grid').eq(pos_start)
        var end = $('.grid').eq(pos_end)

        if(start.hasClass('weapon')) {
            start.children().css('visibility', 'visible')
        }
        if(end.hasClass('weapon')) {
            end.children().css('visibility', 'hidden')
        }
    }
}