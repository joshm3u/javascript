// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//

const MINUTES_IN_ONE_DAY = 1440;
const MINUTES_IN_ONE_HOUR = 60;

$(function() {
    /**
     * These fire when navbar collapsed menu is shown/hidden.
     * The dropdown-menus need to be hidden while the opening of the menu taking place (as to avoid strange transition behavior)
     * but then reset to display-block after to enable "show on hover"
     */
    $('nav').find(".navbar-collapse").first().on('shown.bs.collapse', function () {
        $("nav .navbar-collapse").addClass("overflow-visible-force");
        $(".navbar .dropdown-menu").addClass("display-block-force");
    })

    $('nav').find(".navbar-collapse").first().on('hide.bs.collapse', function () {
        $("nav .navbar-collapse").removeClass("overflow-visible-force");
        $(".navbar .dropdown-menu").removeClass("display-block-force");
    })

    if (matchMedia) {
        var toUncollapsedMediaQuery = window.matchMedia("(min-width: 1172px)");
        toUncollapsedMediaQuery.addListener(moveNavSearchToUncollapsedContainer);

        var toCollapsedXsMediaQuery = window.matchMedia("(min-width: 506px)");
        toCollapsedXsMediaQuery.addListener(moveNavSearchToXSCollapsedMenu);

        if ($(window).width() <= 506) {
           moveNavSearchToXSCollapsedMenu(toCollapsedXsMediaQuery);
        } else {
           moveNavSearchToUncollapsedContainer(toUncollapsedMediaQuery);
        }
    }

    // This triggers on a full page ready event -- if we use $(document).ready() 
    // we will still block the page onload here, which we do not want.
    // This function will lazy load any image with data-src set, most crucially,
    // the slow LSE image.
    $( window ).on( "load", () => {
        let imagesToLoad = document.querySelectorAll('img[data-src]');
        imagesToLoad.forEach((img) => {
            let newImage = img.cloneNode();
            newImage.removeAttribute('src');
            newImage.removeAttribute('data-src');

            // This will trigger once the image in the src attribute has loaded.
            newImage.onload = function() {
                // Replace the old image.
                img.parentNode.replaceChild(newImage, img);
            };
            newImage.setAttribute('src', img.getAttribute('data-src'));
        });
    });
});

/*
 * This handles moving the location of the navbar search when the navbar is collapsed
 */
function moveNavSearchToUncollapsedContainer(mq) {
    if (mq.matches) {
        $("#navbar-search").appendTo($("#navbar-search-uncollasped-container"));
    }   else {
        $("#navbar-search").appendTo($("#navbar-search-collasped-container"));
    }
}

/*
 * At extra small screen sizes, the moveNavSearchToUncollapsedContainer causes the nav search bar to
 * hide content. Even though we aren't optimizing MCM for these sizes, for belt/suspenders, move
 * nav search to collapsed menu at extra small screen sizes.
 */
function moveNavSearchToXSCollapsedMenu(mq) {
    if (mq.matches) {
        $("#navbar-search").appendTo($("#navbar-search-collasped-container"));

    } else {
        $("#navbar-search").appendTo($("#navbar-search-xs-collapsed-container"));
    }
}

function bindAlertCloseEvent() {
    $('.close-to-hide').click(function() {
        $(this).parent().hide();
    });
}

function isNullEmptyOrUndefined(valToCheck) {
    if (isNullOrUndefined(valToCheck)) {
        return true;
    }

    if (valToCheck === "") {
        return true;
    }

    return false;
}

function isNullOrUndefined(valToCheck) {
    if (typeof(valToCheck) === "undefined") {
        return true;
    }

    if (valToCheck === null) {
        return true;
    }

    return false;
}

function isNullOrUndefinedOrEmptyArray(valToCheck) {
    if (isNullOrUndefined(valToCheck)) {
        return true;
    }

    if (valToCheck.length === 0) {
        return true;
    }

    return false;
}

function preventSubmitOnEnterKeyPress() {
    $(".no-enter-submit").keypress(function(event){
        if (event.which == 13) {
            event.preventDefault()
        }
    });
}

/** http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport **/
function isElementInViewport (el) {

    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }

    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function isInt(n) {
   return n % 1 === 0;
}

function isValidUri(uri) {
    return /^[A-Za-z][A-Za-z0-9\+\.\-]*:([A-Za-z0-9\.\-_~:/\?#\[\]@!\$&'\(\)\*\+,;=]|%[A-Fa-f0-9]{2})+$/.test(uri);
}

function isValidCarnavalMonitor(monitorName) {
    return /^[a-zA-Z][\w._ -\/]*$/.test(monitorName);
}

function isPostApprovalEditStatus(cmStatus) {
    return cmStatus == "Scheduled" || cmStatus == "Scheduled with Comments" || cmStatus == "In Progress" || cmStatus == "Paused";
}

function getDomainName() {
    return location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
}

function changeWindowLocationHash(newLocationHash) {
    window.location.hash = newLocationHash;
    //http://stackoverflow.com/a/4630726
     $('head').append($("#mcm_fav_icon").detach());
}

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position){
        position = position || 0;
        return this.substr(position, searchString.length) === searchString;
    };
}

function isJSON(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function capitalizeStr(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function enableMultipleTagsInputPasting(target) {
    placeholder = $(target).next(".bootstrap-tagsinput").children("input").first();
    $(placeholder).on('paste',function(e){
        var element = this;
        setTimeout(function () {
            var text = $(element).val();
            var tags = (text).split(',');
            for (var i = 0, z = tags.length; i<z; i++) {
                $(target).tagsinput("add", $.trim(tags[i]));
            }
            $(element).val('');
        }, 0);
    });
}

// convert number of minutes to a human readable time string
// e.g: 5000 minutes => 3 days, 11 hours, 20 minutes
//      1501 minutes => 1day, 1 hour, 1 minute
//      100  minutes => 1 hour, 40 minutes
//      10   minutes => 10 minutes
//      0    minutes => 0 minute
function minutes_to_human_readable_time(total_minutes) {
    var days = Math.floor(total_minutes / MINUTES_IN_ONE_DAY);
    var hours = Math.floor((total_minutes % MINUTES_IN_ONE_DAY) / MINUTES_IN_ONE_HOUR);
    var minutes = Math.floor(total_minutes % MINUTES_IN_ONE_HOUR);

    var time_str = days == 0? "" : days == 1? "1 Day, " : days + " Days, ";
    time_str += hours == 0? "" : hours == 1? "1 Hour, " : hours + " Hours, ";
    time_str += minutes == 0? "" : minutes == 1? "1 Minute" : minutes + " Minutes";
    if (time_str == "") {
        time_str += "0 Minutes";
    } else if (time_str.charAt(time_str.length-2) == ',') {
        time_str = time_str.substring(0, time_str.length-2)
    }
    return time_str
}

/* Given a function and an interval, this returns a function that will refresh a timer of the given interval each time it's called. Once the timer runs out, it calls the given function.
 * Ex:
 * $("#scheduled_start").keypress(debounce(checkChangeControlDaysByDataCallback, 1800)); will wait until a user is done typing
 * or waits 1.8 seconds after a keypress before calling checkChangeControlDaysByDataCallback once, for the whole typing sequence.
 */
function debounce(func, interval) {
    var lastCall = -1;
    return function() {
        clearTimeout(lastCall);
        var args = arguments;
        var self = this;
        lastCall = setTimeout(function() {
            func.apply(self, args);
        }, interval);
    };
};
