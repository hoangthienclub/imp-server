$(document).ready(function(){  
	
	$('.companySlideNavItem').click(function(){
		var a = $(this).children("a").attr("href");
		if(a=='#connection')
		{
			$('#sameProvince .slick-for').slick({
				prevArrow: $('.navLeftSlick2'),
				nextArrow: $('.navRightSlick2'),
				autoplay: true,
				centerMode: false,
				slidesToShow: 3,
				variableWidth: true,
				responsive: [
					{
						breakpoint: 1024,
						settings: {
							slidesToShow: 2,
							infinite: true,
							variableWidth: true
						}
					},
					{
						breakpoint: 600,
						settings: {
							slidesToShow: 1,
							variableWidth: true
						}
					}
				]
			});	
			$('#sameCategory .slick-for').slick({
				prevArrow: $('.navLeftSlick3'),
				nextArrow: $('.navRightSlick3'),
				autoplay: true,
				centerMode: false,
				slidesToShow: 3,
				variableWidth: true,
				responsive: [
					{
						breakpoint: 1024,
						settings: {
							slidesToShow: 2,
							infinite: true,
							variableWidth: true
						}
					},
					{
						breakpoint: 600,
						settings: {
							slidesToShow: 1,
							variableWidth: true
						}
					}
				]
			});	
		}
	});
	
	$('.slick-for-Gallery').slick({
		prevArrow:$('.navLeftSlick'),
		nextArrow:$('.navRightSlick'),
		autoplay: true,
		centerMode: false,
		variableWidth: true,
		slidesToShow: 3
	});		
});


/* Control hintbox */
$(document).ready(function(){
	
	$('.searchInputForHint').keypress(function(){
		var hei=$(window).height() - $(this).offset().top + $(this).height();
		$(".hintBox").width($(this).width()+38);
		$(".hintBox").height(hei);
		$(".hintBox").css('left',$(this).offset().left);
		$(".hintBox").css('top',$(this).offset().top + $(this).height() + 32);
		$('.hintBox').show();
	});

 });
/* Control hintbox */

$(document).ready(function(){   
	$('#ourPartner .div1').slick({
	  dots: false,
	  slidesToShow: 1,
	  slidesToScroll: 1,
	  centerMode: false,
	  variableWidth: false,
	  autoplay: true,
	  infinite: true,
	  speed: 300,
	  arrows: false
	});
	$('#ourCustomer .div1').slick({
	  dots: false,
	  slidesToShow: 1,
	  slidesToScroll: 1,
	  centerMode: false,
	  variableWidth: false,
	  autoplay: true,
	  infinite: true,
	  speed: 300,
	  arrows: false
	});
});

$(document).ready(function(){   
	$('.reviewSlick').slick({
	  dots: false,
	  autoplay: true,
	  infinite: true,
	  speed: 300,
	  slidesToShow: 1,
	  centerMode: true,
	  variableWidth: true,
	  arrows: false
	});   
		
});
/*
$(document).ready(function(){		
	$('#select-company').selectize();
});
*/
$(document).ready(function(){
	
	$('.reviewSlick2').slick({
	  dots: false,
	  infinite: true,
	  autoplay: true,
	  speed: 800,
	  slidesToShow: 1,
	  centerMode: false,
	  variableWidth: true,
	  arrows: false
	});
		
});

$(document).ready(function(){
	
	/*
	$('.customRadio').click(function(){
		var a = $(this).find('input').attr("name");
		$( "input[name*='" + a + "']").parent().removeClass('active');
		$(this).addClass('active');
	});*/

	
	$('.checkmark').click(function(){
		if($(this).parent().hasClass('active'))
		{
			$(this).parent().removeClass('active');
		}
		else
		{
			$(this).parent().addClass('active');
		}
	});
	$('.customCheck p').click(function(){
		if($(this).parent().hasClass('active'))
		{
			$(this).parent().removeClass('active');
		}
		else
		{
			$(this).parent().addClass('active');
		}
	});


	$("#companyPanel").hide();
	$(".buttonTrigger").click(function(){
		$(".buttonTrigger").hide();
		$("input[name='txtSearchNavTxt']").show();
		$("button[name='btnSearchNavBtn']").show();
	});



	
	/* hiển thị menu anh việt - hide theo yêu cầu designer 
	$(".submenu").click(function(){
	$('.dropdown-submenu a.test').next('ul').toggle();
	});*/
});
/* hiển thị menu anh việt - hide theo yêu cầu designer 
$(document).ready(function(){
  $('.dropdown-submenu a.test').on("click", function(e){
    $(this).next('ul').toggle();
    e.stopPropagation();
    e.preventDefault();
  });
});
*/


