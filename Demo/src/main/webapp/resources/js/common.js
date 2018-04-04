/**************************************************************************************************
* System Name  : SGA 영업 Portal System
* Program Name : sga_common.js
* Location     : common > js
* Author       : Seok, Bum-June
* Date         : 2015-08-00
* Description  : Base Common js
* 
* History      :
* *************************************************************************************************
* No.     Date         Name             Description
* *************************************************************************************************
* CH_OO   2016-01-00   Seok, Bum-June   Initial Release
* CH_01   2015-00-00
***************************************************************************************************/
var GV_CURR_PAGE_NO = "1";     // Default : 1  [현재 페이지 번호]
var GV_PAGE_COUNT   = "10";    // Default : 10 [한 페이지 개수]

/******************************************************
 window javascript error !!
******************************************************/
window.onerror = function(){
    alert("javascript Error !!");
};


/*******************************************************
 * Ajax Send !!
********************************************************/
/*******************************************************
 * Callback Function Return !!
 * 
 * @param {string} actionUrl
 * @param {string} callbackFunction
 * @returns {string} callbackFunction
 * @description CallBack Function Make
 *******************************************************/
function gf_getAfterFunction(actionUrl, callbackFunction){
    if(callbackFunction == null){
        var sepSpace = actionUrl.lastIndexOf("/");
        var sepPoint = actionUrl.indexOf(".");
        
        callbackFunction = eval(actionUrl.substring(sepSpace+1, sepPoint) + "After");
    }
    
    return callbackFunction;
}

/*******************************************************
 * General Submit !!
 * 
 * @param {string} actionUrl
 * @param {string} param
 * @param {string} callbackFunction
 * @returns {Boolean}
 * @description 일반적인 Ajax 호출
 *******************************************************/
function gf_send(actionUrl, param, callbackFunction){
    var myajax = new MyAjax();
    myajax.send(actionUrl, param, gf_getAfterFunction(actionUrl, callbackFunction));
    
    return false;
}

/*******************************************************
 * Form Submit !!
 * 
 * @param {string} formId
 * @param {string} actionUrl
 * @param {string} callbackFunction
 * @returns {Boolean}
 * @description Form Ajax 호출
 *******************************************************/
function gf_sendForm(formId, actionUrl, callbackFunction){
    var url = "";
    
    if(actionUrl != null && actionUrl != ""){
        url = actionUrl;
        
        $("#" + formId).attr("action", actionUrl);
    } else {
        url = $("#" + formId).attr("action");
    }
    
    var myajax = new MyAjax();
    myajax.sendForm(formId, gf_getAfterFunction(url, callbackFunction));
    
    return false;
}

/*******************************************************
 * File Form Submit !!
 * 
 * @param {string} formId
 * @param {string} actionUrl
 * @param {string} callbackFunction
 * @returns {Boolean}
 * @description File Upload Ajax 호출 [IE 9이하는 작동 안함]
 *******************************************************/
function gf_sendFileFormAjax(formId, actionUrl, callbackFunction){
    var url = "";
    
    if(actionUrl != null && actionUrl != ""){
        url = actionUrl;
        
        $("#" + formId).attr("action", actionUrl);
    } else {
        url = $("#" + formId).attr("action");
    }
    
    var myajax = new MyAjax();
    myajax.sendFileForm(formId, gf_getAfterFunction(url, callbackFunction));
    
    return false;
}

/*******************************************************
 * File Form Submit !!
 * 
 * @param {string} formId
 * @param {string} actionUrl
 * @param {string} callbackFunction
 * @returns {Boolean}
 * @description File Upload [IE9 이하 및 다른 Browser 도 사용가능]
 *******************************************************/
function gf_sendFileForm(formId, actionUrl, callbackFunction){
    var flag = gf_getBrowserCheck(); // 브라우저 체크
    
    // Browser 에 따른 저장 처리 !!
    if(flag == "T"){            // IE 10 이상 및 나머지
        gf_sendFileFormAjax(formId, actionUrl, callbackFunction);
    } else if (flag == "N"){    // IE 9 이하
        // Iframe Setting
        if($("#iframeUpload").length == 0){
            $("body").append('<iframe src="" id="iframeUpload" name="iframeUpload" style="display:none;"></iframe>');
        }
        
        // Return String Setting
        if($("#" + formId + " #returnString").length == 0){
            $("#" + formId).append('<input id="returnString" name="returnString" type="hidden" />');
        }
        
        $("#" + formId + " #returnString").val("/common/commFileUploadIframe"); // 브라우저별 controller return
        
        var frm = document.getElementById(formId);
        
        frm.target = "iframeUpload";
        frm.submit();
    } else {
        return false;
    }
}



