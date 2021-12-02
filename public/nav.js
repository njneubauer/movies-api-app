const closeIcon = document.querySelector('.sidebar-close-x');
const expandSidebar = document.querySelector('#expand-sidebar');
const main = document.getElementById('#main');
let nav = document.querySelector('#sidebar');

closeIcon.addEventListener('click', ()=>{
    nav.classList.add('sidebar-close');
    nav.classList.remove('sidebar-open');
});

expandSidebar.addEventListener('click', ()=>{
    nav.classList.add('sidebar-open');
    nav.classList.remove('sidebar-close')
});

window.addEventListener('resize', function(event){
    var newWidth = window.innerWidth;
   
    if (newWidth < 822){
        nav.classList.remove('sidebar-open')
        nav.classList.add('sidebar-close');
    }
});