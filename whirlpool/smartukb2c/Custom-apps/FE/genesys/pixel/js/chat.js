window.agentCount = 0;
window.subscribe = false;


$(document).ready(function() {
    console.log("work");
    $('.toggle_tertiary').click(function() {
        $('.Tertiary_1').toggleClass('TertiaryVisible');
        $('.Tertiary_1').toggle();
        $('.Tertiary_2').toggleClass('TertiaryVisible');
        $('.livepersonstatusimage').toggleClass('TertiaryVisible');
    });

    var brand = window.location.href.includes("hotpoint") ? "hotpoint" : "indesit";
    if (brand === "indesit") {
        $('.toggle_tertiary').attr("src", "https://smartukb2c.vteximg.com.br/arquivos/indesit.live-chat-guy.png");
        $('.Tertiary_Chat p').click(function() {
            setTimeout(function() {
                $('.cx-btn-group').addClass("indesit-theme");
                $('.cx-icon:first').html("<img style=\"height:27px;\" src=\"arquivos/logo_indesit.png\" />")
                $('.cx-icon:first').css("background-image", "none");
            }, 500);
        })
    }

    var isCheckout = window.location.href.includes("checkout");
    var isThankYouPage = window.location.href.includes("orderPlaced");

    window.addEventListener('locationchange', function() {
        isHomePage = window.location.pathname == "/";
        isCheckout = window.location.href.includes("checkout");
        isThankYouPage = window.location.href.includes("orderPlaced");
        $('a img.toggle_tertiary').show();
        $('.can_i_help').show();
        $('.Tertiary').css("bottom", "12%").css("right", "120px");
    })
});


if (!window._genesys)
    window._genesys = {};

if (!window._gt)

    window._gt = [];
window._genesys.widgets = {
    main: {
        theme: 'light',
        lang: "en",
        i18n: {
            "en": {
                "webchat": {
                    "BotConnected": "",
                    "BotDisconnected": ""
                }
            }
        }
    },
    webchat: {},
    cobrowse: {},
};



window._genesys.widgets.webchat = {
    apikey: 'b638772e-4b33-4c11-8b41-5af1b096b140',
    userData: {
        ChatTranscript: true
    },
    transport: {
        type: 'pureengage-v3-rest',
        dataURL: 'https://api-euw1.digital.genesyscloud.com/nexus/v3/chat/sessions',
        headers: {
            'x-api-key': 'b638772e-4b33-4c11-8b41-5af1b096b140'
        },
        stream: 'live',
        endpoint: 'GlobalChatSwitchboard'
    },
    emojis: true,
    uploadsEnabled: false,
    confirmFormCloseEnabled: true,
    actionsMenu: true,
    maxMessageLength: 140,

    autoInvite: {
        enabled: false,
        timeToInviteSeconds: 10,
        inviteTimeoutSeconds: 30
    },
    chatButton: {
        enabled: true,
        template: "<div class='cx-icon' data-icon='chat'></div>",
        effect: 'fade',
        openDelay: 1000,
        effectDuration: 300,
        hideDuringInvite: true
    },
    minimizeOnMobileRestore: false,
    markdown: false,
};


var chatCnt = 0;

function selectchat() {
    $('.Tertiary_Chat_Planning').hide();
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var d = today.getDay();

    $('.Tertiary_1_2 .chatStatus').hide();

    if (
        ((d > 0 && d < 6) && (((h * 100 + m) > 759) && ((h * 100 + m) < 1800))) ||
        ((d == 0) && (((h * 100 + m) > 829) && ((h * 100 + m) < 1530))) ||
        ((d == 6) && (((h * 100 + m) > 829) && ((h * 100 + m) < 1630)))
    ) {
        $('.Tertiary_1_2 .chatStatus.on').hide();
    } else {
        $('.Tertiary_1_2 .chatStatus.off').hide();
    }

    $('.Tertiary_Chat').show();
    $('.Tertiary .Tertiary_2').hide();
    $('.Tertiary .Tertiary_1').hide();
    $('.TertiaryVisible').css('visibility', 'visible');

}

function selectChatPlanning() {
    $('.Tertiary_Chat').hide();
    $('.Tertiary_Chat_Planning').show();
}

function closeSelectChatPlanning() {
    $('.Tertiary_Chat_Planning').hide();
}

