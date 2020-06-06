(function ($) {
    "use strict";

    // on ready function
    jQuery(document).ready(function ($) {

        // Menu show Hide
        let open = false;
        let comming = null;
        let guestData = null;
        const getUrlParameter = function getUrlParameter(sParam) {
            let sPageURL = window.location.search.substring(1),
                sURLVariables = sPageURL.split('&'),
                sParameterName,
                i;

            for (i = 0; i < sURLVariables.length; i++) {
                sParameterName = sURLVariables[i].split('=');

                if (sParameterName[0] === sParam) {
                    return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
                }
            }
        };

        // counter
        // Set the date we're counting down to
        let countDownDate = new Date("Jul 06, 2020 19:30:00").getTime();

        // MODAL
        let $modal = $('.modal__container'),
            $overlay = $('.modal'),
            $close = $('.modal__container__button');

        const API_BASE = '#####';
        let userID = '';
        if (getUrlParameter('id')) {
            userID = getUrlParameter('id').toString();
        } else {
            userID = makeid(9);
        }

        function getData(url, method, id) {
            jQuery(".preloader__status").fadeOut();
            jQuery(".preloader").fadeOut();

            if (method === 'POST') {

                let form_data = new FormData();

                const dataInfo = {
                    name: $('#name_input').val(),
                    phone: $('#telephone_input').val(),
                    coming: $('#subject_input').val(),
                    category: 'no category',
                    side: 'unknown',
                    how_much: 1,
                    ID: 'none'
                };

                if (guestData) {
                    dataInfo.category = guestData[1];
                    dataInfo.side = guestData[2];
                    dataInfo.how_much = guestData[3];
                }

                if (id) {
                    dataInfo.ID = id;
                }

                for (const key in dataInfo) {
                    form_data.append(key, dataInfo[key]);
                }
                console.log('dataInfo', dataInfo);

                const req = {
                    method: 'POST', // *GET, POST, PUT, DELETE, etc.
                    body: form_data // body data type must match "Content-Type" head

                };
                fetch(url, req)
                    .then((response) => response.json())
                    .then((json) => {
                        console.log('json.data', json);
                        $('#guest').hide();
                        $overlay.show();
                    })
                    .catch(() => {
                        $(".modal__container__content__main").hide();
                        $(".modal__container__content").addClass('error');
                        $(".modal__container__content__title").html("יש בעיה בשרת אנה צור קשר עם ####");
                        $overlay.show();
                        $('#guest').hide();
                    });
            } else if (method === 'GET') {
                if (id) {
                    url = url + '?id=' + id;
                }

                fetch(url)
                    .then((response) => response.json())
                    .then((json) => {
                        // jQuery(".preloader__status").fadeOut();
                        // jQuery(".preloader").fadeOut();
                        console.log('json.data', json.data);

                        setTimeout(function () {
                            const $target = $('#guest');
                            $('html, body').animate({scrollTop: $target.offset().top}, 2500, function () {
                                    $target.focus(); // Set focus again
                            });
                        }, 3000);

                        if (json.data !== 'no Data') {
                            guestData = json.data;
                            $('input[name=name]').val(guestData[0]);
                            $('input[name=phone]').val(guestData[4]);

                            if (guestData[5] !== 'visit') {
                                if (guestData[5] > 0) {
                                    $('select[name=coming]').val(guestData[5]);
                                    $(".guest__form__buttons__button--can").toggleClass("active");
                                    $('.guest__form__number').removeClass('hidden');
                                    comming = 'yes';
                                } else {
                                    $('.guest__form__buttons__button').removeClass('active');
                                    $('.guest__form__buttons__button--cant').addClass("active");
                                    $('.guest__form__number').addClass('hidden');
                                    comming = 'no';
                                }
                            }

                        } else {
                            userID = makeid(9);
                            window.history.replaceState(null, null, "?id=" + userID);
                        }
                    })
                    .catch(() => {
/*                        $(".modal__container__content__main").hide();
                        $(".modal__container__content").addClass('error');
                        $(".modal__container__content__title").html("יש בעיה בשרת אנה צור קשר עם ###");
                        $overlay.show();
                        jQuery(".preloader__status").fadeOut();
                        jQuery(".preloader").fadeOut();*/
                    })
            }
        }

        function makeid(length) {
            let result = '';
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const charactersLength = characters.length;
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }

        function setCounter(count) {

            // Time calculations for days, hours, minutes and seconds
        }

        $overlay.hide();

        /*close on click of 'x' */
        $close.on('click', function () {
            $overlay.hide();
        });

        /* close on click outside of modal */
        $overlay.on('click', function (e) {
            if (e.target !== this) return;
            $overlay.hide();
        });

        // toggle buttons
        $(".guest__form__buttons__button--can").click(function () {
            $('.guest__form__buttons__button').removeClass('active');
            $(this).toggleClass("active");
            $('.guest__form__number').removeClass('hidden');
            comming = 'yes';
            if (!guestData || guestData[5] === 'visit' || guestData[5] > 0) {
                $('#subject_input').prop('selectedIndex', 0);
            }
        });

        $(".guest__form__buttons__button--cant").click(function () {
            $('.guest__form__buttons__button').removeClass('active');
            $(this).toggleClass("active");
            $('.guest__form__number').addClass('hidden');
            comming = 'no';
        });

        $('.guest__form__submit__button').on("click", () => {

            const input_name = $('#name_input').val();
            const input_telephone = $('#telephone_input').val();
            const input_subject = $('#subject_input');

            if (!input_name) {
                $('.guest__form__name').effect("shake", {times: 4, distance: 10}, 750);
            }

            if (!input_telephone) {
                $('.guest__form__telephone').effect("shake", {times: 4, distance: 10}, 750);
            }

            if (!comming) {
                $('.guest__form__buttons').effect("shake", {times: 4, distance: 10}, 750);
            }

            if (comming === 'yes') {
                if (!input_subject.val()) {
                    $('.guest__form__number').effect("shake", {times: 4, distance: 10}, 750);
                }
            } else if (comming === 'no') {
                input_subject.val(0);
            }
            if (input_name && input_telephone && input_subject.val()) {
                getData(API_BASE, 'POST', userID);
                $('.lds-heart').show();
                $('.guest__form__submit__button').hide();
                $('.links-Area__arrow').hide();
                $('.header__wrapper__menu__guest').hide();
                $('.header__wrapper__menu').addClass('extra_bottom');
            }
        });

        // Get today's date and time

        setCounter(countDownDate);

// Update the count down every 1 second
        setInterval(function () {

            setCounter(countDownDate);

            // If the count down is finished, write some text
        }, 60 * 1000);

        getData(API_BASE, 'GET', userID);

        /*ready*/
    });
})();
