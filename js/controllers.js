var simpleApp = angular.module('simplePaginationApp', ['ui.bootstrap']);

simpleApp.controller('paginationCtrl', function($scope, $http) {

    $scope.numPerPage = 10;
    $scope.currentPage = 1;
    $scope.previousPage = -1;
    $scope.currentPageItems = {};
    $scope.currentPageItems.lastItem = new Date('1970-01-01');
    
    function formatDate(date){
        var timeOnly = moment.utc(date).format("HH:mm:ss");
        var formattedDate = moment.utc(date).format("YYYY-MM-DD");

        return formattedDate + "T" + timeOnly + "Z";
    }

    function retrievePage(fromDate, direction){
        var formattedDate = formatDate(fromDate);
        var nextPageRequest = 'http://localhost:8080/spotviz/spotdata/pagedspots/kk6dct?fromdate=' + formattedDate;
        nextPageRequest += "&direction=" + direction;
        $http.get(nextPageRequest)
            .then(function(response){
                $scope.currentPageItems.data = response.data;
                $scope.currentPageItems.lastItem = response.data[response.data.length - 1].spotReceivedTimestamp.$date;
            });
    }

    //initial data load of page 1
    //retrievePage();
    $scope.totalItems = 100; //TODO: get total results count

    //move to selected page of items when currentPage value changes
    $scope.$watch("currentPage" , function(){
        var direction;
        
        //check if we're paging forwards or backwards        
        if($scope.currentPage > $scope.previousPage){
            direction = "next";
        }
        else{
            direction = "previous";
        }
        $scope.previousPage = $scope.currentPage;
        retrievePage($scope.currentPageItems.lastItem, direction);
    
    });
	
});