/*******************************************************
 * 검색 조건 parameter !!
 * 
 * @param {string} pageNo
 * @returns {string} parameter
 * @description 검색 조건 Parameter Setting
 *******************************************************/
function gf_searchParam(){
    var args = gf_searchParam.arguments;
    
    var pageNo  = args.length > 0 ? args[0] : "";
    var areaId  = args.length > 1 ? args[1] != "" ? args[1] : "searchArea" : "searchArea";
    
    // 개별로 한 페이지 개수를 따로 지정 가능 !!
    GV_PAGE_COUNT = args.length > 2 ? args[2] : "10";
    
    var param = "";
    
    var rdoId = "";
    var chkId = "";
    
    $("#" + areaId + " *").each(function() {
        var tagName = $(this).prop("tagName").toUpperCase();
        
        if(tagName == "INPUT" || tagName == "SELECT"){
            var id   = $(this).attr("id");
            var type = $(this).attr("type");
            
            if(type == "radio"){
                if(rdoId != id){
                    var rdoVal = "";
                    
                    $("#" + areaId + " input[id=" + id + "]").each(function(){
                        if($(this).is(":checked")){
                            rdoVal = $(this).val();
                            
                            return false;
                        }
                    });
                    
                    param += "&" + id + "=" + rdoVal;
                    
                    rdoId = id;
                }
            } else if(type == "checkbox"){
                if(chkId != id){
                    var chkVal = "";
                    
                    $("#" + areaId + " input[id=" + id + "]").each(function(){
                        if($(this).is(":checked")){
                            chkVal += "," + $(this).val();
                        }
                    });
                    
                    param += "&" + id + "=" + (chkVal != "" ? chkVal.substring(1) : "");
                    
                    chkId = id;
                }
            } else {
                param += "&" + $(this).attr("id") + "=" + $(this).val();
            }
        }
    });
    
    var currPageNo = pageNo == null || pageNo == "" ? GV_CURR_PAGE_NO : pageNo;
    var pageCount  = $("#pageCount").length == 1 ? $("#pageCount").val() : GV_PAGE_COUNT;
    
    param += "&currPageNo=" + currPageNo + "&pageCount=" + pageCount;
    
    return param.substring(1);
}

/*******************************************************
 * 검색 조건 parameter : Report 용!!
 * 
 * @param {string} pageNo
 * @returns {string} parameter
 * @description 검색 조건 Parameter Setting
 *******************************************************/
function gf_searchParamRept(){
    var args = gf_searchParamRept.arguments;
    
    var areaId  = args.length > 0 ? args[0] != "" ? args[0] : "searchArea" : "searchArea";
    
    var param = "";
    
    var rdoId = "";
    var chkId = "";
    
    $("#" + areaId + " *").each(function() {
        var id      = $(this).attr("id");
        var type    = $(this).attr("type");
        var tagName = $(this).prop("tagName").toUpperCase();
        
        if(tagName == "INPUT"){
            if(type == "radio"){
                if(rdoId != id){
                    var rdoVal = "";
                    
                    $("#" + areaId + " input[id=" + id + "]").each(function(){
                        if($(this).is(":checked")){
                            rdoVal = $(this).val();
                            
                            return false;
                        }
                    });
                    
                    param += "&" + id + "=" + rdoVal;
                    
                    rdoId = id;
                }
            } else if(type == "checkbox"){
                if(chkId != id){
                    var chkVal = "";
                    
                    $("#" + areaId + " input[id=" + id + "]").each(function(){
                        if($(this).is(":checked")){
                            chkVal += "," + $(this).val();
                        }
                    });
                    
                    param += "&" + id + "=" + (chkVal != "" ? chkVal.substring(1) : "");
                    
                    chkId = id;
                }
            } else {
                param += "&" + id + "=" + $(this).val();
            }
        } else if(tagName == "SELECT"){
            param += "&" + id + "=" + $(this).val();
            param += "&" + id + "Nm=" + $("option:selected", $(this)).text();
        } else if(tagName == "TEXTAREA"){
            param += "&" + id + "=" + $(this).val();
        }
    });
    
    return param.substring(1);
}


/*******************************************************
 * 페이지 전환 Submit !!
 * 
 * @param {string} actionUrl
 * @param {string} param
 * @param {string} addArea
 * @returns N/A
 * @description 페이지 전환시 사용
 *******************************************************/
