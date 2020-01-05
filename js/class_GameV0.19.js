"use strict";
// MICMACMOE IA INTELLIGENCE ARTISANALE


const good = '✔️ '; const bad = '❌ '

// START >>-------------------------------------
const versionning = {
    "JSv": 18,
    "PHPv": 4,
    "CURv": "a",
    "urlphp": "IArtisanal.php"
}

// const data = {
//     boardSize: 4,
//     board: [],
//     turn: 0,
//     playerMax: 6,
//     playerId: 0,
//     players: [
//         {"player": 0,"name": C_Player,  "ia": false,  "marque": "x", "signal": "X", "svg": "x.svg"},
//         {"player": 1,"name": "LAPIN",   "ia": true,   "marque": "o", "signal": "△", "svg": "o.svg"},
//         {"player": 2,"name": "CHIEN", "ia": true,   "marque": "p", "signal": "◼", "svg": "p.svg"},
//         {"player": 3,"name": "CANARD",     "ia": true,   "marque": "z", "signal": "▢", "svg": "z.svg"},
//         {"player": 4,"name": "PANDA",     "ia": true,   "marque": "g", "signal": "◫", "svg": "g.svg"},
//         {"player": 5,"name": "RENARD",    "ia": true,   "marque": "h", "signal": "◫", "svg": "h.svg"}, //Pas fait encore
//         {"player": 6,"name": "OURS",     "ia": true,   "marque": "i", "signal": "◫", "svg": "i.svg"}  //Pas fait encore
//     ],
//     haswinner: false
// }

class Game {
    constructor (C_NbCasesCote,C_NbPlayers,C_Player){
        this.Ajax = false
        if (C_NbCasesCote>9)    C_NbCasesCote = 7
        if (C_NbCasesCote <3)    C_NbCasesCote = 3
        if (C_NbPlayers>7)      C_NbPlayers = 7
        if (C_NbPlayers <2)      C_NbPlayers = 2
        // this.version = 'Alpha JsV'+versionning.JSv+'.PhpV'+versionning.PHPv+' '+versionning.JSv+'.'+versionning.PHPv+'.'+versionning.CURv
        // this.urlphp = versionning.urlphp
        this.token = 'P'+this.HitDice(1, 999)+'T'+this.HitDice(1,999)+'B'+this.HitDice(1, 999)+'UR'
        this.Actif_KL = true // affiche en console ON !
        // --- MAP
        this.NbCasesCote = C_NbCasesCote // taille de la map
        // ---
        this.NbPlayers = C_NbPlayers
        this.NbCoupsMax = (C_NbCasesCote * C_NbCasesCote)-1
        this.Players = [ // 1 joueurs + 6 IA
            {"player": 0,"name": C_Player,  "Origin_name": "COCHON",    "ia": false,  "marque": "x", "signal": "X", "svg": "x.png"},
            {"player": 1,"name": "LAPIN",   "Origin_name": "LAPIN",    "ia": true,   "marque": "o", "signal": "△", "svg": "o.png"},
            {"player": 2,"name": "CHIEN",   "Origin_name": "CHIEN",    "ia": true,   "marque": "p", "signal": "◼", "svg": "p.png"},
            {"player": 3,"name": "CANARD",  "Origin_name": "CANARD",    "ia": true,   "marque": "z", "signal": "▢", "svg": "z.png"},
            {"player": 4,"name": "PANDA",   "Origin_name": "PANDA",    "ia": true,   "marque": "g", "signal": "◫", "svg": "g.png"},
            {"player": 5,"name": "RENARD",  "Origin_name": "RENARD",    "ia": true,   "marque": "h", "signal": "◫", "svg": "h.png"}, //Pas fait encore
            {"player": 6,"name": "OURS",    "Origin_name": "OURS",    "ia": true,   "marque": "i", "signal": "◫", "svg": "i.png"}  //Pas fait encore
        ]
        this.Player = C_Player
        this.Map = [] // initialisation de la map à vide
        this.OriginalOya = 0
        this.PlayerNum = 0
        this.Oya = this.OriginalOya // 1er joueurs
        this.CoupsJoues = 0
        this.CasesJoues = { // ici on stock tous les coups joués (la 1ere valeur = nb players<)
            "nbplayers" : this.NbPlayers,
            "nbcases" : this.NbCasesCote,
            "starter" : this.Oya,
            "winnerid" : '',
            "winnername" : '',
            "seriedecoups" : []
        }
        this.Winner = -1 // le Vainqueur (-1 si vide)
        this.compteurregles = 0
        this.compteurreglescases = 0
    }
    //  A METTRE DANS LA CLASSE DatazShare ?? -------------------------------------------------
    PushDataz(x,y,num){
        // je pousse le coups joué dans la liste des coups joués
        this.CL('I','PushDataz',x+''+y,'F')
        this.CasesJoues.seriedecoups.push(''+x+''+y+'')
        // this.CL('I','PushDataz','ok >? '+this.CasesJoues.seriedecoups[this.CasesJoues.seriedecoups.length-1],'F')
    }
    GettingDataz(){
        // ici ajax demande la liste des coups joués pour l'afficher en bas de page
        this.CL('G3','GettingDataz','','cloud')
        let nbplay = this.CoupsJoues
        if (nbplay==0) nbplay=1
        var MonPost = new XMLHttpRequest()
        var url = versionning.urlphp
        var params = '?demande=1'
        params += '&nbcases=' + this.NbCasesCote
        params += '&coups=' + nbplay
        params += '&this=' + this.token
        
        this.CL('I','params',params,'F')
        this.CL('GC')
        // console.groupEnd() 
        MonPost.open('POST', url, true)

        MonPost.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')

        let UglyValue=this
        MonPost.onreadystatechange = function() {
            // console.log('MonPost ', '.readyState:'+ MonPost.readyState + ' .status:'+ MonPost.status)
            UglyValue.CL('wait','AR', '.readyState:'+ MonPost.readyState + ' .status:'+ MonPost.status,'cloud')
            if(MonPost.readyState == 4 && MonPost.status == 200) {
                console.groupEnd() 
                UglyValue.AfficheLaReponse_A(MonPost.responseText)
            }
        }
        MonPost.send(params)

    }
    AfficheLaReponse_A(x){
        if (x!='Nothing!'){
            this.CL('G3','AR/AfficheLaReponse_A','✔️ ','cloud')
            this.CL('I',x,'','cloud')
            this.CL('GEnd')
            var testing = document.querySelector('#partiesfaites')
            testing.innerHTML = ''
            testing.innerHTML = this.HTML_Maker(x)
        }
    }
    HTML_Maker(x){
        var message = ''
        x = JSON.parse(x)
        var ipuser = x['user'][0]['ipuser']
        x = x['coups']
        console.log('n+:'+x.length)
        for (let i = 0; i < x.length-1;i++){
            let style = ''
            let marque = ''
            if (x[i].winnerid!="1") {marque = '✔️';style += ' ia'} else {marque = '❌ ';style += ' player'}
            if (x[i].ipuser==ipuser){style += ' ip'}
            message += '<div id="item_'+i+'" ';
            message += 'class="item'+style+'" ';
            message += 'title="'+x[i].winnername+' '+x[i].ladate+''+marque+x[i].seriedecoups+'">';
            message += '<div class="start">'+i+'</div>';
            // message += '<div class="end">'+marque+x[i].seriedecoups+'</div>';
            message += '<div class="end">'+x[i].winnername+'</div>';
            message += '</div>'
        }


        // x = JSON.parse(x, (key, value) => {
        //     // console.log(value);            // on affiche le nom de la propriété dans la console
        //     if (value.length > 13) {
        //     message += '<div id="'+key+'" class="item">'+value+'</div>'}
        //     return value;                // et on renvoie la valeur inchangée.
        // });
        return message
    }




