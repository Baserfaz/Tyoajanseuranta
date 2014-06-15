
function paivitaYhteensa() {		//päivittää työajan yhteensä (input) lokeroon.
	$('#aikaYhteensa').val(yhteensa);
}

//GLOBAALITMUUTTUJAT
//rivilaskuri, nollataan yhteensalaskuri
var i = 1;
var yhteensa = 0.00;

//sivun ollessa ladattu rakennetaan ensimmäinen täytettävä rivi automaattisesti. ns. aloitusrivi.
$('document').ready(function(){

		$('#mainTable tr:last').after('<tr>'+
		'<td><input type="date" class="inputs makeInvis" name="paivays"/></td>'+
		'<td><input type="number" class="inputs specialDocAlku makeInvis" name="alkuklo" value="0.00"/></td>'+
		'<td><input type="number" class="inputs specialDocLoppu makeInvis" name="loppuklo" value="0.00"/></td>'+
		'<td><input type="number" class="inputs specialDocTunnit makeInvis" name="tyotunnit" value="0.00" readonly></input></td>'+
		'</tr>');
		
		$('.specialDocAlku').attr('id', 'alkuklo'+i);
		$('.specialDocLoppu').attr('id', 'loppuklo'+i);	
		$('.specialDocTunnit').attr('id', 'tyotunnit'+i);
		
		$('#nimi').select();	//valitaan työntekijännimi lokero valmiiksi
})

$('#uusiRivi').click(function() {
	var conf = confirm('Haluatko varmasti luoda uuden rivin?');
	
	//luodaan uusi rivi varmistuksen jälkeen.
	if(conf){
		i++;	//rivilaskuria lisätään yhdellä
		
		$('#mainTable tr:last').after('<tr>'+
		'<td><input type="date" class="inputs makeInvis"/></td>'+
		'<td><input type="number" class="inputs specialAlku makeInvis" value="0.00"/></td>'+
		'<td><input type="number" class="inputs specialLoppu makeInvis" value="0.00"/></td>'+
		'<td><input type="number" class="inputs specialTunnit makeInvis" value="0.00" readonly></input></td>'+
		'</tr>');
		
		$('.specialAlku').attr('class','makeInvis inputs specialAlku'+i);
		$('.specialLoppu').attr('class','makeInvis inputs specialLoppu'+i);
		$('.specialTunnit').attr('class','makeInvis inputs specialTunnit'+i);
		
		
		$('.specialAlku'+i).attr('id', 'alkuklo'+i);
		$('.specialLoppu'+i).attr('id', 'loppuklo'+i);	
		$('.specialTunnit'+i).attr('id', 'tyotunnit'+i);
		
		$('#poistaRivi').attr('class','nappula no-print');		//jos luodaan uusi rivi -> näytetään poistonappi -> sallitaan rivin poistaminen.
		
		$('#alkuklo'+i).select();								//valitaan uuden rivin aloitus kellonaika. (käyttäjäystävällinen)
		
	} else {
		return(0);
	}
})

$('#poistaRivi').click(function() {
	//Poista viimeisin rivi.
	var conf = confirm('Haluatko varmasti poistaa uusimman rivin?');
	
	if(conf){								
		var rivinAikaYhteensa = $('#tyotunnit'+i).val();		//otetaan viimeisen rivin tyotunnit talteen.
		yhteensa = yhteensa - rivinAikaYhteensa;				//vähennetään poistettavan rivin aika yhteisajasta.
		paivitaYhteensa(yhteensa);								//päivitetään aikaYhteensa
		i--;													//vähennetään rivilaskuria
		$('#mainTable tr:last').remove();						//poistetaan alin rivi
		$('#alkuklo'+i).select();								//valitaan edellisen rivin aloitus kellonaika. (käyttäjäystävällinen)
		
	} else {
		return(0);										
	}
	
	//piilotetaan nappula, jos ei ole kuin yksi muokattava rivi jäljellä. -> ei voida poistaa koko taulukkoa.
	if(i == 1){															
		$('#poistaRivi').attr('class','nappula no-print hidden');		//piilotetaan poistonappula
	}else {
		return(0);
	}
})


