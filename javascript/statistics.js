const app = new Vue({ 
    el: '#app',
    data: { 
        members:[], 
        congress_data: { 
            democrats: 0,
            republicans: 0,
            independents: 0,
            total: 0,
            votD: 0,
            votR: 0,
            votI: 0,
            totMembers: 0,
            totVotParty: 0,
        }        
    },

    created: () => {
        let url =  document.getElementById("senate") ?
            "https://api.propublica.org/congress/v1/115/senate/members.json" 
        : 
            "https://api.propublica.org/congress/v1/115/house/members.json"

        let key = "RODkxbWlsd4xicphHv4dQnCzCLquHiI4RfqPxmWt"

        fetch(url,{
            method:'GET',
            headers: {
                'X-API-Key': key
            }
        }).then(function (response) {
            if(response.ok){
                return response.json()
            }else{
                throw new Error()
            }
        }).then(function(json){
            app.members= json.results[0].members
            app.calculate()
        }).catch(function(error){
            console.log(error)
        })
    },

    methods: {
        calculate() {
            let sumD= 0
            let sumR= 0
            let sumI= 0

            this.members.forEach(e => {
                switch(e.party){
                    case "D":
                        this.congress_data.democrats ++
                        e.votes_with_party_pct ? sumD += e.votes_with_party_pct :sumD += 0;
                        break
                    case "R":
                        this.congress_data.republicans ++
                        e.votes_with_party_pct ? sumR += e.votes_with_party_pct : sumR += 0;
                        break
                    case "I":
                        this.congress_data.independents ++
                        e.votes_with_party_pct ? sumI += e.votes_with_party_pct :  sumI += 0       
                        break      
                }                    
            })

            this.congress_data.votD = this.congress_data.democrats != 0 ? (sumD / this.congress_data.democrats).toFixed(2) : "0";
            this.congress_data.votR = this.congress_data.republicans != 0 ? (sumR / this.congress_data.republicans).toFixed(2) : "0";
            this.congress_data.votI = this.congress_data.independents != 0 ? (sumI / this.congress_data.independents).toFixed(2) : "0"; 

            this.congress_data.totMembers = this.members.length;

            if (this.congress_data.votI == 0) {
                this.congress_data.totVotParty = ( (parseFloat(this.congress_data.votD) + parseFloat(this.congress_data.votR) ) / 2).toFixed(2);
            } else {
                this.congress_data.totVotParty = ( (parseFloat(this.congress_data.votD) + parseFloat(this.congress_data.votR) + parseFloat(this.congress_data.votI) ) /3).toFixed(2);
            }
        }
    },

    components: {
        stats_table: {
            props: ["array", "isAscendent", "field1", "field2"],
            methods: {
                tenPct(array,key,isAscendent) {

                if(array.length === 0) {
                    return
                }
        
                let result
                let i
                let aux = isAscendent ? 
                            [...array].sort((a,b) => a[key] - b[key]) 
                        : 
                            [...array].sort((a,b) => b[key] - a[key])
    
                let tenPct = parseInt(aux.length*0.1)
            
                result = aux.slice(0,tenPct)
            
                i = result.length
            
                while(aux[i][key] == result[result.length - 1][key] && i < aux.length){
                    result.push(aux[i])
                    i++
                }
            
                return result
            },
            mayus(str){
                str = str.replace(/_/g, " ")
                let tit = str.toLowerCase().split(" ");
                for (i = 0; i < tit.length; i++){
                    tit[i] = tit[i] [0].toUpperCase() + tit[i].slice(1);
                }
                return tit.join(" ");
            }
            
        },

        template: `
                <div class="table-responsive tableFixHead">
                    <table class="table table-responsive-sm table-secondary table-striped text-center border border-light">
                        <thead class= "thead-dark">
                            <tr>
                                <th>Full Name</th>
                                <th>{{mayus(field1)}}</th>
                                <th>{{mayus(field2)}}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for= "member in tenPct(array, field2, isAscendent)">
                                <td><a :href= member.url>{{member.last_name}} {{member.first_name}} {{member.middle_name}}</a></td>
                                <td>{{member[field1]}}</td>
                                <td>{{member[field2]}} %</td>
                            </tr>
                        </tbody>
                    </table>          
                </div>
                    `
        }, 

    /*  Tabla 1, at a glance  */
        at_glance: {
            props: ["obj"], 
            template: `
                <table class="table table-responsive-sm table-secondary table-striped text-center border border-light">
                
                    <thead class="thead-dark">
                        <tr>
                            <th>Party</th>
                            <th>Number of Representants</th>
                            <th>% Voted with Party</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Democrats</td>
                            <td>{{obj.democrats}}</td>
                            <td>{{obj.votD}} %</td>
                        </tr>

                        <tr>
                            <td>Republicans</td>
                            <td>{{obj.republicans}}</td>
                            <td>{{obj.votR}} %</td>
                        </tr>

                        <tr>
                            <td>Independents</td>
                            <td>{{obj.independents}}</td>
                            <td>{{obj.votI}} %</td>
                        </tr>

                        <tr>
                            <td class="font-weight-bold">Total</td>
                            <td>{{obj.totMembers}}</td>
                            <td>{{obj.totVotParty}} %</td>
                        </tr>
                    </tbody>
                </table>
                `
            }
        }
    })