function gf_submitMovePage(){
    var args = gf_submitMovePage.arguments;
    
    var actionUrl = args[0];
    var param     = args[1];
    var target    = args.length > 2 ? args[2] : "_self";
    var addAreaId = args.length > 3 ? args[3] : "";
    
    
    
    if($("#movePageForm").length > 0){
        $("#movePageForm").remove();
    }
    
    // 추가 영역에 대한 추가 파라메터 !!
    if(addAreaId != ""){
        param += "&" + gf_searchParam("", addAreaId, "");
    }
    
    var formHtml = "";
    
    var arrParam = param.split("&");
    
    formHtml += '<form id="movePageForm" name="movePageForm" method="get" target="' + target + '" action="' + actionUrl + '">';
    
    for(var i=0; i<arrParam.length; i++){
        var keyVal = arrParam[i].split("=");
        
        formHtml += '    <input id="' + keyVal[0] + '" name="' + keyVal[0] + '" type="hidden" value="' + keyVal[1] + '" />';
    }
    
    formHtml += '</form>';
    
    $("body").append(formHtml);
    
    $("#movePageForm").submit();
}

/*******************************************************
 * 페이지 전환 !!
 * 
 * @param {string} locationUrl
 * @returns {string} param
 * @description : 페이지 전환시 사용 !!
 *******************************************************/
function gf_searchMovePage(){
    var args = gf_searchMovePage.arguments;
    
    var locationUrl = args[0];
    var param       = "";
    
    if(args[1] != null && args[1] != ""){
        param = "?" + args[1] + "&" + gf_searchParam(GV_CURR_PAGE_NO, "", GV_PAGE_COUNT);
    }
    
    location.href = locationUrl + param;
}

function gf_baseMovePage(){
    var args = gf_baseMovePage.arguments;
    
    var locationUrl = args[0];
    var param       = "";
    
    if(args[1] != null && args[1] != ""){
        param = "?" + args[1];
    }
    
    location.href = locationUrl + param;
}



/***********************************************************************
 * 공통 팝업 관련 함수
 **********************************************************************/
/*******************************************************
 * Window Open !!
 * 
 * @param {string} loc     : Popup URL
 * @param {string} popname : Popup Window Name
 * @param {int} width
 * @param {int} height
 * @param {int} left
 * @param {int} top
 * @returns {string} openw : popup window name
 * @description Window Open
 *******************************************************/
function gf_openWin() {
    var args = gf_openWin.arguments;
    
    var loc     = args[0];
    var popname = args.length > 1 ? args[1] : "";
    var width   = args.length > 2 ? args[2] : (document.body.clientWidth  / 2);
    var height  = args.length > 3 ? args[3] : (document.body.clientHeight / 2);
    var left    = 0;
    var top     = 0;
    
    if(args.length < 5) {
        left = (screen.width  - width)  / 2;
        top  = (screen.height - height) / 2;
    }
    
    var status = "toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=0,width=" + width + ",height=" + height + ",top=" + top + ",left=" + left;
    
    var openw = window.open(loc, popname, status);
    
    return openw;
}

/*******************************************************
 * ShowModalDialog OPEN !!
 * 
 * @param {string} url : PopUp URL
 * @param {object} args
 * @param {int} width
 * @param {int} height
 * @returns {object} args
 * @description Modal Window Open
 *******************************************************/
function gf_openWinDialog(url, args, width, height){
    if(!args)
        args = new Object();
    
    var status = "scroll:auto;status:no;help:no;dialogWidth:" + width + "px;dialogHeight:" + height + "px;border-color:#ADADAD";
    
    var ret = window.showModalDialog(url, args, status);
    
    args.returnValue = ret;
    
    return args;
}

/*******************************************************
 * SGA 기본 팝업 Dialog Close !!
 * 
 * @param N/A
 * @description SGA 기본 팝업 Dialog CLOSE
 *******************************************************/
function gf_setPopupMask(maskLayerId) {    // 마스킹
    var maskLayer = $('<div id="' + maskLayerId + '"></div>');
    
    maskLayer.appendTo("#content");
    
    return false;
}

function gf_setPopupFrame(popWid, popHei, maskLayerId, popFrameId) {    // 팝업 기본 구조 세팅
    var popFrame = $('<div id="' + popFrameId + '"></div>').appendTo("#" + maskLayerId);
    
    popFrame.css({ "width":popWid, "height":popHei });
}

/*******************************************************
 * SGA 기본 팝업 Dialog Close !!
 * 
 * @param N/A
 * @description SGA 기본 팝업 Dialog CLOSE
 *******************************************************/
function gf_closePop() {    // 팝업 삭제
    var args = gf_closePop.arguments;
    
    var popOpt = args.length > 0 ? args[0] != "" ? args[0] : "remove" : "remove";
    
    if(popOpt == "remain"){
        $("#maskLayerRemain").hide();
    } else {
        $("#maskLayer").remove();
    }
}