/*block hiển thị pop up khi chọn company signup*/
$(document).ready(function(){
	$('.buttonDropdownList').click(function(event){
		event.stopPropagation();
		$('.dropdownList').toggle();
	});

	$('.dropdownList li').click(function(){
		$('.inputDropdownList').val($(this).text());
		$('.dropdownList').toggle();
	});

	$('.inputDropdownList').keypress(function(){
		$('.dropdownList').show();
	});

	$(".inputDropdownList").on("keyup", function() {
		var value = $(this).val().toLowerCase();
		$(".dropdownList li").filter(function() {
		  $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
		});
	  });

	$(".inputDropdownList").focus(function(event) {
		$('.dropdownList').show();
	});
});
/*end block hiển thị pop up khi chọn company signup*/

$(document).ready(function(){
	if($(document).width() <= 1025)
	{
		$('.staContent').slick({
		dots: false,
		infinite: false,
		slidesToShow: 1,
		centerMode: false,
		variableWidth: true,
		arrows: false
		});

		$('.staContent2').slick({
			dots: false,
			infinite: false,
			slidesToShow: 1,
			centerMode: false,
			variableWidth: true,
			arrows: false
		});

	}
});

$(document).ready(function(){
	$(".navdown").click(function() {
		var a = $(this).attr('href');
		$('html,body').animate({
			scrollTop: $(a).offset().top},
			'slow');
	});
});

$(document).ready(function(){
	/*Change height fit screen*/
	/*Change height fit screen*/
	/*Change height fit screen
	$(".map").width($(document).width()-435);*/
	var a =$(document).height();
	$("#result").height($(document).height()-115);
	$("#result").css('display','block');
	$(".map").height($(document).height()-115);
	$(".resultListing").height($(document).height() - (115 + $('.resultTop').height() + $('.resultIngo').height()) - 46);
	$(".filterPanel").height($(".resultListing").height() + $('.resultIngo').height() + 36);
	$(".holderContent").height($(".filterPanel").height() - 60);
	$(window).resize(function(){
        $(".map").height($(document).height()-115);
		$("#result").height($(document).height()-115);
		$(".resultListing").height($(document).height() - (115 + $('.resultTop').height() + $('.resultIngo').height()) - 46);
		$(".filterPanel").height($(".resultListing").height() + $('.resultIngo').height() + 36);
		$('.filterPanel').css('left',$('.resultPanel').offset().left);
		$('.filterPanel').css('width',$('.resultPanel').width());
		$(".holderContent").height($(".filterPanel").height() - 60);
		/*$(".map").width($(document).width()-435);*/
		$('.expandBtn').css('top',$('.filterBar').offset().top);
		$('.expandBtn').css('left',$('.filterBar').offset().left-84);
		$('#menu').next().css('top',$('#menu').offset().top+24);
		$('#menu').next().css('left',$('#menu').offset().left-64);
		$('#user').next().css('top',$('#menu').offset().top+24);
		$('#user').next().css('left',$('#menu').offset().left-64);
    });
	
	
	/*Change height fit screen*/
	/*Change height fit screen*/
	/*Change height fit screen*/
	
	/*set position of expand button*/
	$('.expandBtn').css('top',$('.filterBar').offset().top);
	$('.expandBtn').css('left',$('.filterBar').offset().left-84);
	/*set position of expand button*/
});

$(document).ready(function(){
	/*Show filter for maps*/
	$('html').click(function() {
			$('.filterPanel').hide(); 
			$('.sortPanel').hide(); 
			$('.submenu').hide();  
			$('.hintBox').hide();  
	});
 
	$('#filterBtn').click(function(event){
		event.stopPropagation();
	});	
	
	$('.test').click(function(event){
		event.stopPropagation();
	});
	
	$('.filterPanel').click(function(event){
		event.stopPropagation();
	});
	
	$('#filterBtn').click(function(){
		$('.filterPanel').css('top',$('#filterBtn').offset().top + $('#filterBtn').height() + 5);
		$('.filterPanel').css('left',$('.resultPanel').offset().left);
		$('.filterPanel').css('width',$('.resultPanel').width());
		$('.filterPanel').toggle();
		$('.sortPanel').hide();
	});
	
	$('#sortBtn').click(function(event){
		event.stopPropagation();
	});
	
	
	$('#sortBtn').click(function(){
		$('.sortPanel').css('top',$('#sortBtn').offset().top + $('#sortBtn').height() + 5);
		$('.sortPanel').css('left',$('#sortBtn').offset().left-70);
		$('.filterPanel').hide();
		$('.sortPanel').toggle();
	});
	
	$('.closeFilter').click(function(){
		$('.filterPanel').hide();
	});
	/*Show filter for maps*/
});

