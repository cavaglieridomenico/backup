window.agentCount = 0
window.subscribe = false

$(document).ready(function () {
  $('.toggle_tertiary').click(function () {
    $('.Tertiary_1').toggleClass('TertiaryVisible')
    $('.Tertiary_1').toggle()
    $('.Tertiary_2').toggleClass('TertiaryVisible')
    $('.livepersonstatusimage').toggleClass('TertiaryVisible')
  })

  var isHomePage = window.location.pathname == '/'
  var isCheckout = window.location.href.includes('checkout')
  var isThankYouPage = window.location.href.includes('orderPlaced')
  if (isHomePage || isCheckout || isThankYouPage) {
    $('a img.toggle_tertiary').hide()
    $('.can_i_help').hide()
    $('.Tertiary').css('bottom', '0').css('right', '110px')
  }
  window.addEventListener('locationchange', function () {
    isHomePage = window.location.pathname == '/'
    isCheckout = window.location.href.includes('checkout')
    isThankYouPage = window.location.href.includes('orderPlaced')
    if (isHomePage || isCheckout || isThankYouPage) {
      $('a img.toggle_tertiary').hide()
      $('.can_i_help').hide()
      $('.Tertiary').css('bottom', '0').css('right', '110px')
    } else {
      $('a img.toggle_tertiary').show()
      $('.can_i_help').show()
      $('.Tertiary').css('bottom', '12%').css('right', '120px')
    }
    // MOVED GENESYS WIDGETS SETTING HERE AS THEY HAVE TO CHANGE ON LOCATION CHANGE
    // IN ORDER TO SET THE CORRECT ENDPOINT (IT SEEMS LIKE DYNAMICALLY ENDPOINT CHANGE
    // DOESN'T WORK SO THE CHAT REMAIN THE PREVIOUS SET)
    if (window?._genesys?.widgets) {
      window._genesys.widgets.webchat = {
        apikey: 'b638772e-4b33-4c11-8b41-5af1b096b140',
        userData: {
          ChatTranscript: true,
        },
        transport: {
          type: 'pureengage-v3-rest',
          dataURL:
            'https://api-euw1.digital.genesyscloud.com/nexus/v3/chat/sessions',
          headers: {
            'x-api-key': 'b638772e-4b33-4c11-8b41-5af1b096b140',
          },
          stream: 'live',
          endpoint: getGenesysEndpoint(),
        },
        emojis: true,
        uploadsEnabled: false,
        confirmFormCloseEnabled: true,
        actionsMenu: true,
        maxMessageLength: 140,

        autoInvite: {
          enabled: false,
          timeToInviteSeconds: 10,
          inviteTimeoutSeconds: 30,
        },
        chatButton: {
          enabled: true,
          template: "<div class='cx-icon' data-icon='chat'></div>",
          effect: 'fade',
          openDelay: 1000,
          effectDuration: 300,
          hideDuringInvite: true,
        },
        minimizeOnMobileRestore: false,
        markdown: false,
      }
    }
    // ______________________________________________
  })
})

if (!window._genesys) window._genesys = {}

if (!window._gt) window._gt = []
window._genesys.widgets = {
  main: {
    theme: 'light',
    lang: 'en',
    i18n: {
      en: {
        webchat: {
          BotConnected: '',
          BotDisconnected: '',
        },
      },
    },
  },
  webchat: {},
  cobrowse: {},
}

window._genesys.widgets.webchat = {
  apikey: 'b638772e-4b33-4c11-8b41-5af1b096b140',
  userData: {
    ChatTranscript: true,
  },
  transport: {
    type: 'pureengage-v3-rest',
    dataURL: 'https://api-euw1.digital.genesyscloud.com/nexus/v3/chat/sessions',
    headers: {
      'x-api-key': 'b638772e-4b33-4c11-8b41-5af1b096b140',
    },
    stream: 'live',
    endpoint: getGenesysEndpoint(),
  },
  emojis: true,
  uploadsEnabled: false,
  confirmFormCloseEnabled: true,
  actionsMenu: true,
  maxMessageLength: 140,

  autoInvite: {
    enabled: false,
    timeToInviteSeconds: 10,
    inviteTimeoutSeconds: 30,
  },
  chatButton: {
    enabled: true,
    template: "<div class='cx-icon' data-icon='chat'></div>",
    effect: 'fade',
    openDelay: 1000,
    effectDuration: 300,
    hideDuringInvite: true,
  },
  minimizeOnMobileRestore: false,
  markdown: false,
}