/*******************************************************
 * SGA 기본 팝업 Dialog Open !!
 * 
 * @param {string} popUrl : PopUp URL
 * @param {int} wid
 * @param {int} hei
 * @param {object} data : mapping 시킬 데이터
 * @description Modal Dialog Window Open
 *******************************************************/
function gf_openPop(popUrl, wid, hei, obj) {
    var maskId = "maskLayer";
    var popId  = "popFrame";
    
    var popWid = wid;
    var popHei = "auto";
    
    gf_setPopupMask(maskId);
    gf_setPopupFrame(popWid, popHei, maskId, popId);
    
    var maskLayer = $("#" + maskId);
    var popFrame  = $("#" + popId);
    var popBody   = $("#content");
    
    popFrame.load(popUrl, function (){
        // Calendar
        gf_initialCalendar(popId);
        
        var contentWidth     = popBody.width();        // body content width !!
        var popupWidth       = popFrame.width();       // popup width !!
        var contentScrollTop = popBody.scrollTop();    // body content scrollTop !!
        
        var popupTop  = contentScrollTop - 100;
        var popupLeft = (contentWidth / 2) - (popupWidth / 2);    // popup left !!
        
        // Popup Default CSS Setting !!
        popFrame.css({ "position":"absolute"
                      ,"width"   : (popWid    + "px")
                      ,"left"    : (popupLeft + "px")
                      ,"top"     : (popupTop  + "px")
                    });
        /*
        maskLayer.css({ "position":"fixed"
                       ,"width"   : ("100%")
                       ,"height:" : ("100%")
                     });
        
        popBody.css({"overflow":"hidden"});
        */
        
        // Callback Function
        if(typeof(gf_openPopAfter) == "function") {
            gf_openPopAfter(obj);
        }
    });
    
    // Popup Drag Setting !!
    popFrame.draggable();
}

/*******************************************************
 * SGA 기본 팝업 Dialog Open !!
 * 
 * @param {string} popUrl : PopUp URL
 * @param {int} wid
 * @param {int} hei
 * @param {object} data : mapping 시킬 데이터
 * @description Modal Dialog Window Open : 지우지 않고 남겨둘경우
 *******************************************************/
function gf_openPopRemain(popUrl, wid, hei, obj) {
    var maskId = "maskLayerRemain";
    var popId  = "popFrameRemain";
    
    if($("#" + maskId).length == 0){
        var popWid = wid;
        var popHei = "auto";
        
        gf_setPopupMask(maskId);
        gf_setPopupFrame(popWid, popHei, maskId, popId);
        
        var maskLayer = $("#" + maskId);
        var popFrame  = $("#" + popId);
        var popBody   = $("#content");
        
        popFrame.load(popUrl, function (){
            // Calendar
            gf_initialCalendar(popId);
            
            var contentWidth     = popBody.width();        // body content width !!
            var popupWidth       = popFrame.width();       // popup width !!
            var contentScrollTop = popBody.scrollTop();    // body content scrollTop !!
            
            var popupTop  = contentScrollTop - 100;
            var popupLeft = (contentWidth / 2) - (popupWidth / 2);    // popup left !!
            
            // Popup Default CSS Setting !!
            popFrame.css({ "position":"absolute"
                          ,"width"   : (popWid    + "px")
                          ,"left"    : (popupLeft + "px")
                          ,"top"     : (popupTop  + "px")
                         });
            /*
            maskLayer.css({ "position":"fixed"
                           ,"width"   : ("100%")
                           ,"height:" : ("100%")
                         });
            
            popBody.css({"overflow":"hidden"});
            */
            
            // Callback Function
            if(typeof(gf_openPopAfter) == "function") {
                gf_openPopAfter(obj);
            }
        });
    } else {
        $("#" + maskId).show();
        //$("#content").css({"overflow":"hidden"});
    }
    
    // Popup Drag Setting !!
    $("#" + popId).draggable();
}


/***********************************************************************
 * 문자열 관련 함수
 **********************************************************************/
/*******************************************************
 * 반올림 !!
 * 
 * @param {int} val : 값
 * @param {int} precision : 자리수
 * @returns {int} 반올림 값
 * @description : 반올림 값 return
 *******************************************************/
function gf_round(val, precision){
    var p = Math.pow(10, precision);
    
    return Math.round(val * p) / p;
}

/*******************************************************
 * 올림 !!
 * 
 * @param {int} val : 값
 * @param {int} precision : 자리수
 * @returns {int} 올림 값
 * @description : 올림 값 return
 *******************************************************/
function gf_ceil(val, precision){
    var p = Math.pow(10, precision);
    
    return Math.ceil(val * p) / p;
}

/*******************************************************
 * 내림 !!
 * 
 * @param {int} val : 값
 * @param {int} precision : 자리수
 * @returns {int} 내림 값
 * @description : 내림 값 return
 *******************************************************/
