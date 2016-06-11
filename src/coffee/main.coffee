###
# here we do stuff
###
angular.module "tkApp", []
.controller("MainCtrl", ($scope, $http)->

  ###
  # scoped variables
  ###
  $scope.demo = 'WOHOOO angular ça marche'

  $http.get('json/squares.json').then( (data)->
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
  # initilise everything
  ###
  $scope.init = ->
    console.log('mainCtrl initialised');
  $scope.init()
)
