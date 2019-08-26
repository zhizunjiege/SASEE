function createSixNum() {
    let Num="";
    for(let i=0;i<6;i++)
    {
        Num += Math.floor(Math.random()*10);
    }
    return Num;
}
const verify_code = createSixNum();
send(verify_code);
if (verify_code == submit()){
    //write mail info into database
}





function send() {

}

function submit() {
    return []
}