function getGenesysEndpoint() {
  let path = window?.location?.pathname
  if (path?.includes('/service')) return 'GlobalChatSwitchboard'
  else if (path?.includes('spare-parts') || path?.includes('j00'))
    return 'UK_Walter_Parts_DialogueFlow'
  else return 'StartChatUK'
}

var chatCnt = 0

function selectchat() {
  $('.Tertiary_Chat_Planning').hide()
  var today = new Date()
  var h = today.getHours()
  var m = today.getMinutes()
  var d = today.getDay()

  $('.Tertiary_1_2 .chatStatus').hide()

  if (
    (d > 0 && d < 6 && h * 100 + m > 759 && h * 100 + m < 1800) ||
    (d == 0 && h * 100 + m > 829 && h * 100 + m < 1530) ||
    (d == 6 && h * 100 + m > 829 && h * 100 + m < 1630)
  ) {
    $('.Tertiary_1_2 .chatStatus.on').hide()
  } else {
    $('.Tertiary_1_2 .chatStatus.off').hide()
  }
  let path = window?.location?.pathname
  // HOTPOINT SERVICE
  if (path?.includes('/service')) {
    selectChatService()
  } else if (!path?.includes('spare-parts') && !path?.includes('j00')) {
    // AS IT WAS BEFORE HP SERVICE
    $('.Tertiary_Chat.D2C_Chat').show()
  }

  $('.Tertiary .Tertiary_2').hide()
  $('.Tertiary .Tertiary_1').hide()
  $('.TertiaryVisible').css('visibility', 'visible')
}

function selectChatService() {
  $('.Tertiary_Chat_Planning').hide()
  $('.Tertiary_Chat').hide()
  // $(".can_i_help").hide();
  $('.Tertiary_Chat.Service_Chat').show()
  $('.Service_Chat.Begin_Chat').show()
  $('.Tertiary .Tertiary_2').hide()
  $('.Tertiary .Tertiary_1').hide()
}

function selectChatPlanning() {
  $('.Tertiary_Chat').hide()
  $('.Tertiary_Chat_Planning').show()
}
function closeSelectChatPlanning() {
  $('.Tertiary_Chat_Planning').hide()
}

