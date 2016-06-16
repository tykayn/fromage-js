###
# here we do stuff
###
angular.module "tkApp", []
.controller("MainCtrl", ($scope, $http)->

  ###
  # scoped variables
  ###
  $scope.demo = 'WOHOOO angular ça marche'
  $scope.countActive = 0

  $http.get('json/squares.json').then((data)->
    console.log('data', data)
    $scope.config = data.data
  )
  ###
  # scoped functions
  ###
  $scope.reinitSquares = ->
    for square in $scope.config.squares
      square.active = 0
    console.log('impressig!')
  $scope.doStuffWithArg = (arg)->
    console.log('wow such function!', arg)


  ###
  # change a square's activity
  # and run the test to know if we have won
  ###
  $scope.toggleSquare = (s)->
    s.active = !s.active
    if s.active
      $scope.countActive++
    else
      $scope.countActive--
    if $scope.countActive >= $scope.config.rows
      $scope.didWeWon()

  $scope.winReason = ""
  ###
  #  run the test to know if we have won
  ###
  $scope.didWeWon = ->
    if !$scope.config
      console.log('no config')
      return false
    $scope.winReason = ""
    colCurrent = 1
    rowCurrent = 1
    columns = {}
    rows = {}
    squareSide = $scope.config.cols
    for i in [ 1 .. squareSide]
      columns[i]=0
      rows[i]=0
    diagonalSlash = 0 # diagonal /
    diagonalAntiSlash = 0 # diagonal \
    rowsTakenForSlash = []
    ###
    #  identify all the active squares
    #  check their position to find if a line is formed
    ###
    for s in $scope.config.squares
      s.position = colCurrent+", "+rowCurrent
      if(s.active)
        columns[colCurrent]++
        rows[rowCurrent]++
        # find if a diagonal has all its squares actives
        if(colCurrent==rowCurrent)
            diagonalAntiSlash++
#            console.log('added slash', colCurrent, rowCurrent)
            if(diagonalAntiSlash==squareSide)
              $scope.winReason = "diagonale antislash \\"
              return true
        # find for diagonal / slash
        console.log('rowsTakenForSlash.indexOf(rowCurrent)', rowsTakenForSlash.indexOf(rowCurrent))
        if(colCurrent+rowCurrent== squareSide+1 && rowsTakenForSlash.indexOf(rowCurrent) is -1)
          diagonalSlash++
          rowsTakenForSlash.push(rowCurrent)
          #            console.log('added anti slash ', colCurrent, rowCurrent )
          if(diagonalSlash==squareSide)
            $scope.winReason = "diagonale slash /"
            return true
        # find if a column has all its squares actives
        if(columns[colCurrent]==squareSide)
          $scope.winReason = "colonne "+colCurrent
          return true
        # find if a row has all its squares actives
        if(rows[rowCurrent]==squareSide)

          $scope.winReason = "ligne "+rowCurrent
          return true
      colCurrent++
      if(colCurrent > squareSide)
        colCurrent=1
        rowCurrent++
      console.log('diagonalSlash', 'diagonalAntiSlash', diagonalSlash, diagonalAntiSlash)
    false
  ###
  # initilise everything
  ###
  $scope.init = ->
    console.log('mainCtrl initialised');
  $scope.init()
)
$(document).ready( ->
  $('.tip').tooltip()
)
