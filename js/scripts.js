$(document).ready(function(){
    $('body').show();
    $('.error').hide();
    $('.section2').hide();
    if(window.sessionStorage){
        var addingTabID = function(){
            var random = Math.floor((Math.random() * 1000) + 1);
            if((window.sessionStorage.getItem("TAB_ID") && window.sessionStorage.getItem("TAB_ID") != random) || !window.sessionStorage.getItem("TAB_ID")){
                window.sessionStorage.setItem("TAB_ID", "TAB_ID_" + random);
            }else{
                addingTabID();
            }
        }
        addingTabID();
    }
    function checkAllParams(){
        var total = 0,
            allParams = $('form input');
        for(var i=0; i<allParams.length; i++){
            var currentParam = ($(allParams[i])[0]);
            var thisType = currentParam.attributes.type.value,
                thisVal = currentParam.value,
                thisName = currentParam.name;
            orderObj[thisName] = thisVal;
            if(thisType == "number"){
                if(thisName == "cheeseSlice"){
                    total += thisVal * 2;
                }else if(thisName == "cutlet"){
                    total += thisVal * 1;
                }
            }else if(thisName == "salad" && currentParam.checked && thisVal=="Y"){
                total += 5;
            }else if(thisName == "bun"){
                total += (2 * 5); //Buns price added by hardcode
            }
        }
        return total;
    }

    var newTotal = 0, allFilled=false, orderObj={};
    $('form input').on("change",function(e){
        $('.error').hide();
        var thisType = ($(e.currentTarget)[0]).attributes.type.value,
                thisVal = (($(e.currentTarget)[0]).value),
                thisName = ($(e.currentTarget)[0]).name;
        if(thisType == "number" && thisVal < 0){
            ($(e.currentTarget)[0]).value = 0;
        }
        newTotal = checkAllParams();
        $("#totalPrice").html(newTotal);
    });
    $("#totalPrice").html(newTotal);

    $('#OrderNow').on("click", function(e){
        var form = $('form');
        var totl = checkAllParams();
        orderObj['grandTotal'] = totl;
        checkAllReqFields();
        if(allFilled && window.sessionStorage){
            window.sessionStorage.setItem("Order_"+ (window.sessionStorage.getItem("TAB_ID")).split("_ID_")[1], JSON.stringify(orderObj) );
            alert("Order registered successfully!!!");
            document.getElementsByName("order")[0].reset();
            $("#totalPrice").html("0");
        }else{
            $('.error').show();
        }
    });

    function checkAllReqFields(){
        var total = 0, bRadio = -1,
            allParams = $('form input');
        for(var i=0; i<allParams.length; i++){
            var currentParam = ($(allParams[i])[0]);
            var thisType = currentParam.attributes.type.value,
                thisVal = currentParam.value,
                thisName = currentParam.name;
            if((thisType == "number" && thisVal>0)){
                allFilled = true;
            }else if(thisType == "radio"){
                bRadio++;
                if(currentParam.checked){
                    allFilled = true;
                    bRadio++;
                }else if(bRadio == 1){
                    allFilled = false;
                    break;
                }
            }else if(thisVal && thisVal!=""){
                allFilled = true;
            }else{
                allFilled = false;
                break;
            }
        }
    }

    var allNames = 
    $('#toggleOrderView').on("click", function(e){
        $('.section1').toggle();
        $('.section2').toggle();
        $('section').each(function() {
            if ($(".section2").is(':visible')){
                arrangeOrders();
            }
        })
    });

    $('.section2 input').on("keyup",function(e){
        var thisVal = (($(e.currentTarget)[0]).value);
        arrangeOrders(thisVal);
    });

    function arrangeOrders(filterName){
        $('ul.firstLevel li ul li.orderList').remove();
            var allStoredKeys = Object.keys(window.sessionStorage);
            for(var key in allStoredKeys){
                order = allStoredKeys[key];
                if(order.indexOf("Order_") > -1){
                    var completeOrder = JSON.parse(window.sessionStorage[order]);
                    if(filterName){
                        if( ((completeOrder['name']).toLowerCase()).indexOf(filterName.toLowerCase()) == -1){
                            continue;
                        }
                    }
                    for(var head in completeOrder){
                        $('ul.'+head).append("<li class='orderList'>"+ completeOrder[head] +"</li>");
                    }
                    $('ul.key').append("<li class='orderList'>"+ order +"</li>");
                }
            }
    }

});