    SendingDataz(){
        // ici ajax d'envoie des données
        this.CL('G3','SendingDataz','','cloud')
        
        this.CasesJoues.winnername = this.Players[this.Oya].name
        this.CasesJoues.winnerid = this.Winner
        this.CL('table',this.CasesJoues,'','F')

        var MonPost = new XMLHttpRequest();
        var url = versionning.urlphp
        var params = '?new=1'
        params += '&winnerid='+this.CasesJoues.winnerid
        params += '&starter='+this.CasesJoues.starter
        params += '&winnername='+this.CasesJoues.winnername
        params += '&nbplayers='+this.CasesJoues.nbplayers
        params += '&nbcases='+this.CasesJoues.nbcases
        params += '&seriedecoups='+this.CasesJoues.seriedecoups
        params += '&this=' + this.token
        
        this.CL('I','params',params,'F')
        console.groupEnd() 
        MonPost.open('POST', url, true)

        MonPost.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')

        let UglyValue=this
        MonPost.onreadystatechange = function() {
            console.log('MonPost ', '.readyState:'+ MonPost.readyState + ' .status:'+ MonPost.status)
            if(MonPost.readyState == 4 && MonPost.status == 200) {
                console.groupEnd() 
                UglyValue.AfficheLaReponse_B(MonPost.responseText)
                
                UglyValue.GettingDataz() // ICI on demande la liste des coups joué ;)
            }
        }
        MonPost.send(params) 
    }
    AfficheLaReponse_B(x){
        // this.CL('G3','AR/SendingDataz_B','✔️ ','cloud')
        this.CL('G3','AR/SendingDataz_B',+x,'cloud')
        // console.log('✔️ '+'Accusé réception Serveur B :'+x)
        var testing = document.querySelector('#restart')
        let testing2 = document.createElement("p")
        testing2.innerHTML = x
        testing.appendChild(testing2)
    }




