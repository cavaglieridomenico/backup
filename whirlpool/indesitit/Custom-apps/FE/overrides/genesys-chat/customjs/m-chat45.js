window.addEventListener("locationchange", function () {
    genesys();
    if (
      window.location.href.indexOf("supporto") < 0 &&
      document.getElementById("genesys-chat")
    ) {
      document.getElementById("genesys-chat").style.display = "none";
    }
  });
  
  function genesys() {
    var chat = (function () {
      "use strict";
  
      const SUPPORT_EVENT = "support";
      const REQUEST_SESSION = "Request Chat Session";
      const SESSION_LABEL = "Chat Request ";
      const CONFIRM_SESSION = "Confirm Chat Session";
  
      var _doc = document,
        _chat = document.querySelector(".m-chat");
      var errorMessageJson = "";
      var genesys_webChat = (function () {
        let _chatPlugin;
  
        let _subject;
        let _department;
  
        if (!window._genesys) window._genesys = {};
        if (!window._gt) window._gt = [];
  
        function _dispatchEvent(name) {
          let customEvent;
          if (window.CustomEvent && typeof window.CustomEvent === "function") {
            customEvent = new CustomEvent(name, {});
          } else {
            customEvent = document.createEvent("CustomEvent");
            customEvent.initCustomEvent(name, true, true, {});
          }
          document.dispatchEvent(customEvent);
        }
  
        function init(
          src,
          stream,
          apiKey,
          endpoint,
          theme,
          lang,
          subject,
          department
        ) {
          _subject = subject;
          _department = department;
  
          const i18n = {
            it: {
              calendar: {
                CalendarDayLabels: [
                  "Domenica",
                  "LunedÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬",
                  "MartedÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬",
                  "MercoledÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬",
                  "GiovedÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬",
                  "VenerdÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬",
                  "Sabato",
                ],
                CalendarMonthLabels: [
                  "gen",
                  "feb",
                  "mar",
                  "apr",
                  "mag",
                  "giu",
                  "lug",
                  "ago",
                  "Sett",
                  "ott",
                  "nov",
                  "dic",
                ],
                CalendarLabelToday: "Oggi",
                CalendarLabelTomorrow: "Domani",
                CalendarTitle: "Programma una chiamata",
                CalendarOkButtonText: "OK",
                CalendarError:
                  "Impossibile recuperare i dati sulla disponibilitÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ .",
                CalendarClose: "Annulla",
                AriaWindowTitle: "Finestra Calendario",
                AriaCalendarClose:
                  "Annullare il Calendario e tornare alla registrazione Richiamata",
                AriaYouHaveChosen: "Si ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ scelto",
                AriaNoTimeSlotsFound:
                  "Non ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ stato rilevato alcuno slot temporale per la data selezionata",
              },
              callus: {
                CallUsTitle: "Chiamaci",
                ContactsHeader: "Puoi contattarci a uno dei seguenti numeri...",
                CancelButtonText: "Annulla",
                CoBrowseText:
                  "<span class='cx-cobrowse-offer'>Stai giÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢  realizzando una chiamata? Permettici <a role='link' tabindex='0' class='cx-cobrowse-link'>di navigare con te</a></span>",
                CoBrowse: "Avvia navigazione condivisa",
                CoBrowseWarning:
                  "La navigazione condivisa consente all'agente di visualizzare e controllare il tuo desktop, per guidarti. Se sei al telefono con un agente, richiedi un codice per avviare la navigazione condivisa e inseriscilo qui in basso. Non hai ancora chiamato? Esci da questa schermata per tornare alla pagina Chiamaci.",
                SubTitle: "Puoi contattarci a uno dei seguenti numeri...",
                AriaWindowLabel: "Finestra Chiamaci",
                AriaCallUsClose: "Chiudi Chiamaci",
                AriaBusinessHours: "Orari di lavoro",
                AriaCallUsPhoneApp: "Apre l'applicazione telefono",
                AriaCobrowseLink: "Apre la sessione Navigazione condivisa",
                AriaCancelButtonText: "Annulla Chiamaci",
              },
              callback: {
                CallbackTitle: "Ricevi una chiamata",
                CancelButtonText: "Annulla",
                AriaCancelButtonText: "Annulla",
                ConfirmButtonText: "Conferma",
                AriaConfirmButtonText: "Conferma",
                CallbackFirstName: "Nome",
                CallbackPlaceholderRequired: "Obbligatorio",
                CallbackPlaceholderOptional: "Facoltativo",
                CallbackLastName: "Cognome",
                CallbackPhoneNumber: "Telefono",
                CallbackQuestion: "Quando vuoi essere chiamato?",
                CallbackDayLabels: [
                  "Domenica",
                  "LunedÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬",
                  "MartedÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬",
                  "MercoledÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬",
                  "GiovedÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬",
                  "VenerdÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬",
                  "Sabato",
                ],
                CallbackMonthLabels: [
                  "gen",
                  "feb",
                  "mar",
                  "apr",
                  "mag",
                  "giu",
                  "lug",
                  "ago",
                  "set",
                  "ott",
                  "nov",
                  "dic",
                ],
                CallbackConfirmDescription:
                  "La prenotazione ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ stata completata!",
                CallbackNumberDescription: "Ti chiameremo al numero fornito:",
                CallbackNotes: "Note",
                CallbackDone: "Chiudi",
                AriaCallbackDone: "Chiudi",
                CallbackOk: "OK",
                AriaCallbackOk: "OK",
                CallbackCloseConfirm:
                  "Annullare la programmazione della richiamata?",
                CallbackNoButtonText: "No",
                AriaCallbackNoButtonText: "No",
                CallbackYesButtonText: "SÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬",
                AriaCallbackYesButtonText: "SÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬",
                CallbackWaitTime: "Tempo di attesa",
                CallbackWaitTimeText: "attesa min.",
                CallbackOptionASAP: "Quanto prima",
                CallbackOptionPickDateTime: "Scegli data e ora",
                AriaCallbackOptionPickDateTime: "Apre un selettore date",
                CallbackPlaceholderCalendar: "Seleziona data e ora",
                AriaMinimize: "Riduci a icona Richiamata",
                AriaWindowLabel: "Finestra Richiamata",
                AriaMaximize: "Ingrandisci richiamata",
                AriaClose: "Chiudi Richiamata",
                AriaCalendarClosedStatus: "Il Calendario ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ chiuso",
                Errors: {
                  501: "Impossibile accettare parametri non validi, controlla la documentazione dell'API del server di supporto per i parametri validi.",
                  503: "Chiave api mancante, assicurati che sia configurata correttamente.",
                  1103: "Chiave api mancante, assicurati che sia configurata correttamente.",
                  7030: "Inserisci un numero di telefono valido.",
                  7036: "Non ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ possibile richiamare questo numero. Riprova con un altro numero di telefono.",
                  7037: "La richiamata a questo numero non ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ consentita. Riprova con un altro numero di telefono.",
                  7040: "Configura un nome valido per il servizio.",
                  7041: "Troppe richieste in questo momento.",
                  7042: "Ufficio chiuso. Prova a programmare in orario d'ufficio.",
                  unknownError:
                    "Si ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ verificato un errore, ci scusiamo per l'inconveniente. Controlla le impostazioni della connessione e riprova.",
                  phoneNumberRequired:
                    "Il numero di telefono ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ richiesto.",
                },
              },
              channelselector: {
                Title: "Assistenza live",
                SubTitle: "Come preferisci contattarci?",
                WaitTimeTitle: "Tempo di attesa",
                AvailableTitle: "Disponibile",
                AriaAvailableTitle: "Disponibile",
                UnavailableTitle: "Non disponibile",
                CobrowseButtonText: "CobrowseSubTitle",
                CallbackTitle: "Ricevi una chiamata",
                CobrowseSubTitle:
                  "Per questa operazione ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ richiesta la connessione di un agente.",
                AriaClose: "Chiudi Assistenza live",
                AriaWarning: "Avvertenza",
                AriaAlert: "Avviso",
                minute: "min",
                minutes: "min",
                AriaWindowLabel: "Finestra Assistenza live",
              },
              clicktocall: {
                Title: "Fai clic per chiamare",
                FirstName: "Nome",
                PlaceholderRequired: "Obbligatorio",
                PlaceholderOptional: "Facoltativo",
                LastName: "Cognome",
                PhoneNumber: "Telefono",
                WaitTime: "Tempo di attesa",
                FormCancel: "Annulla",
                AriaFormCancel: "Annulla",
                FormSubmit: "Richiedi un numero",
                AriaFormSubmit: "Richiedi un numero",
                PhoneLabel: "Connettiti ora",
                AriaPhoneTitle: "Apre l'applicazione telefono",
                AccessLabel: "Codice di accesso",
                ExpireLabel: "Il numero scade tra",
                AriaExpireLabel: "Timer Il numero scade tra",
                DisplayClose: "Chiudi",
                AriaDisplayClose: "Chiudi",
                NetworkFail:
                  "Si ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ verificato un errore, ci scusiamo per l'inconveniente. Controlla le impostazioni della connessione e riprova.",
                NetworkRetry: "OK",
                AriaNetworkRetry: "OK",
                InvalidAccept: "OK",
                AriaInvalidAccept: "OK",
                PhoneExpired: "Il numero di telefono ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ scaduto!",
                PhoneReRequest: "Richiedi un nuovo numero",
                AriaPhoneReRequest: "Richiedi un nuovo numero",
                LocalFormValidationEmptyPhoneNumber:
                  "Inserisci un numero di telefono",
                ConfirmCloseWindow:
                  "Hai inviato dati del modulo. Desideri uscire?",
                AriaConfirmCloseCancel: "No",
                ConfirmCloseCancel: "No",
                AriaConfirmCloseConfirm: "SÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬",
                ConfirmCloseConfirm: "SÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬",
                AriaWindowLabel: "Finestra Fai clic per chiamare",
                AriaMaximize: "Ingrandisci Fai clic per chiamare",
                AriaMinimize: "Riduci a icona Fai clic per richiamare",
                AriaClose: "Chiudi Fai clic per richiamare",
              },
              cobrowse: {
                agentJoined: "Il rappresentante si ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ unito alla sessione.",
                youLeft:
                  "Hai abbandonato la sessione. La navigazione condivisa ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ terminata.",
                sessionTimedOut:
                  "La sessione ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ scaduta. La navigazione condivisa ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ terminata.",
                sessionInactiveTimedOut:
                  "La sessione ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ scaduta. La navigazione condivisa ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ terminata.",
                agentLeft:
                  "Il rappresentante ha abbandonato la sessione. La navigazione condivisa ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ stata terminata.",
                sessionError:
                  "Si ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ verificato un errore imprevisto. La navigazione condivisa ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ terminata.",
                sessionStarted:
                  "Sessione di navigazione condivisa avviata. In attesa che un rappresentante si connetta alla sessioneÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¦",
                navRefresh:
                  "Il rappresentante ha aggiornato la pagina. Caricamento in corso.",
                navBack:
                  'Il rappresentante ha premuto il pulsante "Indietro". Caricamento pagina in corso.',
                navForward:
                  'Il rappresentante ha premuto il pulsante "Avanti". Caricamento pagina in corso.',
                navUrl:
                  "Il rappresentante ha richiesto la navigazione. Caricamento della pagina in corso.",
                navFailed:
                  "Richiesta di navigazione del rappresentante non riuscita.",
                toolbarContent: "ID sessione: {sessionId}",
                contentMasked:
                  "Il contenuto non viene visualizzato dal rappresentante.",
                contentMaskedPartially:
                  "Alcuni contenuti sono nascosti al rappresentante.",
                exitBtnTitle: "Esci dalla sessione di navigazione condivisa",
                areYouOnPhone:
                  "Sei al telefono con uno dei nostri rappresentanti?",
                areYouOnPhoneOrChat:
                  "Stai parlando al telefono o per chat con uno dei nostri rappresentanti?",
                connectBeforeCobrowse:
                  "Per continuare la navigazione condivisa devi essere connesso con un nostro rappresentante. Chiamaci o avvia una chat live, quindi avvia di nuovo la navigazione condivisa.",
                sessionStartedAutoConnect:
                  "Sessione di navigazione condivisa avviata. In attesa che un rappresentante si connetta alla sessioneÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¦",
                browserUnsupported:
                  "Sfortunatamente, il tuo browser non ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ supportato al momento.<br><br> I browser supportati sono: <ul><li><a target='_blank' href='http://www.google.com/chrome'>Google Chrome</a></li><li><a target='_blank' href='http://www.firefox.com/'>Mozilla Firefox</a></li><li><a target='_blank' href='http://microsoft.com/ie'>Internet Explorer 9 e versioni successive</a></li><li><a target='_blank' href='https://www.apple.com/safari'>Safari 6 e versioni successive</a></li></ul>",
                chatIsAlreadyRunning:
                  "La chat ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ giÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢  in esecuzione in un'altra pagina.",
                modalYes: "SÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬",
                modalNo: "No",
              },
              knowledgecenter: {
                SidebarButton: "Cerca",
                SearchButton: "Cerca",
                Title: "Fai una domanda",
                Ask: "Chiedi",
                AriaAsk: "Chiedi",
                Close: "Chiudi",
                AriaClose: "Chiudi Cerca",
                Categories: "Categorie",
                NoResults: "Nessun risultato",
                NoResultsTextUnder:
                  "Spiacenti, non ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ stato possibile trovare una risposta adeguata.",
                NoResultsTextRephrase: "Puoi provare a riformulare la domanda?",
                WasThisHelpful: "Ti ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ risultato utile?",
                Yes: "SÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬",
                No: "No",
                AriaYes: "SÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬",
                AriaNo: "No",
                ArticleHelpfulnessYes: "UtilitÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢  articolo - 'SÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬'",
                ArticleHelpfulnessYesDesc:
                  "Fantastico! Siamo lieti che l'articolo ti sia stato utile per la tua ricerca. Buona giornata!",
                ArticleHelpfulnessNo: "UtilitÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢  articolo - 'No'",
                ArticleHelpfulnessNoDesc:
                  "Siamo spiacenti che l'articolo non fosse utile per la tua ricerca. Grazie per il feedback!",
                TypeYourQuestion: "Scrivi la tua domanda",
                Back: "Indietro",
                AriaBack: "Torna ai risultati della ricerca",
                More: "Altro",
                Error: "Errore!",
                GKCIsUnavailable:
                  "Il server del Knowledge Center al momento non ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ disponibile.",
                AriaClear: "Cancella il testo della ricerca",
                AriaSearch: "Cerca",
                AriaWindowLabel: "Finestra Cerca",
                AriaSearchDropdown: "Risultati suggeriti",
                AriaSearchMore: "Leggi di piÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ su",
                AriaResultsCount: "Numero totale di risultati",
                KnowledgeAgentName: "Knowledge Center",
                WelcomeMessage:
                  "Ciao e benvenuto! Un agente ti assisterÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢  a breve. Nel frattempo, posso aiutarti con qualsiasi dubbio o domanda? Inserisci la domanda nel campo di immissione qui sotto.",
                SearchResult:
                  "Mentre attendi che si connetta un agente, ecco le risposte piÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ rilevanti alla tua query:",
                NoDocumentsFound:
                  "Spiacenti. Non ci sono articoli che corrispondano alla tua domanda. Vuoi fare un'altra domanda?",
                SuggestedMessage:
                  "ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â¹ÃƒÂ¢Ã¢â€šÂ¬  stato suggerito il seguente elemento della Knowledge Base:",
                OpenDocumentHint: "fai clic per visualizzarne il contenuto",
                SuggestedDocumentMessage:
                  "ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â¹ÃƒÂ¢Ã¢â€šÂ¬  stato suggerito il documento '<%DocTitle%>'",
                FeedbackQuestion: "Ti ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ risultato utile?",
                FeedbackAccept: "SÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬",
                FeedbackDecline: "No",
                TranscriptMarker: "Knowledge Center: ",
                SearchMessage:
                  "Cerca con la query '<%SearchQuery%>'ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â²",
                VisitMessage: "Visita per il documento '<%VisitQuery%>'",
                OpenMessage: "Visualizzato '<%OpenQuery%>'",
                AnsweredMessage:
                  "I risultati della query '<%AnsweredQuery%>' sono stati contrassegnati come rilevanti.",
                UnansweredMessage:
                  "I risultati della query '<%UnansweredQuery%>' sono stati contrassegnati come non risposti.",
                PositiveVoteMessage:
                  "Voto positivo per il documento '<%VoteQuery%>'.",
                NegativeVoteMessage:
                  "Voto negativo per il documento '<%VoteQuery%>'.",
                SuggestedMarker: "ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â¹ÃƒÂ¢Ã¢â€šÂ¬  stato suggerito il documento[^\\0]*?",
              },
              sendmessage: {
                SendMessageButton: "Invia messaggio",
                OK: "OK",
                Title: "Invia messaggio",
                PlaceholderFirstName: "Obbligatorio",
                PlaceholderLastName: "Obbligatorio",
                PlaceholderEmail: "Obbligatorio",
                PlaceholderSubject: "Obbligatorio",
                PlaceholderTypetexthere: "Scrivi qui il tuo messaggio...",
                FirstName: "Nome",
                LastName: "Cognome",
                Email: "E-mail",
                Subject: "Oggetto",
                Attachfiles: "Allega file",
                AriaAttachfiles:
                  "Allega collegamento file, Apre una finestra di dialogo Upload file",
                Send: "Invia",
                AriaSend: "Invia messaggio",
                Sent: "Il tuo messaggio ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ stato inviato...",
                Close: "Chiudi",
                ConfirmCloseWindow: "Chiudere il widget Invia messaggio?",
                Cancel: "Annulla",
                AriaMinimize: "Riduci a icona Invia messaggio",
                AriaMaximize: "Ingrandisci Invia messaggio",
                AriaWindowLabel: "Finestra Invia messaggio",
                AriaClose: "Chiudi Invia messaggio",
                AriaCloseAlert: "Casella di avviso chiusa",
                AriaEndConfirm: "SÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬",
                AriaEndCancel: "Annulla",
                AriaOK: "OK",
                AriaRemoveFile: "Rimuovi file",
                AriaFileIcon: "File",
                AriaFileSize: "Dimensioni file",
                Errors: {
                  102: "Nome richiesto",
                  103: "Cognome richiesto",
                  104: "Oggetto richiesto",
                  181: "Indirizzo e-mail richiesto",
                  182: "Testo del contenuto del messaggio richiesto",
                  connectionError: "Impossibile connettersi al server. Riprova.",
                  unknowError:
                    "Si ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ verificato un errore, ci scusiamo per l'inconveniente. Controlla le impostazioni della connessione e riprova.",
                  attachmentsLimit:
                    "Il numero totale di allegati supera il limite: ",
                  attachmentsSize:
                    "Le dimensioni totali degli allegati superano il limite: ",
                  invalidFileType:
                    "Tipo di file non supportato. Carica immagini, PDF, file di testo e file ZIP.",
                  invalidFromEmail: "E-mail non valida - Indirizzo mittente.",
                  invalidMailbox: "E-mail non valida - Indirizzo destinatario.",
                },
              },
              sidebar: {
                SidebarTitle: "Bisogno di aiuto?",
                ChannelSelectorName: "Assistenza live",
                ChannelSelectorTitle:
                  "Ottieni subito assistenza da uno dei nostri agenti",
                SearchName: "Cerca",
                SearchTitle: "Cerca",
                OffersName: "Offerte",
                OffersTitle: "Offerte",
                CallUsName: "Chiamaci",
                CallUsTitle: "Dettagli per chiamarci",
                CallbackName: "Richiamata",
                CallbackTitle: "Ricevi una chiamata",
                ClickToCallName: "Fai clic per chiamare",
                ClickToCallTitle:
                  "Richiedi un numero telefonico di assistenza clienti",
                SendMessageName: "Invia messaggio",
                SendMessageTitle: "Invia messaggio",
                WebChatName: "Chat live",
                WebChatTitle: "Chat live",
                AriaClose: "Chiudi menu Bisogno di aiuto?",
              },
              webchat: {
                ChatButton: "Chat",
                ChatStarted: "Chat avviata",
                ChatEnded: "Chat terminata",
                AgentNameDefault: "Agente",
                AgentConnected: "<%Agent%> connesso",
                AgentDisconnected: "<%Agent%> disconnesso",
                BotNameDefault: "Bot",
                BotConnected: "",
                BotDisconnected: "",
                SupervisorNameDefault: "Supervisore",
                SupervisorConnected: "<%Agent%> connesso",
                SupervisorDisconnected: "<%Agent%> disconnesso",
                AgentTyping: "...",
                AriaAgentTyping: "L'agente sta scrivendo",
                AgentUnavailable:
                  "Spiacenti, non ci sono agenti disponibili. Riprova piÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ tardi.",
                ChatTitle: "Chat live",
                ChatEnd: "X",
                ChatClose: "X",
                ChatMinimize: "Min",
                ChatFormFirstName: "Nome",
                ChatFormLastName: "Cognome",
                ChatFormNickname: "Nickname",
                ChatFormEmail: "E-mail",
                ChatFormSubject: "Oggetto",
                ChatFormPlaceholderFirstName: "Obbligatorio",
                ChatFormPlaceholderLastName: "Obbligatorio",
                ChatFormPlaceholderNickname: "Facoltativo",
                ChatFormPlaceholderEmail: "Facoltativo",
                ChatFormPlaceholderSubject: "Facoltativo",
                ChatFormSubmit: "Avvia chat",
                AriaChatFormSubmit: "Avvia chat",
                ChatFormCancel: "Annulla",
                AriaChatFormCancel: "Annulla chat",
                ChatFormClose: "Chiudi",
                ChatInputPlaceholder: "Scrivi qui il tuo messaggio",
                ChatInputSend: "Invia",
                AriaChatInputSend: "Invia",
                ChatEndQuestion: "Terminare la sessione della chat?",
                ChatEndCancel: "Annulla",
                ChatEndConfirm: "Termina chat",
                AriaChatEndCancel: "Annulla",
                AriaChatEndConfirm: "Termina",
                ConfirmCloseWindow: "Chiudere la chat?",
                ConfirmCloseCancel: "Annulla",
                ConfirmCloseConfirm: "Chiudi",
                AriaConfirmCloseCancel: "Annulla",
                AriaConfirmCloseConfirm: "Chiudi",
                ActionsDownload: "Scarica trascrizione",
                ActionsEmail: "Trascrizione e-mail",
                ActionsPrint: "Stampa trascrizione",
                ActionsCobrowseStart: "Avvia navigazione condivisa",
                AriaActionsCobrowseStartTitle:
                  "Apre la sessione Navigazione condivisa",
                ActionsSendFile: "Allega file",
                AriaActionsSendFileTitle:
                  "Allega collegamento file, Apre una finestra di dialogo Upload file",
                ActionsEmoji: "Invia emoji",
                ActionsCobrowseStop: "Esci da navigazione condivisa",
                ActionsVideo: "Invita a chat video",
                ActionsTransfer: "Trasferisci",
                ActionsInvite: "Invita",
                InstructionsTransfer:
                  "Apri questo link su un altro dispositivo per trasferire la sessione della chat</br></br><%link%>",
                InstructionsInvite:
                  "Condividi il link con un'altra persona per aggiungerla a questa sessione della chat</br></br><%link%>",
                InviteTitle: "Bisogno di aiuto?",
                InviteBody: "Facci sapere se ti possiamo aiutare.",
                InviteReject: "No grazie",
                InviteAccept: "Avvia chat",
                AriaInviteAccept: "Accetta invito e inizia a chattare",
                AriaInviteReject: "Rifiuta invito",
                ChatError:
                  "Si ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ verificato un problema durante l'avvio della sessione chat. Riprova.",
                ChatErrorButton: "OK",
                AriaChatErrorButton: "OK",
                ChatErrorPrimaryButton: "SÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬",
                ChatErrorDefaultButton: "No",
                AriaChatErrorPrimaryButton: "SÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬",
                AriaChatErrorDefaultButton: "No",
                DownloadButton: "Scarica",
                AriaDownloadButton: "Scarica il file",
                FileSent: "ha inviato:",
                FileTransferRetry: "Riprova",
                AriaFileTransferRetry: "Riprova a trasferire il file",
                FileTransferError: "OK",
                AriaFileTransferError: "OK",
                FileTransferCancel: "Annulla",
                AriaFileTransferCancel: "Annulla trasferimento file",
                RestoreTimeoutTitle: "Chat terminata",
                RestoreTimeoutBody:
                  "La sessione della chat precedente ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ scaduta. Vuoi avviarne una nuova?",
                RestoreTimeoutReject: "No grazie",
                RestoreTimeoutAccept: "Avvia chat",
                AriaRestoreTimeoutAccept: "Accetta invito e inizia a chattare",
                AriaRestoreTimeoutReject: "Rifiuta invito",
                EndConfirmBody: "Vuoi davvero terminare la sessione della chat?",
                EndConfirmAccept: "Termina chat",
                EndConfirmReject: "Annulla",
                AriaEndConfirmAccept: "Termina chat",
                AriaEndConfirmReject: "Annulla",
                SurveyOfferQuestion: "Vuoi partecipare a un sondaggio?",
                ShowSurveyAccept: "SÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬",
                ShowSurveyReject: "No",
                AriaShowSurveyAccept: "SÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬",
                AriaShowSurveyReject: "No",
                UnreadMessagesTitle: "non letto",
                AriaYouSaid: "Hai detto",
                AriaSaid: "ha detto",
                AriaSystemSaid: "Messaggio di sistema:",
                AriaWindowLabel: "Finestra Chat live",
                AriaMinimize: "Riduci a icona chat live",
                AriaMaximize: "Ingrandisci chat live",
                AriaClose: "Chiudi chat live",
                AriaEmojiStatusOpen: "Finestra di dialogo Selettore emoji aperta",
                AriaEmojiStatusClose:
                  "Finestra di dialogo Selettore emoji chiusa",
                AriaEmoji: "emoji",
                AriaEmojiPicker: "Selettore emoji",
                AriaCharRemaining: "Caratteri rimanenti",
                AriaMessageInput: "Casella messaggi",
                AsyncChatEnd: "Termina chat",
                AsyncChatClose: "Chiudi finestra",
                AriaAsyncChatEnd: "Termina chat",
                AriaAsyncChatClose: "Chiudi finestra",
                DayLabels: ["do", "lu", "ma", "me", "Gio", "ve", "sa"],
                MonthLabels: [
                  "gen",
                  "feb",
                  "mar",
                  "apr",
                  "mag",
                  "giu",
                  "lug",
                  "ago",
                  "Sett",
                  "ott",
                  "nov",
                  "dic",
                ],
                todayLabel: "Oggi",
                Errors: {
                  102: "Il nome ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ richiesto",
                  103: "Il cognome ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ richiesto",
                  161: "Inserisci il tuo nome",
                  201: "Impossibile inviare il file.<br/><strong><p class='filename' title='<%FilenameFull%>'>'<%FilenameTruncated%>'</p></strong><p class='cx-advice'>ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â¹ÃƒÂ¢Ã¢â€šÂ¬  stato superato il numero massimo di file allegati (<%MaxFilesAllowed%>)</p>",
                  202: "Impossibile inviare il file.<br/><strong><p class='filename' title='<%FilenameFull%>'>'<%FilenameTruncated%>'</p></strong><p class='cx-advice'>ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â¹ÃƒÂ¢Ã¢â€šÂ¬  stato superato il limite di upload e/o il numero massimo di allegati (<%MaxAttachmentsSize%>)</p>",
                  203: "Impossibile inviare il file.<br/><strong><p class='filename' title='<%FilenameFull%>'>'<%FilenameTruncated%>'</p></strong><p class='cx-advice'>Il tipo di file non ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ consentito.</p>",
                  204: "Spiacenti, il tuo messaggio ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ troppo lungo, Scrivi un messaggio piÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ breve",
                  240: "Spiacenti, ma non ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ possibile avviare una nuova chat al momento. Riprova piÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ tardi",
                  364: "E-mail non valida",
                  401: "Non ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ possibile autorizzare la sessione di chat. Vuoi iniziare una nuova chat?",
                  404: "Non ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ stato possibile trovare la tua precedente sessione di chat. Vuoi iniziare una nuova chat?",
                  500: "Si ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ verificato un errore inaspettato associato al servizio. Vuoi chiudere e iniziare una nuova chat?",
                  503: "Il servizio non ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ attualmente disponibile o ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ occupato. Vuoi chiudere e ricominciare una nuova chat?",
                  ChatUnavailable:
                    "Spiacenti, ma non ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ possibile avviare una nuova chat al momento. Riprova piÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ tardi",
                  CriticalFault:
                    "La sessione della chat ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ terminata a causa di un errore sconosciuto. Ci scusiamo per l'inconveniente",
                  StartFailed:
                    "Si ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ verificato un errore durante l'avvio della sessione chat. Verifica la connessione e di aver inviato correttamente tutte le informazioni richieste, quindi riprova",
                  MessageFailed:
                    "Il tuo messaggio non ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ stato ricevuto. Riprova",
                  RestoreFailed:
                    "Spiacenti, non ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ possibile ripristinare la sessione della chat a causa di un errore sconosciuto",
                  TransferFailed:
                    "Impossibile trasferire la chat al momento. Riprova piÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ tardi",
                  FileTransferSizeError:
                    "Impossibile inviare il file.<br/><strong><p class='filename' title='<%FilenameFull%>'>'<%FilenameTruncated%>'</p></strong><p class='cx-advice'>Le dimensioni del file sono superiori a quelle consentite (<%MaxSizePerFile%>)</p>",
                  InviteFailed:
                    "Impossibile generare l'invito al momento. Riprova piÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ tardi",
                  ChatServerWentOffline:
                    "I messaggi al momento richiedono piÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ tempo del normale per essere recapitati. Ci scusiamo per il ritardo",
                  RestoredOffline:
                    "I messaggi al momento richiedono piÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ tempo del normale per essere recapitati. Ci scusiamo per il ritardo",
                  Disconnected:
                    "<div style='text-align:center'>Connessione persa</div>",
                  Reconnected:
                    "<div style='text-align:center'>Connessione ripristinata</div>",
                  FileSendFailed:
                    "Impossibile inviare il file.<br/><strong><p class='filename' title='<%FilenameFull%>'><%FilenameTruncated%></p></strong><p class='cx-advice'>Si ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ verificata una disconnessione inesperata. Riprovare?</p>",
                  Generic:
                    "<div style='text-align:center'>Si ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ verificato un errore sconosciuto</div>",
                  "pureengage-v3-rest-INVALID_FILE_TYPE":
                    "Tipo di file non valido. Sono consentite solo immagini",
                  "pureengage-v3-rest-LIMIT_FILE_SIZE":
                    "Le dimensioni del file sono superiori a quelle consentite",
                  "pureengage-v3-rest-LIMIT_FILE_COUNT":
                    "Il numero massimo di file allegati ha superato il limite",
                  "pureengage-v3-rest-INVALID_CONTACT_CENTER":
                    "Configurazione trasferimento chiave-api-x non valida",
                  "pureengage-v3-rest-INVALID_ENDPOINT":
                    "Configurazione trasferimento non valida",
                  "pureengage-v3-rest-INVALID_NICKNAME":
                    "Il nome ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ richiesto",
                  "pureengage-v3-rest-AUTHENTICATION_REQUIRED":
                    "Non ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ possibile autorizzare la sessione di chat.",
                  "purecloud-v2-sockets-400":
                    "Spiacenti, si ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ verificato un errore. Verifica la connessione e di aver inviato correttamente tutte le informazioni richieste, quindi riprova.",
                  "purecloud-v2-sockets-500":
                    "Spiacenti, si ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ verificato un errore imprevisto con il servizio.",
                  "purecloud-v2-sockets-503":
                    "Spiacenti, il servizio non ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ disponibile al momento.",
                },
              },
            },
          };
  
          window._genesys.widgets = {
            main: {
              debug: false,
              themes: {
                custom: theme,
              },
              theme: "custom",
              lang: lang,
              i18n: i18n,
              plugins: ["cx-webchat-service", "cx-webchat"],
            },
            webchat: {
              emojis: true,
              transport: {
                type: "pureengage-v3-rest",
                dataURL:
                  "https://api-euw1.digital.genesyscloud.com/nexus/v3/chat/sessions",
                endpoint: endpoint,
                stream: stream,
                headers: {
                  "x-api-key": apiKey,
                },
                async: {
                  enabled: false,
                },
              },
              confirmFormCloseEnabled: false,
              chatButton: {
                enabled: true,
                template: false,
                hideDuringInvite: true,
              },
            },
          };
  
          if (!window._genesys.widgets.extensions) {
            window._genesys.widgets.extensions = {};
          }
          window._genesys.widgets.extensions["CustomChatExtension"] = function (
            $,
            CXBus
          ) {
            if (_chatPlugin === undefined) {
              _chatPlugin = CXBus.registerPlugin("CustomChatExtension");
            }
            _chatPlugin.subscribe("WebChat.opened", function (e) {
              setTimeout(function () {
                _dispatchEvent("chat-opened");
                let _webChat = document.querySelector(".cx-widget.cx-webchat");
                _webChat.style.visibility = "visible";
              }, 1000);
            });
            // The user started a chat, but the chat fails to start.
            _chatPlugin.subscribe("WebChat.rejected", function (e) {
              _dispatchEvent("chat-rejected");
              _chatPlugin.command("WebChat.close");
            });
            // The user changed their mind and closed it without starting a chat session
            // ot the user started a chat session but ended it before an agent connected.
            _chatPlugin.subscribe("WebChat.cancelled", function (e) {
              _dispatchEvent("chat-ended");
            });
            // The user started a chat, met with an agent, and the session ended normally.
            _chatPlugin.subscribe("WebChat.completed", function (e) {
              _dispatchEvent("chat-ended");
            });
            // Genesys is sending a message with type 'GenesysTerminateChat' in the below two cases:
            //   - If the Business hours is closed.
            //   - If the Agent attend the chat and disconnect it, then he clicks the mark done tick.
            // Catching this special message and call ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œendChatÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â command in Widgets to terminate the chat in the widget side too.
            _chatPlugin.subscribe("WebChatService.messageReceived", function (e) {
              if (e.data) {
                let aOriginalMsgs = e.data.originalMessages;
                Array.prototype.forEach.call(aOriginalMsgs, function (message) {
                  if (
                    message.type == "GenesysTerminateChat" ||
                    message.text == "GenesysTerminateChat" ||
                    message.type == "ItalyChatTerminata" ||
                    message.text == "ItalyChatTerminata"
                  ) {
                    _chatPlugin.command("WebChatService.endChat");
                    return;
                  }
                });
              }
            });
            // Any messages matched using the pre-filters will not be shown in the transcript
            _chatPlugin.command("WebChatService.addPrefilter", {
              filters: [/GenesysTerminateChat/, /ItalyChatTerminata/],
            });
          };
  
          let script = document.createElement("script");
          script.src = src + "/cxbus.min.js";
          script.onload = function () {
            CXBus.configure({ pluginsPath: src + "/plugins/" });
            CXBus.loadPlugin("widgets-core");
          };
          document.body.append(script);
        }
  
        function open(
          firstName,
          lastName,
          email,
          // reason,
          // message,
          chatTranscript
        ) {
          let data = {
            userData: {
              FirstName: firstName,
              LastName: lastName,
              EmailAddress: email,
              Subject: _subject,
              Department: _department,
              // Reason: reason,
              // Message: message,
              ChatTranscript: chatTranscript,
            },
            form: {
              autoSubmit: true,
              firstname: firstName,
              lastname: lastName,
              email: email,
              subject: _subject,
            },
          };
  
          return _chatPlugin.command("WebChat.open", data);
        }
  
        function isOpened() {
          if (document.querySelectorAll(".cx-webchat").length > 0) {
            return true;
          }
  
          return false;
        }
  
        return {
          init: init,
          open: open,
          isOpened: isOpened,
        };
      })();
  
      //GA4FUNREQ16
      function pushSupportChatEvent() {
        let availability = document.querySelector(".m-chat__open")
          ? "Chat Request (Available)"
          : "Chat Request (Not available)";
        const ga4Data = {
          eventName: "vtex:ga4-supportChat",
          event: "ga4-supportChat",
          data: {
            chat_status: availability,
          },
        };
        window.postMessage(ga4Data, window.origin);
      }
      // End of GA4FUNREQ16

      function _handleEvents() {
        var _chatHeader = _chat.querySelector(".m-chat__header"),
          _reduce = _chat.querySelector(".reduce"),
          _close = _chat.querySelector(".close"),
          _contact_btn = _doc.querySelectorAll("a[href*=chat]");
        setTimeout(function () {
          _chat.classList.add("visible");
        }, 2000);
        _chatHeader.addEventListener("click", function () {
          this.offsetParent.classList.add("open");
        });
  
        Array.prototype.forEach.call(_contact_btn, function (el) {
          el.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            if (!genesys_webChat.isOpened()) {
              let status = document.querySelector(".m-chat__open")
                ? "Available"
                : "Unavailable";
              window.dataLayer = window.dataLayer || [];
              window.dataLayer.push({
                event: SUPPORT_EVENT,
                chatSessionAction: REQUEST_SESSION,
                chatSessionLabel: SESSION_LABEL + status,
              });
              //GA4FUNREQ16
              pushSupportChatEvent();

              _chat.classList.add("visible");
              _chat.classList.add("open");
            }
          });
        });
  
        _reduce.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          _resetError();
          _chat.classList.remove("open");
        });
        _close.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          _resetError();
          _chat.classList.remove("open");
          _chat.classList.remove("visible");
          localStorage.setItem("chatIsHidden", true);
        });
  
        document.addEventListener("chat-opened", function () {
          if (localStorage.getItem("chatIsHidden")) {
            // _resetError();
            _chat.classList.remove("open");
            _chat.classList.remove("visible");
            _chat.querySelector(".m-chat__wrapper").style.transform =
              "translateX(0)";
            document.querySelector(".m-chat__error-ctn").style.visibility =
              "hidden";
          }
        });
        document.addEventListener("chat-rejected", function () {
          document.querySelector(".loader").style.display = "none";
          document.querySelector(".m-chat__error-ctn").style.visibility =
            "hidden";
        });
        document.addEventListener("chat-ended", function () {
          localStorage.setItem("chatIsHidden", false);
        });
      }
  
      function _getLocalStorage() {
        var isHidden = localStorage.getItem("chatIsHidden");
        if (isHidden == true) {
          // remove chat
        }
      }
  
      function _resetError() {
        var fields = _chat.querySelectorAll(
          ".m-form-item__field[data-field-required]"
        );
        Array.prototype.forEach.call(fields, function (el) {
          el.classList.remove("m-form-item__field--error");
          el.querySelector(".m-form-item__field-text--error").innerHTML = "";
        });
      }
  
      function _validateForm() {
        var fields = _chat.querySelectorAll(
          ".m-form-item__field[data-field-required]"
        );
        var valid = true;
        Array.prototype.forEach.call(fields, function (el) {
          var element;
          var field = el;
          if (el.querySelector("input")) {
            element = el.querySelector("input");
          } else if (el.querySelector("select")) {
            element = el.querySelector("select");
          } else if (el.querySelector("textarea")) {
            element = el.querySelector("textarea");
          }
  
          if (element.value.length === 0) {
            field.classList.add("m-form-item__field--error");
            field.querySelector(".m-form-item__field-text--error").innerHTML =
              errorMessageJson.empty_err;
            valid = false;
          } else {
            field.classList.remove("m-form-item__field--error");
            field.querySelector(".m-form-item__field-text--error").innerHTML = "";
          }
        });
  
        return valid;
      }
  
      function _startChat() {
        var _chatStartBtn = _chat.querySelector(".start-chat"),
          _chatWrapper = _chat.querySelector(".m-chat__wrapper"),
          _chatReload = _chat.querySelector(".reload-chat a");
        _chatStartBtn.addEventListener("click", function (e) {
          e.preventDefault();
          if (_validateForm()) {
            _chatWrapper.style.transform = "translateX(-400px)";
            setTimeout(function () {
              _chatWrapper.style.transform = "translateX(0)";
              _chat.classList.remove("open");
            }, 2000);
            setTimeout(function () {
              // let option = document.querySelector("#reason");
              // option = option.options[option.selectedIndex].text;
              genesys_webChat
                .open(
                  document.querySelector("#chat #firstname").value,
                  document.querySelector("#chat #lastname").value,
                  document.querySelector("#chat #mail").value,
                  // document.querySelector("#chat #reason").value,
                  // document.querySelector("#chat #message").value,
                  document.querySelector("#chat #chattranscript").checked
                )
                .done(function (e) {
                  document.querySelector("form#chat").reset();
                  window.dataLayer = window.dataLayer || [];
                  window.dataLayer.push({
                    event: SUPPORT_EVENT,
                    chatSessionAction: CONFIRM_SESSION,
                    // chatSessionLabel: option,
                  });

                //GA4FUNREQ16
                let availability = document.querySelector(".m-chat__open")
                ? "Chat Request (Available)"
                : "Chat Request (Not available)";

                const ga4Data = {
                    eventName: "vtex:ga4-chatSupport",
                    event: "ga4-chatSupport",
                    data: {
                    chatRequest: "",
                    chatStatus: availability,
                    },
                };
                window.postMessage(ga4Data, window.origin);
                // End of GA4FUNREQ16

                })
                .fail(function (e) {
                  document.querySelector(".loader").style.display = "none";
                  document.querySelector(".m-chat__error-ctn").style.visibility =
                    "visible";
                });
            }, 500);
          }
        });
        _chatReload.addEventListener("click", function (e) {
          e.preventDefault();
          _chatWrapper.style.transform = "translateX(0)";
          document.querySelector(".m-chat__error-ctn").style.visibility =
            "hidden";
        });
      }
  
      function _init(callback) {
        if (_chat) {
          errorMessageJson = JSON.parse(
            _chat.querySelector("form").getAttribute("data-error-translation")
          );
          _handleEvents();
          _getLocalStorage();
          _startChat();
          //_checkTimeChatModal();
  
          if (window.location.href.indexOf("#chat") > -1) {
            setTimeout(function () {
              _chat.classList.add("open");
            }, 500);
          }
        }
        callback();
      }
  
      function _chatOpen(chat_open, chat_closed) {
        var i;
        for (i = 0; i < chat_closed.length; i++) {
          chat_closed[i].style.display = "none";
        }
      }
  
      function _chatClosed(chat_open, chat_closed) {
        var i;
        for (i = 0; i < chat_open.length; i++) {
          chat_open[i].style.display = "none";
        }
        for (i = 0; i < chat_closed.length; i++) {
          chat_closed[i].style.display = "flex";
        }
      }
  
      var isMobileViewPort = function () {
        return window.innerWidth < 768;
      };
  
      function _checkTimeChatModal() {
        var d = new Date(),
          chat_open = _chat.querySelectorAll(".m-chat__open"),
          chat_closed = _chat.querySelectorAll(".m-chat__closed");
        var i;
  
        var chatHeight;
  
        if (isMobileViewPort()) {
          chatHeight = "485px";
        } else {
          chatHeight = "575px";
        }
  
        //Check day of week
        var day = d.getDay();
        if (day === 0) {
          _chatClosed(chat_open, chat_closed);
          _chat.style.height = chatHeight;
        }
  
        //Check hours
        var n = d.getHours();
  
        //If saturday
        if (day === 6) {
          if (n < 13 && n >= 9) {
            _chatOpen(chat_open, chat_closed);
          } else {
            _chatClosed(chat_open, chat_closed);
            _chat.style.height = chatHeight;
          }
        } else {
          if (n < 18 && n >= 9) {
            _chatOpen(chat_open, chat_closed);
          } else {
            _chatClosed(chat_open, chat_closed);
            _chat.style.height = chatHeight;
          }
        }
  
        //Check specific day
        d.setHours(0, 0, 0, 0);
  
        var festaRepubblica = new Date("06/02/2020");
        var ferragosto = new Date("08/15/2020");
        var santi = new Date("11/01/2020");
        var immacolata = new Date("12/08/2020");
        var natale = new Date("12/25/2020");
        var santoStefano = new Date("12/26/2020");
        var primoAnno = new Date("01/01/2020");
        var epifania = new Date("01/06/2020");
        var orarioRidotto = new Date("04/10/2020");
        var pasquetta = new Date("04/13/2020");
        var liberazione = new Date("04/25/2020");
        var lavoratori = new Date("05/01/2020");
  
        if (festaRepubblica.setHours(0, 0, 0, 0) === d.setHours(0, 0, 0, 0)) {
          _chatClosed(chat_open, chat_closed);
          _chat.style.height = chatHeight;
        }
        if (ferragosto.setHours(0, 0, 0, 0) === d.setHours(0, 0, 0, 0)) {
          _chatClosed(chat_open, chat_closed);
          _chat.style.height = chatHeight;
        }
        if (santi.setHours(0, 0, 0, 0) === d.setHours(0, 0, 0, 0)) {
          _chatClosed(chat_open, chat_closed);
          _chat.style.height = chatHeight;
        }
        if (immacolata.setHours(0, 0, 0, 0) === d.setHours(0, 0, 0, 0)) {
          _chatClosed(chat_open, chat_closed);
          _chat.style.height = chatHeight;
        }
        if (natale.setHours(0, 0, 0, 0) === d.setHours(0, 0, 0, 0)) {
          _chatClosed(chat_open, chat_closed);
          _chat.style.height = chatHeight;
        }
        if (santoStefano.setHours(0, 0, 0, 0) === d.setHours(0, 0, 0, 0)) {
          _chatClosed(chat_open, chat_closed);
          _chat.style.height = chatHeight;
        }
        if (primoAnno.setHours(0, 0, 0, 0) === d.setHours(0, 0, 0, 0)) {
          _chatClosed(chat_open, chat_closed);
          _chat.style.height = chatHeight;
        }
        if (epifania.setHours(0, 0, 0, 0) === d.setHours(0, 0, 0, 0)) {
          _chatClosed(chat_open, chat_closed);
          _chat.style.height = chatHeight;
        }
        if (orarioRidotto.setHours(0, 0, 0, 0) === d.setHours(0, 0, 0, 0)) {
          if (n < 14 && n >= 9) {
            _chatOpen(chat_open, chat_closed);
          } else {
            _chatClosed(chat_open, chat_closed);
            _chat.style.height = chatHeight;
          }
        }
        if (pasquetta.setHours(0, 0, 0, 0) === d.setHours(0, 0, 0, 0)) {
          _chatClosed(chat_open, chat_closed);
          _chat.style.height = chatHeight;
        }
        if (liberazione.setHours(0, 0, 0, 0) === d.setHours(0, 0, 0, 0)) {
          _chatClosed(chat_open, chat_closed);
          _chat.style.height = chatHeight;
        }
        if (lavoratori.setHours(0, 0, 0, 0) === d.setHours(0, 0, 0, 0)) {
          _chatClosed(chat_open, chat_closed);
          _chat.style.height = chatHeight;
        }
  
        return true;
      }
  
      if (_chat) {
        genesys_webChat.init(
          document.getElementById("genesys_webchat_src").value,
          document.getElementById("genesys_webchat_stream").value,
          document.getElementById("genesys_webchat_api_key").value,
          document.getElementById("genesys_webchat_endpoint").value,
          document.getElementById("genesys_webchat_theme").value,
          document.getElementById("genesys_webchat_lang").value,
          document.getElementById("genesys_webchat_subject").value,
          document.getElementById("genesys_webchat_department").value
        );
      }
  
      // window.addEventListener('load', function () {
      _init(showAndHideChat);
      // });
    })();
  }
  
  showAndHideChat = function () {
    if (window.location.href.indexOf("supporto") > 0) {
      document.getElementById("genesys-chat").style.display = "block";
    }
  };