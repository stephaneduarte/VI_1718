var currYear = 2014;
var currMeasure = "incidents";

function changeMeasure(e) {
    var menu = e.parentNode.parentNode;
    var options = menu.getElementsByClassName('option-menu-option');
    for (i in options) {
        if (options[i].classList) options[i].classList.remove('option-menu-option-selected');
    }
    e.classList.add('option-menu-option-selected');
    currMeasure = e.getAttribute('measure');
    reloadCharts();
}

function changeYear(e) {
    var menu = e.parentNode.parentNode;
    var options = menu.getElementsByClassName('option-menu-option');
    for (i in options) {
        if (options[i].classList){
            if (options[i] == e) {
                if (e.classList.contains('option-menu-option-selected')) {
                    e.classList.remove('option-menu-option-selected');
                    currYear = null;
                }
                else {
                    e.classList.add('option-menu-option-selected');
                    currYear = e.getAttribute('year');
                }
            }
            else options[i].classList.remove('option-menu-option-selected');
        }
    }
    reloadCharts();
}

function reloadCharts() {
    makeChronopleth();
}