Scores = function (game) { };

Scores.prototype = {
    create: function () {
        
        this.database = firebase.database();
        
        this.test = this.game.add.text(0,this.game.height - 50, '<= Back', {font: '20px sans-serif'})
        this.test.addColor('#ffffff', 0);
        this.test.inputEnabled = true;
        this.test.events.onInputDown.add(this.backToMenu, this);
        
        this.database.ref("/parcial").get().then(res => {
            let val = res.val();
            let properties = Object.keys(val);
            let arr = [];
            for(let i =0; i < properties.length; i++){
                arr.push(val[properties[i]]);
            }
            arr.sort((a,b) => {return b.score - a.score});
            let len = arr.length > 10 ? 10 : arr.length;
            for(let i = 0; i < len; i++){
                if (i == 10) break;
                let name = this.game.add.text(this.game.width / 2 - 200,(40*(i+1)), 
                    arr[i].user_id + "\t\t\t\t\t\t" + (Date(arr[i].created_at)).slice(0, 15) + "\t\t\t\t\t\t" + arr[i].score
                    ,{font: '20px sans-serif'});
                name.addColor('#ffffff', 0);
            }
        }, this)
    },
    testAdd(){
        let date = Date.now();
        this.database.ref(date.toString(16)).set({
            created_at: date,
            score: 99,
            user_id: date.toString(16)
        })
    },
    backToMenu() {
        this.game.state.start("Menu");
    }
}