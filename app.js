var app = angular.module('myApp', ['ui.router', 'ngRoute', 'ngCookies', 'ngMessages']);
var loginChecker = false;
var filterChecker = false;

const SERVER = "https://spa-project-alexstefan.c9users.io";

app.controller('myDatabaseController', ['$scope', '$http', '$location', '$cookies', function($scope, $http, $location, $cookies) {
  $scope.message = 'Waiting'
  $http.get(SERVER + '/users')
    .then((response) => {
      $scope.usersInfo = response.data;
    })
    .catch((error) => {
      console.warn(error);
      $scope.usersInfo = "There is an error at server";
    });
  $scope.submit = function() {
    for (var i = 0; i < $scope.usersInfo.length; i++) {
      if ($scope.username == $scope.usersInfo[i].user_name && $scope.password == $scope.usersInfo[i].user_password) {
        $cookies.put('req_id', $scope.usersInfo[i].id);
        loginChecker = true;
        $location.path('/home');
        break;
      }
      else $scope.message = 'Failed'
    }
  }
}]);

app.directive("usernameVerif", function() {
  return {
    restrict: "A",
    require: "?ngModel",
    link: function(scope, element, attributes, ngModel) {
      ngModel.$validators.usernameVerif = function(modelValue) {
        if (modelValue && modelValue.length > 2) {
          return true;
        }
        else return false;
      };
    }
  };
});


app.config(function($routeProvider) {
  $routeProvider

    .when('/login', {
    templateUrl: 'pages/login.html',
    controller: 'LoginController'
  })

  .when('/register', {
    templateUrl: 'pages/register.html',
    controller: 'RegisterController'
  })

  .when('/home', {
    templateUrl: 'pages/home.html',
    controller: 'HomeController'
  })

  .when('/profile', {
    templateUrl: 'pages/profile.html',
    controller: 'ProfileController'
  })

  .when('/cardcollection', {
    templateUrl: 'pages/cardcollection.html',
    controller: 'cardsController'
  })

  .when('/decks', {
    templateUrl: 'pages/decks.html',
    controller: 'DecksController'
  })

  .when('/exp', {
    templateUrl: 'pages/exp.html',
    controller: 'Expansions&AdventuresController'
  })

  .when('/about', {
    templateUrl: 'pages/about.html',
    controller: 'AboutController'
  })

  .otherwise({
    redirectTo: '/login'
  });
});

app.controller('LoginController', function($scope) {
  $scope.message = 'Hello from LoginController';
});
app.controller('RegisterController', ['$scope', '$http', '$state', function($scope, $http, $state) {
  $scope.message = 'Waiting for register';
  $scope.addUser = (user) => {
    $http.post(SERVER + '/users', user)
      .then((response) => {
        $scope.message = 'Registered';
        $state.go($state.current, {}, {
          reload: true
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }
}]);

app.controller('HomeController', function($scope) {
  $scope.message = 'Lower you will find the news section';
});

app.controller('ProfileController', ['$scope', '$http', '$location', '$cookies', function($scope, $http, $location, $cookies) {
  if (!loginChecker) $scope.message = 'Not availvable without authetification';
  else {
    $scope.message = 'Hello from ProfileController' + $cookies.get('req_id');
    $scope.saveRank = (rank) => {
      $http.post(SERVER + '/users/' + $cookies.get('req_id') + '/ranks', rank)
        .then((response) => {
          $scope.message = 'The current rank is' + rank.c_rank;
        })
        .catch((error) => {
          console.log(error)
          $scope.message = 'It Failed'
        })
    }
    $scope.updateRank = (rank) => {
      $http.put(SERVER + '/users/' + $cookies.get('req_id') + '/ranks/' + $cookies.get('req_id'), rank)
        .then((response) => {
          $scope.message = 'The rank was updated to' + rank.c_rank;
        })
        .catch((error) => {
          console.log(error)
          $scope.message = 'Update failed'
        })
    }
    $scope.deleteRank = (rank) => {
      $http.delete(SERVER + '/users/' + $cookies.get('req_id') + '/ranks/' + $cookies.get('req_id'), rank)
        .then((response) => {
          $scope.message = 'The rank was deleted';
        })
        .catch((error) => {
          console.log(error)
          $scope.message = 'The delete operation has failed'
        })
    }
  }
}]);

app.controller('DeckBuilderController', function($scope) {
  if (loginChecker) $scope.message = 'Hello from DeckBuilderController';
  else $scope.message = 'Not availvable without authetification';
});

app.controller('DecksController', function($scope) {
  if (loginChecker) $scope.message = 'Hello from DecksController';
  else $scope.message = 'Not availvable without authetification';
});

app.controller('Expansions&AdventuresController', ['$scope', '$http', function($scope, $http) {
  if (!loginChecker) $scope.message = 'Not availvable without authetification';
  else {
    $scope.message = 'Cards sorted by Expansions & Adventures';
    $http.get('cards.json').success(function(data) {
      $scope.cards = data;
    });
  }
}]);


app.controller('AboutController', ['$scope', '$http', function($scope, $http) {
  if (!loginChecker) $scope.message = 'Not availvable without authetification';
  else {
    $scope.message = 'Deck Builder';
    $http.get('cards.json').success(function(data) {
      $scope.cards = data;
    });
    var i = 0;
    $scope.items = [{}];
    $scope.currentNumber = 0;
    $scope.addItem = (cardItem) => {
      //var image = new Image();
      //image.src = cardItem;
      //$scope.listData.push(cardItem);
      $scope.currentNumber++;
      $scope.items.push(cardItem);
    }
  }
}]);

app.controller('loginCtrl', function($scope, $location) {
  $scope.submit = function() {
    for (var i = 0; i < $scope.usersInfo.length; i++) {
      if ($scope.username == $scope.usersInfo[i].user_name &&
        $scope.password == $scope.usersInfo[i].user_password) {
        loginChecker = true;
        $location.path('/home');
        break;
      }
    }
  }
});
app.controller('cardsController', ['$scope', '$http', function($scope, $http) {
  if (!loginChecker) $scope.message = 'Not availvable without authetification';
  else {
    $scope.message = 'Card Collection';
    var c = [{
      name: 1
    }, {
      name: 2
    }];
    //var c=[];
    $http.get('cards.json').success(function(data) {
      $scope.cards = data;
    });
  }
}]);
