
'use strict';

app.directive('scrollDirective',function($timeout, $routeParams, $location, $window){
    return {
      restrict: 'AE',
      scope: true,
      link: function(scope,elem,attrs) {
        //angular.element($window).unbind("scroll");
        if($('#top-college-pic').height()){
          attrs.extraOffset=String('-'+($('#top-college-pic').height()+($('#top-college-pic').height()/100)*13));
          // console.log('ChangedExtraOffset');
        }
        if($location.path() == '/about'){
          if($routeParams.tab) {
            scope.tab = $routeParams.tab;
            if(scope.tab==='about'){
              attrs.targetScroll='#sales-content';
            }
            else{
              attrs.targetScroll='#'+scope.tab+'-content'; 
            }
            attrs.elems='#about-nav:z,#sidebar-'+scope.tab+':c^m';
            attrs.offsetElem='sidebar-'+scope.tab;
            scope.$applyAsync();
          }
        }
        // angular.element($window).unbind("scroll");
        angular.element($window).bind("scroll", function() {
          // console.log($location.path());
          if($('#top-college-pic').height()){
            attrs.extraOffset=String('-'+($('#top-college-pic').height()+($('#top-college-pic').height()/100)*13));
            // console.log('ChangedExtraOffset');
          }
          // console.log(attrs.extraOffset);
          if($location.path() == '/about'){
            /*data-elems="#about-nav:z,#sidebar-about:c^m" data-target-scroll="#sales-content" data-target-class="scrollFixed" data-offset-elem="#sidebar-about" data-extra-offset="50" id="about-top-nav"*/
            if($routeParams.tab) {
              scope.tab = $routeParams.tab;
              scope.$applyAsync();
              if(scope.tab==='about'){
                attrs.targetScroll='#sales-content';
                attrs.extraOffset="40";
              }
              else{
                attrs.targetScroll='#'+scope.tab+'-content'; 
                attrs.extraOffset="65";
              }
              attrs.elems='#about-nav:z,#sidebar-'+scope.tab+':c^m';
              attrs.offsetElem='sidebar-'+scope.tab;
              attrs.targetClass='scrollFixed';
            }
          }
          else
          if($location.path() == '/search'){
            /*data-elems="#search-sidebar:p^m" data-target-scroll="#search-results-content" data-target-class="" data-offset-elem="#search-sidebar" data-extra-offset="100"*/
            attrs.elems="#search-sidebar:p^m";
            attrs.offsetElem="#search-sidebar";
            attrs.targetScroll='#search-results-content';
            attrs.extraOffset="100";
          }
          else
          if($location.path() == '/contact'){
            attrs.elems=".contact-cont:p^m^t";
            attrs.targetScroll=".map-cont";
            attrs.offsetElem=".contact-cont";
            attrs.extraOffset="100";
            // console.log('GotHere');
            /*data-elems=".contact-cont:p^m^t" data-target-scroll=".map-cont" data-target-class="" data-offset-elem=".contact-cont" data-extra-offset="100"*/
          }
          else
          if($location.path() == '/dashboard'){
            // console.log('OnDashboard');
            /*data-elems="#student-top-bar-for-directive:pf^t^z^top^w^blank" data-target-scroll="#topCoverPic" data-target-class="" data-offset-elem="#student-top-bar-for-directive" data-extra-offset="-48" data-blank-space="#extra-div-by-animesh"*/
            attrs.elems='#student-top-bar-for-directive:pf^t^z^top^w^blank';
            attrs.targetScroll='#topCoverPic';
            attrs.offsetElem='#student-top-bar-for-directive';
            attrs.extraOffset='-148';
            attrs.blankSpace='#extra-div-by-animesh';
          }
          else
          if($location.path().indexOf('/college-profile/simplelogin:')+1){
            // console.log('GotIn');
            /*data-elems="#extra-div-by-animesh:pf^top^left" data-target-scroll="#top-college-pic" data-target-class="" data-offset-elem="#extra-div-by-animesh" data-extra-offset="1000" data-blank-space="#extra-div-by-animesh"*/
            attrs.targetScroll='.college-pic';
            attrs.offsetElem='#extra-div-by-animesh';
            attrs.extraOffset='-325';
            attrs.blankSpace='#extra-div-by-animesh';
            if($(window).scrollTop()>240+$('.searchpg-content-row').height()-$('#extra-div-by-animesh').height()){//0.416*$(document).height()){
              attrs.elems='#extra-div-by-animesh:pf^top^left,#extra-div-by-animesh:p^m^z';
              attrs.extraOffset='-340';
            }//String(410+$('.searchpg-main-content').height()-$('#extra-div-by-animesh').height())
            else{
              attrs.elems='#extra-div-by-animesh:p^z,#extra-div-by-animesh:pf^top^left';
              $('#extra-div-by-animesh').css('marginTop','');
            }
          }
          if($location.path() == '/about'||$location.path() == '/search'||$location.path() == '/contact'||$location.path() == '/dashboard'||$location.path().indexOf('/college-profile/simplelogin:')+1){
            var scrollPos=$(window).scrollTop();
            var scrollPosTarget2=$(attrs.targetScroll);
            var totalHeight=$(document).height();
            var offsetElem=$(attrs.offsetElem).height();
            var transDoneTmpInitial=false;
            var transDoneTmpFinal=false;
            var extraOffset=Number(attrs.extraOffset);
            if(offsetElem<50){
              offsetElem=50;
            }
            var scrollFactor=(scrollPosTarget2.position().top+scrollPosTarget2.height()-offsetElem-extraOffset-100)/totalHeight;
            var classToRemove=attrs.targetClass;
            var allElems=attrs.elems;
            // console.log(scrollPosTarget2.position().top+scrollPosTarget2.height());
            // console.log(scrollPos+'----'+totalHeight);
            allElems=allElems.split(',');
            for(var i=0;i<allElems.length;i++){
              allElems[i]=allElems[i].split(':')
              allElems[i][1]=allElems[i][1].split('^');
            }
            // console.log(allElems);
            // console.log('scrollPos'+scrollPos);
            // console.log('scrollFactor'+scrollFactor);
            // console.log('totalHeight'+totalHeight);
            // console.log('extraOffset'+extraOffset);
            if(scrollPos>=scrollFactor*totalHeight){
              // console.log('GotInForRemovingSticked');
              for(var element in allElems){
                // console.log(allElems[element]);
                for(var property in allElems[element][1]){
                  // console.log(allElems[element][0]);
                  if(allElems[element][1][property]==='c'){
                    $(allElems[element][0]).removeClass(classToRemove);
                  }
                  else
                  if(allElems[element][1][property]==='m'){
                    if($location.path().indexOf('/college-profile/simplelogin:')+1){
                      $(allElems[element][0]).css('marginTop',(130+$('.searchpg-content-row').height()-$('#extra-div-by-animesh').height()));
                    }
                    else{
                      $(allElems[element][0]).css('marginTop',(scrollFactor*totalHeight)+"px");
                    }
                  }
                  else
                  if(allElems[element][1][property]==='z'){
                    $(allElems[element][0]).css('zIndex','99');
                  }
                  else
                  if(allElems[element][1][property]==='p'){
                    $(allElems[element][0]).css('position','absolute');
                  }
                  else
                  if(allElems[element][1][property]==='t'&&!transDoneTmpInitial){
                    $(allElems[element][0]).css('transition','all 0s');
                    $(allElems[element][0]).css('-webkit-transition','all 0s');
                    $(allElems[element][0]).css('-moz-transition','all 0s');
                    $(allElems[element][0]).css('-ms-transition','all 0s');
                    $(allElems[element][0]).css('-o-transition','all 0s');
                    transDoneTmpInitial=true;
                    transDoneTmpFinal=false;
                    $timeout(function(){
                      $(allElems[element][0]).css('transition','');
                      $(allElems[element][0]).css('-webkit-transition','');
                      $(allElems[element][0]).css('-moz-transition','');
                      $(allElems[element][0]).css('-ms-transition','');
                      $(allElems[element][0]).css('-o-transition','');
                    },50);
                  }
                  else
                  if(allElems[element][1][property]==='pf'){
                    //console.log('foundPF');
                    $(allElems[element][0]).css('position','fixed');
                  }
                  else
                  if(allElems[element][1][property]==='top'){
                    //console.log('foundPF');
                    if($location.path().indexOf('/college-profile/simplelogin:')+1){
                      $(allElems[element][0]).css('top','200px');
                    }
                    else{
                      $(allElems[element][0]).css('top','60px'); 
                    }
                  }
                  else
                  if(allElems[element][1][property]==='left'){
                    //console.log('foundPF');//165.7168950977768
                    $(allElems[element][0]).css('right','2.05em');
                    $(allElems[element][0]).css('padding-right','28px');
                    $(allElems[element][0]).css('width','31.87686196623635%');//(203.8127330512887*$(document).height()/$(document).width())+'px');//'32%');
                  }
                  else
                  if(allElems[element][1][property]==='w'){
                    //console.log('foundPF');
                    $(allElems[element][0]).css('width','100%');
                  }
                  else
                  if(allElems[element][1][property]==='blank'){
                    $(attrs.blankSpace).css('height','48px');
                  }
                }
              }
            }
            else{
              // console.log('GotInForAddingSticked');
              for(var element in allElems){
                // console.log(allElems[element]);
                for(var property in allElems[element][1]){
                  // console.log(allElems[element][0]);
                  if(allElems[element][1][property]==='c'){
                    $(allElems[element][0]).addClass(classToRemove);
                  }
                  else
                  if(allElems[element][1][property]==='m'){
                    $(allElems[element][0]).css('marginTop',"");
                  }
                  else
                  if(allElems[element][1][property]==='z'){
                    $(element[0]).css('zIndex','');
                  }
                  else
                  if(allElems[element][1][property]==='p'){
                    $(allElems[element][0]).css('position','');
                  }
                  else
                  if(allElems[element][1][property]==='t'&&!transDoneTmpFinal){
                    $(allElems[element][0]).css('transition','all 0s');
                    $(allElems[element][0]).css('-webkit-transition','all 0s');
                    $(allElems[element][0]).css('-moz-transition','all 0s');
                    $(allElems[element][0]).css('-ms-transition','all 0s');
                    $(allElems[element][0]).css('-o-transition','all 0s');
                    transDoneTmpFinal=true;
                    transDoneTmpInitial=false;
                    $timeout(function(){
                      $(allElems[element][0]).css('transition','');
                      $(allElems[element][0]).css('-webkit-transition','');
                      $(allElems[element][0]).css('-moz-transition','');
                      $(allElems[element][0]).css('-ms-transition','');
                      $(allElems[element][0]).css('-o-transition','');
                    },50);
                  }
                  else
                  if(allElems[element][1][property]==='pf'){
                    //console.log('foundPF');
                    $(allElems[element][0]).css('position','');
                  }
                  else
                  if(allElems[element][1][property]==='top'){
                    //console.log('foundPF');
                    $(allElems[element][0]).css('top','');
                  }
                  else
                  if(allElems[element][1][property]==='left'){
                    //console.log('foundPF');
                    $(allElems[element][0]).css('right','');
                    $(allElems[element][0]).css('padding-right','');
                    $(allElems[element][0]).css('width','');
                  }
                  else
                  if(allElems[element][1][property]==='w'){
                    //console.log('foundPF');
                    $(allElems[element][0]).css('width','100%');
                  }
                  else
                  if(allElems[element][1][property]==='blank'){
                    $(attrs.blankSpace).css('height','');
                  }
                }
              /*for(element in allElems){
                console.log($(allElems[i]).hasClass('scrollFixed'));
                $('.'+element).addClass('scrollFixed');
                $('.'+element).css('marginTop',"0px");
              }*/
              }
            }
        }
        });
      }
    }
  } ) ; 