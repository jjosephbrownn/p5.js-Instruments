let sampler
let sampleDur1, sampleDur2
let toggle = true

function setup(){
	createCanvas(windowWidth,windowHeight)
	background(100)

	sampler = new fracture();//the fracture objects

	setTimeout(function(){
		sampler.params(0)              //setting the params
		sampleDur1 = sampler.length1() //finding the durations of the two samples
		sampleDur2 = sampler.length2()
	},2000)  						   //all after 2 seconds to allow for loading
}

//gonna use some class p5 functions here
//mousePressed is called on a mouse click
//we can access which mouse button was pressed with the mouseButton variable
//pressing a button plays one or other of the sounds
//the toggle variable allows us to play in a few styles
//when true, the sampler is in sweet, sweet "fracture mode"
//when false, its mellow, mellow sample mode

function mousePressed() {
	if(toggle === true){
		if(mouseButton === LEFT){
			sampler.fracBegin(0)
		} else if(mouseButton === RIGHT){
			sampler.fracBegin(1)
		}
	} else if (toggle === false){
		if(mouseButton === LEFT){
			sampler.samplePlay(0,random(0,sampleDur1),random(-1,1))
		} else if(mouseButton === RIGHT){
			sampler.samplePlay(1,random(0,sampleDur2),random(-1,1))
		}
	}
}

//releasing the button stops it
function mouseReleased(){
	if(toggle === true){
		if(mouseButton === LEFT){
			sampler.fracStop(0)
		} else if(mouseButton === RIGHT){
			sampler.fracStop(1)
		}
	} else if(toggle === false){
		if(mouseButton === LEFT){
			sampler.sampleStop(0)
		} else if(mouseButton === RIGHT){
			sampler.sampleStop(1)
		}
	}
	
}

//pressing the ENTER key adds steps to the sequencer
//pressing the right arrow key changes the bpm
//pressing left arrow changes the toggle state
//i use this last toggle idea A LOT - very useful thing to do and, if you combine a few of them, you get very complex developement and structure
function keyPressed(){
	if(keyCode === ENTER){
		sampler.add(0,random(0,sampleDur1))
		sampler.add(1,random(0,sampleDur2))
	} else if(keyCode === RIGHT_ARROW){
		sampler.fracBPM(0,random(20,120),0)
		sampler.fracBPM(1,random(20,120),0)
	} else if(keyCode === LEFT_ARROW){
		if(toggle === true){
			toggle = false
		} else if(toggle === false){
			toggle = true
		}
	} 
}