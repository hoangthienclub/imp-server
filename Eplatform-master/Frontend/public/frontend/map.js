var getParams = function (url) {
    var params = {};
    var parser = document.createElement('a');
    parser.href = url;
    var query = parser.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        params[pair[0]] = decodeURIComponent(pair[1]);
    }
    return params;
};
function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

var requestDict = {};
function loadJSON(id, url, callback) {
    if (requestDict[id]) {
        requestDict[id].abort();
        delete requestDict[id];
    }
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', url, true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(JSON.parse(xobj.responseText));
        }
    };
    xobj.send(null);
    requestDict[id] = xobj;
}
function updateURLParameter(url, param, paramVal){
    var newAdditionalURL = "";
    var tempArray = url.split("?");
    var baseURL = tempArray[0];
    var additionalURL = tempArray[1];
    var temp = "";
    if (additionalURL) {
        tempArray = additionalURL.split("&");
        for (var i=0; i<tempArray.length; i++){
            if(tempArray[i].split('=')[0] != param){
                newAdditionalURL += temp + tempArray[i];
                temp = "&";
            }
        }
    }

    var rows_txt = temp + "" + param + "=" + paramVal;
    return baseURL + "?" + newAdditionalURL + rows_txt;
}
function getBoundCenter(str) {
    let points = str.split(",").map((e) => { return parseFloat(e); })
    return new L.latLngBounds([
        new L.LatLng(points[3], points[2]),
        new L.LatLng(points[1], points[0])
    ]).getCenter();
}
function updatePageNumber(total, totalPage, currentPage, fn) {
    $(".resultIngo span").text(total);

    prev = '<a href="#" data-number="' + (currentPage - 1) + '"><i class="fa fa-angle-left"></i></a>';
    next = '<a href="#" data-number="' + (currentPage + 1) + '"><i class="fa fa-angle-right"></i></a>';
    

    navi = $('.pageNav');

    navi.empty();
    if (totalPage <= 1) {
    } else {
        if (currentPage > 0) {
            navi.append(prev);
        }
        if (totalPage <= 3) {
            let i = 0;
            while (i < totalPage) {
                navi.append('<a href="#" data-number="' + i + '" class="number' + (i == currentPage ? ' act' : '') + '">' + (i + 1) + '</a>');
                i += 1;
            }
        } else {
            let i = currentPage - 1;
            if (i != 0 && currentPage != 0) {
                navi.append('<a href="#" data-number="0" class="number">1</a>');
                navi.append('...');
            }
            while (i < currentPage + 2) {
                if (i >= 0 && i < totalPage) {
                    navi.append('<a href="#" data-number="' + i + '" class="number' + (i == currentPage ? ' act' : '') + '">' + (i + 1) + '</a>');
                }
                i++;
            }
            if (i != 0 && currentPage < totalPage - 2) {
                navi.append('...');
                navi.append('<a href="#" data-number="' + (totalPage - 1) + '" class="number">' + totalPage + '</a>');
            }
        }

        if (currentPage < totalPage - 1) {
            navi.append(next);
        }
        navi.find("a").click(function () {
            if (fn) {
                fn(parseInt($(this).attr("data-number")));
            }
            return false;
        })
    }
}
function getColor(d) {
    return d % 4 == 0 ? '#4286f4' :
    d % 3 == 0 ? '#ea9e07' :
    d % 2 == 0 ? '#e2e519' :
    '#0816d6';
}
function style() {
    return {
        fillColor: getColor(parseInt((Math.random() * 4) + 1)),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.3
    };
}
function styleIp() {
    return {
        fillColor: '#0060fc',
        weight: 2,
        opacity: 1,
        color: '#001dfc',
        dashArray: '3',
        fillOpacity: 0.3
    };
}
   
function getGeometry (url, fn) {
    $.ajax({
        method: "post",
        url: url,
        success: fn
    })
}