function gf_floor(val, precision){
    var p = Math.pow(10, precision);
    
    return Math.floor(val * p) / p;
}

/*******************************************************
 * 숫자 3자리마다 comma 찍기 !!
 * 
 * @param {int} val : 값
 * @returns {string} comma 가 찍힌 값
 * @description : comma 가 찍힌 값 return
 *******************************************************/
function gf_comma(val) {
    if(!isNaN(val)){
        var strVal = val.toString();
        
        if(strVal.indexOf(".") >= 0){
            var arrVal = val.toString().split(".");
            
            var integerVal = arrVal[0];
            var decimalVal = arrVal[1];
            
            var newVal = integerVal.replace(/(\d)(?=(?:\d{3})+(?!\d))/g,'$1,') + "." + decimalVal;
            
            return newVal;
        } else {
            return strVal.replace(/(\d)(?=(?:\d{3})+(?!\d))/g,'$1,');
        }
        
        //return val.toString().replace(/(\d)(?=(?:\d{3})+(?!\d))/g,'$1,');
        //return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
        return val;
    }
    
    
}

/*******************************************************
 * String Byte 수 return !!
 * 
 * @param {string} str
 * @returns {int} cnt
 * @description : String Byte 수 return
 *******************************************************/
function gf_getStrByte(str){
    var cnt = 0;
    
    for(i=0;i < str.length; i++){
        if(str.substr(i,1) > String.fromCharCode("255")) {
            cnt = cnt + 2;
        } else {
            cnt++;
        }
    }
    
    return cnt;
}

/*******************************************************
 * NULL TO String return !!
 * 
 * @param {string} str
 * @returns {string} str
 * @description :  NULL TO String return
 *******************************************************/
function gf_getNullToString(str){
    if(str == null || str == "undefined" || str == "null" || str == "NULL" || str == "")
        return "";
    else
        return str;
}

/*******************************************************
 * format 맞추기 !!
 * 
 * @param {string} data
 * @returns {string} mask
 * @description : format 맞추기
 *******************************************************/
function gf_toMask(data, mask) {
    var data   = data.replace(/[^a-z|^A-Z|^\d]/g,'');
    var len    = data.length;
    var result = "";
    var j = 0;
    
    for(var i = 0; i < len; i++){
        result += data.charAt(i);
        
        j++;
        
        if (j < mask.length && "-:|/.".indexOf(mask.charAt(j)) != -1 )
            result += mask.charAt(j++);
    }
    
    return result;
}

/*******************************************************
 * Input Event 설정 : 숫자만 가능하게 처리 !!
 * 
 * @param {string} data
 * @returns {string} mask
 * @description : Input Event 설정 : 숫자만 가능하게 처리 !!
 *******************************************************/
function gf_onlyKeyNumber(targetId){
    $("#" + targetId + " ._onlynumber").on("keyup", function(e){
        e.preventDefault();
        
        $(this).val($(this).val().replace(/[^0-9]/gi, ""));
    });
}

/*******************************************************
 * Input Event 설정 : 숫자만 가능하게 처리 (소수점 포함) !!
 * 
 * @param {string} data
 * @returns {string} mask
 * @description : Input Event 설정 : 숫자만 가능하게 처리 !!
 *******************************************************/
function gf_onlyKeyNumberPoint(targetId){
    $("#" + targetId + " ._onlynumberpoint").on("keyup", function(e){
        e.preventDefault();
        
        $(this).val($(this).val().replace(/[^0-9.]/gi, ""));
    });
}

/*******************************************************
 * 저장 조건 Check !!
 * 
 * @param {string} objId : 저장 form ID or Check 하고 픈 영역의 ID
 * @description 일반적인 Form 저장 조건 Check
 *******************************************************/
function gf_storeDataCheck(){
    var args = gf_storeDataCheck.arguments;
    
    var checkArea = args.length > 0 ? args[0] : "registArea";
    var userChkId = args.length > 1 ? args[1] : "";
    
    if($("#" + checkArea).length == 0){
        return false;
    }
    
    var bool = true;
    
    $("#" + checkArea + " ._required").each(function(idx) {
        var id  = $(this).attr("id");
        var val = $(this).val();
        
        var tagName   = $(this).prop("tagName").toUpperCase();
        var maxlength = Number($(this).attr("maxlength"));
        var thTxt     = $(this).parent().prev().text();    // <th> Tag Text
        
        // 필수 체크
        if(val == ""){
            // [field Name] (은)는 필수 입력/선택입니다.
            alert(thTxt.replace(" *", "") + "(은)는 필수" + (tagName == "SELECT" ? "선택" : "입력") + "입니다.");
            
            $(this).focus();
            
            bool = false;
            
            return false;
        }
        
        // 입력 Byte 수 체크
        if(maxlength != null){
            if(gf_getStrByte(val) > maxlength){
                alert(thTxt.replace(" *", "") + "의 최대 입력 길이 초과입니다.");
                
                $(this).focus();
                
                bool = false;
                
                return false;
            }
        }
    });
    
    return bool;
}

