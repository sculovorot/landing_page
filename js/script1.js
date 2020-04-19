window.addEventListener('DOMContentLoaded', () => {

    'use strict';
    let tab = document.querySelectorAll('.info-header-tab'),
        info = document.querySelector('.info-header'),
        tabContent = document.querySelectorAll('.info-tabcontent');

    function hideTabContent(a = 1) {
        for (let i = a; i < tabContent.length; i++) {
            tabContent[i].classList.remove('show');
            tabContent[i].classList.add('hide');
        }
    }

    hideTabContent();

    function showTabContent(b) {
        if (tabContent[b].classList.contains('hide')) {
            tabContent[b].classList.remove('hide');
            tabContent[b].classList.add('show');
        }
    }

    info.addEventListener('click', (event) => {
        let target = event.target;
        if (target && target.classList.contains('info-header-tab')) {
            for(let i = 0; i < tab.length; i++) {
                if (target == tab[i]) {
                    hideTabContent(0);
                    showTabContent(i);
                    break;
                }
            }
        }

    });

    //timer
    let dedline = '2020-03-31';

    function getTimeRemaining(endtime) {
        let t = Date.parse(endtime) - Date.parse(new Date()),
            seconds = Math.floor( (t/1000) % 60),
            minutes = Math.floor( (t/1000/60) % 60),
            hours = Math.floor( (t/(1000*60*60)));

        return {
            'total' : t,
            'hours' : hours,
            'minutes' : minutes,
            'seconds' : seconds
        };
    }

    function setClock (id, endtime) {
        let timer = document.getElementById(id),
            hours = timer.querySelector('.hours'),
            minutes = timer.querySelector('.minutes'),
            seconds = timer.querySelector('.seconds'),
            timeInterval = setInterval(updateClock, 1000);

        function updateClock() {
            let t = getTimeRemaining(endtime);

            function addZero (num) {
                if (num <= 9) {
                    return '0' + num;
                } else return num;
            };

            hours.textContent = addZero(t.hours);
            minutes.textContent = addZero(t.minutes);
            seconds.textContent = addZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
                hours.textContent = '00';
                minutes.textContent = '00';
                seconds.textContent = '00';
            }
        }
        
    }

    setClock('timer', dedline);

    //modal

    let more = document.querySelector('.more'),
        overlay = document.querySelector('.overlay'),
        close = document.querySelector('.popup-close');
    
    more.addEventListener('click', function() {
        overlay.style.display = 'block';
        this.classList.add('more-splash');
        document.body.style.overflow = 'hidden';
    });

    close.addEventListener('click', function() {
        overlay.style.display = 'none';
        more.classList.remove('more-splash');
        document.body.style.overflow = '';
    });


   // form

   let message = {
    loading: 'Загрузка...',
    success: 'Спасибо! Скоро мы с вами свяжемся!',
    failure: 'Что-то пошло не так...'
    };

let form = document.getElementsByClassName('main-form')[0],
    formBottom = document.getElementById('form'),
    input = document.getElementsByTagName('input'),
    statusMessage = document.createElement('div');
    statusMessage.classList.add('status');

function sendForm(elem) {
    elem.addEventListener('submit', function (e) {
        e.preventDefault();
        elem.appendChild(statusMessage);
        let formData = new FormData(elem);

        function postData(data) {
            return new Promise(function(resolve, reject) {
                let request = new XMLHttpRequest();
                request.open ('POST', 'server.php');
                request.setRequestHeader('Content-type', 'applicaation/json; charset=utf-8');

                request.onreadystatechange = function () {
                   if (request.readyState < 4){
                       resolve()
                       console.log("успешно");
                   } else if (request.readyState === 4){
                       if (request.status == 200 && request.status <300) {
                       resolve()
                       console.log("Спасибо");
                   } 
                   else {
                       reject()
                       console.log("странно...");
                   } 
                }  
                }
                request.send(data);
            })
            
        }
        function clearInput(){
           for (let i = 0; i < input.length; i++) {
                input[i].value = '';
            } 
        }
        postData(formData)
            .then ( ()=> statusMessage.innerHTML = message.loading )
            .then (()=> statusMessage.innerHTML = message.success)
           
            .catch (()=> statusMessage.innerHTML = message.failure)
            .then(clearInput())
    });
    }
    sendForm(form);
    sendForm(formBottom);

    //slider

    let sliderIndex = 1,                                         //параметр текущего слайда
        slides = document.querySelectorAll('.slider-item'),   //geting slides from the page
        prev = document.querySelector('.prev'),                 //getting arrows
        next = document.querySelector('.next'),
        dotsWrap = document.querySelector('.slider-dots'),      //getting dots
        dots = document.querySelectorAll('.dot');

    showSlides(sliderIndex);

    function showSlides (n) {                                       //function show slides

        if (n > slides.length) {                                   //условие переключения слайдов
            sliderIndex = 1;
        }
        if (n<1) {
            sliderIndex = slides.length;
        }

        slides.forEach((item) => item.style.display = 'none');       //all slides are disabled
        // for (let i=0; i < slides.length; i++) {                   //эти 2 записи абсолютно идентичны
        //     slides[i].style.display = 'none';
        // }
        dots.forEach((item) => item.classList.remove('dot-active'));  //убираем классы с точек
        slides[sliderIndex - 1].style.display = 'block';             //show one slide
        dots[sliderIndex - 1].classList.add('dot-active');            //show dot
        
    }

    function plusSlides (n) {                                         //ф-ия которая увеличивает параметр slideIndex
        showSlides(sliderIndex +=n);                                  //сразу вызываем ф-ию с новым аргументом
    }
    function currentSlide(n) {                                        //для показа конкретного слайда (когда кликаем на точку n)                               
        showSlides(sliderIndex = n);
    }
    
    prev.addEventListener('click', function() {                        //реалинуем стрелочку "назад"
        plusSlides(-1);
    });
    next.addEventListener('click', function() {                        //стрелочка вперед
        plusSlides(1);
    });

    dotsWrap.addEventListener('click', function(event) {               //реализуем точки используя делегирование
        for (let i = 0; i < dots.length +1; i++) {
            if (event.target.classList.contains('dot') && event.target == dots[i-1]) {
                currentSlide(i);                                          //при клмке в 4-ю точку открываем 4-й слайд
            }
        }
    })
});