class MyLayer {
    constructor (selector, map, toggleStatus=false) {
        this.map = map;
        this.polylines = [];
        this.__timeout = undefined;
        this.toggleStatus = toggleStatus;
        this.fns = [];

        this.zoom = {
            min: 0,
            max: 18
        };
        this.lineStyle =  {
            weight: 3,
            color: 'red',
            dashArray: '',
            fillColor: '#000',
            fillOpacity: 0,
            opacity: 1
        };
        
        let that = this;
        
        $(selector).on("click", function () {
            let newStatus = $(this).hasClass("active");
            if (that.toggleStatus !== newStatus) {
                that.toggleStatus = newStatus;
                that.toggleLayer();
                for(let fn of that.fns) {
                    fn(that.toggleStatus);
                }
            }
        })
    }
    onToggleLayer(fn) {
        this.fns.push(fn);
    }
    removePolylines() {
        for (let line of this.polylines) {
            this.map.removeLayer(line);
        }
        this.polylines = [];
    }
    addPolyline(geo) {
        let that = this;
        geo.addTo(that.map);
        that.polylines.push(geo);
    }
    
    zoomEnd() {}
    moveEnd() {}
    updateMap() {}
    updateList() {}
    toggleLayer() {}
}

class CompanyLayer extends MyLayer {
    constructor(selector, map, toggleStatus=false) {
        super(selector, map, toggleStatus);
        this.markers = [];
        this._markers = [];
        this.loadedMarker = {};
    }
    updateMarkerName() {
        let that = this;
        let __update = function () {
            for (let marker of that._markers) {
                let iconUrl = that.loadedMarker[marker.company_id].icon ? that.loadedMarker[marker.company_id].icon : "https://hub.nso.vn/glide/eplatform/icon/other-01.png";
                marker.setIcon(L.divIcon({ html: '<div><img src="' + iconUrl + '"/><span>' + that.loadedMarker[marker.company_id].name + '</span></div>', className: 'marker-name' }))
                marker.on("dblclick", function () {
                    window.open('/detail/' + that.loadedMarker[marker.company_id].url, '_blank');
                })
            }
        }
        let ids = that._markers.map(e => e.company_id).filter(e => that.loadedMarker[e] == undefined);
        if (ids.length > 0) {
            $.ajax({
                method: "post",
                url: "/api-v1.0/company-name",
                contentType: "application/json",
                data: JSON.stringify({
                    _id: ids
                }), 
                success: function (arr) {
                    for (let c of arr) that.loadedMarker[c._id] = c;
                    __update();
                }
            })
        } else {
            __update();
        }
    }
    updateMap() {
        let that = this;
        if (that.toggleStatus) {
            loadJSON("search", "/api-v1.0/search" + window.location.search, function (res) {
                if (!that.toggleStatus) return;
                that.removePolylines();
                for (let marker of that.markers) {
                    that.map.removeLayer(marker);
                }
                that.markers = [];
                that._markers = [];

                for(let location of res) {
                    let c = ' marker-cluster-';
                    let icon = undefined;
                    if (location.count == 1) {
                        icon = L.divIcon({ html: '<div><span></span></div>', className: 'marker-name' });
                    } else {
                        if (location.count < 10) {
                            c += 'small';
                        } else if (location.count < 100) {
                            c += 'medium';
                        } else {
                            c += 'large';
                        }
                        icon = L.divIcon({ html: '<div><span>' + location.count + '</span></div>', className: 'marker-cluster' + c, iconSize: new L.Point(40, 40) })
                    }

                    let marker = L.marker([location.lat, location.lng], { 
                        icon: icon
                    })
                    .on('click', function () {
                        that.removePolylines();
                        if (location.nodes.length > 0) {
                            $.ajax({
                                url: "/api-v1.0/company/list-popup",
                                method: "post",
                                data: { "ids": JSON.stringify(location.nodes) },
                                success: function (html) {
                                    if (screen.width >= 768) {
                                        L.popup()
                                            .setLatLng([location.lat, location.lng])
                                            .setContent(html)
                                            .openOn(that.map);
                                    } else {
                                        $("body > .popUpCompanyOnMap").remove();
                                        $("body").append(html);
                                        $("body").ready(() => {
                                            $("body > .popUpCompanyOnMap").removeClass("down");
                                        })
                                    }
                                }
                            })
                        } else {
                            let oldZoom = that.map.getZoom();
                            that.map.fitBounds([
                                [location.bounding_box.top, location.bounding_box.left],
                                [location.bounding_box.bottom, location.bounding_box.right]
                            ])
                            setTimeout(() => {
                                if (oldZoom == that.map.getZoom()) {
                                    that.map.setZoom(oldZoom + 1);
                                }
                            }, 500);
                        }
                    })
                    .on('mouseover', function () {
                        let locations = location.polygon.map(e => [e[1], e[0]]);
                        let multipolyline = L.polygon(locations, { color:'red' }).addTo(that.map);
                        that.polylines.push(multipolyline);
                    })
                    .on('mouseout', function () {
                        that.removePolylines();
                    })
                    .addTo(that.map);
                    
                    if (location.count == 1) {
                        marker.company_id = location.nodes[0];
                        that._markers.push(marker);
                    }
                    that.markers.push(marker);
                }
                that.updateMarkerName();
            });
        }
    }
    updateList(page=0) {
        let that = this;
        window.history.replaceState('', '', updateURLParameter(window.location.href, "page", page));
        loadJSON("viewbox", "/api-v1.0/viewbox" + window.location.search, function (res) {
            updatePageNumber(res.total.node, res.total.page, page, (page) => {
                that.updateList(page);
            });
            if (that.toggleStatus)
                $(".resultListing").html(res.data);
        });
    }
    moveEnd() {
        let that = this;
        let url = updateURLParameter(window.location.href, "bb_string", that.map.getBounds().toBBoxString());
        url = updateURLParameter(url, "zoom", that.map.getZoom());
        window.history.replaceState('', '', url);

        if (that.toggleStatus) {
            if (that.__timeout) {
                clearTimeout(that.__timeout);
                that.__timeout = undefined;
            }
            that.__timeout = setTimeout(() => {
                that.updateMap();
                that.updateList();
            }, 1000);
        }
    }
    toggleLayer() {
        let that = this;
        if (that.toggleStatus == false) {
            that.removePolylines();
            for (let marker of that.markers) {
                that.map.removeLayer(marker);
            }
            that.markers = [];
        } else {
            that.updateMap();
            that.updateList();
        }
    }
}