    //  A METTRE DANS LA CLASSE ?? -------------------------------------------------
    TheWinnerIs(){    
        // this.GettingDataz() // deplacé dans SendingDataz
        this.Winner = this.Oya 
        this.CL('G','TheWinnerIs','','F')
        this.CL('WIN','And the Winner is',this.Players[this.Winner].name,'star')
        this.CL('I','Partie en '+ this.CasesJoues.seriedecoups.length +' Coups','('+this.CasesJoues.seriedecoups+')','star')


        let NewGameLauncher = document.createElement("div")
        NewGameLauncher.title = 'C1ick M3 t0 R35t4rt !'
        NewGameLauncher.id = 'restart'

        let NewGameTitle = document.createElement("h2")
        NewGameTitle.innerHTML = '✔️' + this.Players[this.Oya].name+' Win !' +'✔️'
        let NewGamePunchLine = document.createElement("p")
        NewGamePunchLine.innerHTML = 'Click to restart'
        
        NewGameLauncher.appendChild(NewGamePunchLine)
        NewGameLauncher.appendChild(NewGameTitle)

        // let ButtonLauncher = document.createElement("button")
        // ButtonLauncher.textContent = 'Restart'

        let UglyValue=this
        NewGameLauncher.addEventListener(
            'click',
            function Restarting(e){
                UglyValue.Restarting(e)
            },
            {once:true}
        )

        // BDD BDD BDD BDD
        if (this.Ajax) this.SendingDataz()

        var navigation = document.querySelector('.buttons')
        NewGameLauncher.prepend(NewGameTitle)
        // NewGameLauncher.appendChild(ButtonLauncher)
        navigation.appendChild(NewGameLauncher)
    }
    
    Restarting(){
        console.clear()
        this.CL('I','Restarting MicMacMoe','','good')
        document.querySelector('#restart').remove()
        this.ReInit()
    }


    // A METTRE DANS LA CLASSE AFFICHAGE HTML -----------------------------------------------
    Create_map(){
        this.CL('G3','Creating World','','good')

        for (let a=0; a<this.NbCasesCote; a++){
            let ligne = []
            for (let b=0; b<this.NbCasesCote; b++){
                ligne.push('A')
            }
            this.Map.push(ligne)
        }
        this.CL('I','Map','Ok','good')
    }
    //  A METTRE DANS LA CLASSE AFFICHAGE HTML -------------------------------------------------
    Affiche_map(){ // et creation aussi

        var GameTemp = this
        
        let versionpage = document.querySelector('#version')
        versionpage.innerHTML = 'Alpha JsV'+versionning.JSv+'.PhpV'+versionning.PHPv+' '+versionning.JSv+'.'+versionning.PHPv+'.'+versionning.CURv
        // Vol de class Game > GameTemp 
        // pour la fonction plus ClickMeHard bas
        let PlateauDiv = document.createElement("div")
        PlateauDiv.id = 'leplateau'
        PlateauDiv.className = 'plateau'
        var leplateau = document.querySelector('#board')
        // création des div pour  les cases console.logiquables du plateau
            // let titrediv = document.createElement("h2")
            // titrediv.textContent = 'MicMacMoe'
            // titrediv.style.width = "100%"
            // leplateau.appendChild(titrediv)
        for (let YY = 0; YY < GameTemp.NbCasesCote; YY++) {
            for (let XX = 0; XX < GameTemp.NbCasesCote; XX++) {

                var newdiv = document.createElement("div")
                newdiv.id = 'case_' + XX + '' + YY
                newdiv.className = 'case shadowed'

                // newdiv.style.width = "calc( (100% - ("+GameTemp.NbCasesCote+" * 10px)) / "+GameTemp.NbCasesCote+" )"
                // newdiv.style.height =  "calc( (100% - ("+GameTemp.NbCasesCote+" * 10px)) / "+GameTemp.NbCasesCote+" )"
                newdiv.style.cursor = "pointer";
                var casetitle = ''
                newdiv.innerHTML = 'vide'+ ' [' + XX + ',' + YY+']'
                
                if (GameTemp.Map[XX][YY]=="A"){
                    casetitle = 'Vide'
                    newdiv.addEventListener(
                        'click',
                        function ClickMeHard(e) {
                        // if (GameTemp.Winner == -1) 
                            GameTemp.GestionDuClick(e)
                        },
                        {once:true}
                    )
                } else {
                    casetitle = GameTemp.Map[XX][YY]
                }
                newdiv.title = casetitle + ' [' + XX + ',' + YY+']'
                // on remplis la nouvelle case
                PlateauDiv.appendChild(newdiv)
                // on ajoute la case au DOM
            }
        }
                leplateau.innerHTML = '';
                leplateau.appendChild(PlateauDiv)
        this.refresh_affichage(0)
        this.CL('I','Dom','Ok','good')
        this.CL('I','Joueur(s)',this.NbPlayers,'good')
        this.CL('I','Map de',this.NbCasesCote*this.NbCasesCote+' cases. ('+ this.NbCasesCote+'*'+this.NbCasesCote+'cases)','good')
        this.CL('GEnd')
        this.CreatePlayersHtmlNav()
        this.AQuiDeJouer()
    }
    // -----------------------------------------------------------------------------------
    GestionDuClick(e){
        if (this.Winner == -1){
            console.clear()
            this.CL('G','GestionDuClick','','F')
            this.CL('G3',this.Players[this.Oya].name+' viens de cliquer !','','F')
            if(this.Map[e.target.id[5]][e.target.id[6]]=='A'){
                this.Map[e.target.id[5]][e.target.id[6]] = this.Players[this.Oya].marque // maj de la case dans Map


                
                // e.target.style.backgroundImage = "url('img/"+this.Players[this.Oya].svg+"')";
                e.target.className += e.target.className + ' p' + this.Oya // maj de la class css
                // e.target.innerHTML = this.Players[this.Oya].signal
                e.target.innerHTML = this.Players[this.Oya].name
                e.target.style.cursor = "not-allowed";
                let casetitle = '' + this.Players[this.Oya].name + ' [' + e.target.id[5] + ',' + e.target.id[6] +']' //Map[e.target.id[5]][e.target.id[6]]
                e.target.title = casetitle
                
                // BDD BDD BDD BDD
                this.PushDataz(e.target.id[5], e.target.id[6],1)

                this.NextPlayer()
            } else {
                this.CL('E','Case OQP')
            }
            this.CL('GEnd')
        }
    }
    AQuiDeJouer(){
        this.CL('I','AQuiDeJouer',this.Oya + this.Players[this.Oya].name,'F')
        switch(this.Players[this.Oya].ia){
            case true:
                this.IAPlay()
            break   
        }   
    }
    GameOver(){    
        this.CL('I','Game Over','','F')
        let NewGameLauncher = document.createElement("div")
        NewGameLauncher.style.backgroundcolor = "black"
        NewGameLauncher.id = 'restart'

        let NewGameTitle = document.createElement("h2")
        NewGameTitle.innerHTML = '❌Game Over❌'
        NewGameLauncher.appendChild(NewGameTitle)

        // let ButtonLauncher = document.createElement("button")
        // ButtonLauncher.textContent = 'Restart'
        
        let UglyValue=this
        NewGameLauncher.addEventListener(
            'click',
            function again(e){
                UglyValue.Restarting()
            },
            {once:true}
        )
        var navigation = document.querySelector('.buttons')
        NewGameLauncher.prepend(NewGameTitle)
        // NewGameLauncher.appendChild(ButtonLauncher)
        navigation.appendChild(NewGameLauncher)
    }
    NextPlayer() { // A METTRE DANS LA CLASSE Class_PLAYERS--------------------------------------------
        // this.CL('GEnd') 
        if (this.Oya > -1 && this.CoupsJoues > 2) {         // on test si il y a victoire
            this.IsWinningLine() // * nbplayers
        }
        if (this.Winner != -1) {                            // on test si il y a un ou une victoireuse
            this.TheWinnerIs()
            return
        }
        if (this.CoupsJoues >= this.NbCoupsMax) {           // on test si il ne reste plus de coups a jouer
            this.GameOver() // fin des coups possibles
            return
        }
        if (this.CoupsJoues < this.NbCoupsMax) {           // on test si il reste des coups a jouer
            let nextplayer = this.Oya + 1
            if (nextplayer > this.Players.length - 1) nextplayer = 0
            this.CL('G3', 'Next Player', this.Players[nextplayer].name + '(' + this.Players[nextplayer].ia + ')', 'F')

            this.CoupsJoues++ // un coups joués de plus
            if (this.Oya < this.NbPlayers - 1) {
                this.Oya++
            } else {
                this.Oya = 0;
            }
            // document.querySelectorAll('.player').className = "player"
            // document.querySelectorAll('#player_'+this.oya).className = "player me"
            // this.CL('I','Coups joués',this.CoupsJoues+'/'+this.NbCoupsMax,'')
            this.CL('I', 'Next', this.Players[this.Oya].name + ' ' + this.Players[this.Oya].ia, 'oya')


            if (this.Players[this.Oya].ia) {                // on definie le type du joueur suivant
                this.CL('GEnd')
                this.CL('GEnd')
                this.IAPlay()                               // si c'est à un IA de jouer
            }
            this.CL('GEnd')
        }
        
    }
    
