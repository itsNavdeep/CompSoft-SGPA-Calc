<template>
  <div class="mainContainer">
    <div class="sideHeaderContainer">
      <div class="introductionContainer">
        <p class="designedText">Accuracy you always <br>needed.</p>
        <p>A reliable SGPA calculator from <br>CompSoft Technologies.</p>
        <p></p>
      </div>
    </div>

    <div class="formContainer" v-if="isSignUp">

      <div class="signupHead">
        <p>Sign Up</p>
      </div>
      <form @submit.prevent="executeSignUp">

        <div class="nameContainer">
          <input type="text" v-model="firstName" placeholder="First name" required>
          <input type="text" v-model="lastName" placeholder="Last name" >
        </div>
        <input type="text" v-model="username" placeholder="Username" required>
        <input type="email" v-model="userCredentials.email" placeholder="Email" required>
        <input type="password" v-model="userCredentials.password" placeholder="Password" required>
        <input type="password" v-model="userCredentials.confirmPassword" placeholder="Confirm Password" required>

        <div class="buttonContainer">
          <button type="submit">Continue</button>
        </div>
      </form>


      <div class="messageContainer" v-if="resMessageBoolean">
        <div class="message">
          <p><strong>Error : </strong> {{ this.responseMessage }}</p>
        </div>
      </div>

      <div class="linkContainer">
        <p><strong>Already a user? </strong><button class="switchForm" @click="switchForm">Login</button></p>
      </div>
    </div>

    <div class="formContainer" v-if="!isSignUp">

      <div class="signupHead">
        <p>SignIn</p>
      </div>
      <form @submit.prevent="executeSignIn">

        <input type="email" v-model="userCredentials.email" placeholder="Email" required>
        <input type="password" v-model="userCredentials.password" placeholder="Password" required>

        <div class="buttonContainer">
          <button type="submit">Continue</button>
        </div>
      </form>


      <div class="messageContainer" v-if="resMessageBoolean">
        <div class="message">
          <p><strong>Error : </strong> {{ this.responseMessage }}</p>
        </div>
      </div>

      <div class="linkContainer">
        <p><strong>New user? </strong><button class="switchForm" @click="switchForm">Sign Up</button></p>
      </div>
    </div>
  </div>
</template>

<script>
import { Database } from '@/plugins/firebase';
import { getDoc, doc, setDoc } from 'firebase/firestore';

export default {
  data() {
    return {
      userCredentials : {
        email : '',
        password: '',
        confirmPassword: ''
      },
      firstName: '',
      lastName: '',
      username : '',
      responseMessage : '',
      resMessageBoolean : false,
      isSignUp : true,
    }
  },
  methods: {
    switchForm(){
      this.isSignUp = !this.isSignUp;
    },

    async executeSignUp(){

      if(this.userCredentials.password !== this.userCredentials.confirmPassword){

        this.resMessageBoolean = true;
        this.responseMessage = "Confirm password doesn't match.";
        setTimeout(() => {
          this.resMessageBoolean = false;
        }, 5000)

      } else {
          const userDataSnapshot = await getDoc(doc(Database, "CSTUsers", this.username));
          if(userDataSnapshot.exists()) {
            this.resMessageBoolean = true;
            this.responseMessage = 'Username already exists.'
            setTimeout(() => {
              this.resMessageBoolean = false;
            }, 5000)
          }else{

            this.$store.dispatch('Authentication/userSignUp', this.userCredentials)
              .then(() => {
                this.executeCreateAccount();
              }).catch( e => {
              this.resMessageBoolean = true;
              this.responseMessage = e.message;
              setTimeout(() => {
                this.resMessageBoolean = false;
              }, 5000)
            });
          }
      }
    },

    async executeCreateAccount(){
      await setDoc(doc(Database, "CSTUsers", this.username), {
        UserUID : this.$store.getters["Authentication/getCurrentUserUID"],
        Username : this.username,
        UserFirstName : this.firstName,
        UserLastName : this.lastName,
        UserCreatedOn : new Date().getTime(),
        Results : []
      }).then(() => {
        this.createUsername();
      }).catch(e => {
        throw e;
      })
    },

    async createUsername(){
      await setDoc(doc(Database, "CSTUsersUID", this.$store.getters["Authentication/getCurrentUserUID"]), {
        Username : this.username
      }).then(() => {
        this.$router.push(`/user/${this.$store.getters['UserUsername/loadUserUsername']}`)
      }).catch( e => {
        throw e;
      })
    },

    async executeSignIn(){
      await this.$store.dispatch('Authentication/userSignIn', this.userCredentials)
        .then(() => {
          this.$store.dispatch('UserUsername/getUserUsername', this.$store.getters['Authentication/getCurrentUserUID'])
            .then(() => {
              this.$router.push(`/user/${this.$store.getters['UserUsername/loadUserUsername']}`)
            })
        })
    }
  }
}
</script>

<style scoped>
*{
  margin: 0;
  padding: 0;
}

.mainContainer{
  width: 1200px;
  display: flex;
  padding: 10px;
  margin: 50px auto auto;
}

.sideHeaderContainer{
  width: 700px;
}

.formContainer{
  padding: 30px;
  width: 300px;
  border: 3px #61892F solid;
  border-radius: 10px;
  height: auto;
  display: grid;
  align-content: center;
  align-items: center;
  margin: 60px auto auto;
}

.signupHead{
  width: 100px;
  font-size: 30px;
  font-weight: bold;
  margin: auto auto 10px;
  color: #86C232;
}

.nameContainer{
  display: flex;
}

input{
  margin-bottom: 10px;
  background-color: #222629;
  padding: 10px;
  border: none;
  width: 90%;
  color: #AAABB8;
  font-size: 19px;
  outline: none;
  border-radius: 5px;
}

.messageContainer{
  border: 1px solid rgba(255, 0, 0, 0.50);
  background-color: rgba(255, 0, 0, 0.2);
  border-radius: 5px;
  width: 275px;
  margin: 10px auto auto;
  padding: 10px;
  color: #AAABB8;
}

.linkContainer{
  width: 160px;
  margin: 10px auto auto;
  color: #AAABB8;
}
.linkContainer a{
  color: #86C232;
  text-decoration: none;
}

.buttonContainer{
  text-align: center;
  align-items: center;
  align-content: center;
  width: 160px;
  height: auto;
  margin: 10px auto auto;
}

.buttonContainer button{
  border: 1px solid #86C232;
  background-color: #222629;
  color: #AAABB8;
  font-size: 17px;
  font-weight: bold;
  border-radius: 5px;
  padding: 10px 40px 10px 40px;
}

.buttonContainer button:hover{
  background-color: rgba(97, 137, 47, 0.70);
}

.buttonContainer button:hover:after{
  background-color: #61892F;
}

.introductionContainer{
  width: 500px;
  height: auto;
  text-align: center;
  align-items: center;
  align-content: center;
  color: #AAABB8;
  font-size: 18px;
  margin: 200px auto auto;
}

.designedText{
  font-size: 50px;
  font-weight: bold;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-color: #F4D03F;
  background-image: linear-gradient(132deg, #F4D03F 0%, #16A085 100%);

}

.switchForm{
  border: none;
  color: #86C232;
  background : #222629;
  font-size: 16px;
}
</style>
