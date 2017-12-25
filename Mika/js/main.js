var clickEvent = ('ontouchstart' in window ? 'touchend' : 'click');
var isMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|BlackBerry|Android)/i) != null;
var mdown = "mousedown";
var mmove = "mousemove";
var mup = "mouseup";
if (isMobile) {
    mdown = "touchstart";
    mmove = "touchmove";
    mup = "touchend";
}

var press = false;
$(function() {

    $(".footnotes").on("touchend", function() {
        $(this).toggleClass("footnotes--visible");
    });

    CommunicateEmbedded.ready(function() {
        var triggered = false;
        
        $('[data-fire-event]')
        .on('touchstart', function () {
            $(this).attr('data-moved', '0');
        })
        .on('touchmove', function () {
            $(this).attr('data-moved', '1');
        })
        .on('touchend', function () {
            if($(this).attr('data-moved') == 0){
                if ( triggered ) {
                    return;
                }
                triggered = true;
                CommunicateEmbedded.fireEvent($(this).attr('data-fire-event'));
            }  
        });
        var astellasFooter = new AstellasFooter({
            json: CommunicateEmbedded.presentationContext.config,
            isFullSizeLib: true
        });
    });
});