    IAPlay(){ // A METTRE DANS LA CLASSE Class_IA (INTELLIGENCE ARTISANALE) -------------------------
        // console.clear()
        this.CL('G3','IA playing ! Coups',this.Players[this.Oya].name,'F')
        if (this.CoupsJoues<=this.NbCoupsMax) {
            // var bdd = this.GettingDataz()
            let casesdispos = []

            // version test (pour le momment je met les cases dispo
            // dans un array pour un tirage aléatoire )
            for (let b=0;b<this.NbCasesCote;b++){
                for (let a=0;a<this.NbCasesCote;a++){
                    if (this.Map[a][b]=="A") casesdispos.push(a+''+b)
                }
            }
            let Ai_Choice_XY = 0
            this.CL('G3','Les cases libres',casesdispos,'')
            if (casesdispos.length>1){
                Ai_Choice_XY = casesdispos[this.HitDice(0, casesdispos.length - 1)]
            }else{
                Ai_Choice_XY = casesdispos[0]
            }
            this.CL('I','Case',Ai_Choice_XY[0]+''+Ai_Choice_XY[1] +' choisie par '+this.Players[this.Oya].name,'ia')
            this.CL('GEnd')
            let objdivID = "case_"+Ai_Choice_XY
            let objdiv = document.querySelector('#'+objdivID)
            // FIN TEST

            // ici on check si l'ia est attaqué pour eviter plus de 2 case en ligne
            // Ai_Choice_XY = this.CounterStrike(this.Map)

            // // On modifie le div dans le dom pour oqp la case
            if(this.Map[Ai_Choice_XY[0]][Ai_Choice_XY[1]]=='A'){            

                this.Map[Ai_Choice_XY[0]][Ai_Choice_XY[1]] = this.Players[this.Oya].marque // maj de la case dans Map
                objdiv.className += objdiv.className + ' p' + this.Oya // maj de la class css
                objdiv.innerHTML = this.Players[this.Oya].name
                objdiv.style.cursor = "not-allowed";
                let casetitle = ' Prise par ' + this.Players[this.Oya].name //Map[e.target.id[5]][e.target.id[6]]
                objdiv.title = 'Coord : (' + Ai_Choice_XY[0] + ',' + Ai_Choice_XY[1] +')' + casetitle
                // let patatobeur = [Ai_Choice_XY[0],Ai_Choice_XY[1]]

                // BDD BDD BDD BDD
                if (this.Ajax) this.PushDataz(Ai_Choice_XY[0],Ai_Choice_XY[1],2)
                // this.IsTheEnd()
            } else {
                this.CL('E','Coup impossible ',this.CoupsJoues,'bad') // ceci ne peut arriver
            }
            // this.CL('GEnd')
            // if (this.CoupsJoues < this.NbCoupsMax) {
            //     console.warn(this.CoupsJoues + ' < ' + this.NbCoupsMax)
            //     if (this.Winner == -1) {this.NextPlayer()} 
            // }
            // else {
            //     this.CL('I', 'END OF STORY', this.CoupsJoues, 'F')
            //     this.GameOver() // fin des coups possibles
            // }
            this.NextPlayer()
        }
    }

