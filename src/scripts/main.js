// jQuery(document).ready(function($) {

// });

(function () {

    addEvent('button__sound', 'button__sound--soundOff');
    addEventAll('button__choise', 'button__choise--selected', true);


    function addEventAll(classe, addClass, check) {
        let classeNew = '.' + classe;
        let elm = document.querySelectorAll(classeNew);
        for (let i = 0; i < elm.length; i++) {
            elm[i].addEventListener('click', function (e) {
                for (let b = 0; b < elm.length; b++) {
                    if (check && elm[b].classList.contains(addClass))
                        return;
                    else
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
            nextStepButton.classList.add('button__classic--good');
        }
        else {
            var displayedElement = document.querySelector('.answerReponse__wrong');
            let answer = displayedElement.querySelector('.answerReponse__element');
            var displayedShape = document.querySelector('.answerReponse__cross');
            let contentGoodAnswer = document.querySelector('.contentExercice__list span[data-attr="true"').innerText;
            answer.innerText = contentGoodAnswer;
            nextStepButton.classList.add('button__classic--wrong');
        }
        displayedShape.classList.add('active');
        displayedElement.style.display = 'block';
        nextStepButton.disabled = false;
    }
})();

// on fait notre IIFE en passant la window en paramètre
(function (w) {
    console.log('coin');

    // on définit nos routes vides
    var routes = [];

    // on définit une route 404
    var route404;

    // on définit les links
    var $links;

    w.Router = {
        on: addRoute,
        start: start,
        refreshLinks: refreshLinks
    };

    function start() {
        // on écoute si l'historique change et on gère
        w.addEventListener('popstate', matchAndHandleRoutes);
        // on établit les liens
        setLinks();
        // on essaye de matcher l'URL en cours
        matchAndHandleRoutes();

        // je return "this" pour pouvoir chainer sur le router
        // genre : Router.on(...).on(...).start()
        return this;
    }

    function setLinks() {
        // on récupère les liens
        $links = document.querySelectorAll('.router-link');

        // on converti on Array
        $links = Array.prototype.slice.call($links);
        // ou $links = Array.prototype.slice.apply($links);
        // ou $links = [].slice.apply($links);
        // ou $links = Array.apply(null, $links);

        $links.forEach(function ($link) {
            $link.addEventListener('click', handleLinkClick);
        });
    }

    function refreshLinks() {
        // si on n'a pas ecore de lien, on ne fait rien
        if (!$links) {
            return;
        }

        // on arrête d'écouter les clicks sur les anciens liens
        $links.forEach(function ($link) {
            $link.removeEventListener('click', handleLinkClick);
        });

        setLinks();
    }

    function handleLinkClick(event) {
        event.preventDefault();

        // on récupère l'URL actuel
        var currentPath = w.location.pathname;

        // ici, "this" représente l'élément en cours
        var href = this.getAttribute('href');

        // on navigue vers le href
        w.history.pushState(null, null, href);

        if (currentPath !== w.location.pathname) {
            // on essaye de matche la nouvelle URL
            // si l'URL a changé
            matchAndHandleRoutes();
        }
    }

    function matchAndHandleRoutes() {
        var hasMatched = false;
        var path = w.location.pathname;

        // Matcher les routes: finissant avec / (e.g '/test/')
        // et sans / (e.g '/test')
        if (path[path.length - 1] !== '/') {
            path += '/';
        }

        routes.forEach(function (route) {
            // Générer une regex en fonction du path de la route sauvegardée
            var regex = createRegexFromPath(route.path);

            // Tester la regex obtenue sur le path actuel
            if (regex.test(path)) {
                hasMatched = true;
                // Récupérer les paramètres de la route par rapport au path
                var parameters = getParametersFromPath(path, route.parameters);

                // Exécuter le handler de la route en lui passant les paramètres
                route.handler.apply(null, parameters);
            }
        });

        if (!hasMatched && typeof route404 === 'function') {
            route404();
        }
    }

    function addRoute(path, handler) {
        // on vérifie que :
        // - path est une string et qu'elle n'est pas vide
        // - handler est une fonction
        if (typeof path !== 'string') {
            throw 'PATH_NOT_STRING';
        } else if (path.length < 1) {
            throw 'PATH_EMPTY';
        } else if (typeof handler !== 'function') {
            throw 'HANDLER_NOT_FUNC';
        }

        // si notre route est une "catch all"
        // on enregistre juste la fonction en 404
        if (path === '*') {
            route404 = handler;
        } else {
            // si on n'a pas de slash, on ajoute
            if (path[0] !== '/') {
                path = '/' + path;
            }

            // Récupérer les paramètres de forme :nom dans le path
            var parameters = parsePathParams(path);

            // tout est bon on peut push
            routes.push({
                path: path,
                handler: handler,
                parameters: parameters
            });
        }

        // je return "this" pour pouvoir chainer sur le router
        // genre : Router.on(...).on(...).start()
        return this;
    }

    //
    function parsePathParams(path) {
        // Nettoyer le tableau des valeurs vides après le split des caractères "/"
        var pathArguments = cleanArray(path.split('/'));

        return pathArguments.reduce(function (accumulator, value, index) {
            if (value.indexOf(':') >= 0) {
                accumulator.push(index);
            }
            return accumulator;
        }, []);
    }

    // Récupérer les paramètres d'un path à partir des paramètres sauvés à l'initialisation de la route
    // (lors de l'exécution de la fonction addRoute / on)
    // routeParameters format ["indexInPath:Integer": "value:String"]
    function getParametersFromPath(path, routeParameters) {
        var pathSplit = cleanArray(path.split('/'));
        return routeParameters.reduce(function (accumulator, value) {
            accumulator.push(pathSplit[value]);
            return accumulator;
        }, []);
    }

    // 'test/\(\\w+)\x2F$'
    // '(\\w+)\x2Ftasks/(\\w+)/$'
    function createRegexFromPath(path) {
        var pathSplit = cleanArray(path.split('/'));
        var reg = ['^/'];

        // Loop on Uri parameters to build regex according to whether parameter is dynamic or static
        pathSplit.forEach(function (param) {
            return param.indexOf(':') >= 0 ? reg.push('(\\w+)/') : reg.push(param + '/');
        });

        // checks that "String Ends with"
        reg.push('$');
        var regexString = reg.join('');
        return RegExp(regexString);
    }

    // Récupérer un nouveau tableau, dont les valeurs 'vides' ont été supprmé
    function cleanArray(array) {
        return array.filter(function (element) {
            return element ? true : false
        });
    }

})(window);

// init router

Router.on('/exercice/:id', function (id) {
    let param = 'exercice-' + id;
    displayPage(param);
    let button = document.getElementById('next-step');
    button.addEventListener('click', function (ev) {
        ev.preventDefault();
        page.classList.add('page--badge');
        button.classList.remove('button__classic--wrong', 'button__classic--good');
    })
});
Router.on('/', function () {
    displayPage('choiceGroup');
});
Router.on('/choiceChapter', function () {
    displayPage('choiceChapter');
});
Router.on('/choiceExercice', function () {
    displayPage('choiceExercice');
});
Router.start();

function displayPage(id) {
  let pages = document.querySelectorAll('.page');
  for (let i = 0; i < pages.length; i++) {
      pages[i].classList.remove('page--active');
  }
    let bob = document.getElementById(id);
    bob.classList.add('page--active');
}
