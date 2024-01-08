// @ts-nocheck
import React, { useContext, useEffect, useState } from 'react' 
import { defineMessages } from 'react-intl' 
import styles from './styles.css' 
import { FormattedMessage,
    MessageDescriptor,
    useIntl,
    defineMessages } from 'react-intl'
 

const messages = defineMessages({
    warning: { id: 'store/countdown.warningMessage' },
    warning2: { id: 'store/countdown.warningMessage2' }
    })

const TermsPage: StorefrontFunctionComponent<Props> = () => {
  const intl = useIntl()
  const translateMessage = (message: MessageDescriptor) => intl.formatMessage(message) 
  return (
            <div className={styles.termsMainDiv}>

                <div className={styles.termsHeader}>
                   <h2 className={styles.termsTitle}>TERMS PAGE (Business files and labels missing)</h2>  
                </div>
                
                <div className={styles.termsBody}>

                    <p><strong>
                        Algemene voorwaarden met betrekking tot het bestellen van Whirlpool producten via onze website.     
                    </strong></p>
 
                    <p><strong>
                        1. Algemeen    
                    </strong></p>

                    <p>1.1 Deze site is eigendom en wordt bestuurd door Whirlpool Belux N.V. (hierna “Whirlpool”, “wij”, “ons)</p>
                   
                    <p>Vestigingsadres:</p>
                   
                    <p>Nijverheidslaan 3/1</p>
                    
                    <p>1853 Strombeek-Bever</p>
                    
                    <p>België</p>
                   
                    <p>Indien u vragen, klachten of commentaren heeft in verband met deze voorwaarden dan kunt u een email sturen naar consumercare_benelux@whirlpool.com of u kunt bellen met onze Dienst Onderdelen en Accessoires (0032) 02 263 34 60. Voor informatie over een herstelling aan huis kunt u terecht bij onze Consumentendienst (0032) 02 263 33 33.</p>
                   
                    <p>Bereikbaarheid: 
                    Van maandag tot vrijdag 08:30 uur tot 17:00 uur. 
                    Ondernemingsnummer: BE0423029569 
                    BTW-nummer: BE0423.029.569 RPR Brussel</p>
                    
                    <p><strong>
                        2. Definities
                    </strong></p>

                    <p>2.1 De hierna met een beginhoofdletter aangeduide begrippen hebben in deze Algemene Voorwaarden de volgende betekenis:
                    <br/> 
                    a. Algemene Voorwaarden: deze algemene voorwaarden van Whirlpool;
                    <br/> 
                    b. Consument: de natuurlijke persoon die niet handelt voor doeleinden die verband houden met zijn handels-, bedrijfs-, ambachts- of beroepsactiviteit;
                    <br/> 
                    c. Overeenkomst: de overeenkomst tussen Whirlpool en Consument ter verkrijging van een Product;
                    <br/> 
                    d. Product: het door Whirlpool op haar website aangeboden product.
                    </p> 

                    <p><strong>
                    3. Toepasselijkheid Algemene Voorwaarden 
                    </strong></p>
                    
                    <p>
                    3.1 Deze Algemene Voorwaarden zijn van toepassing op alle aanbiedingen van, bestellingen bij, rechtsbetrekkingen 
                    en overeenkomsten waarbij Whirlpool, producten of diensten van welke aard ook aan Consument levert, ook indien deze 
                    producten of diensten niet (nader) in deze Algemene Voorwaarden zijn omschreven.
                    </p>

                    <p>
                    3.2 Onze voorwaarden zijn in overeenstemming met de Belgische en Luxemburgse wetgeving en zijn zo opgesteld dat 
                    onze Consumenten in alle vertrouwen via onze website kunnen aankopen. Wij raden u aan een afdruk te maken van deze 
                    algemene voorwaarden wanneer u een bestelling plaatst.
                    </p>
                    
                    <p>
                    3.3 De toepasselijkheid van andere voorwaarden van Consument wijst Whirlpool uitdrukkelijk van de hand. 
                    </p>

                    <p>
                    3.4 Whirlpool behoudt zich het recht voor deze Algemene Voorwaarden voor zover wettelijk toegestaan te 
                    veranderen en/of te wijzigen. Doordat u deze website op dit moment bezoekt, accepteert u dat u op dit moment 
                    bent gebonden door de huidige Algemene Voorwaarden en dat u deze elke keer dat u een bestelling plaats checkt op 
                    veranderingen en aanpassingen. In de toekomst kunnen andere Algemene Voorwaarden gelden.
                    </p>

                    <p><strong>
                    4. Bestellingen via de website 
                    </strong></p>

                    <p>
                    4.1 Whirlpool heeft alles in het werk gesteld om de inhoud van deze website met de grootste nauwkeurigheid samen 
                    te stellen. Zeker met het oog op een juiste prijsweergave en een correcte beschrijving van onze producten. 
                    Desalniettemin kan Whirlpool geen garantie bieden ten aanzien van de juistheid van alle gegevens en zijn wij 
                    niet verantwoordelijk voor eventuele fouten op deze website.
                    </p>

                    <p>
                    4.2 Tenzij schriftelijk anders is overeengekomen zijn alle aanbiedingen, daaronder begrepen advertenties en 
                    prijslijsten zoals vermeld op de website van Whirlpool vrijblijvend.
                    </p>

                    <p>
                    4.3 Consument dient voordat hij zijn bestelling bevestigt altijd goed te controleren of het juiste Product is 
                    geselecteerd. Consument dient bij het maken van de bestelling altijd een juist adres te gebruiken.
                    </p>

                    <p>
                    4.4 Als wordt getwijfeld aan de juistheid van de gegevens die Consument heeft ingevoerd bij de bestelling, 
                    kan Whirlpool contact met Consument opnemen met behulp van de gegevens die Consument heeft ingevoerd. Als Whirlpool Consument niet kan bereiken en de gegevens derhalve niet kan controleren, kan Whirlpool ertoe overgaan de bestelling te annuleren.
                    </p>

                    <p>
                    4.5 Iedere Overeenkomst wordt aangegaan onder de opschortende voorwaarde van voldoende beschikbaarheid van de 
                    desbetreffende producten of diensten.
                    </p>

                    <p>
                    4.6 Wij zullen u zo snel mogelijk per e-mail verwittigen om de ontvangst van uw bestelling te bevestigen. 
                    Deze ontvangstmelding impliceert van de zijde van Whirlpool geen aanvaarding van de bestelling. 
                    Pas wanneer uw bestelling door ons is nagekeken en volledig is bevonden, de aangeboden betalingswijze in 
                    orde is en de bestelde goederen beschikbaar worden gesteld, en Whirlpool niet om andere redenen niet op uw 
                    bestelling wenst in te gaan waartoe zij zich het recht voorbehoudt, zal uw bestelling door Whirlpool zijn aanvaard. 
                    Zolang dit niet is gebeurd schept de bestelling die u plaatst, geen lastens Whirlpool afdwingbare rechten. 
                    Ingeval uw bestelling geweigerd wordt, zal u daarvan onverwijld op de hoogte worden gebracht. 
                    Whirlpool wijst iedere verantwoordelijkheid af voor eventuele vertragingen of verhinderingen in 
                    verband met de mogelijke aanvaarding of weigering van uw bestelling.
                    </p>

                    <p><strong>
                    Totstandkoming Overeenkomst telefonische bestellingen
                    </strong></p>

                    <p>
                    4.7 Wanneer u een telefonische bestelling plaatst zullen we u onmiddellijk melden indien het Product niet voorradig is. U hebt dan de keuze of u wilt verdergaan met het plaatsen van uw bestelling. Wanneer u een bestelling via de telefoon plaatst zullen we uw betaling verwerken en u het ordernummer doorgeven. U ontvangt een bevestiging van uw bestelling per e-mail.
                    </p>

                    <p>
                    4.8 We zullen u onmiddellijk inlichten indien uw betalingsgegevens niet goedgekeurd zijn en u vragen om te betalen via een andere aanvaarde methode.
                    </p>

                    <p><strong>
                    5. Prijzen en betaling
                    </strong></p>

                    <p>
                    5.1 Consument betaalt voor de door middel van de website bestelde producten dan wel diensten, de in de Overeenkomst vermelde prijs. Betaling vindt plaats volgens de op de website van Whirlpool aangegeven wijze.
                    </p>

                    <div className={styles.termsButtonDiv}>
                        <a className={styles.downloadLink} target="_blank" href="https://parts.whirlpool.be/assets/frontend/pdf/whirlpool/algemenevoorwaarden_Whirlpool_Belux.pdf" download>
                            Download
                        </a>
                    </div>  
                </div> 
            </div>
  )
}

export default TermsPage
 