function openchat(type = 'Claims', choice = '', chatStyle = 'standard') {
    var welcomeText = '';
    if (type == 'Claims') {
        welcomeText = 'Claims chat';
    } else if (type == 'Service') {
        welcomeText = 'Service chat';
    }

    welcomeText = choice;

    $('.Tertiary_Chat').hide();
    $('.Tertiary_Chat_Planning').hide();


    $('.Tertiary .Tertiary_1').hide();
    $('.TertiaryVisible').css('visibility', 'hidden');

    window.oMyPlugin = window._genesys.widgets.bus.registerPlugin('MyPlugin' + chatCnt++);

    /*
      window._genesys.widgets.common.Generate.Container(
      {type:'generic',title:'My Toast',body:'Some HTML here as a string or jQuery wrapped set',icon:'chat',controls:'',buttons:{type:'binary',primary:'OK',secondary:'cancel'}}
      );
    */
    if (chatStyle == 'standard') {
        $('.cx-widget.cx-window-manager.cx-theme-light').show();

        window.oMyPlugin.command('WebChat.open', {
            userData: {
                FirstName: 'firstName',
                LastName: 'lastName',
                EmailAddress: 'email',
                Subject: 'subject',
                Department: type
            },
            title: "Chat with us",
            icon: 'icon',
            html: "<div>Example text</div>",
            formJSON: {
                wrapper: "<table>" + welcomeText + "</table>",
                inputs: [
                    { id: "cx_webchat_form_firstname", name: "firstname", maxlength: "100", placeholder: "@i18n:webchat.ChatFormPlaceholderFirstName", label: "First name*" },
                    {
                        id: "cx_webchat_form_lastname",
                        name: "lastname",
                        maxlength: "100",
                        placeholder: "@i18n:callback.CallbackPlaceholderRequired",
                        label: "Last name*",
                        validate: function(event, form, input, label, $, CXBus, Common) {
                            var pattern = /^[a-zA-Z ]+$/;
                            if (input) {
                                if (input.val() == "") {
                                    return false;
                                }
                                if (pattern.test(input.val())) {
                                    return true;
                                }
                                return false;
                            }
                        }
                    },
                    {
                        id: "cx_form_callback_phone_number",
                        required: "required",
                        name: "phonenumber",
                        maxlength: "14",
                        placeholder: "@i18n:callback.CallbackPlaceholderRequired",
                        label: "Phone*",
                        validateWhileTyping: true, // default is false
                        validate: function(event, form, input, label, $, CXBus, Common) {
                            window.chatEnded = false;
                            window.agentCount = 0;
                            window.cxbusSaved = CXBus;
                            if (window.subscribe == false && typeof CXBus != 'undefined') {
                                CXBus.subscribe("WebChatService.messageReceived", function(e) {
                                    if (e.data) {
                                        var aOriginalMsgs = e.data.originalMessages;
                                        if (aOriginalMsgs.length) {
                                            for (let i = 0; i < aOriginalMsgs.length; i++) {
                                                var aOriginalMsg = aOriginalMsgs[i];
                                                if (aOriginalMsg.type == "Text") {
                                                    if (aOriginalMsg.text == "GenesysTerminateChat" && window.chatEnded == false) {
                                                        CXBus.command("WebChatService.endChat");
                                                        window.chatEnded = true;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                });
                                window.subscribe = true;
                            }

                            var pattern = /^\d{11}$/;
                            if (input) {
                                if (input.val() == "") {
                                    return false;
                                }
                                if (pattern.test(input.val())) {
                                    return true;
                                }
                                return false;
                            }
                        }
                    },
                    {
                        id: "cx_form_email",
                        name: "email",
                        maxlength: "50",
                        placeholder: "myemail@example.com",
                        label: "Email",
                        required: "true",
                        validateWhileTyping: true, // default is false
                        validate: function(event, form, input, label, $, CXBus, Common) {
                            if (input) {
                                pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

                                if (input.val() == "") {
                                    return false;
                                }
                                if (pattern.test(input.val())) {
                                    return true;
                                }
                                return false;
                            }
                        }
                    },
                    {
                        id: "cx_form_transcript",
                        name: "transcript",
                        type: "checkbox",
                        label: "Keep the chat transcript",
                        wrapper: '<tr><th class="chtra"></th><td class="chtra">{input} {label}</td></tr>'
                    },
                    { id: "cx_form_topic", name: "topic", value: choice, type: "hidden" }
                ]
            },
        }).done(function(e) {
            window.oMyPlugin.subscribe('WebChatService.agentConnected', function(e) {
                window.agentCount++;
            });
            window.oMyPlugin.subscribe('WebChatService.agentDisconnected', function(e) {
                window.agentCount--;
                if (window.agentCount == 0) {
                    //		  window.oMyPlugin.command('WebChat.endChat').done(function(e){
                    //		  });
                }

            });

        });

    } else {
        $('.cx-widget.cx-window-manager.cx-theme-light').show();
        window.oMyPlugin.command('WebChat.open', {
            userData: {
                Department: type,
                ChatTranscript: false
            },
            title: "Chat with us",
            icon: 'icon',
            html: "<div>Example text</div>",
            formJSON: {
                wrapper: "<table>" + welcomeText + "</table>",
                inputs: [{
                    id: "cx_webchat_form_engnum",
                    name: "firstname",
                    maxlength: "100",
                    placeholder: "Engineer number",
                    label: "What is your engineer number?",
                    wrapper: '<tr><th style="padding:0">{label}</th></tr><tr><td>{input}</td></tr>',
                    validateWhileTyping: true, // default is false
                    validate: function(event, form, input, label, $, CXBus, Common) {
                        window.chatEnded = false;
                        window.agentCount = 0;
                        window.cxbusSaved = CXBus;
                        if (window.subscribe == false && typeof CXBus != 'undefined') {
                            CXBus.subscribe("WebChatService.messageReceived", function(e) {

                                if (e.data) {
                                    var aOriginalMsgs = e.data.originalMessages;
                                    if (aOriginalMsgs.length) {
                                        for (let i = 0; i < aOriginalMsgs.length; i++) {
                                            var aOriginalMsg = aOriginalMsgs[i];
                                            if (aOriginalMsg.type == "Text") {
                                                if (aOriginalMsg.text == "GenesysTerminateChat" && window.chatEnded == false) {
                                                    CXBus.command("WebChatService.endChat");
                                                    window.chatEnded = true;
                                                }
                                            }
                                        }
                                    }
                                }

                            });
                            window.subscribe = true;
                        }

                        if (input) {
                            var pattern = /^[0-9]{5}$/
                            if (input.val() == "") {
                                return false;
                            }
                            if (pattern.test(input.val())) {
                                return true;
                            }
                            return false;
                        }
                    }
                }]
            },
        }).done(function(e) {
            window.oMyPlugin.subscribe('WebChatService.agentConnected', function(e) {
                window.agentCount++;
            });
            window.oMyPlugin.subscribe('WebChatService.agentDisconnected', function(e) {
                window.agentCount--;
                if (window.agentCount == 0) {
                    if (window.chatEnded == false) {}
                }
            });
        });
    }

    let GTM = window.dataLayer || [];
    GTM.push({ 'event': 'chatSupport', 'eventLabel': `Chat session topic: - ${choice}` });
}


$(document).ready(function() {
    $('.Tertiary_Chat_Planning .header').on('click', function() {
        $('.Tertiary_Chat_Planning').hide();
    });

    $('.chatStatus.on').on('click', function() {
        $('.Tertiary .Tertiary_1').hide();
        $('.TertiaryVisible').css('visibility', 'hidden');

        $('.Tertiary_Chat').show();
    });

    $('.Tertiary_Chat .toggle_chat').on('click', function() {
        $('.Tertiary_Chat').hide();
    });

    $('.toggle_tertiary').on('click', function() {
        $('.Tertiary .Tertiary_1').hide();
        $('.TertiaryVisible').css('visibility', 'hidden');

        selectchat();
    });
    $(".ion-close").on('click', function() {
        $('.Tertiary .Tertiary_1').hide();
        $('.TertiaryVisible').css('visibility', 'hidden');
        $('.Tertiary_Chat').hide();
    });
});


function hashHandler() {
    this.oldHash = window.location.hash;
    this.Check;

    var that = this;
    var detect = function() {
        if (that.oldHash != window.location.hash) {
            alert("HASH CHANGED - new has" + window.location.hash);
            that.oldHash = window.location.hash;
        }
    };
    this.Check = setInterval(function() { detect() }, 100);
}

window.addEventListener('hashchange', function(e) { console.log('hash changed') });