document.querySelectorAll(".button").forEach((elmt)=>{
    elmt.addEventListener('click', function (){
        if (!elmt.dataState){
            let blockedDmains = new Set(JSON.parse(localStorage.getItem('bocked_domains')) || []);
            blockedDmains.add(this.innerHTML);
            localStorage.setItem('bocked_domains', JSON.stringify([...blockedDmains]));
            elmt.dataState = true;
        }
    });
});