//functions.js


var mcTransport = {

	playing: false,
	recording: false,

	input: function(data1, data2){
		if (data1 == 31 && data2 > 0){
			transport.play();
		}else if (data1 == 30 && data2 > 0){
			transport.stop();
		}else if (data1 == 29 && data2 > 0){
			transport.record();
		}
	},	

 	output: function(){
		if (this.playing){
			sendMidi(144, 35, 127);
			sendMidi(144, 34, 0);
		}else{
			sendMidi(144, 35, 0);
			sendMidi(144, 34, 127);
		}

		if(this.recording){
			sendMidi(144, 33, 127)
		}else{
			sendMidi(144, 33, 0)
		}

	}
}