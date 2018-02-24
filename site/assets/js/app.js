/**
 * This sets up the website to work as intended
 */
$(document).ready(function(){
    resize();
    $(window).on("resize",resize);
    $("#yesPool").on("click", function(){
        $("#yesPool");
    });
    toggleCheckbox(true, $("#service").parents(".div-check").first());
    toggleCheckbox(true, $("#installation").parents(".div-check").first());
    toggleCheckbox(true, $("#residential").parents(".div-check").first());
    gatherDealers();
    $(".validate").keyup(function(e){
        if (validate(e.target.id, $(e.target).val())) {
            if ($(e.target).siblings("label").find("img").attr("src") !== "/assets/img/checkmark-circle.png") {
                $(e.target).siblings("label").find("img").fadeOut("fast", function(el){
                    $(this).attr("src", "/assets/img/checkmark-circle.png");
                    $(this).fadeIn("fast");
                });
            }
        } else {
            if ($(e.target).siblings("label").find("img").attr("src") !== "/assets/img/circle-form.png") {
                $(e.target).siblings("label").find("img").fadeOut("fast", function(el){
                    $(this).attr("src", "/assets/img/circle-form.png");
                    $(this).fadeIn("fast");
                });
            }
        }
    });
    $("#filter .div-check").on("click", function(){if($(window).width() > 768) gatherDealers();});
    $("button.btn-filter").on("click", gatherDealers);
    $(".div-check").on("click", function(ev) {
        var e = ($(this).hasClass("div-check") ? $(this) : $(this).parents(".div-check").first());
        toggleCheckbox(!e.find("input").prop("checked"), e);
    });
});
/** @function toggleCheckbox
 * This function checks and unchecks the custom checkboxes that are in both
 * the filter navbar and the contact form
 * @param {bool} on - specifies if the checkbox should be on or off
 * @param {Object} e - the element to edit, it should be from the "div-check"
 * css class
 */
function toggleCheckbox(on, e) {
    if(!on){
        e.find(".div-checkmark").css("display", "none");
        e.find(".div-checkbox").css("background-color", (e.hasClass("box-back-grey") ? "lightgrey" : "white"));
        e.find(".div-checkbox").css("box-shadow", "0 0 0 1px " + (e.hasClass("box-black") ? "black" : "lightgrey"));
        e.find("input").prop("checked", false);
    } else {
        e.find(".div-checkmark").css("display", "block");
        e.find(".div-checkbox").css("background-color", "#326FD8");
        e.find(".div-checkbox").css("box-shadow", "none");
        e.find("input").prop("checked", true);
        if(e.hasClass("div-radio")){
            e.siblings(".div-radio").each(function(i, el){
                $(el).find("input").prop("checked",false);
                $(el).find(".div-checkmark").css("display", "none");
                $(el).find(".div-checkbox").css("box-shadow", "0 0 0 1px " + ($(el).hasClass("box-black") ? "black" : "lightgrey"));
                $(el).find(".div-checkbox").css("background-color", ($(el).hasClass("box-back-grey") ? "lightgrey" : "white"));

            });
        }
    }

}
/** @function gatherDealers
 * This function performs a get request to get the json and then parses it
 * so it can be put into the cards on the website
 */
