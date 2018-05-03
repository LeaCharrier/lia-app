// jQuery(document).ready(function($) {

// });
(function () {
    var links = document.querySelectorAll('.listCours__links a')
    var pages = document.querySelectorAll('.page');

    for (let i = 0; i < links.length; i++) {
        let link = links[i];
        link.addEventListener('click', function (e) {
            e.preventDefault();
            for (let b = 0; b < pages.length; b++) {
                pages[b].classList.remove('activePage');
            }
            pages[i + 1].classList.add('activePage');
        });
    }
})();


(function () {

    addEvent('button__sound', 'button__sound--soundOff');
    addEventAll('button__choise', 'button__choise--selected');


    function addEventAll(classe, addClass) {
        let classeNew = '.' + classe;
        let elm = document.querySelectorAll(classeNew);
        for (let i = 0; i < elm.length; i++) {
            elm[i].addEventListener('click', function (e) {
                for (let b = 0; b < elm.length; b++) {
                    elm[b].classList.remove(addClass);
                }
                elm[i].classList.add(addClass);
                verifAnswer(elm[i]);
            });
        }
    }


    function addEvent(classe, toogleClass) {
        let classeNew = '.' + classe;
        let elm = document.querySelector(classeNew);
        elm.addEventListener('click', function (e) {
            elm.classList.toggle(toogleClass);
        })
    }

    function verifAnswer(elem) {
        var attr = elem.querySelector('span:last-of-type').getAttribute('data-attr');
        var nextStepButton = document.getElementById('next-step');
        if (attr === "true") {
            var displayedElement = document.querySelector('.answerReponse__good');
            var displayedShape = document.querySelector('.answerReponse__validate');

        }
        else {
            var displayedElement = document.querySelector('.answerReponse__wrong');
            let answer = displayedElement.querySelector('.answerReponse__element');
            var displayedShape = document.querySelector('.answerReponse__cross');
            let contentGoodAnswer = document.querySelector('.contentExercice__list span[data-attr="true"').innerText;
            answer.innerText = contentGoodAnswer;
        }
        displayedShape.classList.add('active');
        displayedElement.style.display = 'block';
        nextStepButton.disabled = false;
    }

})();
