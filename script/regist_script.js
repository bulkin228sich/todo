 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
  import { getFirestore} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
  import { doc, collection, addDoc , getDocs , setDoc, query , where} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDslTfzea0KFaVHszP6Q8BPst6prF1obmY",
    authDomain: "todolist-e24ca.firebaseapp.com",
    projectId: "todolist-e24ca",
    storageBucket: "todolist-e24ca.appspot.com",
    messagingSenderId: "173648301613",
    appId: "1:173648301613:web:28337caf368ff49aee72a4"
    };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);


document.getElementById('registration-form').addEventListener('submit', async function(event) {
  event.preventDefault();
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;


    getDocs(query(collection(db, "users"), where("name", "==", username))).then((querySnapshot) => {
    if (querySnapshot.docs.length > 0) {
           document.getElementById("errors").textContent = `Пользователь ${username} уже зарегистрирован`;
          // Выполняем другую логику, если пользователь уже зарегистрирован
        } else {
          // Создаем новую коллекцию для пользователя, если он еще не зарегистрирован
          addDoc(collection(db, "users" ), {
            name: username,
            password: password,
            inlogin: true,
            task: ""
          }).then(() => {
              setInterval(() => {
                  getDocs(query(collection(db, "users"), where("name", "==", username))).then((querySnapshot) => {
                      if (querySnapshot.docs.length > 0) {
                        const docId = querySnapshot.docs[0].id;
                        localStorage.setItem("user", docId);
                        return
                      }
                  }).then(() => {
                     window.location.href = "../todo/index.html";
                    });
              }, 500);
          });
          }
      });

});
