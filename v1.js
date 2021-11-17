let count = 0;
function test(){
    return new Promise((resolv, reject) =>{
        let a = setInterval(() => {
            count++;
            console.log(`count: ${count}`);
            if(count == 3){
                resolv(a);
            }
        }, 1000);
        
    });
}

b = test().then(
    a => {clearInterval(a)},
    null
)