$(document).ready(function(){
		
	/*show scroll to top when scroll*/
	window.onscroll = function() {scrollFunction()};

	function scrollFunction() {
		if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
			$('.gottopping').show();
		} else {
			$('.gottopping').hide();
		}
	}
	/*show scroll to top when scroll*/
	
	$('.gottopping').click(function(){
		jQuery('html,body').animate({scrollTop:0},800);
	});

	
	$('.hideNoti').click(function(){
		$('.hideNoti').parent(this).toggle();
	});
	
	
	$('#lang').click(function(){
		$('#menuLang').toggle();
		
	});
	
	$('#menuLang').click(function(){
		$('#menuLang').toggle();
	});
	
	$("#companyToggle").click(function(){
		$("#companyPanel").show();
		$("#personalPanel").hide();
	});
	
	$("#personalToggle").click(function(){
		
		$("#companyPanel").hide();
		$("#personalPanel").show();
	});
	
	
	$('html').click(function() {
   		$('#user').next().hide();
   		$('#menu').next().hide();
	});
	
	$('#user').click(function(event){
		 event.stopPropagation();
   		$('#menu').next().hide();
	});
	
	$('#user').click(function(){
		var a = $('#user').next();
		if($('.topNav').width() <= 1366)
		{
			a.css('top',$('#user').offset().top + $('#user').height() + 5);
			a.css('right',10);
			a.css('left','auto');
		}
		else
		{	
			a.css('top',$('#user').offset().top + $('#user').height() + 5);
			a.css('left',$('#user').offset().left-64);
		}
		a.toggle();
	});
	
	
	$('#menu').click(function(event){
		 event.stopPropagation();
   		$('#user').next().hide();
	});
	
	$('#menu').click(function(){
		var a = $('#menu').next();
		if($('.topNav').width() <= 1366)
		{
			a.css('top',$('#menu').offset().top + $('#menu').height() + 5);
			a.css('right',10);
			a.css('left','auto');
		}
		else
		{	
			a.css('top',$('#menu').offset().top + $('#menu').height() + 5);
			a.css('left',$('#menu').offset().left-64);
		}
		a.toggle();
	});

	$('.customCard').click(function(){
		if($(this).hasClass('expandCustomCard'))
		{
			$(this).removeClass('expandCustomCard');
		}
		else
		{
			$(this).addClass('expandCustomCard');
		}
	});
	
	
	/*cut down the content of notification to match 85 characters*/
	/*cut down the content of notification to match 85 characters*/
	/*cut down the content of notification to match 85 characters*/
	function cutDownLengthOfNoti(){
		var n = $(".notiItemContent h7").length;
		for(i = 0; i<n ;i++)
		{
			var n = $(".notiItemContent h7").eq(i).text().length;
			if(n > 85)
			{
				var subs = $(".notiItemContent h7").eq(i).text().substr(0,82) + ".....";
				$(".notiItemContent h7").eq(i).text(subs);
			}
		}
	}
	
	cutDownLengthOfNoti();
	
	/*cut down the content of notification to match 85 characters*/
	/*cut down the content of notification to match 85 characters*/
	/*cut down the content of notification to match 85 characters*/
	/*cut down the content of notification to match 85 characters*/
	
	
	
	
	/*running number for homepage*/
	/*running number for homepage*/
	/*running number for homepage*/
	/*running number for homepage*/
	/*running number for homepage*/
	var display1 = document.getElementById("count01");
	var number1 = {param:0};
	var value1= document.getElementById("count01").getAttribute("value-to");
	
	var display2 = document.getElementById("count02");
	var number2 = {param:0};
	var value2= document.getElementById("count02").getAttribute("value-to");
	
	var display3 = document.getElementById("count03");
	var number3 = {param:0};
	var value3= document.getElementById("count03").getAttribute("value-to");
	
	var display4 = document.getElementById("count04");
	var number4 = {param:0};
	var value4= document.getElementById("count04").getAttribute("value-to");	
	
	var options = {
		useEasing: true,
		useGrouping: true,
		separator: ',',
		decimal: '.',
	};
	var companies = new CountUp('count01',0, value1, 0, 5, options);
	
	var cities = new CountUp('count02',0, value2, 0, 5, options);
	
	var searched = new CountUp('count03',0, value3, 0, 5, options);
	
	var totalUser = new CountUp('count04',0, value4, 0, 5, options);
	
		$(window).scroll(function() {
			var height = $(window).scrollTop();
			var topPosition = $('.staContent').offset().top;
			if(height  >= topPosition) {
				// do something
				totalUser.start();
				searched.start();
				cities.start();
				companies.start();
			}
		});
	/*running number for homepage*/
	/*running number for homepage*/
	/*running number for homepage*/
	/*running number for homepage*/
	
});
$(document).ready(function(){
	$('.imgFB1').click(function(){
		$("#f1").attr('checked','checked');
		$("#f2").removeAttr('checked');
		$("#f3").removeAttr('checked');
		$("#f4").removeAttr('checked');
		$("#f5").removeAttr('checked');
	});
	
	$('.imgFB2').click(function(){
		$("#f2").attr('checked','checked');
		$("#f1").removeAttr('checked');
		$("#f3").removeAttr('checked');
		$("#f4").removeAttr('checked');
		$("#f5").removeAttr('checked');
	});
	
	$('.imgFB3').click(function(){
		$("#f3").attr('checked','checked');
		$("#f1").removeAttr('checked');
		$("#f2").removeAttr('checked');
		$("#f4").removeAttr('checked');
		$("#f5").removeAttr('checked');
	});
	
	$('.imgFB4').click(function(){
		$("#f4").attr('checked','checked');
		$("#f1").removeAttr('checked');
		$("#f3").removeAttr('checked');
		$("#f2").removeAttr('checked');
		$("#f5").removeAttr('checked');
	});
	
	$('.imgFB5').click(function(){
		$("#f5").attr('checked','checked');
		$("#f1").removeAttr('checked');
		$("#f3").removeAttr('checked');
		$("#f4").removeAttr('checked');
		$("#f2").removeAttr('checked');
	});
	
	$('.fbCate1').click(function(){
		$("#c1").removeAttr('checked');
		$("#c2").removeAttr('checked');
		$("#c3").removeAttr('checked');
		$("#c1").attr('checked','checked');
	});
	
	$('.fbCate2').click(function(){
		$("#c1").removeAttr('checked');
		$("#c2").removeAttr('checked');
		$("#c3").removeAttr('checked');
		$("#c2").attr('checked','checked');
	});
	
	$('.fbCate3').click(function(){
		$("#c1").removeAttr('checked');
		$("#c2").removeAttr('checked');
		$("#c3").removeAttr('checked');
		$("#c3").attr('checked','checked');
	});

	/* function copy to clipboard */
	function copyToClipboard(element) {
		var $temp = $("<input>");
		$("body").append($temp);
		$temp.val($(element).html()).select();
		document.execCommand("copy");
		$temp.remove();
	  }

	function showNoti(element){
		$('.notification').css('position','absolute');
		$('.notification').css('height','60px');
		$('.notification').css('top',element.offset().top+30);
		$('.notification').css('left',element.offset().left);
		$('.notification').toggle();
		setTimeout(function() {
			$(".notification").fadeOut();
		  }, 1500);
	}

	$('.copyToClipboard').click(function(){
		copyToClipboard('#emailSign');
		showNoti($('.copyToClipboard'));
	});

	$('.testupdatenamecard').click(function(){
		if($('.downloadNameCard').hasClass('isDisabled'))
		{
			$('.downloadNameCard').removeClass('isDisabled');
		}
		else
		{
			$('.downloadNameCard').addClass('isDisabled');
		}
		if($('.copyToClipboard').hasClass('isDisabled'))
		{
			$('.copyToClipboard').removeClass('isDisabled');
		}
		else
		{
			$('.copyToClipboard').addClass('isDisabled');
		}
		
		$('.imgNameCard').toggle();
		$('.emailSign').toggle();
		$('.uploadNameCard').toggle();
		$('.uploadEmailSign').toggle();
	});

});

