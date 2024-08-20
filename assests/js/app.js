 const cl= console.log;
const postcontainer =document.getElementById("postcontainer");
const loader =document.getElementById("loader");
const postform =document.getElementById("postform");
const titlecontrol=document.getElementById("titleId");
const contentcontrol=document.getElementById("contentId");
const useridcontrol=document.getElementById("userId");
const submitbtn=document.getElementById("submitbtn");
const updatebtn=document.getElementById("updatebtn");

let BASE_URL="https://xhraa-db410-default-rtdb.firebaseio.com"
let POST_URL=`${BASE_URL}/posts.json`;



const sweetalert=(msg,icon)=>{
      Swal.fire({
          title:msg,
          timer:2500,
          icon:icon
      });
}

const templating=(arr)=>{
     let result=``;
     arr.forEach(post=> {
          result+=`
             <div class="col-md-4 mb-4">
               <div class="card postcard h-100" id=${post.id}>
                 <div class="card-header">
                  <h3 class="m-0">${post.title}</h3>
                 </div>
                 <div class="card-body">
                  <p class="m-0">${post.body}</p>
                 </div>
                 <div class="card-footer d-flex justify-content-between">
                   <button onclick="onEdit(this)" class="btn btn-sm btn-outline-primary">EDIT</button>
                   <button onclick="onDelete(this)" class="btn btn-sm btn-outline-danger">DELETE</button>
                 </div>
               </div>
            </div>
          
          `
          postcontainer.innerHTML=result;
     }); 
}

const makeapicall=(methodName, api_url,msgBody=null)=>{
        return  new Promise((resolve,reject)=>{
         loader.classList.remove('d-none');
         let xhr= new XMLHttpRequest();
         
         xhr.open(methodName,api_url);

         xhr.onload= function(){
               if(xhr.status>=200 && xhr.status<300){
                    let data= JSON.parse(xhr.response)
                    resolve(data);
               }else{
                     reject(`something went wrong !!!`);
               }
             loader.classList.add('d-none')
         }
        xhr.onerror=function(){
          loader.classList.add('d-none');
        }
         xhr.send(JSON.stringify(msgBody));
    })

}

const fetchpost=()=>{
  makeapicall("GET",POST_URL)
  .then(res=>{
       cl(res)
       let postArr=[];
       for (const key in res) {
      //  cl(res[key]);
       let obj= {...res[key],id:key};
       //obj.id=key;
       postArr.push(obj);
      //  cl(postArr);
      templating(postArr);
      sweetalert("POST IS FETCHED SUCCESSFULLYY!!","success")
       }
  })
  .catch(err=>{
      cl(err)
  })
}

fetchpost();

const onpostadd=(eve)=>{
       eve.preventDefault();
       let newpost={
          title:titlecontrol.value,
          body:contentcontrol.value,
          userId:useridcontrol.value,
       }

       makeapicall("POST",POST_URL,newpost)
         .then(res=>{
            cl(res);
            //card create 
            newpost.id= res.name;
            let div= document.createElement("div");
            div.className="col-md-4 mb-4";
            div.innerHTML=`
             <div class="card postcard h-100" id=${newpost.id}>
                 <div class="card-header">
                  <h3 class="m-0">${newpost.title}</h3>
                 </div>
                 <div class="card-body">
                  <p class="m-0">${newpost.body}</p>
                 </div>
                 <div class="card-footer d-flex justify-content-between">
                   <button onclick="onEdit(this)" class="btn btn-sm btn-outline-primary">EDIT</button>
                   <button onclick="onDelete(this)" class="btn btn-sm btn-outline-danger">DELETE</button>
                 </div>
               </div>
            `
            postcontainer.prepend(div);
            sweetalert("POST IS ADDED SUCCESSFULLYY!!","success")
         })
         .catch(err=>{
              cl(err);
         })
         .finally(()=>{
             postform.reset();
         })

}

const onEdit=(ele)=>{
     let editId= ele.closest('.card').id;
     localStorage.setItem("editId",editId);
    let EDIT_URL= `${BASE_URL}/posts/${editId}.json`

    makeapicall("GET",EDIT_URL)
      .then(res=>{
          cl(res);
          titlecontrol.value= res.title;
          contentcontrol.value=res.body;
          useridcontrol.value=res.userId;
          window.scroll({top:0,behavior:"smooth"})
          submitbtn.classList.add('d-none');
          updatebtn.classList.remove('d-none');
      })
      .catch(err=>{
           cl(err);
      })
}

const onpostupdate=()=>{
  let  updateId=localStorage.getItem('editId');
  let UPDATE_URL= `${BASE_URL}/posts/${updateId}.json`;
  let updatedobj={
    title:titlecontrol.value,
    body:contentcontrol.value,
    userId:useridcontrol.value,
  }
  postform.reset();

  makeapicall("PATCH",UPDATE_URL,updatedobj)
    .then(res=>{
         cl(res);
         let card=[...document.getElementById(updateId).children];
         card[0].innerHTML=`<h3 class="m-0">${updatedobj.title}</h3>`;
         card[1].innerHTML=`<p class="m-0">${updatedobj.body}</p>`;
         updatebtn.classList.add('d-none');
         submitbtn.classList.remove('d-none');
         sweetalert("POST IS UPDATED SUCCESSFULLYY!!","success")
    })
    .catch(err=>{
        sweetalert(err,"error")
    })
}

const onDelete=(ele)=>{
    let removeId=ele.closest('.card').id;
    let REMOVE_URL=`${BASE_URL}/posts/${removeId}.json`
  
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        makeapicall("DELETE",REMOVE_URL)
        .then(res=>{
            cl(res);
            ele.closest('.card').parentElement.remove();
            sweetalert("POST IS REMOVED SUCCESSFULLYY!!","success")
        })
        .catch(err=>{
         sweetalert(err,"error") 
        })
      }
    });   
}


postform.addEventListener("submit",onpostadd);
updatebtn.addEventListener("click",onpostupdate);



// let obj={
//     user1:{
//         fname:"jhon",
//         lname:"doe"
//     },
//     user2:{
//        fname:"may",
//        lname:"doe",  
//     },
//     user3:{
//        fname:"jiya",
//        lname:"deo",
//     }
// }

// for(const key in obj){
//     //  cl(key);
//      let obj1={...obj[key],id:key};
//      cl(obj1);
// }
