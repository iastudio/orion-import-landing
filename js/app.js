(function(){

	////////////////////////
	//  FORMS VALIDATION  //
	////////////////////////

	$('a.submit').click(function(e) {
		e.preventDefault();
		$(this).parent().submit();
	});

	$('form').each(function() {
        $(this).validate({
            errorPlacement: $.noop,
	        submitHandler: function(form) {
			    $(form).submitForm();
			}
        });
    });

	/////////////////////////
	//  BROWSER DETECTION  //
	/////////////////////////

	var BrowserDetect = 
	{
	    init: function () 
	    {
	        this.browser = this.searchString(this.dataBrowser) || "Other";
	        this.version = this.searchVersion(navigator.userAgent) ||       this.searchVersion(navigator.appVersion) || "Unknown";
	    },

	    searchString: function (data) 
	    {
	        for (var i=0 ; i < data.length ; i++)   
	        {
	            var dataString = data[i].string;
	            this.versionSearchString = data[i].subString;

	            if (dataString.indexOf(data[i].subString) != -1)
	            {
	                return data[i].identity;
	            }
	        }
	    },

	    searchVersion: function (dataString) 
	    {
	        var index = dataString.indexOf(this.versionSearchString);
	        if (index == -1) return;
	        return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	    },

	    dataBrowser: 
	    [
	        { string: navigator.userAgent, subString: "Chrome",  identity: "Chrome" },
	        { string: navigator.userAgent, subString: "MSIE",    identity: "Explorer" },
	        { string: navigator.userAgent, subString: "Firefox", identity: "Firefox" },
	        { string: navigator.userAgent, subString: "Safari",  identity: "Safari" },
	        { string: navigator.userAgent, subString: "Opera",   identity: "Opera" }
	    ]

	};

	BrowserDetect.init();

	/////////////////
	//    SCROLL   //
	/////////////////

	if (BrowserDetect.browser == 'Opera' && BrowserDetect.version <= 12) { 
		$('a[data-scroll]').click(function(e){
		    scrollFrom = $(window).scrollTop();
		    var target = $(this).attr('href');
		    $(window.opera?'html':'html, body').animate({ 
		        scrollTop: $(target).offset().top-0
		    },1000);
		});
	} else {
		smoothScroll.init({
		    speed: 500, // scroll speed (ms)
		    easing: 'easeInOutCubic', // easing
		    updateURL: true // url hash update
		});
	}

	/////////////
	//   MAP   //
	/////////////

	ymaps.ready(function () {
	    var myMap = new ymaps.Map('map', {
	        center: [43.166807, 131.908544],
	        zoom: 17,
	        offset: [100, 100],
	        controls: []
	    });

	    var myPlacemark = new ymaps.Placemark([43.166807, 131.908544], {
	        balloonContentBody: [
	            '<address>',
	            '<strong>Автомобили с аукционов Японии, Кореи и США</strong>',
	            '<br/>',
	            'Адрес: г. Владивосток, ул.Русская 9Б, офис 608',
	            '<br/>',
	            'Тел.: 8(423)200-48-47',
	            '</address>'
	        ].join('')
	    }, {
	        preset: 'islands#dotIcon',
	        iconColor: '#126FA6'

	    });

	    myMap.geoObjects.add(myPlacemark);
	    myMap.behaviors.disable('scrollZoom');
	});

	/////////////////////////
	//  RANGE SLIDER       //
	/////////////////////////

	$('#calculate .header-button').on( 'click', function() {
	//spagetti
	  var text = '';
	  if (!$(this).hasClass('active')) {
		($(this).hasClass('moto')) ? text = 'мотоцикла' : text = 'спецтехники';
		$(this).parent().find('h1').html('Расчитать стоимость ' + text);
		$(this).parent().find('.active').removeClass('active');
		$(this).addClass('active');
	  } else {
		$(this).parent().find('h1').html('Расчитать стоимость авто');
	  	$(this).removeClass('active');
	  }
	  var val = $(this).parent().find('h1').html();
	  $('#calculate form').attr('data-title', val);
	});

	$("#slider-range").slider({
	    range: true,
	    min: 2005,
	    max: 2014,
	    step: 1,
	    values: [2009, 2011],
	    slide: function( event, ui ) {
	        $("#year-1").val(ui.values[0]);
	        $("#year-2").val(ui.values[1]);
	      }
	});

	/////////////////////////
	//  ISOTOPE (GALLERY)  //
	/////////////////////////

	var $container = $('#container');
	$container.isotope({
	  itemSelector: '.item',
	  layoutMode: 'fitRows'
	});
        
    $container.isotope({ filter: '.auto' });

	$('#filters').on( 'click', 'a', function( event ) {
	  event.preventDefault();
	  var filterValue = $(this).attr('data-filter-value');
	  $container.isotope({ filter: filterValue });
	  $('#filters li.active').removeClass("active");
	  $(this).parent().addClass("active");
	});

	/////////////////
	//  COUNTDOWN  //
	/////////////////

	var ts = new Date().getTime();
	var interval = 3 * 24 * 60 * 60 * 1000;
	var tm = 0;
	var result = tm + interval * ( Math.floor((ts - tm) / interval) + 1 ) - ts;

	FlipClock.Lang.Russian = {
		'years'   : 'Лет',
		'months'  : 'Месяцев',
		'days'    : 'Дней',
		'hours'   : 'Часов',
		'minutes' : 'Минут',
		'seconds' : 'Секунд'
	};

	FlipClock.Lang['ru'] = FlipClock.Lang.Russian;

	var clock = $('#countdown').FlipClock(result/1000, {
		countdown: true,
		language: 'ru'
	});

	$('.flip-clock-wrapper ul li a').on( 'click', function( event ) {
		event.preventDefault();
	});

	/////////////////
	//    SLIDER   //
	/////////////////

	var count = $('.slide.active').attr('id').split('slide-')[1]-1;;
	var slidesCount = $('.slide').size()-1;

	$('.slider-nav a').on('click', function(e) {
		e.preventDefault();
		if ($('.slide:animated').size()>0) return;

		count = $(this).attr('href').split('#slide-')[1]-1;

		$('.slide.active').fadeOut(300, function() {
			$('.slide.active').removeClass('active');
			$('.slide').eq(count).addClass('active');
			$('.slide').eq(count).fadeIn(300);
		});
		$('.slider-nav li.active').removeClass('active');
		$('.slider-nav li').eq(count).addClass('active');
	});

	$('.prev-next > div').on('click', function(e) {
		e.preventDefault();
		if ($('.slide:animated').size()>0) return;
		
		var direction;
		$(this).hasClass('next-btn') ? direction = 1 : direction = 0;

		if (direction == 0)
			(count == 0) ? count = slidesCount + 1 : count = count;
		else
			(count == slidesCount) ? count = - 1 : count = count;

		$('.slide.active').fadeOut(300, function() {
			$(this).removeClass('active');
			(direction == 1) ? count++ : count--;
			$('.slide').eq(count).addClass('active');
			$('.slide').eq(count).fadeIn(300);
			$('.slider-nav li.active').removeClass('active');
			$('.slider-nav li').eq(count).addClass('active');
		});
	});

	////////////////////////
	//  PLACEHOLDERS FIX  //
	////////////////////////

	if ($.fn.placeholder.input && $.fn.placeholder.textarea) {
	} else if ($.fn.placeholder.input) {
		$('textarea').placeholder();
	} else {
		$('input, textarea').placeholder();
	}

	/////////////////
	//    ELSE     //
	/////////////////

	$('.logo').on('click', function(e) {
		e.preventDefault();
	});

})(jQuery);

