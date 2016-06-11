###
# here we do stuff
###
angular.module "tkApp", []
.controller("MainCtrl", ($scope)->

  ###
  # scoped variables
  ###
  $scope.demo = 'WOHOOO angular ça marche'

  ###
  # scoped functions
  ###
  $scope.doStuff = ->
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
