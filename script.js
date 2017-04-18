$(document).ready(function(){
	var showMovieInfo = function(data){
        var movieList = $("<li class=\"movie-list\"></li>").appendTo(".movies");
        if(data.Poster !== "N/A"){
            $("<img class=\"movie-poster\">").attr({
        	                        src: data.Poster,
                                    alt: data.Title})
                                .appendTo(movieList);
        };
            
        var title = $("<h2></h2>").html(data.Title)
                                  .appendTo(movieList);
        $("<span class=\"year\"><span>").html(" ("+data.Year+")")
                                        .appendTo(title);
        var movieInfo = $("<ul class=\"movie-info\"></ul>").appendTo(movieList);
        if(data.Genre!=="N/A"){
            movieInfo.append("<li>"+data.Genre+"</li>");
        };
        if(data.Runtime!=="N/A"){
            movieInfo.append("<li>"+data.Runtime+"</li>");
        };
        if(data.imdbRating!=="N/A"){
            movieInfo.append("<li>imdbRating: "+data.imdbRating+"/10</li>");
        };
            
        if(data.Plot!=="N/A"){
            $("<p class=\"movie-plot\"></p>").html(data.Plot)
                               .appendTo(movieList);
        }  
            
	}; 

	var showResult = function(data){
        var movieArray = data.Search;
        console.log(movieArray);
        movieArray.forEach(function(movie){
        	var movieID = movie.imdbID;
        	url = "http://www.omdbapi.com/?i="+ movieID;
        	$.ajax({
        		url: url,
        		dataType: "json",
        		success: function(data){
                    if(data.Response == "True"){
                        showMovieInfo(data);
                    }
        		}
        	})
        });
      	
    };

	var formSubmit = function(){
    	var searchText = $("#search").val();
    	var pageNum = 1;
    	var url = "http://www.omdbapi.com/?type=movie&page=1&s="
	    url = url + searchText;
    
	    $.ajax({
		    url: url,
		    type: "GET",
		    dataType: "json",
		    beforeSend: function(){
		    	$(".movies").html("");
		    },
		    success: function(data,textStatus,jqXHR){
		    	if(data.Response == "False"){
		    		console.log(data.Error);		    		
		    	}
		    	else {
		    		showResult(data);	
		    	};
		    },
		    error: function(jqXHR, textStatus, errorThrown){
		    	alert("There is an error!");
		    	console.log(textStatus);
		    	console.log(errorThrown);
		    },

	    });

	    $(window).scroll(function(){
	    	//show more movies when the user scrolls to the bottom
	    	if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {               
               pageNum++;
               url = "http://www.omdbapi.com/?type=movie&page="+pageNum+"&s="+searchText;
               $.ajax({
		            url: url,
		            type: "GET",
		            dataType: "json",
		            success: function(data,textStatus,jqXHR){
		    	        if(data.Response == "False"){
		    		       console.log(data.Error);		    		
		    	        }
		    	        else {
		    		        showResult(data);	
		    	        }		    	
		            }
	            });
           };        	
        }); 
    };


	
	$("form").validate({
		errorPlacement: function(error, element){
			error.insertAfter(element);
		},
		errorClass: "error",
		rules: {
			search: "required"
		},
		messages: {
			search: "Please enter the movie title."
		},
		submitHandler: function(){
            formSubmit();
		}
	});
    
    
})