/*******************************************************
 * 저장 조건 List Check !!
 * 
 * @param {string} objId : 저장 form ID or Check 하고 픈 영역의 ID
 * @description 일반적인 Form 저장 조건 Check
 *******************************************************/
function gf_storeListDataCheck(){
    var args = gf_storeListDataCheck.arguments;
    
    var checkArea = args.length > 0 ? args[0] : "registArea";
    var userChkId = args.length > 1 ? args[1] : "";
    
    if($("#" + checkArea).length == 0){
        return false;
    }
    
    var bool = true;
    
    $("#" + checkArea + " ._required").each(function(idx) {
        var id  = $(this).attr("id");
        var val = $(this).val();
        
        var tagName   = $(this).prop("tagName").toUpperCase();
        var maxlength = Number($(this).attr("maxlength"));
        var thTxt     = $("#" + checkArea + " thead th:eq(" + $(this).parent().index() +")").text();
        
        // 필수 체크
        if(val == ""){
            // [field Name] (은)는 필수 입력/선택입니다.
            alert(thTxt + " (은)는 필수" + (tagName == "SELECT" ? "선택" : "입력") + "입니다.");
            
            $(this).focus();
            
            bool = false;
            
            return false;
        }
        
        // 입력 Byte 수 체크
        if(maxlength != null){
            if(gf_getStrByte(val) > maxlength){
                alert(thTxt + " 의 최대 입력 길이 초과입니다.");
                
                $(this).focus();
                
                bool = false;
                
                return false;
            }
        }
    });
    
    return bool;
}

/*******************************************************
 * 값 초기화 !!
 * 
 * @param {string} targetId : form ID or Area ID
 * @param {string} excepId  : 제외할 Object ID
 * @returns N/A
 * @description 값 초기화
 *******************************************************/
function gf_initializeArea(){
    var args = gf_initializeArea.arguments;
    
    var targetId = args[0];
    var excepId  = args.length > 0 ? args[1] : "";
    
    $("#" + targetId + " *").each(function() {
        var id      = $(this).attr("id");
        var tagName = $(this).prop("tagName").toUpperCase();
        
        
        if(id != null){
            var bool = true;
            
            if(excepId != null){
                var arrExcepId = excepId.split(",");
                
                for(var i=0; i<arrExcepId.length; i++){
                    if(id == arrExcepId[i]){
                        bool = false;
                        break;
                    }
                }
            }
            
            if(bool){
                if(tagName == "INPUT" || tagName == "TEXTAREA"){
                    var type = $(this).attr("type");
                    
                    if(type == "checkbox" || type == "radio"){
                        $(this).prop("checked", false);
                    } else {
                        $(this).val("");
                    }
                } else if(tagName == "SELECT"){
                    $(this).val("").prop("selected", "selected");
                } else if(tagName == "SPAN"){
                    $(this).text("");
                }
            }
        }
    });
}

/*******************************************************
 * 달력 !!
 * 
 * @param {string} targetId
 * @param {string} opt [dynamic/static] : 동적으로 달력을 적용할 경우 처리
 * @description 달력
 *******************************************************/
function gf_initialCalendar(){
    var args = gf_initialCalendar.arguments;
    
    var targetId = args[0];
    var opt      = args.length > 0 ? args[1] : "static";
    
    
    $("#" + targetId + " .date_picker").each(function() {
        // 동적으로 달력을 추가할 경우 Class를 지우고 들어감.
        if(opt == "dynamic"){
            $(this).removeClass("hasDatepicker");
        }
        
        $(this).datepicker({
           /* Button으로 설정시
            showOn: "button"
           ,buttonImage: "images/btn_cal.png"
           ,buttonImageOnly: true
           ,buttonText: "날짜 선택"
           ,buttonClass: "find_date"
           */
            dateFormat: "yy.mm.dd"
           ,dayNames: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
           ,dayNamesMin: ["일", "월", "화", "수", "목", "금", "토"]
           ,dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"]
           ,monthNames: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]
           ,monthNamesShort: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]
           ,changeMonth: true 
           ,changeYear: true
           ,prevText: "이전달"
           ,nextText: "다음달"
           ,showOtherMonths: true
           ,showMonthAfterYear: true
            
           ,beforeShowDay: function (day,year) {
                //alert($('.ui-datepicker').find('.ui-datepicker-year').html());
                var result;
                
                switch (day.getDay()) {
                    case 0: // 일요일?
                        result = [true, "ui-date-sunday"];
                        break;
                    case 6: // 토요일?
                        result = [true, "ui-date-saturday"];
                        break;
                    default:
                        result = [true, ""];
                        break;
                }
                
                return result;
            }
           ,onSelect: function (dateText, obj) {
                if(typeof(gf_onSelectCalendar) == "function") {
                    gf_onSelectCalendar(dateText, obj);
                }
            }
        });
        
        $(".ui-datepicker-calendar > thead td.ui-datepicker-week-end:last-child a").addClass("ui-date-saturday");
    });
}

