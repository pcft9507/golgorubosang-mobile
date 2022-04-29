// 상단으로 이동
function goTop() {
  $('html').animate({
    scrollTop: 0
  })
}

// 모달 열기
function openModal(modalName) {
  console.log('openModal')
  $('html').addClass('ovh')
  $('.modal[data-modal="' + modalName + '"]').addClass('show')
  if (modalName == 'reception02') {
    $('.reception-form .form').css('overflow' , 'initial').css('overflow' , 'hidden')
  }
  // 병원찾기 모달일 경우는 지도보기 동적 생성
  if (modalName == 'hospital') {
    createMap ('hospital-map', '.modal-hospital .hospital-addr', '.modal-hospital .hospital-name')
  }
}

// 모달 닫기
function closeModal(modal) {
  $('.modal[data-modal=' + modal + ']').removeClass('show')
  if ($('.modal.show').length < 1) {
    $('html').removeClass('ovh')
  }
}

// textarea
$.fn.textArea = function () {
  var tAreaBody = []
  return this.each(function (i) {
    tAreaBody[i] = $(this)
    var textArea = tAreaBody[i].find('.textArea__text')
    var countChar = tAreaBody[i].find('.textArea__cntChar')
    var currentEl = countChar.find('.textArea__cntCurrent')
    var limitEl = countChar.find('.textArea__cntLimit')
    var limitNum = tAreaBody[i].data('limit')
    textArea.attr('maxlength', limitNum)
    limitEl.text(limitNum)
    textArea.on('keyup', function () {
      var textLeng = $(this).val().length
      currentEl.text(textLeng)
    })
  })
}

// formInp 
$.fn.formInpTxt = function () {
  var inpBody = Array
  return this.each(function (i) {
    inpBody[i] = $(this)
    var input = inpBody[i].children('.formInp__txt')
    var btnDel = inpBody[i].children('.js-del')
    input.on('keyup', function () {
      var txtLeng = $(this).val().length
      if (txtLeng > 0) {
        $(this).next('.formInp__del').show()
      } else {
        $(this).next('.formInp__del').hide()
      }
    })
  })
}

// 손해사 매칭 키워드 검색
$.fn.matchingSch = function () {
  var schBody = this
  var inpTxt = schBody.find('.schKey__inpTxt')
  var inpDel = schBody.find('.schKey__del')
  var submit = schBody.find('.schKey__btn')
  inpTxt.on('focus', function () {
    schBody.addClass('focus')
  })
  inpTxt.on('blur', function () {
    schBody.removeClass('focus')
  })
  inpTxt.on('keyup', function () {
    var thisVal = $(this).val()
    if (thisVal.length > 0) {
      inpDel.show()
    } else {
      inpDel.hide()
    }
  })
  inpDel.on('click', function () {
    inpTxt.val('')
    inpDel.hide()
  })
  submit.on('click', function () {
    console.log('키워드 검색 submit')
  })
}

// 텍스트 클립보드 복사
function copyText(element){
  var content = $(element).text()
  navigator.clipboard.writeText(content)
    .then(() => {
    console.log("복사성공")
  })
    .catch(err => {
    console.log('복사실패', err);
  })
  alert('복사되었습니다.')
}

// 카카오지도 1.요소, 2.도로명주소, 3.마커위에 인포윈도우
function createMap (mapEl, addr, infoWindow) {
  // 지도 실행 스크립트
  var mapContainer = document.getElementById(mapEl), // 지도를 표시할 div 
  mapOption = {
    center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표 아무곳이든 필수입력
    level: 4 // 지도의 확대 레벨
  };  

  // 도로명주소 - 데이터를 변수에 대입해도 됩니다.
  // const address = some data
  const address = $(addr).text()

  // 손해사정사 이름 - 데이터를 변수에 대입해도 됩니다.
  // const agentName = some data
  const infoName = $(infoWindow).text()

  // 지도를 생성합니다    
  var map = new kakao.maps.Map(mapContainer, mapOption); 

  // 주소-좌표 변환 객체를 생성합니다
  var geocoder = new kakao.maps.services.Geocoder();

  // 주소로 좌표를 검색합니다
  geocoder.addressSearch(address, function(result, status) {
    // 정상적으로 검색이 완료됐으면 
    if (status === kakao.maps.services.Status.OK) {
      var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
      // 결과값으로 받은 위치를 마커로 표시합니다
      var marker = new kakao.maps.Marker({
          map: map,
          position: coords
      });
      // 인포윈도우로 장소에 대한 설명을 표시합니다 (필요한 경우에만)
      var infowindow = new kakao.maps.InfoWindow({
          content: '<div class="info-window d-flex-c-c">' + infoName + ' 손해사정사</div>'
      });
      infowindow.open(map, marker);
      // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
      map.setCenter(coords);
    } 
  });      
}

// 드래그탭  
$.fn.swiperTab = function () {
  var swiperBody = []
  var swiperTabArr = []
  return this.each(function (i) {
    swiperBody[i] = $(this);
    var thisClass = swiperBody[i].attr('class');
    var tabItem = swiperBody[i].find('.swiper-slide');
    var tabBtn = swiperBody[i].find('.js-click-tab');
    swiperTabArr[i] = new Swiper ('.swiperTab', {
      slidesPerView: "auto",
      observer: true,
      slideToClickedSlide: true,
    });
    tabItem.eq(0).addClass('active')

    tabBtn.on('click', function () {
      var curIdx = swiperTabArr[i].activeIndex
      tabItem.removeClass('active')
      $(this).parent().addClass('active')
      setTimeout(function () {
        swiperTabArr[i].update();
      }, 300)
    })  
  })
}

// 게시판 리스트
$.fn.boardList = function () {
  var listBody = this
  var btnItem = listBody.find('.boardList__item')
  var btnOpen = listBody.find('.boardList__subject')
  var btnClose = listBody.find('.boardList__btnClose')
  btnOpen.on('click', function () {
    btnItem.removeClass('opened')
    $(this).parents('.boardList__item').addClass('opened')
  })
  btnClose.on('click', function () {
    $(this).parents('.boardList__item').removeClass('opened')
  })
}

// 문서 로드 후 실행
$(document).ready(function () {
  // GNB활성화
  if (typeof page != 'undefined') {
    if (page == 'home') {
      $('.quickMenu__item').eq(0).find('.quickMenu__txt').addClass('on')
    } else if (page == 'matching') {
      $('.quickMenu__item').eq(1).find('.quickMenu__txt').addClass('on')
    } else if (page == 'recommend') {
      $('.quickMenu__item').eq(2).find('.quickMenu__txt').addClass('on')
    } else if (page == 'case') {
      $('.quickMenu__item').eq(3).find('.quickMenu__txt').addClass('on')
    } else if (page == 'menu') {
      $('.quickMenu__item').eq(4).find('.quickMenu__txt').addClass('on')
    }
  }
  
})