class ProvinceCityLayer extends MyLayer {
    constructor(selector, map, url, style, toggleStatus=false) {
        super(selector, map, toggleStatus);
        this.initCompleted = false;
        this.arr = [];
        // this.info =  L.control();
        this.count = 0;
        
        this.geojson = undefined;
        this.zoom.max = 9;
        this.zoom.min = 0;
        this.style = style;
        this.url = url;
        this.layerName = "province";
        this.path = "/app/province/";
        let that = this;

        if (this.toggleStatus) {
            this.initLayer(function () {
                that.toggleLayer()
            })
        }
    }
    initLayer(fn) {
        let that = this;
        // that.info.onAdd = function () { that.infoOnAdd() };
        // that.info.updateInfo = function () { that.updateInfo() };
        
        getGeometry(that.url, function (arr) {
            that.initCompleted = true;
            that.arr = arr;

            that.geojson = L.geoJson(that.arr.map(e => {
                return {
                    geometry: e.geometry,
                    properties: e,
                    type: "Feature"
                }
            }), {
                style: that.style,
                onEachFeature: function (feature, layer) { that.onEachFeature(feature, layer) }
            })
            fn();
        });
    }
    
    infoOnAdd() {
        let that = this;
        that.count++;
        if (that.count == 1) {
            that.updateInfo();
        }
    }
    updateInfo(props) {
        let that = this;
        that.info._div = L.DomUtil.create('div', 'info');
        that.info._div.innerHTML = '<h4>Property in </h4>' +  (props ?
            '<b>' + props.name + '</b><br />' +  ' .......... / m<sup>2</sup>'
            : 'Hover over a province');
    }
    highlightFeature(e) {
        let that = this;
        let layer = e.target;

        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
        // that.info.updateInfo(layer.feature.properties);
    }
    resetHighlight(e) {
        let that = this;
        that.geojson.resetStyle(e.target);
        // that.info.updateInfo();
    }
    zoomToFeature(e) {
        let that = this;
        that.map.fitBounds(e.target.getBounds());
        that.removePolylines();
        that.addPolyline(L.geoJson(e.target.feature, that.lineStyle));
        let urlInfo = "/api-v1.0/" + this.layerName + "/popup";
        $.ajax({
            url: urlInfo,
            method: "post",
            data: { "id": e.target.feature.properties._id},
            success: function (html) {
                if (screen.width >= 768) {
                    L.popup()
                        .setLatLng([e.latlng.lat, e.latlng.lng])
                        .setContent(html)
                        .openOn(that.map);
                } else {
                    $("body > .popUpCompanyOnMap").remove();
                    $("body").append(html);
                    $("body").ready(() => {
                        $("body > .popUpCompanyOnMap").removeClass("down");
                    })
                }
            }
        })
    }
    loadViewBox(e) {
        let that = this;
        let size = 25;
        let props = e.target.feature.properties;
        if (props) {
            let _id = props._id;
            let index = that.arr.findIndex(function (e) { return e._id == _id; });
            let page = Math.ceil(index / size) - (index % size == 0 ? 0 : 1);
            that.toggleStatus = true;
            that.updateList(page, function () {
                $('.resultListing').ready(function () {
                    $('.resultListing').animate({
                        scrollTop: 0
                    }, 0);
                
                    $('.resultListing').animate({
                        scrollTop: $("#" + _id).offset().top - $('.resultListing').offset().top
                    }, 'slow');
                        
                })
            });
        }
    }
    onEachFeature(feature, layer) {
        let that = this;
        layer.on({
            mouseover: function (e) { that.highlightFeature(e); },
            mouseout:  function (e) { that.resetHighlight(e); },
            click:  function (e) { that.loadViewBox(e); that.zoomToFeature(e); }
        });
    }
    updateList(page=0, callback=undefined){
        let that = this;
        if (that.toggleStatus) {
            window.history.replaceState('', '', updateURLParameter(window.location.href, "page", page));
            loadJSON("viewbox", that.path + window.location.search, function (res) {
                updatePageNumber(res.total.node, res.total.page, page, (page) => {
                    that.updateList(page);
                });
                
                if (that.toggleStatus) {
                    $(".resultListing").html(res.data);
                    if (callback) {
                        callback();
                    }
                }
            });
        }
    }
    zoomEnd() {
        let that = this;
        if (!that.initCompleted) return;
        let currentZoom = that.map.getZoom();
        if (that.toggleStatus && that.zoom.min <= currentZoom && that.zoom.max >= currentZoom) {
            if (!that.map.hasLayer(that.geojson))
                that.geojson.addTo(that.map);
        } else {
            that.map.removeLayer(that.geojson);
        }
    }
    toggleLayer() {
        let that = this;
        if (that.initCompleted !== true) {
            that.initLayer(function () {
                that.toggleLayer()
            });
            return;
        }

        let currentZoom = that.map.getZoom();
        if (that.toggleStatus) {
            that.updateList(0);
        }
        if (that.toggleStatus == false || !(that.zoom.min <= currentZoom && that.zoom.max >= currentZoom)) {
            that.map.removeLayer(that.geojson);
        } else {
            if (!that.map.hasLayer(that.geojson))
                that.geojson.addTo(that.map);
        }
    }
}

