/*

Copyright 2015 Evan Bogunia_____evanbeta@keithmcmillen.com


*/



//Load the bitwig API.
loadAPI(1);

//Define/set our controller properties [ company, device, version, uuid ]
host.defineController("MyCompany", "MyController", "1.0",
					 "FBE16610-F98F-11E4-B939-0800200C9A66");
host.defineMidiPorts(1, 1);

//Loading External Files
load("MyController_functions.js")

//Define the range of our CCs
var CC_RANGE_HI = 100;
var CC_RANGE_LO = 60;

//------------------------------------ Init -----------------------------------//
function init()
{
	//-------- Set MIDI callbacks / port
	host.getMidiInPort(0).setMidiCallback(onMidiPort1);
	
	//Sends Notes to Bitwig, with no input filters. 
	noteIn = host.getMidiInPort(0).createNoteInput("Notes");
	noteIn.setShouldConsumeEvents(false);

	//Creates an array of user controls with the proper amount of CC#s
	userControls = host.createUserControlsSection(CC_RANGE_HI - CC_RANGE_LO + 1);

	//Iterate over the userControls, and assign the CC# to each control. 
	for(var i = CC_RANGE_LO; i<=CC_RANGE_HI; i ++)
	{
		userControls.getControl(i - CC_RANGE_LO).setLabel("CC" + i);
	}
	
	//Creating a view onto our transport. 
	transport = host.createTransport();

	//Creating a view onto the selected device.
	cursorDevice = host.createEditorCursorDevice(2);


	//Creating a Playing Observer.
	transport.addIsPlayingObserver(function(value){
		mcTransport.playing = value;
		mcTransport.output()
	})
	//Creating a Recording Observer
	transport.addIsRecordingObserver(function(value){
		mcTransport.recording = value;
		mcTransport.output();
	})

	parameters.update();
}

function onMidiPort1(status, data1, data2)
{	
	//Checks if the MIDI data is a CC
	if (isChannelController(status))
	{
		//if it is, check if the CC is within our range
		if (data1 >= CC_RANGE_LO && data1 <= CC_RANGE_HI)
		{
			//if it is, get the index of the CC in our userControls
			//And set the value of the control to the value of our CC
			var index = data1 - CC_RANGE_LO;
			userControls.getControl(index).set(data2, 128);
		}else{
			//Running our control Functions
			parameters.control(data1,data2)
			}
	//Note Data
	}else{
		mcTransport.input(data1, data2)
		parameters.pageScroll(data1, data2)
	}	
}

function exit()
{
	println("exit.");
}



