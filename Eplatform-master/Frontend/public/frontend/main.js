function castSlug(str, separator="-") {
    str = str.toLowerCase();

    str = str.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, 'a');
    str = str.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e');
    str = str.replace(/(ì|í|ị|ỉ|ĩ)/g, 'i');
    str = str.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o');
    str = str.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u');
    str = str.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y');
    str = str.replace(/(đ)/g, 'd');
    str = str.replace(/([^0-9a-z-\s])/g, '');
    str = str.replace(/(\s+)/g, separator);
    str = str.replace(/^-+/g, '');
    str = str.replace(/-+$/g, '');
    str = str.replace(/^\s+/g, '');
    str = str.replace(/\s+$/g, '');
    
    return str;
}
$(()=> {
    $("a.hideNoti").on("click", function () {
        $.ajax({
            url: "/api-v1.0/action/cookie",
            method: "post",
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function (html) {
                console.log(html);
            }
        })
        return false;
    })

    $(".notiApp").on("click", function () {
        $.ajax({
            url: "/api-v1.0/cookie_downloada_app",
            method: "post",
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function (html) {
                console.log(html);
            }
        })
        return false;
    })

    if ($("button[name='btnSearchBar']").length == 0) {
        $("button[name^='btnSearch']").click(function () {
            var strSearch = castSlug($(this).prev().val());
            window.location.href = mapUrl + "?text=" + strSearch;
        });
        $("input[name^='txtSearch']").keyup(delay(function(e) {
            if(e.keyCode == 13) {
                var strSearch = castSlug($(this).val());
                window.location.href = mapUrl + "?text=" + strSearch;
            } else {
                $.ajax({
                    url: window.location.origin + "/api-v1.0/company/suggest-search",
                    method: "post",
                    data: {query: castSlug($(this).val(), " ")},
                    success: function (html) {
                        $(".suggest-search").children('div').remove();
                        $(".suggest-search").append(html);
                    }
                })
                
                if ($(this).val() == "") {
                    $('.hintBox').hide();
                }
                else
                {
                    var hei=$(window).height() - $(this).offset().top + $(this).height();
                    $(".hintBox").width($(this).width()+78);
                    $(".hintBox").height(hei);
                    $(".hintBox").css('left',$(this).offset().left);
                    $(".hintBox").css('top',$(this).offset().top + $(this).height() + 18);
                    $('.hintBox').show();
                }
            }
        }, 500));

        $("input[name^='txtSearch']").keyup(function(e) {
            if(e.keyCode != 13) {
                $(".suggest-search").children('div').remove();
                $(".suggest-search").append(`
                    <div>Dang tim</div>
                `);
            }
        });
    }

    function delay(callback, ms) {
        var timer = 0;
        return function () {
            var context = this,
                args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                callback.apply(context, args);
            }, ms || 0);
        };
    }

    // function for subscribe
    function postSubscribe(subscribeData) {
        $.ajax({
            url: subscribeApi,
            method: "post",
            data: subscribeData,
            success: function (html) {
                $("body .modal").each(function (e) {
                    $(this).remove();
                })
                $(html).modal();
            }
        })
    }
    $("input[name^='txtSubscribe']").keyup(function(e){
        if(e.keyCode == 13) {
            postSubscribe({ email: $(this).val() });
        }
    });
    $("button[name='btnSubscribe']").click(function () {
        postSubscribe({ email: $("input[name^='txtSubscribe']").val() });
    })



    // function for show modal by name
    var modal = undefined;
    function showModal(modalName, data={}) {
        $.ajax({
            method: "get",
            url: "/modal/" + modalName + "?" + jQuery.param(data),
            success: function (html) {
                modal = html;
                $("body .modal").each(function (e) {
                    $(this).remove();
                })
                $("body").append(modal);
                $("body").ready(function () {
                    $(".modal").modal();
                });
            }
        })
    }
    window.showModal = showModal;
    
    $("a[data-toggle='modal'], div[data-toggle='modal']").on("click", function () {
        var modalName = $(this).attr("data-target").replace("#", "");
        var data = $(this).attr("data");
        if (data) {
            try {
                data = JSON.parse(data);
            } catch (ex) {
                data = {};
            }
        }
        showModal(modalName, data);
        return true;
    })


    // function for subscribe
    $(".contactRight form").submit(function () {
        var postData = {};
        $(this).serializeArray().forEach(function (element) {
            postData[element.name] = element.value;
        });
        $.ajax({
            url: contactApi,
            method: "post",
            data: postData,
            success: function (html) {
                $("body .modal").each(function (e) {
                    $(this).remove();
                })
                $(html).modal();
            }
        })
        return false;
    })


    // function for update language
    $("a[href^='/change-lang/']").click(function () {
        $.ajax({
            url: window.location.origin + $(this).attr("href"),
            method: "get",
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function () {
                window.location.reload();
            }
        })
        return false;
    })


    // logout function
    $("#logoutButton").click(function () {
        $.ajax({
            url: logoutApi,
            method: "post",
            success: function () {
                window.location.reload();
            }
        })
        return false;
    })

    // function below use for resive category item in home screen
    if (window.location.pathname == "/") {
        resizeDiv = function () {
            arr = [];
            $(".catItem").each(function () { arr.push ({div: $(this), childWidth: $(this).find("h6 span").width()}); });
            screenWidth = $("#catContainer").width();
            maxWidth = screenWidth / 1.5;
        
            function getRow(arr) {
                let row = [];
                let sum = 0;
                let isAll = false;
                for (let i in arr) {
                    if (sum + arr[i].childWidth > maxWidth) {
                        if (i == 0) {
                            row.push(arr[0]);
                            arr.splice(0, 1);
                            break;
                        }
                        arr.splice(0, i);
                        break;
                    }
                    sum += arr[i].childWidth;
                    row.push(arr[i]);
                    if (i == arr.length - 1) {
                        isAll = true;
                    }
                }
                if (isAll) {
                    arr.splice(0);
                }
                return row;
            }
            while (arr.length > 0) {
                firstRow = getRow(arr);
                sumWidth = 30 * (firstRow.length - 1);
                firstRow.forEach((elem) => sumWidth += elem.childWidth);
                addOn = (screenWidth - sumWidth) / firstRow.length;
        
        
                firstRow.forEach(function (elem, index) {
                    let newWidth = elem.childWidth + addOn;
                    elem.div.css("width", newWidth);
                    if (firstRow.length == 1) {
                        elem.div.css("margin-left", "0px");
                        elem.div.css("margin-right", "0px");
                    } else {
                        elem.div.css("margin-left", "0px");
                        if (index < firstRow.length - 1) {
                            elem.div.css("margin-right", "30px");
                        } else {
                            elem.div.css("margin-right", "0px");
                        }
                    }
                })
            }
        }
        resizeDiv();
        window.onresize = resizeDiv;
        var currentPage = 1;
        var isLoading = false;
        $("#loadMoreCat, #loadMoreCat a").click(function () {
            if (!isLoading) {
                isLoading = true;
                var postData = {
                    page: currentPage
                }
                $.ajax({
                    url: window.location.origin + "/api-v1.0/home/category",
                    method: "post",
                    data: postData,
                    success: function (pageData) {
                        currentPage += 1;
                        isLoading = false;
                        if (Array.isArray(pageData.rows)) {
                            pageData.rows.forEach(function (elem) {
                                $(`<div class="catItem">
                                    <a href="` + mapUrl + "?ep_companyCategories=" + elem._id + `">
                                        <img src="` + elem.imageUrl + `" />
                                        <h6><span>` + elem.name + `</span></h6>
                                    </a>
                                </div>`).insertBefore("#loadMoreCat");
                            })
                        }
                        if (!pageData.showLoadMore) {
                            $("#loadMoreCat").remove();
                        }
                        resizeDiv();
                    }
                })
            }
        })
    }


    // auto load main.css
   /* $('.hintBox').hide();*/
    $('.hintBoxDialog').hide();
    $("head").append('<link rel="stylesheet" href="public/frontend/main.css" type="text/css">');
})