class IPLayer extends ProvinceCityLayer {
    constructor(selector, map, url, style, toggleStatus=false) {
        super(selector, map, url, style, toggleStatus);
        this.zoom.max = 18;
        this.zoom.min = 10;
        this.layerName = "industrialPark";
        this.path = "/app/industrial-park/";
    }
}

class Filter {
    constructor (fnApply) {
        this.filter = {};
        this.unsaveFilter = {};
        this.types = ["ep_companyCategories", "ep_industrialParks", "system_mapProvinces", "system_mapDistricts"];
        this.init ();

        let that = this;
        $("button[name='btnSaveFilter']").click(function () {
            that.update();
            for (let type in that.filter) {
                window.history.replaceState('', '', updateURLParameter(window.location.href, type, that.filter[type].join(",")));
            }
            fnApply();
        })
    }
    update () {
        let that = this;
        that.filter = {};
        $(".item01 > ul").each((i, elem) => {
            let type = $(elem).attr("data-type");
            if (that.types.indexOf(type) >= 0)
                that.filter[type] = [];
        })
        $(".item01 > ul:visible").each((i, elem) => {
            let type = $(elem).attr("data-type");
            that.filter[type] = [];
            $(elem).find("li").each((i, val) => {
                that.filter[type].push($(val).attr("data-id"));
            });
        });
        for (let attr in that.filter) {
            that.unsaveFilter[attr] = [].concat(that.filter[attr]);
        }
    }
    add(data) {
        let that = this;
        let html = `<li data-id="` + data.id + `">
            <label class="filterCheck customCheck active"><p>` + data.text + `</p>
                <input type="checkbox" checked>
                <span class="checkmark"></span>
            </label>
        </li>`;
        
        $('.item01.' + data.type).show();
        $('.item01.' + data.type + " ul").append(html).ready(function () {
            $('.item01.' + data.type + ' > ul > li[data-id="' + data.id + '"]').on('click', function () {
                let val = $("#search-filter").val().split(",");
                val.splice(val.indexOf(data.id), 1);
                
                $(this).remove();
                
                that.unsaveFilter[data.type].splice(that.unsaveFilter[data.type].indexOf(data.id), 1);
                if (that.unsaveFilter[data.type].length == 0) {
                    $('.item01.' + data.type).hide();
                }
            })
        })
    }
    init() {
        let that = this;
        let params = getParams(window.location.href);
        for (let type of that.types) {
            if (params[type]) {
                that.filter[type] = params[type].split(",") || [];
            }
        }
        $.ajax({
            url: '/api-v1.0/init-filter/',
            contentType: 'application/json',
            method: 'post',
            data: JSON.stringify(that.filter),
            success: function (arr) {
                for (let filters of arr) {
                    for (let filter of filters) {
                        that.add(filter);
                    }
                }
            }
        })
        
        $("#search-filter").select2({
            tags: false,
            ajax: {
                url: '/api-v1.0/filter/',
                dataType: 'json',
                data: function(term) {
                    for (let attr in that.filter) {
                        if (!that.unsaveFilter[attr]) {
                            that.unsaveFilter[attr] = [].concat(that.filter[attr]);
                        } else {
                            that.unsaveFilter[attr] = that.unsaveFilter[attr].concat(that.filter[attr]);
                        }
                        that.unsaveFilter[attr] = that.unsaveFilter[attr].filter(onlyUnique);
                    }
                    return {
                        q: term,
                        filter: that.unsaveFilter
                    };
                },
                results: function(data) {
                    return {
                        results: data
                    };
                }
            }
        })
        .on("change", function(e) {
            if (e.added) {
                let data = e.added;
                if (!that.unsaveFilter[data.type]) that.unsaveFilter[data.type] = [];
                that.unsaveFilter[data.type].push(data.id);

                that.add(data);
            }
        })
    }
}