function openchat(type = 'Claims', choice = '', chatStyle = 'standard') {
  var welcomeText = ''
  welcomeText = choice

  $('.Tertiary_Chat').hide()
  $('.Tertiary_Chat_Planning').hide()

  if (chatStyle == 'service' || chatStyle == 'planning') {
    $('.Tertiary_Chat.Service_Chat').hide()
    $('.Service_Chat.Begin_Chat').hide()
  } else {
    window._genesys.widgets.webchat.userData.Department = 'Claims'
  }

  $('.Tertiary .Tertiary_1').hide()
  $('.TertiaryVisible').css('visibility', 'hidden')

  window.oMyPlugin = window?._genesys?.widgets?.bus?.registerPlugin(
    'MyPlugin' + chatCnt++
  )

  /*
	  window._genesys.widgets.common.Generate.Container(
	  {type:'generic',title:'My Toast',body:'Some HTML here as a string or jQuery wrapped set',icon:'chat',controls:'',buttons:{type:'binary',primary:'OK',secondary:'cancel'}}
	  );
	*/
  // STANDARD D2C CHAT
  if (chatStyle == 'standard') {
    $('.cx-widget.cx-window-manager.cx-theme-light').show()
    window.oMyPlugin
      .command('WebChat.open', {
        userData: {
          FirstName: 'firstName',
          LastName: 'lastName',
          EmailAddress: 'email',
          Subject: 'subject',
          Department: type,
        },
        title: 'Chat with us',
        icon: 'icon',
        html: '<div>Example text</div>',
        formJSON: {
          wrapper: '<table>' + welcomeText + '</table>',
          inputs: [
            {
              id: 'cx_webchat_form_firstname',
              name: 'firstname',
              maxlength: '100',
              placeholder: '@i18n:webchat.ChatFormPlaceholderFirstName',
              label: 'First name*',
            },
            {
              id: 'cx_webchat_form_lastname',
              name: 'lastname',
              maxlength: '100',
              placeholder: '@i18n:callback.CallbackPlaceholderRequired',
              label: 'Last name*',
              validate: function (event, form, input, label, $, CXBus, Common) {
                var pattern = /^[a-zA-Z ]+$/
                if (input) {
                  if (input.val() == '') {
                    return false
                  }
                  if (pattern.test(input.val())) {
                    return true
                  }
                  return false
                }
              },
            },
            {
              id: 'cx_form_callback_phone_number',
              required: 'required',
              name: 'phonenumber',
              maxlength: '14',
              placeholder: '@i18n:callback.CallbackPlaceholderRequired',
              label: 'Phone*',
              validateWhileTyping: true, // default is false
              validate: function (event, form, input, label, $, CXBus, Common) {
                window.chatEnded = false
                window.agentCount = 0
                window.cxbusSaved = CXBus
                if (window.subscribe == false && typeof CXBus != 'undefined') {
                  CXBus.subscribe(
                    'WebChatService.messageReceived',
                    function (e) {
                      if (e.data) {
                        var aOriginalMsgs = e.data.originalMessages
                        if (aOriginalMsgs.length) {
                          for (let i = 0; i < aOriginalMsgs.length; i++) {
                            var aOriginalMsg = aOriginalMsgs[i]
                            if (aOriginalMsg.type == 'Text') {
                              if (
                                aOriginalMsg.text == 'GenesysTerminateChat' &&
                                window.chatEnded == false
                              ) {
                                CXBus.command('WebChatService.endChat')
                                window.chatEnded = true
                              }
                            }
                          }
                        }
                      }
                    }
                  )
                  window.subscribe = true
                }

                var pattern = /^\d{11}$/
                if (input) {
                  if (input.val() == '') {
                    return false
                  }
                  if (pattern.test(input.val())) {
                    return true
                  }
                  return false
                }
              },
            },
            {
              id: 'cx_form_email',
              name: 'email',
              maxlength: '50',
              placeholder: 'myemail@example.com',
              label: 'Email',
              required: 'true',
              validateWhileTyping: true, // default is false
              validate: function (event, form, input, label, $, CXBus, Common) {
                if (input) {
                  pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

                  if (input.val() == '') {
                    return false
                  }
                  if (pattern.test(input.val())) {
                    return true
                  }
                  return false
                }
              },
            },
            {
              id: 'cx_form_transcript',
              name: 'transcript',
              type: 'checkbox',
              label: 'Keep the chat transcript',
              wrapper:
                '<tr><th class="chtra"></th><td class="chtra">{input} {label}</td></tr>',
            },
            {
              id: 'cx_form_topic',
              name: 'topic',
              value: choice,
              type: 'hidden',
            },
          ],
        },
      })
      .done(function (e) {
        window.oMyPlugin.subscribe(
          'WebChatService.agentConnected',
          function (e) {
            window.agentCount++
          }
        )
        window.oMyPlugin.subscribe(
          'WebChatService.agentDisconnected',
          function (e) {
            window.agentCount--
            if (window.agentCount == 0) {
              //		  window.oMyPlugin.command('WebChat.endChat').done(function(e){
              //		  });
            }
          }
        )
      })
  } else if (chatStyle == 'service') {
    // STANDARD SERVICE CHAT
    if (!window?.location?.pathname?.includes('/service/planning')) {
      $('.cx-widget.cx-window-manager.cx-theme-light').show()
      window.oMyPlugin
        .command('WebChat.open', {
          userData: {
            FirstName: 'firstName',
            LastName: 'lastName',
            EmailAddress: 'email',
            Subject: 'subject',
            Department: type,
          },
          title: 'Chat with us',
          icon: 'icon',
          html: '<div>Example text</div>',
          formJSON: {
            wrapper: '<table>' + welcomeText + '</table>',
            inputs: [
              {
                id: 'cx_webchat_form_firstname',
                name: 'firstname',
                maxlength: '100',
                placeholder: '@i18n:webchat.ChatFormPlaceholderFirstName',
                label: 'First name*',
              },
              {
                id: 'cx_webchat_form_lastname',
                name: 'lastname',
                maxlength: '100',
                placeholder: '@i18n:callback.CallbackPlaceholderRequired',
                label: 'Last name*',
                validate: function (
                  event,
                  form,
                  input,
                  label,
                  $,
                  CXBus,
                  Common
                ) {
                  var pattern = /^[a-zA-Z ]+$/
                  if (input) {
                    if (input.val() == '') {
                      return false
                    }
                    if (pattern.test(input.val())) {
                      return true
                    }
                    return false
                  }
                },
              },
              {
                id: 'cx_form_callback_phone_number',
                required: 'required',
                name: 'phonenumber',
                maxlength: '14',
                placeholder: '@i18n:callback.CallbackPlaceholderRequired',
                label: 'Phone*',
                validateWhileTyping: true, // default is false
                validate: function (
                  event,
                  form,
                  input,
                  label,
                  $,
                  CXBus,
                  Common
                ) {
                  window.chatEnded = false
                  window.agentCount = 0
                  window.cxbusSaved = CXBus
                  if (
                    window.subscribe == false &&
                    typeof CXBus != 'undefined'
                  ) {
                    CXBus.subscribe(
                      'WebChatService.messageReceived',
                      function (e) {
                        if (e.data) {
                          var aOriginalMsgs = e.data.originalMessages
                          if (aOriginalMsgs.length) {
                            for (let i = 0; i < aOriginalMsgs.length; i++) {
                              var aOriginalMsg = aOriginalMsgs[i]
                              if (aOriginalMsg.type == 'Text') {
                                if (
                                  aOriginalMsg.text == 'GenesysTerminateChat' &&
                                  window.chatEnded == false
                                ) {
                                  CXBus.command('WebChatService.endChat')
                                  window.chatEnded = true
                                }
                              }
                            }
                          }
                        }
                      }
                    )
                    window.subscribe = true
                  }

                  var pattern = /^\d{11}$/
                  if (input) {
                    if (input.val() == '') {
                      return false
                    }
                    if (pattern.test(input.val())) {
                      return true
                    }
                    return false
                  }
                },
              },
              {
                id: 'cx_form_email',
                name: 'email',
                maxlength: '50',
                placeholder: 'myemail@example.com',
                label: 'Email',
                required: 'true',
                validateWhileTyping: true, // default is false
                validate: function (
                  event,
                  form,
                  input,
                  label,
                  $,
                  CXBus,
                  Common
                ) {
                  if (input) {
                    pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

                    if (input.val() == '') {
                      return false
                    }
                    if (pattern.test(input.val())) {
                      return true
                    }
                    return false
                  }
                },
              },
              {
                id: 'cx_form_transcript',
                name: 'transcript',
                type: 'checkbox',
                label: 'Keep the chat transcript',
                wrapper:
                  '<tr><th class="chtra"></th><td class="chtra">{input} {label}</td></tr>',
              },
              {
                id: 'cx_form_topic',
                name: 'topic',
                value: choice,
                type: 'hidden',
              },
            ],
          },
        })
        .done(function (e) {
          window.oMyPlugin.subscribe(
            'WebChatService.botConnected',
            function (e) {
              window.botCount++
            }
          )
          window.oMyPlugin.subscribe(
            'WebChatService.botDisconnected',
            function (e) {
              window.botCount--
              if (window.botCount == 0) {
                //		  window.oMyPlugin.command('WebChat.endChat').done(function(e){
                //		  });
              }
            }
          )
        })
    } else {
      // PLANNING SERVICE CHAT
      $('.cx-widget.cx-window-manager.cx-theme-light').show()
      window.oMyPlugin
        .command('WebChat.open', {
          userData: {
            Department: type,
            ChatTranscript: false,
          },
          title: 'Chat with us',
          icon: 'icon',
          html: '<div>Example text</div>',
          formJSON: {
            wrapper: '<table>' + welcomeText + '</table>',
            inputs: [
              {
                id: 'cx_webchat_form_engnum',
                name: 'firstname',
                maxlength: '100',
                placeholder: 'Engineer number',
                label: 'What is your engineer number?',
                wrapper:
                  '<tr><th style="padding:0">{label}</th></tr><tr><td>{input}</td></tr>',
                validateWhileTyping: true, // default is false
                validate: function (
                  event,
                  form,
                  input,
                  label,
                  $,
                  CXBus,
                  Common
                ) {
                  window.chatEnded = false
                  window.agentCount = 0
                  window.cxbusSaved = CXBus
                  if (
                    window.subscribe == false &&
                    typeof CXBus != 'undefined'
                  ) {
                    CXBus.subscribe(
                      'WebChatService.messageReceived',
                      function (e) {
                        if (e.data) {
                          var aOriginalMsgs = e.data.originalMessages
                          if (aOriginalMsgs.length) {
                            for (let i = 0; i < aOriginalMsgs.length; i++) {
                              var aOriginalMsg = aOriginalMsgs[i]
                              if (aOriginalMsg.type == 'Text') {
                                if (
                                  aOriginalMsg.text == 'GenesysTerminateChat' &&
                                  window.chatEnded == false
                                ) {
                                  CXBus.command('WebChatService.endChat')
                                  window.chatEnded = true
                                }
                              }
                            }
                          }
                        }
                      }
                    )
                    window.subscribe = true
                  }

                  if (input) {
                    var pattern = /^[0-9]{5}$/
                    if (input.val() == '') {
                      return false
                    }
                    if (pattern.test(input.val())) {
                      return true
                    }
                    return false
                  }
                },
              },
            ],
          },
        })
        .done(function (e) {
          window.oMyPlugin.subscribe(
            'WebChatService.agentConnected',
            function (e) {
              window.agentCount++
            }
          )
          window.oMyPlugin.subscribe(
            'WebChatService.agentDisconnected',
            function (e) {
              window.agentCount--
              if (window.agentCount == 0) {
                if (window.chatEnded == false) {
                }
              }
            }
          )
        })
    }
  } else {
    return
  }
}

