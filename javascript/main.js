const app = new Vue({ 
    el: '#app',
    data: { 
        senators:[], 
        states: "all",
        parties: ["R", "D", "I"] 
    },
    
    computed: { 
      filterMembers(){ 
        return this.senators.filter(e => app.parties.includes(e.party) && (app.states == e.state || app.states == "all")? e : null)
      },
      fnStates: function() { 
        let aux = []
        this.senators.forEach(e => !aux.includes(e.state) ? aux.push(e.state) : null )
        return aux.sort()
      }
    }
  
  })
  
  /* Fetch */
  function getData(url, key) {
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
      app.senators= json.results[0].members
  
  
    }).catch(function(error){
      console.log(error)
    })
  }
  
  document.getElementById("senate") ? 
  getData("https://api.propublica.org/congress/v1/115/senate/members.json","RODkxbWlsd4xicphHv4dQnCzCLquHiI4RfqPxmWt") 
  : 
  getData("https://api.propublica.org/congress/v1/115/house/members.json","RODkxbWlsd4xicphHv4dQnCzCLquHiI4RfqPxmWt")