    IsTheEnd(){
        if (this.CoupsJoues < this.NbCoupsMax ) {
            this.IsWinningLine()
        } else if (this.CoupsJoues == this.NbCoupsMax) {
            this.CL('E','Partie FInie','good')
        } else if (this.CoupsJoues > this.NbCoupsMax) {
            this.isBullSHeet()
        }
    }






    
    
    
    // A METTRE DANS LA CLASSE AFFICHAGE CONSOLE  -----------------------------------------------
    IsBlindMap(){
        this.CL('G3','IsBlindMap','','F')

        for (let b=0; b<this.NbCasesCote; b++){
            let ligne = []
            for (let a=0; a<this.NbCasesCote; a++){
                ligne.push(this.Map[a][b])
            }
        }
        this.CL('table',this.Map)
        this.CL('GEnd')
    }


    
    // A METTRE DANS LA CLASSE RULES  --------- IL FAUT GERER PLUSIEUR JOUEURS ENEMIES ??? -- WTF-
    IsAnAttack(xx, xx1, xx2, yy, yy1, yy2){
        for (let enemies = 0; enemies < this.NbPlayers; enemies++){
            // this.Players = [{"player": 0,"name": C_Player,"ia": false,  "marque": "x", "signal": "X", "svg": "x.svg"},
            if (this.Players[1].marque != 'o'){
                // if (false
                    // this.Map[xx][yy] != this.Players[this.Oya].marque &&
                    // this.Map[xx][yy] == this.Map[xx1][yy1] && 
                    // 'A' == this.Map[xx2][yy2]
                    // ){
                    // this.Map[xx2][yy2]
                // }
                // if (false
                    // this.Map[xx][yy] == 'A' && 
                    // this.Map[xx1][yy1] != this.Players[this.Oya].marque && 
                    // this.Map[xx][yy] == this.Map[xx2][yy2]){
                    // this.Map[xx1][yy1]
                    // ){
                    // }
            }
        }
    }
    // A METTRE DANS LA CLASSE RULES  --------------------------------------------------
    IsALine(xx, xx1, xx2, yy, yy1, yy2){
        if (this.Map[xx][yy] == this.Players[this.Oya].marque &&
            this.Map[xx][yy] == this.Map[xx1][yy1] &&
            this.Map[xx][yy] == this.Map[xx2][yy2]) {
                this.Winner = this.Oya
        }
    }
    // A METTRE DANS LA CLASSE RULES  --------------------------------------------------
    TestCasesPossibles(checker,hh,hh1=0,hh2=0,vv,vv1=0,vv2=0){
        this.CL('I','TestCasesPossibles',this.Map[hh][vv] + '('+ hh + ',' + vv +')' ,'F')
        this.compteurreglescases += 1
        let reponse = ''
        if (this.Map[hh][vv]==this.Players[this.Oya].marque && hh>=0 && vv>=0 && hh2>=0 && vv2>=0 && hh1>=0 && vv1>=0 && hh<this.NbCasesCote && hh1<this.NbCasesCote && hh2<this.NbCasesCote && vv<this.NbCasesCote && vv1<this.NbCasesCote && vv2<this.NbCasesCote){
            // ok c'est une ligne existante mais est ce une ligne de 3 qui est le vainqueur ?
            if (checker=='cs'){
                reponse = this.IsAnAttack(hh, hh1, hh2, vv, vv1, vv2)
            }
            else {
                reponse = this.IsALine(hh, hh1, hh2, vv, vv1, vv2)
            }
        }
        this.CL('I','test case cliqué',this.Map[hh][vv],'ia')
    }
    // A METTRE DANS LA CLASSE RULES  --------------------------------------------------
    CounterStrike(Map){
        this.IsBlindMap()
        this.compteurregles = 0
        this.CL('G3', 'CounterStrike', '', 'ia')
        for (let yy = 0; yy < this.NbCasesCote; yy++) {
            this.compteurreglescases = 0
            this.CL('G3', 'Boucle', 'ligne', 'ia')
            for (let xx = 0; xx < this.NbCasesCote; xx++) {
                // --------------------------------
                this.TestCasesPossibles('cs',xx, xx, xx, yy, yy-2, yy-1)         // +2 en haut
                this.TestCasesPossibles('cs',xx, xx+1, xx+2, yy, yy-1, yy-2)     // +2 en haut à droite
                this.TestCasesPossibles('cs',xx, xx+2, xx+1, yy, yy, yy)         // +2 à droite
                this.TestCasesPossibles('cs',xx, xx+1, xx+2, yy, yy+1, yy+2)     // +2 en bas à droite
                this.TestCasesPossibles('cs',xx, xx, xx, yy, yy+2, yy+1)         // +2 en bas
                this.TestCasesPossibles('cs',xx, xx-1, xx-2, yy, yy+1, yy+2)     // +2 en bas à gauche
                this.TestCasesPossibles('cs',xx, xx-2, xx-1, yy, yy, yy)         // +2 à gauche 
                this.TestCasesPossibles('cs',xx, xx-1, xx-2, yy, yy-1, yy-2)     // +2 en haut à gauche
                this.TestCasesPossibles('cs',xx, xx, xx, yy, yy-1, yy+1)         // Vertical
                this.TestCasesPossibles('cs',xx, xx-1, xx+1, yy, yy-1, yy+1)     // +2 en haut à droite
                this.TestCasesPossibles('cs',xx, xx-1, xx+1, yy, yy, yy)         // horizontal
            }
            this.CL('GEnd')
        }
        this.CL('GEnd')
    }
    // A METTRE DANS LA CLASSE RULES  --------------------------------------------------
    IsWinningLine() {
        this.IsBlindMap()
        this.compteurregles = 0
        this.CL('G3', 'IsWinningLine', '', 'ia')
        for (let yy = 0; yy < this.NbCasesCote; yy++) {
            this.compteurreglescases = 0
            this.CL('G3', 'Boucle', 'ligne', 'ia')
            for (let xx = 0; xx < this.NbCasesCote; xx++) {
                // --------------------------------
                let xx1 = 0;let xx2 = 0;let yy1 = 0;let yy2 = 0             // tests
                this.TestCasesPossibles('all',xx, xx, xx, yy, yy-2, yy-1)         // +2 en haut
                this.TestCasesPossibles('all',xx, xx+1, xx+2, yy, yy-1, yy-2)     // +2 en haut à droite
                this.TestCasesPossibles('all',xx, xx+2, xx+1, yy, yy, yy)         // +2 à droite
                this.TestCasesPossibles('all',xx, xx+1, xx+2, yy, yy+1, yy+2)     // +2 en bas à droite
                this.TestCasesPossibles('all',xx, xx, xx, yy, yy+2, yy+1)         // +2 en bas
                this.TestCasesPossibles('all',xx, xx-1, xx-2, yy, yy+1, yy+2)     // +2 en bas à gauche
                this.TestCasesPossibles('all',xx, xx-2, xx-1, yy, yy, yy)         // +2 à gauche 
                this.TestCasesPossibles('all',xx, xx-1, xx-2, yy, yy-1, yy-2)     // +2 en haut à gauche
                this.TestCasesPossibles('all',xx, xx, xx, yy, yy-1, yy+1)         // Vertical
                this.TestCasesPossibles('all',xx, xx-1, xx+1, yy, yy-1, yy+1)     // +2 en haut à droite
                this.TestCasesPossibles('all',xx, xx-1, xx+1, yy, yy, yy)         // horizontal
            }
            this.CL('GEnd')
        }
        this.CL('GEnd')
    }
    PromptForName(){
        let PlayerName = prompt('Votre Pseudo ? (rafraichissez la page pour changer)')
        if (PlayerName === null || PlayerName===''){
            this.Players[0].name = 'Prompt';
        }
        else {
            this.Players[0].name = PlayerName;
        }
    }
    isBullSHeet(){
        this.CL('E','Nombre de coups joués supérieure aux coups possibles', this.CoupsJoues+'>'+this.NbCoupsMax,'bad')
    }
    // -------------------UTILS----
    HitDice(min, max) {
        return Math.floor(Math.random(min) * Math.floor(max));
    }
    // -------------------UTILS----
    CL(typo='L',x='',y='',logo=''){ // console log maison
        if (this.Actif_KL) {
            switch(logo){
                case 'good':
                    logo = '✔️ '
                break
                case 'bad':
                    logo = '❌ '
                break
                case 'F':
                    logo = '📋 '
                break
                case 'ia':
                    logo ='☕ '
                break
                case 're':
                    logo ='⭮ '   
                break
                case 'warn':
                    logo ='⚠ '   
                break
                case 'oya':
                    logo ='☯ '   
                break
                case 'star':
                    logo ='☆ '   
                break
                case 'cloud':
                    logo ='☁ '   
                break
                case 'wait':
                    logo ='♺ '   
                break
                case 'world':
                    logo ='🌎 '   
                break
                default:
                    logo = '?/ ' 
                break
            }
            if (y!='') y = ': ' + y
            let avancement = this.CoupsJoues 
            avancement = this.Oya + '/' + avancement
            switch(typo){
                case 'L':
                    console.log(avancement + ' ' + logo + x + "" + y, 'background: #222; color: #bada55')
                break
                case 'E':
                    console.error(avancement + ' ' + logo + x + "" + y)
                break
                case 'I':
                    console.info(avancement + ' ' + logo + x + "" + y)
                break
                case 'G':
                    console.group(avancement + ' ' + logo + x + "" + y)
                break
                case 'GEnd':
                    console.groupEnd(avancement + ' ' + logo + x + "" + y)
                break
                case 'G3':
                    console.groupCollapsed(avancement + ' ' + logo + x + "" + y)
                break
                case 'WIN':
                    console.group(avancement + ' ' + logo + x + "" + y)//, 'background: #222; color: #bada55')
                break
                case 'table':
                    console.table(x)
                break
                default:
                    console.info(avancement + ' ' + logo + x + "" + y)
                break
            break
            }
        }
    }
    //  A METTRE DANS LA CLASSE DatazShare ?? -------------------------------------------------
    ReInit(){
        console.clear()
        this.CL('I','ReInit','Game','F')
        // this.Player = C_Player
        this.Map = [] // initialisation de la map à vide
        this.Oya = 0 // 1er joueurs//
        this.CoupsJoues = 0
        this.CasesJoues = { // ici on stock tous les coups joués (la 1ere valeur = nb players)
            "nbplayers" : this.NbPlayers,
            "nbcases" : this.NbCasesCote,
            "starter" : 0,
            "winnerid" : '',
            "winnername" : '',
            "seriedecoups" : []
        }
        this.Winner = -1 // le Vainqueur (-1 si vide)
        this.compteurregles = 0
        this.compteurreglescases = 0
        this.Create_map()
        this.Affiche_map()
        this.CL('I'+'MicMacMoe','','good')
        this.CreatePlayersHtmlNav(0)


    }
    playersact(e,dis){
        this.CL('I','playersact',e.target.id,'F')
        switch(e.target.id){
            case 'moreplayer':                
                if (this.NbPlayers<this.Players.length){
                    this.NbPlayers++
                }    
            break
            case 'lessplayer':                
                if (this.NbPlayers>2){
                    this.NbPlayers--
                }    
            break
            case 'morecase':                
                if (this.NbCasesCote<9){
                    this.NbCasesCote++
                }    
            break
            case 'lesscase':      
                if (this.NbPlayers > (this.NbCasesCote * this.NbCasesCote)  - 1) this.NbPlayer =  (this.NbCasesCote * this.NbCasesCote) - 2  
                if (this.NbCasesCote>3){
                    this.NbCasesCote--
                }                   
                if (this.NbPlayers>this.Players.length){
                    this.NbPlayers = this.Players.length
                }    
            break
            case 'auto':      
                if (this.NbPlayers >= (this.NbCasesCote -1)) this.NbPlayers = this.NbCasesCote - 2  
                if (this.NbPlayers < (this.NbCasesCote - 1 )) this.NbPlayers = this.NbCasesCote -1
            break
        }
        this.ReInit()
    }

