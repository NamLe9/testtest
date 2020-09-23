document.addEventListener('DOMContentLoaded', function() {
  // nav menu
  const menus = document.querySelectorAll('.side-menu');
  M.Sidenav.init(menus, {edge: 'right'});
  // add recipe form
  const forms = document.querySelectorAll('.side-form');
  M.Sidenav.init(forms, {edge: 'left'});
});


function getDate(){
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  return dd;
};

function getMonth(){
  var today = new Date();
  var mm = String(today.getMonth()).padStart(2, '0');
  return mm;
};

function getYear(){
  var today = new Date();
  var yyyy = today.getFullYear();
  return yyyy;
};
