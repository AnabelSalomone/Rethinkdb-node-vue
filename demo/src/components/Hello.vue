<template>
  <div class="hello">
  <form>
  <input v-model="newUser.name" type="text" placeholher="name"/> name
  <input v-model="newUser.email" type="email" placeholher="email" /> email
  <input v-model="newUser.enable" type="checkbox"/> visible
  <button type="button" @click="add">Cree cet utilisateur</button>
  </form>
    <p v-for="user in users">{{user.name}} <a @click="remove(user.id)">Delete</a>
    <!-- -->
    <router-link :to="{name: 'Detail', params: {id: user.id}}">Go</router-link> 
    </p> 
    
  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      users : [],
       newUser: {
        name: '',
        email: '',
        enable: null
      }
    }
  },
  created(){
    this.$http.get('http://localhost:3000/').then((res) => {
      this.users = res.body;
    })
  },
  methods:{
    add(){
      this.$http.post('http://localhost:3000/newUser',this.newUser).then((res)=>{
        this.users = res.body;
        this.newUser = {
          name: '',
          email: '',
          enable: null
        };
      })
    },
    remove(id){
      this.$http.get(`http://localhost:3000/remove/${id}`).then((res) =>{
        this.users = res.body;
      });
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