function gatherDealers() {
    $.get("/data/dealers.json", function(res){
        if (typeof res.zipcode === undefined || res.zipcode === null) {
            $("#dealerInfo").text("Error loading data");
        } else {
            $("#dealers").text(res.dealers.length);
            $("#card-area").empty();
            $("#zip").text(res.zipcode);
            var dealers = res.dealers;
            var filter = [];
            if($("#service").is(":checked")) filter.push("Service Pro");
            if($("#installation").is(":checked")) filter.push("Installation Pro");
            if($("#residential").is(":checked")) filter.push("Residential Pro");
            if($("#commercial").is(":checked")) filter.push("Commercial Pro");
            for (var i = 0; i < dealers.length; i++) {
                if (filterDealer(dealers[i], filter)) {
                    var curr = dealers[i].data;
                    var cardText = "<div class='col-s-12 col-md-6 col-lg-4 card-container'>"
                        + "<div class='card text-center'>"
                            + "<div class='card-header d-flex'>"
                                + "<h1 class='my-auto mx-auto'>"
                                    + curr.name
                                + "</h1>"
                            + "</div>"
                            + "<div class='card-body'>"
                                + "<h3 class='phone-num d-none d-md-inline'>"
                                    + "<img src='/assets/img/phone-icon-desktop.png' class='desktop-phone' />&nbsp;"
                                    + curr.phone1
                                + "</h3>"
                                + "<button class='btn btn-primary btn-phone d-md-none' href='tel:" + curr.phone1 + "' >"
                                    + "<img src='/assets/img/phone-icon-mobile.png' class='btn-img-call' />"
                                    + "&nbsp;<span class='call-text'>Tap to Call&nbsp;</span>"
                                    + "<strong>" + curr.phone1 + "</strong>"
                                + "</button>"
                                + "<p><br><small><em>Can't talk now? Click below to send an email</em></small></p>"
                                + "<button class='btn btn-outline-secondary email-btn open-contact' id='" + curr.companyID + "' href='#'>"
                                    + "<img class='btn-img' src='/assets/img/email-icon.png' />"
                                    + "&nbsp;&nbsp;Contact this Pro"
                                    + "<input class='company-email d-none' value='" + curr.email + "' />"
                                    + "<input class='company-name d-none' value='" + curr.name + "' />"
                                + "</button>"
                                + "<p class='hours'><br><strong>Business Hours</strong><br>"
                                + "Weekday&nbsp;" + curr.weekHours.mon + "<br>"
                                + "Saturdays&nbsp;" + (curr.weekHours.sat !== "" ? curr.weekHours.sat : "CLOSED") + "<br>"
                                + "Sundays&nbsp;" + (curr.weekHours.sun !== "" ? curr.weekHours.sun : "CLOSED") + "<br>"
                            + "</div>"
                            + "<div class='card-footer'>"
                                + "<div class='d-flex row-one'>"
                                    + "<div class='foot-col-left'>"
                                        + (curr.certifications.includes("Installation Pro") ? ""
                                            + "<p><img class='cert-img' src='/assets/img/star-installation-pro.png' />"
                                            + "&nbsp;Installation Pro</p>" : "")
                                    + "</div>"
                                    + "<div class='foot-col-right'>"
                                        + (curr.certifications.includes("Service Pro") ? ""
                                            + "<p><img class='cert-img' src='/assets/img/gear-service-pro.png' />"
                                            + "&nbsp;Service Pro</p>" : "")
                                    + "</div>"
                                + "</div>"
                                + "<div class='d-flex row-two'>"
                                    + "<div class='foot-col-left'>"
                                        + (curr.certifications.includes("Residential Pro") ? ""
                                            + "<p><img class='cert-img' src='/assets/img/home-residential-pro.png' />"
                                            + "&nbsp;Residential Pro</p>" : "")
                                    + "</div>"
                                    + "<div class='foot-col-right'>"
                                        + (curr.certifications.includes("Commercial Pro") ? ""
                                            + "<p><img class='cert-img' src='/assets/img/users-commercial-pro.png' />"
                                            + "&nbsp;Commercial Pro</p>" : "")
                                    + "</div>"
                                + "</div>"
                            + "</div>"
                        + "</div>"
                    + "</div>";
                    $("#card-area").append(cardText);
                }
                $(".open-contact").off("click");
                $(".open-contact").on("click", setContact);
                $(".card").matchHeight();
                $(".card-header").matchHeight();
                $(".card-footer").matchHeight();
            }
        }
    });
}
/** @function filterDealer
 * Checks the specified dealer retrieved from json against the requirements set by the
 * user when selecting the checkboxes in the navbar
 * @param string[] dealer - the array of the dealers properties
 * @param string[] filter - the array of the objects to filter
 */
function filterDealer(dealer, filter) {
    for (var j = 0; j < filter.length; j++) {
        if (!dealer.data.certifications.includes(filter[j])) {
            return false;
        }
    }
    return true;
}
/** @function resize
 * Resizes certain aspects of the screen and fixes the header when in smaller screens
 */
function resize() {
    if ($(window).width() < 768) {
        $("#headContainer").removeClass("container");
        $("#headContainer").addClass("container-fluid");
    } else {
        $("#headContainer").addClass("container");
        $("#headContainer").removeClass("container-fluid");
    }
    $(".card").matchHeight();
    $(".card-header").matchHeight();
    $(".card-footer").matchHeight();
}
/** @function validate
 * Validates the data provided by the contact form
 * @param {String} id the id provided in the contact form element
 * @param {String} val the value to test, also provided in the contact form element
 * @return {bool} whether or not the value passed validation
 */
function validate(id, val) {
    // obviously this shouldn't all be done clientside
    switch (id) {
        case "name":
            return (val !== null && typeof val !== undefined);
            break;
        case "phone":
            val = val.replace(/[\- )(]/g,"");
            return (/^\d+$/.test(val) && [10, 11].includes(val.length));
            break;
        case "email":
            return (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val));
            break;
        default:
            return false;
            break;
    }
}
/** @function setContact
 * This function gets information from hidden values on the card and places
 * them in the appropriate place on the contact form
 * @param {Object} e - the html element to pull information from
 */
function setContact(e) {
    $("#dealer-name").text($(e.target).find(".company-name").val());
    $("#dealer-head").text($(e.target).find(".company-name").val());
    $("#company-email").val($(e.target).find(".company-email").val());
    $("#contact").modal("show");

}