////////////////////////////
//  FORM SUBMIT FUNCTION  //
////////////////////////////

$.fn.submitForm = function() {

	var form = $(this);
	var preloaderHTML = '<div class="form-preloader" style="display: none;"><div><i class="fa fa-refresh fa-spin"></i></div></div>';
	var okHTML = '<i class="fa fa-check"></i><br />Сообщение отправлено!';
	var errorHTML = '<i class="fa fa-frown-o"></i><br />Произошла ошибка!';

	form.parent().append(preloaderHTML);
	var preloader = $(this).parent().find('.form-preloader');

	var preloaderHeight = preloader.height();
	var innerHeight = preloader.find('div').height();
	var preloaderPadding = ((preloaderHeight/2) - innerHeight/2) + 10;
	preloader.css("padding-top", preloaderPadding + "px");

	preloader.fadeIn(300);

	var fields = form.find("input[type=text], input[type=email]");
	//var fields = form.find("input[type=text], input[type=email], input[type=checkbox], textarea");
	var data = {};
	data["formName"] = form.attr("data-title");



	$(fields).each(function(){
		var name = $(this).attr("name");

		// if ($(this).attr("type")=="checkbox") {
		// 	if ($(this).is(':checked')) {
		// 		val = "on";
		// 	} else {
		// 		val = "off";
		// 	}
		// } else {
			var val = $(this).val();
		//}

		data[name] = val;
	});

	data["secret"] = "2f7d9f0d0acf89a8f6a57d79f0f7d475";

	var isError = false;

	$.ajax({
	  type: "POST",
	  url: "/",
	  data: JSON.stringify(data),
	  contentType: "application/json; charset=utf-8",
      success: function (data) {
      	preloader.find('div').html(okHTML);
      },
      error: function (data) {
      	isError = true;
      	preloader.find('div').html(errorHTML);
      }
	});

	$('.form-preloader').click(function() {
		$(this).fadeOut(300, function() {
			$(this).remove();
		});
		if (!isError) {
			fields.val('');
		}
	});

}