function openTradeSupportChat(
  title = 'Chat with us',
  department = 'MULTIBRAND'
) {
  $('.Tertiary_Chat').hide()
  $('.Tertiary_Chat_Planning').hide()

  $('.Tertiary .Tertiary_1').hide()
  $('.TertiaryVisible').css('visibility', 'hidden')

  window.oMyPlugin = window?._genesys?.widgets?.bus?.registerPlugin(
    'MyPlugin' + chatCnt++
  )

  $('.cx-widget.cx-window-manager.cx-theme-light').show()
  window.oMyPlugin
    .command('WebChat.open', {
      userData: {
        FirstName: 'firstName',
        LastName: 'lastName',
        EmailAddress: 'email',
        Subject: 'subject',
        Department: department,
      },
      title: 'Chat with us',
      icon: 'icon',
      html: '<div>Example text</div>',
      formJSON: {
        wrapper: '<table>' + title + '</table>',
        inputs: [
          {
            id: 'cx_webchat_form_firstname',
            name: 'firstname',
            maxlength: '100',
            placeholder: '@i18n:webchat.ChatFormPlaceholderFirstName',
            label: 'First name*',
          },
          {
            id: 'cx_webchat_form_lastname',
            name: 'lastname',
            maxlength: '100',
            placeholder: '@i18n:callback.CallbackPlaceholderRequired',
            label: 'Last name*',
            validate: function (event, form, input, label, $, CXBus, Common) {
              var pattern = /^[a-zA-Z ]+$/
              if (input) {
                if (input.val() == '') {
                  return false
                }
                if (pattern.test(input.val())) {
                  return true
                }
                return false
              }
            },
          },
          {
            id: 'cx_form_email',
            name: 'email',
            maxlength: '50',
            placeholder: 'myemail@example.com',
            label: 'Email',
            required: 'true',
            validateWhileTyping: true, // default is false
            validate: function (event, form, input, label, $, CXBus, Common) {
              if (input) {
                pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

                if (input.val() == '') {
                  return false
                }
                if (pattern.test(input.val())) {
                  return true
                }
                return false
              }
            },
          },
          {
            id: 'cx_form_transcript',
            name: 'transcript',
            type: 'checkbox',
            label: 'Keep the chat transcript',
            wrapper:
              '<tr><th class="chtra"></th><td class="chtra">{input} {label}</td></tr>',
          },
          {
            id: 'cx_form_topic',
            name: 'topic',
            value: title,
            type: 'hidden',
          },
        ],
      },
    })
    .done(function (e) {
      window.oMyPlugin.subscribe('WebChatService.agentConnected', function (e) {
        window.agentCount++
      })
      window.oMyPlugin.subscribe(
        'WebChatService.agentDisconnected',
        function (e) {
          window.agentCount--
          if (window.agentCount == 0) {
            //		  window.oMyPlugin.command('WebChat.endChat').done(function(e){
            //		  });
          }
        }
      )
    })
}

