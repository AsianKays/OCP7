$(document).ready(function() {

    /**
     * Generate new Grid
     * Parameters: size, number of walls
     */
    var grid = new Grid(8, 10)

    /**
     * Generate new Player
     * Parameters: name, hp, mp
     */
    var player1 = new Player('Roadhog', 100, 3)
    var player2 = new Player('McCree', 100, 3)

    /**
     * Add a new Manager for all the events triggered in the grid
     * Parameters: grid, player, player
     */
    var manager = new Manager(grid, player1, player2)

    manager.launchGame()
    manager.manageMoves('player1')

});