    navigation(){

    }
    // A METTRE DANS LA CLASSE AFFICHAGE DES JOUEURS -----------------------------------------------
    CreatePlayersHtmlNav(nada){
        this.CL('F','CreatePlayersHtmlNav','','good')
        var message =''
        let lesjoueurs2 = document.querySelector('#lesjoueurs')
        lesjoueurs2.innerHTML = ''
        for (let a=0; a<this.NbPlayers; a++){
            var me = ''
            if (this.PlayerNum == a){me = ' me'}
            message += '<div id="player_'+a+'" class="player'+me+'"><span class="marque" style="background-image:url(img/'+this.Players[a].svg+')"></span>'+this.Players[a].name+'</div>'          


            let listegamers = document.createElement("div")
            listegamers.id = 'nav2player_'+a
            listegamers.className = 'player'

            let Iconegamer = document.createElement("div")
            Iconegamer.id = 'changeto_'+a
            Iconegamer.className = 'marque btn'
            Iconegamer.style.backgroundImage = 'url(img/'+this.Players[a].svg+')'


            let Namegamer = document.createElement("div")
            Namegamer.id = 'nameof'+a
            Namegamer.className = 'name'
            Namegamer.title = this.Players[a].name
            Namegamer.innerHTML = this.Players[a].name


            let IconeIA = document.createElement("div")
            IconeIA.id = this.Players[a].name
            IconeIA.style.backgroundImage = 'url(img/'+this.Players[a].svg+')'
            IconeIA.style.backgroundSize = '50%'
            IconeIA.style.backgroundRepeat = 'no-repeat'
            // IconeIA.innerHTML = '<div class="on"></div>'

            let texte = "C'est moi !";

            
            let self = this
            Iconegamer.title = 'Vous êtes le '+this.Players[a].name
            if (this.Players[a] != this.Players[this.PlayerNum]){
                texte = "Activer l'IA";
                if (this.Players[a].ia) {texte = "Désactiver l'IA";} 
                console.info('same')
                Iconegamer.title = 'Devenez le '+this.Players[a].name
                Iconegamer.addin = a
                Iconegamer.addEventListener(
                    'click',
                    function ChangeAvatar(e) {
                        console.info('ChangeAvatar : '+self.Oya+' par ' + e.target.addin)
                        self.ChangeDAvatar(self.Oya,e.target.addin)
                    },{once:true}
                )
                IconeIA.addin = a
                IconeIA.className = 'ia_or_not '+this.Players[a].ia
                IconeIA.addEventListener(
                    'click',
                    function ChangeIa(e) {
                        console.info('ChangeIa : id:' + e.target.addin)
                        self.ChangeDIa(e.target.addin)
                    },
                    {once:true}
                )
            }else{
                // c'est moi
                Iconegamer.style.borderRadius = "15px"
                IconeIA.className = 'ia_or_not none'
            }
            IconeIA.title = texte
            listegamers.appendChild(Iconegamer)
            listegamers.appendChild(Namegamer)
            listegamers.appendChild(IconeIA)
            lesjoueurs2.appendChild(listegamers)
        }
        let TurnPlayers = document.querySelector('#playersturn')
        TurnPlayers.innerHTML = message
        // let lesjoueurs = document.querySelector('#lesjoueurs')
        // lesjoueurs.innerHTML = messagenav
        // lesjoueurs2.innerHTML = messagenav2
    }
    ChangeDAvatar(idavant,idapres){
        let MonNom = this.Players[idavant].name
        let MonIa = this.Players[idavant].ia
        let CibleNom = this.Players[idapres].name
        let CibleIa = this.Players[idapres].ia
        //on interchange
        this.Players[idavant].name = this.Players[idavant].Origin_name
        this.Players[idavant].ia = CibleIa
        this.Players[idapres].name = MonNom
        this.Players[idapres].ia = MonIa
        this.OriginalOya = 1
        this.PlayerNum = idapres
        this.ReInit()
    }
    ChangeDIa(id){
        let lIa = this.Players[id].ia
        if (lIa) {this.Players[id].ia = false}else{this.Players[id].ia = true}
        this.ReInit()
    }
    AddEventListenerOne() {
        let UglyValue=this
        window.addEventListener(
                'resize',
                function(e) {
                    UglyValue.refresh_affichage(e);
                }
        );
    }
    refresh_affichage(e){
        var largeur = window.innerWidth
        var hauteur = window.innerHeight
        let space_largeur = Math.round(largeur * .2)  // marge en px à multiplié par deux
        let space_hauteur = Math.round(hauteur * .2)  // marge en px à multiplié par deux
        let cote = 500
        let marge = Math.round(cote / 100)
        console.log("w:"+largeur + ' h:' + hauteur )

        // document.querySelector('.plateau').style.width = '700px'
        // document.querySelector('.plateau').style.height = '700px'


        if (largeur>=hauteur) {     // plus large que haut      ecran en largeur
            cote =  Math.round((  (hauteur - (1.5 * (space_hauteur)) ) ))
        } else {                    // plus haut que large      ecran en hauteur -> mobile ?? 
            cote =  Math.round((  (largeur - (1.5 * (space_largeur)) ) ))
        }

        marge = Math.round(cote/200)
        document.querySelector('.plateau').style.width =  cote + 'px'
        document.querySelector('.plateau').style.height = cote + 'px'

        var  l1 = document.querySelector("#leplateau").childNodes;
        var lescases = document.querySelectorAll('.case')
        for(let i=0;i<l1.length;i++){
            l1[i].style.width = "calc( (100% - ("+this.NbCasesCote+" * "+(marge*2)+"px)) / "+this.NbCasesCote+" )"
            l1[i].style.height =  "calc( (100% - ("+this.NbCasesCote+" * "+(marge*2)+"px)) / "+this.NbCasesCote+" )"
            l1[i].style.margin =  marge + "px"

        }
    }
}
// -------------------------------------------------------------------------------------------------------------------


let partie = new Game(6,6,'COCHON')
partie.Create_map()
partie.Affiche_map()

partie.AddEventListenerOne()
// partie.PromptForName()
// partie.GettingDataz()
// partie.NextPlayer() // adddd
// partie.CL('I'+'MicMacMoe','','good')

var eventUelement = ['#moreplayer','#lessplayer','#morecase','#lesscase','#auto']
for (let i =0; i < eventUelement.length; i++){
    let clickMoreP = document.querySelector(eventUelement[i])
    clickMoreP.addEventListener(
        'click',
        function(e) {
            partie.playersact(e,partie)
        }
    );
}