class App {
    constructor(map) {
        let that = this;
        let params = getParams(window.location.href);
        let layerDict = {};
        if (params["layers"]) {
            for (let attr of params["layers"].split(",")) {
                layerDict[attr] = true;
                $(".customCheck[type='" + attr + "']").addClass("active");
                $(".customCheck[type='" + attr + "'] input").prop('checked', true);
            }
        }
        
        if (Object.keys(layerDict).length == 0) {
            layerDict["ep_companies"] = true;
            $(".customCheck[type='ep_companies']").addClass("active");
            $(".customCheck[type='ep_companies'] input").prop('checked', true);
        }

        this.companyLayer = new CompanyLayer(".customCheck[type='ep_companies']", map, layerDict["ep_companies"]);
        this.ipLayer = new IPLayer(".customCheck[type='ep_industrialParks']", map,"/api-v1.0/geometry/ip", styleIp, layerDict["ep_industrialParks"]);
        this.provinceCityLayer = new ProvinceCityLayer(".customCheck[type='ep_cityProvinces']", map,"/api-v1.0/geometry/province", style, layerDict["ep_cityProvinces"]);
        
        this.filter = new Filter(function () {
            that.updateMap();
            that.updateList();
        })
        
        this.companyLayer.onToggleLayer((a) => { that.changeToggleLayer(a); });
        this.ipLayer.onToggleLayer((a) => { that.changeToggleLayer(a); });
        this.provinceCityLayer.onToggleLayer((a) => { that.changeToggleLayer(a); });

        that.updateMap();
        that.updateList();
    }

    changeToggleLayer (toggleStatus) {
        let that = this;
        if (!toggleStatus) {
            if (that.companyLayer.toggleStatus) {
                that.companyLayer.updateList();
            } else {
                if (that.ipLayer.toggleStatus) {
                    that.ipLayer.updateList();
                } else {
                    that.provinceCityLayer.updateList();
                }
            }
        }
    }

    updateMap() {
        this.companyLayer.updateMap();
        this.ipLayer.updateMap();
        this.provinceCityLayer.updateMap();
    }

    moveEnd() {
        this.companyLayer.moveEnd();
        this.ipLayer.moveEnd();
        this.provinceCityLayer.moveEnd();
    }

    zoomEnd() {
        this.companyLayer.zoomEnd();
        this.ipLayer.zoomEnd();
        this.provinceCityLayer.zoomEnd();
    }

