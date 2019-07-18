var action = require("./action")

var an;
action.get_new("../json/notice.json",3) .then((data) => {an = data;console.log(an)}).catch(console.error);