$(document).ready(function(){   
	$('.featureProductItem').click(function(){
		var a = $(this).children("a").attr("data-target");
		var b= a + ' .topImgGalleryProduct';
		var c= a + ' .botImgGalleryProduct';

		var count = $(b + ' .itemGal01').length;
		if(count > 1)
		{
			$(a + ' .topImgGalleryProduct').slick({
				autoplay: false,
				centerMode: false,
				arrows:false,
				slidesToShow: 1,
				slidesToScroll: 1,
				asNavFor: c
			});	
			
			$(a + ' .botImgGalleryProduct').slick({
				autoplay: true,
				centerMode: true,
				arrows:false,
				variableWidth:true,
				focusOnSelect: true,
				infinite: false,
				asNavFor: b
			});
		}
	});
	
});

$(document).ready(function(){ 
	
	$('.searchNearByExpand').click(function(){
		var a = $(".nearBy").css('margin-left');
		$('.searchNearByExpand').removeAttr('style');
		if(a=="0px")
		{
			$(".nearBy").animate({marginLeft: "-410"});
			$('.searchNearByExpand img').css('transform','rotate(180deg)');
		}
		else
		{
			$(".nearBy").animate({marginLeft: "0"});
			$('.searchNearByExpand img').css('transform','rotate(0deg)');
		}
		
	});
});