/*******************************************************
 * 한 건 Data Mapping !!
 * 
 * @param {string} targetId : Mapping 시킬 영역 ID [ form ID or div ID or 등등 ]
 * @param {object} data : Data Information
 * @param {int} sep : 첨자가 들어갔을 경우 자리수
 * @returns N/A
 * @description 한 건 Data Mapping
 *******************************************************/
function gf_setDataMapping(){
    var args = gf_setDataMapping.arguments;
    
    var data     = args[0];
    var targetId = args[1];
    var sep      = args.length > 2 ? args[2] : 0;
    
    $("#" + targetId + " *").each(function() {
        var tagName = $(this).prop("tagName").toUpperCase();
        
        if(tagName == "INPUT" || tagName == "SELECT" || tagName == "TEXTAREA" || tagName == "SPAN"){
            var id = $(this).attr("id");
            
            if(id != null && id != ""){
                var val = eval("data.dataInfo[0]." + gf_castIdString(id, sep));
                if($(this).hasClass("_onlynumber") || $(this).hasClass("_onlynumberpoint")){
                    val = isNaN(val) ? val : gf_comma(val);    // 숫자로만 구성 된 경우 천단위 Comma 를 붙여줌
                }
                
                if(val != null && val != ""){
                    if(tagName == "SPAN"){
                        $(this).html(val);
                    } else if(tagName == "SELECT"){
                        $("#" + targetId + " select[id=" + id + "]").val(val).prop("selected", "selected");
                    } else {
                        var type = $(this).attr("type");
                        
                        if(type == "checkbox"){
                            // 나중에 추가
                        } else if(type == "radio"){
                            // 나중에 추가
                        } else {
                            $(this).val(val);
                        }
                    }
                    
                    $(this).attr("title", val);
                }
            }
        }
    });
}

/*******************************************************
 * ID Cast !!
 * 
 * @param {string} str : Control ID
 * @returns N/A
 * @description ID Cast !!
 *******************************************************/
function gf_castIdString(str, sep){
    var returnVal = "";
    
    str = str.replace(/-./g, "");
    
    if(sep > 0){
        var tmpStr = str.substring(0, sep + 1).toLowerCase();
        str = tmpStr.substring(sep) + str.substring(sep + 1);
    }
    
    var strBool = new RegExp('[A-Z]');
    var chars   = "abcdefghijklmnopqrstuvwxyz";  
    
    if(strBool.test(str)){
       for (var inx=0; inx<str.length; inx++) {
           if(chars.indexOf(str.charAt(inx)) == -1){
               returnVal += "_" + str.charAt(inx).toLowerCase();
           } else {
               returnVal += str.charAt(inx);
           }
       } 
    } else {
        returnVal = str;
    }
    
    return returnVal.toUpperCase();
}

/*******************************************************
 * Browser Check !!
 * 
 * @returns {string} checkFlag
 * @description : Browser Check !!
 *******************************************************/
function gf_getBrowserCheck(){
    var checkFlag = ""
    
    if(navigator.userAgent.toLowerCase().indexOf('chrome') != -1) {
        checkFlag = "T";  // Chrome
    } 
    
    if(navigator.userAgent.match(/Trident\/(\d.\d)/i) != null){
        if(navigator.userAgent.match(/Trident\/(\d.\d)/i)[1] >= '6.0') {
            checkFlag = "T";  // IE 10 이상 TEN
        } else {
            checkFlag = "N";  // IE 10 이하 NINE
        }
    }
    
    return checkFlag;
}

/*******************************************************
 * 일반 파일 다운로드 Submit Initialize!!
 * 
 * @param {string} param
 * @param {string} actionUrl
 * @returns N/A
 * @description 페이지 전환시 사용
 *******************************************************/