$(document).ready(function () {
  // function to open service chat with window.openServiceGenChat() command
  window.openServiceGenChat = function () {
    openchat('GlobalChatSwitchboard', 'Connect to Live Chat', 'service')
  }

  $('.Tertiary_Chat_Planning .header').on('click', function () {
    $('.Tertiary_Chat_Planning').hide()
  })

  $('.toggle_tertiary').on('click', function () {
    $('.Tertiary .Tertiary_1').hide()
    $('.TertiaryVisible').css('visibility', 'hidden')
    // FOR HP SERVICE
    if (window?.location?.pathname?.includes('/service')) {
      selectChatService()
    } else {
      !window.location.href.includes('spare-parts') &&
      !window.location.href.includes('j00')
        ? selectchat()
        : openchat('HOTPOINTBRANDSITEORDERQUERY', '')
    }
  })

  $('.ion-close').on('click', function () {
    $('.Tertiary .Tertiary_1').hide()
    $('.TertiaryVisible').css('visibility', 'hidden')
    $('.Tertiary_Chat').hide()
    if (window?.location?.pathname?.includes('/service')) {
      $('.Tertiary_Chat.Service_Chat').hide()
      $('.Service_Chat.Begin_Chat').hide()
      $('.can_i_help').show()
    }
  })

  // OBSERVERS TO ADD CLICK ON SUPPORT BOXES BEFORE FOOTER
  var configObs = {
    attributes: true,
    childList: true,
    subtree: true,
  }
  var targetNode = document.body

  const callbackStandardObserver = function (mutationsList, observer) {
    for (var mutation of mutationsList) {
      if (mutation.type == 'childList') {
        let card = $('.vtex-slider-layout-0-x-slide--cardsSupp')[3]
        if (card) {
          card.onclick = function () {
            openChatD2C()
          }
          let cardCta = card.querySelector(
            '.vtex-rich-text-0-x-container--linkCardsButton'
          )
          if (cardCta) {
            cardCta.onclick = function () {
              openChatD2C()
            }
          }
        }
      }
    }
  }
  let observerStandard = new MutationObserver(callbackStandardObserver)
  observerStandard.observe(targetNode, configObs)

  // COMMENTED AS FOR SERVICE THE BOX DOESN'T HAVE TO OPEN THE CHAT
  // const callbackServiceObserver = function (mutationsList, observer) {
  //   for (var mutation of mutationsList) {
  //     if (mutation.type == 'childList') {
  //       let card = $('.vtex-slider-layout-0-x-slide--hpServiceCardsSupp')[2]
  //       if (card) {
  //         card.onclick = function () {
  //           openchat('GlobalChatSwitchboard', 'Connect to Live Chat', 'service')
  //         }
  //         let cardCta = card.querySelector(
  //           '.vtex-rich-text-0-x-container--linkCardsButton'
  //         )
  //         if (cardCta) {
  //           cardCta.onclick = function () {
  //             openchat(
  //               'GlobalChatSwitchboard',
  //               'Connect to Live Chat',
  //               'service'
  //             )
  //           }
  //         }
  //       }
  //     }
  //   }
  // }
  // let observerService = new MutationObserver(callbackServiceObserver)
  // observerService.observe(targetNode, configObs)
  // ____________________________________________________
})

function openChatD2C() {
  !window.location.href.includes('spare-parts') &&
  !window.location.href.includes('j00')
    ? selectchat()
    : openchat('HOTPOINTBRANDSITEORDERQUERY', '')
}
