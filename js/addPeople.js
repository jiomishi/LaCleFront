var remote = require('electron');


function addElementDataBase(){
  
  function make_base_auth(user, password) {
          var tok = user + ':' + password;
          var hash = btoa(tok);
           return 'Basic ' + hash;
      }
if(document.addForm.name.value!=null && document.addForm.name.value!=""){

  
if( document.querySelector('.checkboxType:checked').value=="student"){
$.ajax({

          url: 'http://lacle.humanitech.fr/student/',
          type: 'POST',
          beforeSend: function (xhr) 
           {
              xhr.setRequestHeader('Authorization', make_base_auth("admin","password"));
            },
          contentType: 'application/json',
          data: JSON.stringify({"name": document.addForm.name.value}),
          dataType: 'application/json', // or $('#myform').serializeArray()
          success: function() { alert('POST completed'); }
        });
}
if( document.querySelector('.checkboxType:checked').value=="teacher"){
$.ajax({

          url: 'http://lacle.humanitech.fr/teacher/',
          type: 'POST',
          beforeSend: function (xhr) 
           {
              xhr.setRequestHeader('Authorization', make_base_auth("admin","password"));
            },
          contentType: 'application/json',
          data: JSON.stringify({"name": document.addForm.name.value}),
          dataType: 'application/json', // or $('#myform').serializeArray()
          success: function() { alert('POST completed'); }
        });
}
}

$('#addBox').toggle(1000);

}
/**/

