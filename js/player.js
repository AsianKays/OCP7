class Player {

    /**
     * name = player's name / pm = movement point / hp = heal point / dmg = damage / position = position in grid
     * @param {string} name
     * @param {number} hp
     * @param {number} mp
     */
    constructor(name, hp, mp) {
        this.name = name
        this.hp = hp
        this.mp = mp,
        this.position = -1,
        this.weapon = 'shears',
        this.status = 'attack'
    }

    setName(name) {
        this.name = name
    }

    getName() {
        return this.name
    }

    setHP(hp) {
        this.hp = hp
    }

    getHP() {
        return this.hp
    }

    setMP(mp) {
        this.mp = mp
    }

    getMP() {
        return this.mp
    }

    setPosition(position) {
        this.position = position
    }

    getPosition() {
        return this.position
    }

    setWeapon(weapon) {
        this.weapon = weapon
    }

    getWeapon() {
        return this.weapon
    }

    setStatus(status) {
        this.status = status
    }

    getStatus() {
        return this.status
    }

    attack(target, dmg) {
        this.status = 'attack'
        this.receiveDmg(target, dmg)
    }
    

    defend() {
        this.status = 'defend'
    }

    receiveDmg(target, dmg) {
        var damage = dmg
        var hp = target.getHP() - damage

        if(target.getStatus() == 'defend') {
            damage = damage/2
        }

        target.setHP(hp)
    }
}