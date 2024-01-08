## General

General properties

## Colors

```
Primary: #ffffff
Secondary:#f9f9f9
Text banner: #505050
BackGround Link Card: #f9f9f9
Text Link card and Footer: #505050
Button banner, Button hover: #fdc100
Button Link Card: #f9f9f9
Text Button: #ffffff
```

## Typography

H2

```
General
	font-family:myriadLight,Arial;
	font-size:30px;
	line-height:36px;
	text-align:start;
	letter-spacing:normal;
	color:#505050


```

Span

```
First
	font-family:myriadLight,Arial;
	font-size:40px;
	line-height:48px;
	text-align:left;
	letter-spacing:normal;
	color:#505050
Second
	font-family:myriadLight,Arial;
	font-size:25px;
	line-height:30px;
	text-align:left;
	letter-spacing:normal;
	color:#505050
Subtitle
	font-family:myriadLight,Arial;
	font-size:10px;
	line-height:13px;
	letter-spacing:normal;
	text-align:start;
	color:#8d8d8d
Postilla
	font-family:myriadLight,Arial;
	font-size:10px;
	line-height:13px;
	letter-spacing:normal;
	text-align:start;
	color:#8d8d8d
```

A tag

```
Header
	font-family:myriadSemibold,Arial;
	font-size:13px;
	line-height:15px;
	text-align:left;
	letter-spacing:2px;
	color:#505050;
	background-color:#ffffff;
	text-transform:uppercase
	text-decoration:none
Footer bold
	font-size:14px;
	line-height:35px;
	text-align:start;
	letter-spacing:normal;
	color:#505050
	text-decoration:none;
	font-family:myriadSemibold,Arial;
	font-weight:bold;
	text-transform: uppercase;
Footer normal
	font-size:14px;
	line-height:35px;
	text-align:start;
	letter-spacing:normal;
	color:#505050
	text-decoration:none;
	font-family:myriadLight,Arial;
```

p tag

```
General
	font-family:myriadLight,Arial;
	font-size:20px;
	line-height:39px;
	text-align:start;
	letter-spacing:normal;
	color:#505050
Subtitle
	font-family:myriadLight,Arial;
	font-size:16px;
	line-height:26px;
	letter-spacing:normal;
	color:#505050
```

Div used as P tag for banner Grid

```
Used as P tag for
Title
	font-family:myriadLight,Arial;
	font-size:24px;
	line-height:28px;
	text-align:start;
	letter-spacing:normal;
	color:#000000
Subtitle
	font-family:myriadLight,Arial;
	font-size:14px;
	line-height:22px;
	text-align:start;
	letter-spacing:normal;
	color:#000000
```

## Button

```
Primary
	width:150px;
	height:45px;
	padding:12px 20px 8px 20px;
	font-family:myriadSemibold,Arial;
	font-size:14px;
	line-height:16.8px;
	text-align:center;
	letter-spacing:-0.2;
	color:#ffffff;
	background-color:#fdc100;
	text-transform:uppercase;
	border-radius:5px
Secondary
	width:150px;
	height:45px;
	padding:12px 20px 8px 20px;
	font-family:myriadSemibold,Arial;
	font-size:14px;
	line-height:16.8px;
	text-align:center;
	letter-spacing:-0.2;
	color:#aeaeae;
	background-color:#f9f9f9;
	border: 1px solid #aeaeae;
	text-transform:uppercase;
	border-radius:5px
Secondary Hover
	width:150px;
	height:45px;
	padding:12px 20px 8px 20px;
	font-family:myriadSemibold,Arial;
	font-size:14px;
	line-height:16.8px;
	text-align:center;
	letter-spacing:-0.2;
	color:#fdc100;
	background-color:#f9f9f9;
	border: 1px solid #fdc100;
	text-transform:uppercase;
	border-radius:5px;
Filter
	width:157px;
	height:55px;
	padding:10px 30px;
	font-family:myriadLight,Arial;
	font-size:14px;
	line-height:16.8px;
	text-align:center;
	letter-spacing:normal;
	color:#505050;
	background-color:#f2f2f2;
	border-radius:3px;
```

---

## Responsive guidelines

_Creare media query quando il contenuto in soggetto non e' piu piacevole o facile da consumare anziche device-specific_

### Approccio

1. Partendo da una vista mobile (inspector => Mobile mode) delle stesse dimensioni del _Samsung galaxy S5_ o _Motorola G4_

2. Allargare la viewport

3. Quando il contenuto/layout si rovina, aggiustare di conseguenza (anziche fissarsi su un set limitato di device specifici ovvero non fare il cane)

- Utilizzare unita' relative il piu possibile (cosi da adattare il contenuto al cambiamento delle dimensioni il piu possiible senza Media Query)

  - font
    - _`em`_
    - _`rem`_
  - layout ed altri elementi (idealmente)
    - _`vh`_ (height)
    - _`%`_ (width)

Come funziona _`em`_:

- 1 _`em`_ equivale a:

  - i px della _`font-size`_ corrente (dello stesso elemento)
  - oppure della prima _`font-size`_ che trova salendo i parent
    Per strutturare layout

- _`flex`_
- _`grid`_

Utilizzare unita: _`em`_ perche':

- _`px`_: non e' affidibile quando si zooma o l utente ha cambiato la font-size del suo browser.
  - ⚠ anche se in caso di problemi perdi-tempo con _em_ piuttosto usiamo _`px`_
- _`rem`_: crea bug su Safari per via della sua implementazione

---

## Convenzioni di Git Commit

Creare un branch {​​​​​​​​​nomereply}​​​​​​​​​
Una volta che si ha qualcosa di stabile committarlo seguendo le convenzioni di commit
Allineare branch con Demo

Premessa: oltre alle versioni, Git si rivela utile in caso di cambio di rotta o disastri,quindi per massimizzare l efficenza di quelle situazioni e' importante lasciarci nel passato piu tracce ed informazioni possibili su cosa viene fatto ma sopratutto perche' venga fatto (quando si ritene possa essere utile saperlo per il futuro)

Esempi di commit:

✨Aggiunta la "wishlist"

✨Rimossi i "preferiti"
Il committente ha cambiato idea sulla feature

🐛La X del popup del prodotto non chiudeva il popup

Convenzioni di Git commit:

✨ Produttivita' generica (principlamente aggiunta di features) /scintila - spark

🐛
Bugfix:
Come: scrivere il comportamento del bug, la soluzione SE si vuole la si aggiunge sotto/
insetto - bug

📃 Documentazione pagina /
pagina - doc

⚡ Performance: migliorie di prestazioni (non intacca features) /alta tensione - lightning

🎨
Grafica
Quando: se esclusivamente grafica/
arte - art

🧪 Test: aggiunta o esecuzione test/ test

🔨 Refactor/ hammer

⬆ Upgrade pacchetti/dipendenze /up

🔧 Configurazione di ambiente (non prodotto) (package.json e simili)/ wrench

⏪ Riavvolgi codice ad un punto nel passato rewind

1- Scrivere al passato: Aggiunto, Rimosso, Cancellato, Rifinito

2- Sotto la riga del commit si puo aggiungere una lista di ragioni per tale nuovo commit se ritenuto probabilmente utile per il futuro
