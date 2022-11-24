// document objesiyle html üzerinde seçimler yapıyoruz
const Form = document.querySelector("#todo-form");
const todoInput = document.querySelectorAll("#floatingInput")[0];
const addButton = document.querySelector("#add");
const todoList = document.querySelector(".list-group");
const cardBody1 = document.querySelectorAll(".card-body")[0];
const cardBody2 = document.querySelectorAll(".card-body")[1];
const todoFilter = document.querySelectorAll("#floatingInput")[1];
const clearButton = document.querySelector("#clear-all");

EventListener();

// Oluşturudğumuz fonksiyonları tek bir fonksiyon çatısı altında topluyoruz
function EventListener(){
    Form.addEventListener("submit",addTodo);
    document.addEventListener("DOMContentLoaded",loadAllTodosUI);
    clearButton.addEventListener("click",clearTodos);
    cardBody2.addEventListener("click",deleteTodo);
    todoFilter.addEventListener("keyup",filterTodos);

};

// Todo ekleme işlemini yapan fonksiyonumuz
function addTodo(e){
    // todoInput dan gelen değeri yeni bir değişkene atıyoruz
    const newTodo = todoInput.value;
    // eğer input un içerisi boş ise alert ile ekrana mesaj gönderiyoruz
    if(newTodo === ""){
        // type,message
        showAlert("danger","Lütfen bir todo giriniz.");
    }
    // değil ise addTodoUI yani html listesi için oluşturduğumuz fonksiyona buradan gelen bilgiyi giriyoruz
    // ve ardından ekrana alert ile başarı mesajı gönderiyoruz
    else{
        addTodoUI(newTodo);
        addTodoStorage(newTodo); // storage e kayıt için newTodo daki değeri gönderiyoruz
        showAlert("success","Todo başarıyla eklendi.");
    }
    
    // yenileme işlemi gerçekleştirmesini engelliyoruz
    e.preventDefault();
};

// aldığımız verileri localStorage e kaydediyoruz
function addTodoStorage(newTodo){
    let todos = getTodosFromStorage();  // todos u aldık
    todos.push(newTodo); // todos u ekledik
    localStorage.setItem("todos",JSON.stringify(todos)); // todos ları array olarak alıyoruz
};
// localStorage e eklemiş olduğumuz verileri array şeklinde getiriyoruz
function getTodosFromStorage(){ 
    let todos;
    // localstorage de todos değeri boş ise, yeni bir dizi yarat
    if(localStorage.getItem("todos") === null){
        todos = [];
    }
    else{
        // eğer değilse todos değerini ekle ve array e dönüştür
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    return todos;
};


// todo listesine ekliyoruz
function addTodoUI(newTodo){ 
    // burada aldığı değeri list item olarak ara yüze ekler
    // yeni bir element ekleyeceğiz
    /*
                <li class="list-group-item d-flex justify-content-between">
                    First checkbox
                <a href="#" class="delete-todo"><i class="fa-solid fa-trash-can" style="color:red;"></i></a> 
                </li>

*/
const listItem = document.createElement("li");
const link = document.createElement("a");
link.href = "#";
link.className = "delete-todo";
link.innerHTML = "<i class='fa-solid fa-trash-can' style='color:red;'></i>"
listItem.className = "list-group-item d-flex justify-content-between"; // listItem ın sınıfının adını giriyoruz
// Text node olarak ekleme işlemini yapıyoruz
// yeni bir textnode oluşturup appendChild olarak listitem a ekleyeceğiz
listItem.appendChild(document.createTextNode(newTodo)); 
listItem.appendChild(link);

// todo list e listItem ı ekleme işlemi
todoList.appendChild(listItem);
todoInput.value = "";

console.log(listItem);

};


function loadAllTodosUI(){
    // todoları localStorage dan alıyoruz ve bir değişkene atıyoruz
    let todos = getTodosFromStorage();
    // forEach ile tek tek ekliyoruz, todo listesine
    todos.forEach(function(todo) {
        addTodoUI(todo);
    });

};

// seçili todo yu silme işlemi 
function deleteTodo(e){
    console.log(e.target);
    if(e.target.className === "fa-solid fa-trash-can"){
        // tıkladığımız nesnenin parent elementleri sayesinde bulunduğu li yi siliyoruz
        e.target.parentElement.parentElement.remove();
        // storage e silmek istediğimiz li nin içerisindeki text i gönderiyoruz
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
        showAlert("success","Todo başarıyla silindi!");
    }
};

// bütün todo ları siliyoruz
function clearTodos (){
    if(confirm("Tümünü silmek istediğinizden emin misiniz?")){
        // todoList in ilk elemanı boş olmadığı sürece dön
        while(todoList.firstElementChild != null){
            // todoList in childlarından ilkini sil
            todoList.removeChild(todoList.firstElementChild);
        }
        // localStorage den silme işlemi
        localStorage.removeItem("todos");
        showAlert("success","Tüm todolar başarıyla silindi.");
    }
};

// localStorage den tüm verileri siliyoruz
function deleteTodoFromStorage(deletetodo){
    // localstorage daki todoları alıyoruz
    let todos = getTodosFromStorage();
    // forEach ile todos u dolaşıyoruz
    todos.forEach(function(todo,index){
        // eğer todo deleteTodo ya eşit ise
        if(todo === deletetodo){
            todos.splice(index,1); // o indexten itibaren 1 tane elemanı sil diyoruz
        }
    });

    // daha sonra array i güncelliyoruz
    // JSON.stringify ile array e çeviriyoruz
    localStorage.setItem("todos",JSON.stringify(todos));
};


// aradığımız todo yu getirme
function filterTodos(e){
    // büyük küçük karakter çakışması olmasın diye öncelikle tüm harfleri küçüğe çeviriyoruz
    // filter a girdiğimiz kelimenin harfleri***
    const filterValue = e.target.value.toLowerCase();
    const listItems = document.querySelectorAll(".list-group-item"); // list grouptaki bütün li leri seçiyoruz
    // seçtiğimiz li leri forEach yardımıyla dönüyoruz
    listItems.forEach(function(listItem){
        // list item içerisindeki yani li lerdeki değerlerin yani kelimelerin tüm harflerini küçültüyoruz
        const text = listItem.textContent.toLowerCase();
        if(text.indexOf(filterValue) === -1){
            // bulunamadığı zaman
            // eğer bulunamazsa listItem öğesini css ile gösterme
            listItem.setAttribute("style","display : none !important");
        }
        else {
            // eğer bulunduysa css ile göster
            listItem.setAttribute("style","display : block");
        }
    });
};

// alert işlemleri
function showAlert(type,message){
    //bootstrap4 teki alert danger ı oluşturuyoruz

    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.textContent = message;

    // oluşturulan alert i ilk cardbodynin içerisine ekliyoruz
    cardBody1.appendChild(alert);
    // setTime metodu ile belirli bir süre içerisinde kalır ve gider
    // istediğimiz fonksiyonu ne kadar süre sonra çalıştırmamız istenirse onu yaızoyurz
    setTimeout(function(){
        alert.remove();
    },1000);
};


