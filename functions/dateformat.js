Number.prototype.padLeft = function(base,chr){
    var  len = (String(base || 10).length - String(this).length)+1;
    return len > 0? new Array(len).join(chr || '0')+this : this;
}

const formatDate = (date) => {

	date = new Date(date)
	const day = date.getDate();
	const month = date.getMonth()+1;
	const year = date.getFullYear();
	const hour = date.getHours();
	const minute = date.getMinutes();
	const second = date.getSeconds();

	return year + "/" + month.padLeft() + "/" + day.padLeft() + " " + hour.padLeft() + ":" + minute.padLeft() + ":" + second.padLeft();
}

const testing = () => {
	console.log("==========")
	var time = "2024/8/20 3:35:01";
	var date = new Date(time);

	var test = date.getTime();

	console.log(test)
	// date.setHours(20);
	console.log(new Date(test))
	console.log("==========")
}

export {formatDate, testing}