    updateList(page=0) {
        if (this.companyLayer.toggleStatus) {
            this.companyLayer.updateList(page);
            this.companyLayer.updateMap(page);
        } else {
            if (this.provinceCityLayer.toggleStatus != this.ipLayer.toggleStatus) {
                if (this.ipLayer.toggleStatus) {
                    this.ipLayer.updateList(page);
                    this.ipLayer.updateMap(page);
                } else if (this.provinceCityLayer.toggleStatus) {
                    this.provinceCityLayer.updateList(page);
                    this.provinceCityLayer.updateMap(page);
                }
            }
        }
    }
}

$(() => {
    var params = getParams(window.location.href);
    var map;
    
    let styleMap = [
        {
            "featureType": "poi",
            "elementType": "labels.text",
            "stylers": [{
                "visibility": "off"
            }]
        },
        {
            "featureType": "poi.business",
            "stylers": [{
                "visibility": "off"
            }]
        },
        {
            "featureType": "road",
            "elementType": "labels.icon",
            "stylers": [{
                "visibility": "off"
            }]
        },
        {
            "featureType": "transit",
            "stylers": [{
                "visibility": "off"
            }]
        }
    ];
    var googleRoadMapLayer = new L.gridLayer.googleMutant({ type: 'roadmap', styles: styleMap })
    var googleHybridLayer = new L.gridLayer.googleMutant({ type: 'hybrid', styles: styleMap	})

    map = L.map('map', {
        zoom: params.zoom || 6,
        center: params.bb_string ? getBoundCenter(params.bb_string) : [16.052466, 108.208038],
        maxZoom: 18,
        layers: [googleRoadMapLayer],
        zoomControl:false,
    });
    
    var baseMaps = {
        "Hybrid"  : googleHybridLayer,
        "Roadmap" : googleRoadMapLayer
    };
    L.control.layers(baseMaps, null, {position:'topleft'}).addTo(map);

    var app = new App(map);
    
    function closePopup () {
        $("body > .popUpCompanyOnMap").addClass("down");
    }
    map.on('moveend', function () {
        closePopup();
        app.moveEnd();
    })
    map.on('zoomend', function () {
        app.zoomEnd();
    })

    setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
    }, 100);

    $(".expandBtn").click(() => {
        $("div#result").toggleClass("open-list");
        window.dispatchEvent(new Event('resize'));
    })
    $("input[name^='txtSearchNavTxt'], input[name^='txtSearchBar']").keyup(delay(function(e){
        if(e.keyCode == 13) {
            var strSearch = castSlug($(this).val());
            window.location.href = mapUrl + "?text=" + strSearch;
            // searchByString($(this).val());
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
        } 
    }, 500));

    $("input[name^='txtSearchNavTxt'], input[name^='txtSearchBar']").keyup(function(e){
        if(e.keyCode != 13) {
            $(".suggest-search").children('div').remove();
            $(".suggest-search").append(`
                <div>Dang tim</div>
            `);
        }
    });

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
    
    $("button[name='btnSearchNavBtn']").click(function () {
        // searchByString($("input[name^='txtSearchNavTxt']").val());
        var strSearch = castSlug($("input[name^='txtSearchNavTxt']").val());
        window.location.href = mapUrl + "?text=" + strSearch;
    });  
    $("button[name='btnSearchBar']").click(function () {
        searchByString($("input[name^='txtSearchBar']").val());
    });
    $("#filterBtn").click(function () {
        setTimeout(() => {
            $("#search-filter").select2('open');
        }, 100);
    });

    
    if (!params["clientType"]) {
        params["clientType"] = "10K";
    }

    $(".clientType input").each(function () {
        if ($(this).attr("value") == params["clientType"]) {
            $(this).parent().addClass("active");
            $(this).prop( "checked", true );
        }
    })

    $(".clientType input").on("change", function () {
        $(".clientType input").each(function () { $(this).parent().removeClass("active"); })
        $(this).parent().addClass("active");
        
        let clientType = "";
        clientType = $(this).val();
        params["clientType"] = clientType;
        let url = updateURLParameter(window.location.href, "clientType", params["clientType"]);
        window.history.replaceState('', '', url);

        app.updateMap();
        app.updateList();
    })
    $(".layerPanel .customCheck p, .layerPanel .checkmark").click(function () {
        let layers = [];
        $(".layerPanel .customCheck.layer").each(function () {
            if ($(this).hasClass("active")) {
                layers.push($(this).attr("type"));
            }
        })
        params["layers"] = layers.join(",");
        let url = updateURLParameter(window.location.href, "layers", params["layers"]);
    })
});
