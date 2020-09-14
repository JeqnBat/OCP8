/**
 * <b>DESCR:</b><br>
 * Fills-in description when one of the bottom nav's item
 * is hovered
 */
 function navMenu() {
   let navItem = document.getElementsByClassName('nav-category');

   for (let i = 0; i < navItem.length; i++) {
     let navInfos = document.getElementById(`descr-${i}`);

     navItem[i].addEventListener('mouseenter', function() {
       navInfos.style.display = 'block';
     });
     navItem[i].addEventListener('mouseleave', function() {
       navInfos.style.display = 'none';
     });
   }
 }

navMenu();