$('#laskeTyotunnit').click(function() {

	for(var j=1; j<=i; j++){													//Loopataan kaikkien i:n (rivien) arvojen läpi 
		
		var tunnitEnnen = $('#tyotunnit'+j).val();
	
		//Ensin käsitellään alkuaika: 
		var alkuAika = parseFloat($('#alkuklo'+j).val(), 10);					//haetaan syötetty kellonaika(
		var alkuAikaMin = alkuAika - (Math.floor(alkuAika));					//otetaan desimaalipilkun jälkeinen osa talteen
		alkuAikaMin = alkuAikaMin + 0.05; 										//Pyöristystarkkuus on 5min. -> 0.05
	
			//PYÖRISTYS
			if(alkuAikaMin < 0.15){
				alkuAikaMin = 0.00;
			} else if((alkuAikaMin > 0.15) && (alkuAikaMin < 0.31)){
				alkuAikaMin = 0.25;
			} else if((alkuAikaMin > 0.30) && (alkuAikaMin < 0.46)){
				alkuAikaMin = 0.50;
			} else if((alkuAikaMin > 0.45) && (alkuAikaMin < 0.59)){
				alkuAikaMin = 0.75;
			} else if (alkuAikaMin >= 0.60) {
				alkuAikaMin = 0.75;
			}
		
		var alkuAikaH = Math.floor(alkuAika);									//etsitään kokonaiset osat desimaaliluvusta
		var alkuTyoaika = alkuAikaH + alkuAikaMin;								//lisätään pyöristetty minuuttiosa tasatunteihin
	
		//Sitten käsitellään loppuaika:
		var loppuAika = parseFloat($('#loppuklo'+j).val(), 10);
		var loppuAikaMin = loppuAika - (Math.floor(loppuAika));
		loppuAikaMin = loppuAikaMin + 0.05; // Pyöristystarkkuus on 5min. -> 0.05
	
			/* PYÖRISTYS*/
			if(loppuAikaMin < 0.15){
				loppuAikaMin = 0.00;
			} else if((loppuAikaMin > 0.15) && (loppuAikaMin < 0.31)){
				loppuAikaMin = 0.25;
			} else if((loppuAikaMin > 0.30) && (loppuAikaMin < 0.46)){
				loppuAikaMin = 0.50;
			} else if((loppuAikaMin > 0.45) && (loppuAikaMin < 0.59)){
				loppuAikaMin = 0.75;
			} else if (loppuAikaMin >= 0.60) {
				loppuAikaMin = 0.75;
			}
		
		var loppuAikaH = Math.floor(loppuAika);
		var loppuTyoaika = loppuAikaH + loppuAikaMin;
		var Tyoaika = loppuTyoaika - alkuTyoaika;
	
		$('#tyotunnit'+j).val(Tyoaika);				//syötetään rivin laskettu työaika työtunti (input) lokeroon.
	
		if(tunnitEnnen === Tyoaika) {
		alert('Ei paiviteta');
			return(0);
		} else if (tunnitEnnen != Tyoaika) {
			if(tunnitEnnen < Tyoaika){					//jos tunteja tulee lisää päivityksen yhteydessä lisätään laskuriin.
				yhteensa = yhteensa + (Tyoaika - tunnitEnnen);
				paivitaYhteensa();				
			} else if (tunnitEnnen > Tyoaika){			//jos tunteja lähtee päivityksen yhteydessä vähennetään laskuria.
				yhteensa = yhteensa - (tunnitEnnen - Tyoaika); 	
				paivitaYhteensa();
			}
			
		}
	}	
})

$('#reset').click(function() {
	var conf = confirm('Haluatko varmasti pyyhkia kaikki tiedot?');
	
	if(conf){
		$(window).unbind("beforeunload");					//älä kysy kahdesti samaa asiaa. ks. $(window).bind...
		location.reload();									//päivitys.
	} else {
		return(0);
	}
})

$('#tulosta').click(function() {							//avaa tulostus ikkuna
	$('#aikaYhteensa').css('margin-bottom','20px');			//muutetaan tyylejä print ystävälliseksi ...
	$('.makeInvis').css('border','none');
	$('.makeInvis').css('background-color','transparent');
	$('#mainForm').css('border','none');

	window.print();

	$('#aikaYhteensa').css('margin-bottom','0px');			//muutetaan tyylejä print ystävälliseksi ...
	$('.makeInvis').css('border','1px solid #ccc');
	$('.makeInvis').css('background-color','#fff');
	$('#mainForm').css('border','1px solid #ccc');
})

$(window).bind('beforeunload', function(){					//kun yritetään päivittää tai sulkea sivu:
    return "Sivun paivittaminen pyyhkii kaikki tiedot.";	//this == confirm();
});

//ei toimi class valitsimen kanssa
$('.inputs').on('blur', function() {
	alert('aappaappa');
})

