only the background has access to the chrome.On.... methds

why does so many extensions's content_scripts use :
(()=>{
    //All the javascript code goes here
})();

Because:

Avoid polluting the global scope (window):

Without the IIFE, all variables declared with var (and to some extent let/const) at the top level would be globally accessible.

That risks clashing with the web page’s own JavaScript or other extensions.

IIFE keeps everything inside a private scope.

Prevent name collisions:

If multiple scripts define functions or variables with the same name, they'll conflict unless isolated.

Encapsulation:

Makes sure internal logic, helper functions, or constants aren’t exposed to the rest of the page.