function gf_genFileDownLoad(){
    var args = gf_genFileDownLoad.arguments;
    
    var param        = args[0];
    var actionChkUrl = args.length > 1 ? args[1] : "/common/commonDownloadFileChk.do";
    var actionUrl    = args.length > 2 ? args[2] : "/common/commonDownloadFile.do";
    
    if($("#genDownloadForm").length > 0){
        $("#genDownloadForm").remove();
    }
    
    var formHtml = "";
    
    var arrParam = param.split("&");
    
    formHtml += '<form id="genDownloadForm" name="genDownloadForm" method="get" action="' + actionChkUrl + '">';
    
    for(var i=0; i<arrParam.length; i++){
        var keyVal = arrParam[i].split("=");
        
        formHtml += '    <input id="' + keyVal[0] + '" name="' + keyVal[0] + '" type="hidden" value="' + keyVal[1] + '" />';
    }
    
    formHtml += '    <input id="actionUrl" name="actionUrl" type="hidden" value="' + actionUrl + '" />';
    
    formHtml += '</form>';
    
    $("body").append(formHtml);
    
    gf_sendForm("genDownloadForm", "", gf_genFileDownLoadAfter);
}

/*******************************************************
 * 일반 파일 다운로드 Check After Submit !!
 * 
 * @param {object} data
 * @returns N/A
 * @description 파일 다운로드
 *******************************************************/
function gf_genFileDownLoadAfter(data){
    if(Number(data.result) > 0){
        $("#genDownloadForm").attr("action", data.actionUrl).submit();
    } else {
        alert("지정된 경로에 파일이 없습니다.");
    }
}

/*******************************************************
 * List Excel Download !!
 * 
 * @param {string} actionUrl
 * @param {string} targetId
 * @param {string} param
 * @returns N/A
 * @description List Excel Download
 *******************************************************/
function gf_genExcelDownListForm(){
    var args = gf_genExcelDownListForm.arguments;
    
    var opt = args.length > 0 ? args[0] : {};
    
    var actionUrl = opt.actionUrl;    // action Url
    var targetId  = opt.targetId == null ? DE_DATA_GRID_ID : opt.targetId;    // target Id
    var param     = opt.param    == null ? gf_searchParam() : opt.param;      // Param
    var excepCol  = opt.excepCol == null ? "" : opt.excepCol;                 // Exception Column
    
    if($("#genExcelDownForm").length > 0){
        $("#genExcelDownForm").remove();
    }
    
    var formHtml = "";
    
    var arrParam = param.split("&");
    
    formHtml += '<form id="genExcelDownForm" name="genExcelDownForm" method="post" action="' + actionUrl + '">';
    
    for(var i=0; i<arrParam.length; i++){
        var keyVal = arrParam[i].split("=");
        
        formHtml += '    <input id="' + keyVal[0] + '" name="' + keyVal[0] + '" type="hidden" value="' + keyVal[1] + '" />';
    }
    
    // 제외 Column
    var arrExcepCol = excepCol != "" ? excepCol.split(",") : null;
    
    // Excel Title Name !!
    var tempTitle = "";
    
    $("#" + targetId + " thead:eq(0) tr th").each(function(idx) {
        var bool = true;
        var titleText = $(this).text();
        
        for(var i=0; i<arrExcepCol.length; i++){
            if(i == idx){
                bool = false;
                break;
            }
        }
        
        if(bool){
            tempTitle += "," + titleText;
        }
    });
    
    formHtml += '    <input id="titleInfo" name="titleInfo" type="hidden" value="' + tempTitle.substring(1) + '" />';
    
    
    // Excel Title Width !!
    var tempWidth = "";
    
    $("#" + targetId + " colgroup col").each(function(idx) {
        var bool = true;
        var titleWidth = $(this).css("width");
        
        for(var i=0; i<arrExcepCol.length; i++){
            if(i == idx){
                bool = false;
                break;
            }
        }
        
        if(bool){
            var wid = Math.ceil(titleWidth.replace("%", ""));
            
            tempWidth += "," + wid;
        }
    });
    
    formHtml += '    <input id="titleWidth" name="titleWidth" type="hidden" value="' + tempWidth.substring(1) + '" />';
    
    
    // Excel Cell Align !!
    var tempAlign = "";
    
    $("#" + targetId + " tbody tr:eq(0) td").each(function(idx) {
        var bool = true;
        
        for(var i=0; i<arrExcepCol.length; i++){
            if(i == idx){
                bool = false;
                break;
            }
        }
        
        if(bool){
            if($(this).hasClass("tl")){
                tempAlign += ",L";
            } else if($(this).hasClass("tr")){
                tempAlign += ",R";
            } else {
                tempAlign += ",C";
            }
        }
    });
    
    formHtml += '    <input id="colAlign" name="colAlign" type="hidden" value="' + tempAlign.substring(1) + '" />';
    
    formHtml += '</form>';
    
    $("body").append(formHtml);
}