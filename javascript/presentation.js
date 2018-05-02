//      do this ASAP
jQuery('#hidden').css("visibility", "hidden");

//type machine
var ticker = {

    fontSizeSamplingTime: 30,

    selectedImage: 0,

    imageLinkArray: [],

    imageObjectArray: [],

    textWithHTML: '',

    textWithoutHTML: '',

    /** 220 characters per minute if fast typing */
    delayPerLetter: 7,

    timeSpentLoading: 0,

    currentChar: 1,

    manualImageChange: false,

    resizeTimeout: null,

    maxHeight: 0,

    hiddenDiv: null,

    fontSize: 8,

    picChangeDelay: 25000,

    init: function(){
        ticker.currentChar = 1;
        ticker.textWithHTML = ticker.textWithHTML.replace(/\s\s+/g, ' ');
        ticker.textWithoutHTML = ticker.stripHTML(ticker.textWithHTML);
        ticker.preloadNextImage();
        ticker.workOutBestFontSize();
        this.screenResizerSetup();
        this.swapWithIframe();
    },

    preloadNextImage: function(){
        jQuery("img").click(
            function(){
                ticker.manualImageChange = true;
                ticker.changePic(true);
                ticker.manualImageChange = false;
            }
        );
        var newImage = ticker.selectedImage+1;
        if(newImage >= ticker.imageLinkArray.length) {
            newImage = 0;
        } else {
            ticker.imageObjectArray[newImage] = new Image();
            ticker.imageObjectArray[newImage].src = ticker.imageLinkArray[newImage];
        }
    },

    workOutBestFontSize: function()
    {
        ticker.timeSpentLoading += ticker.fontSizeSamplingTime + 10;
        if(ticker.maxHeight === 0) {
            ticker.maxHeight = parseFloat(jQuery("#message").height());
            ticker.hiddenDiv = jQuery("#hidden");
            ticker.innerDiv = jQuery('#inner');
            ticker.innerDiv.html("...");
        }
        var height = ticker.hiddenDiv.height();
        //for bigger screens, we speed up the process ...
        if(ticker.fontSizeSamplingTime > 5) {
            ticker.fontSizeSamplingTime--;
        }
        if(height < ticker.maxHeight) {
            ticker.fontSize = ticker.fontSize + 0.5;
            ticker.hiddenDiv.css("fontSize", ticker.fontSize + "px");
            window.setTimeout(
                ticker.workOutBestFontSize,
                ticker.fontSizeSamplingTime
            );
        } else {
            ticker.innerDiv
                .css("fontSize", ticker.fontSize + "px")
                .css("display", "block");
            var delayTime = 500 - ticker.timeSpentLoading;
            if(delayTime < 10) {
                delayTime = 10;
            }
            ticker.startTicking(delayTime);
        }
    },

    startTicking: function(delayTime)
    {
        if(typeof delayTime !== 'number') {
            delayTime = 0;
        }
        window.setTimeout(
            function() {
                jQuery('#loading').fadeOut(
                    function() {
                        jQuery('#page').fadeIn(
                            function() {
                                ticker.type();
                            }
                        );
                    }
                );
            },
            delayTime
        );
    },

    screenResizerSetup: function(){
        jQuery(window).on(
            'resize',
            function() {
                window.clearTimeout(ticker.resizeTimeout);
                ticker.resizeTimeout = window.setTimeout(
                    function() {
                        window.location = window.location;
                    },
                    300
                );
            }
        );
    },


    type: function(){
        var textToAdd = ticker.textWithoutHTML.substr(0, ticker.currentChar);
        ticker.innerDiv.html(textToAdd);
        ticker.currentChar++;
        //end
        if (ticker.currentChar > ticker.textWithoutHTML.length){
            ticker.innerDiv.html(ticker.textWithHTML);
            ticker.currentChar = 1;
            jQuery("body").addClass("ticker-finished");
            window.setTimeout(
                ticker.changePic,
                ticker.picChangeDelay
            );
        }
        //run again
        else{
            window.setTimeout(
                ticker.type,
                ticker.delayPerLetter
            );
        }
    },

    stripHTML: function(html)
    {
       var tmp = document.createElement("DIV");
       tmp.innerHTML = html;
       return tmp.textContent || tmp.innerText || "";
   },

    changePic: function(){
        ticker.selectedImage++;
        if(ticker.selectedImage >= ticker.imageLinkArray.length) {
            ticker.selectedImage = 0;
        }
        var url = ticker.imageLinkArray[ticker.selectedImage];
        // console.debug(ticker.selectedImage);
        // console.debug(ticker);
        // console.debug(url);
        jQuery("img").attr("src", url);
        jQuery("body").css("backgroundImage", "url("+url+")");
        ticker.preloadNextImage();
        if(!ticker.manualImageChange) {
            window.setTimeout(
                ticker.changePic,
                ticker.picChangeDelay
            );
        }
    },

    swapWithIframe: function()
    {
        jQuery('#current-site a').click(
            function() {
                if(jQuery('body').hasClass('showing-site')) {
                    jQuery('body')
                        .removeClass('showing-site')
                        .addClass('not-showing-site');
                } else {
                    jQuery('body')
                        .addClass('showing-site')
                        .removeClass('not-showing-site');
                    //jQuery('#message').append(jQuery('iframe').first());
                }
                var text = jQuery(this).text();
                jQuery(this).text(jQuery(this).attr('data-alternative-text'));
                jQuery(this).attr('data-alternative-text', text);
                return false;
            }
        );
    }


};

jQuery(document).ready(
    function(){
        ticker.init();
    }
);
