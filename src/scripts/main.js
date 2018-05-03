// jQuery(document).ready(function($) {
    
// });
(function () {

    addEvent('button__sound','button__sound--soundOff');
    addEventAll('button__choise','button__choise--selected');



    function addEventAll (classe, addClass) {
        let classeNew = '.' + classe;
        let elm = document.querySelectorAll(classeNew);
        for (let i = 0; i < elm.length; i++) {
            elm[i].addEventListener('click', function (e) {
                for (let b = 0; b < elm.length; b++) {
                    elm[b].classList.remove(addClass);
                }
                elm[i].classList.add(addClass);
            });
        }
    }


    function addEvent (classe, toogleClass) {
        let classeNew = '.' + classe;
        let elm = document.querySelector(classeNew);
        elm.addEventListener('click', function (e) {
            elm.classList.toggle(toogleClass);
        })
    }

})();
