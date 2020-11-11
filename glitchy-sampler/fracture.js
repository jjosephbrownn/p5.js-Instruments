//a sequencer / mangler that is a p5.js version of the Glitchmachines plugin Fracture 
//sort of - it does a similar thing but probably works very differently
//basically it cuts up and sequences a sample and it sounds mint


//it functions in a similar way to a tracker program
//each step has its own set of parameters for rate, playback position, filter value, delay value and pan
//this is initialised in a series of "pattern" arrays with non-zero values as playback positions and zeros as rests
//all of the pattern arrays are kept to the same length
//when a new step is played the program reads through all the pattern arrays at that index and applies the parameters
//see the example file for a proper run through

let samples = [ 
	//put your soundfile links here!
	//see the p5 helpfiles for stuff about file types
];

function fracture(){ //arguments here could define sample types or parameter settings.  I usually have a couple of arrays of different samples (voice,percussion etc)
	//choose and load sounds
	let sound1, sound2
	let file1,file2

	file1 = round(random(samples.length-1))
	file2 = round(random(samples.length-1))
	sound1 = loadSound(samples[file1])
	sound2 = loadSound(samples[file2])

	//initialise effects n that
	let filt1 = new p5.LowPass()
	let filt2 = new p5.LowPass()

	let del1 = new p5.Delay()
	let del2 = new p5.Delay()

	//routing - the soundfile needs to be disconnected from the master out first
	sound1.disconnect()
	sound2.disconnect()

	//then connected to the effects (otherwise you get a wet/dry mix you can't do anything about)
	sound1.connect(filt1)
	sound2.connect(filt2)

	del1.process(sound1,0,0,1000)
	del2.process(sound2,0,0,1000)

	//the master bus! connect everything here
	//this looks fiddly but it allows you to have a master volume control (rather than tons of single channels)
	let master = new p5.Gain()
	master.connect()
	filt1.disconnect()
	filt2.disconnect()
	filt1.connect(master)
	filt2.connect(master)
	master.amp(0.5) //master volume control

	//sequence initialising, these have to have some sort of initial value otherwise confusion occurs
	let pace         //bpm or speed
	let dur1,dur2    //duration of each soundfile, called below
	let pats1 = [0]	 //pattern 1
	let pats2 = [0]	 
	let durs1 = [0]  //sequence of durations 1
	let durs2 = [0]

	//effect patterns - allows each step to have its own effect parameters
	let filt1Pat = [] //filter
	let rate1Pat = [] //playback rate
	let del1Pat = []  //delay time 
	let fdbk1Pat = [] //delay feedback

	let filt2Pat = [] //same again for second soundfile
	let rate2Pat = []
	let del2Pat = []
	let fdbk2Pat = []

	let fracPos1 = 0 //the sequence step counter
	let fracPos2 = 0

	//the sequencer bit - rather complicated, look at the p5 helpfiles for Phrase and Part
	let samp1Phrase //the sequencer "phrase" 
	let samp2Phrase
	let samp1       //the actual sequencer "channel"
	let samp2
	
	let place1 = 0 //the sequencer counter and increment (the "where are we?" number)
	let place2 = 0
	let pat1pos = 0 //keeps track of pattern length, eg when a new step is added this increments (and is therefore the sequence length)
	let pat2pos = 0

	pace = 40

	//the sequencer, arguments: a name (string) for referral, a callback function to execute, the pattern!
	//this cycles through the pattern at the rate set by "pace" and when the play() method is called
	//a non-zero value is passed the callback function (seq1 for example)
	//a zero is understood as a "do nothing" and the callback isn't executed
	samp1Phrase = new p5.Phrase("samp1", seq1, pats1); 
	samp2Phrase = new p5.Phrase("samp2", seq2, pats2);
	
	//in p5-ian a Part is the structure for the sequencer - seems needlessly complicated to me
	samp1 = new p5.Part();
	samp1.addPhrase(samp1Phrase)
	samp1.setBPM(pace)
	samp2 = new p5.Part();
	samp2.addPhrase(samp2Phrase)
	samp2.setBPM(pace)

	//alright! the functions!

	//call this to set the sequencer playing
	//the "src" argument is my universal name for part, channel, pattern etc.
	//in this case it refers to which sequencer part we're playing
	this.fracBegin = function(src){
		userStartAudio() // a must in Chrome where auto-playing is strictly verboten
		if(src === 0){
			sound1.play()          //plays the actual sample
			samp1.loop(); 	   //loops the sequencer part
		} else if(src === 1){
			samp2.loop();
			sound2.play()
		}
	}

	//plays the sequencer pattern once
	this.fracNoLoop = function(src){
		if(src === 0){
			samp1.start();
			samp1.noLoop()
		} else if(src === 1){
			samp2.start();
			samp2.noLoop()
		}
	}

	//progresses the sequencer pattern by one step only (see later for a run through of the effect sequences)
	this.fracProg = function(src){
		if(src === 0){
			filt1.freq(filt1Pat[fracPos1])
			del1.process(sound1,del1Pat[fracPos1],fdbk1Pat[fracPos1])
			sound1.play()
			sound1.jump(random(sound1.duration()),durs1[fracPos1])
			sound1.rate(rate1Pat[fracPos1])
			fracPos1++
			if(fracPos1 === pats1.length-1){fracPos1 = 0}
		} else if(src === 1){
			filt2.freq(filt2Pat[fracPos2])
			del2.process(sound2,del2Pat[fracPos2],fdbk2Pat[fracPos2])
			sound2.play()
			sound2.jump(random(sound2.duration()),durs2[fracPos2])
			sound2.rate(rate2Pat[fracPos2])
			fracPos2++
			if(fracPos2 === pats2.length-1){fracPos2 = 0}
		}
	}

	//stops the looping
	this.fracStop = function(src){
		if(src === 0){
			samp1.stop()
			sound1.stop()
		} else if(src === 1){
			samp2.stop();
			sound2.stop()
		}
	}

	//changes the bpm, also resets if init is set to 1 (other arguments can be anything if you do this)
	this.fracBPM = function(src,bpm,init){
		if(init === 0){
			if(src === 0){
				samp1.setBPM(bpm)
			} else if(src === 1){
				samp2.setBPM(bpm)
			}
		} else if(init === 1) {
			samp1.setBPM(pace)
			samp2.setBPM(pace)
		}		
	}

	//plays a sample with no cutting and screwing, requires a sample play position ("start")
	//pan is between -1 and 1 - this WILL NOT PLAY AND WILL CRASH if those numbers go out of bounds because pan is a sulky arse
	this.samplePlay = function(src,start,pan){
		if(src === 0){
			sound1.play(0,1,0.5,start)
			sound1.pan(pan)
		} else if(src === 1){
			sound2.play(0,1,0.5,start)
			sound2.pan(pan)
		}
	}

	
	//same as above but just plays from the beginning of the sample
	this.samplePlayCont = function(src,pan){
		if(src === 0){
			sound1.play(0,1,0.5)
			sound1.pan(pan)
		} else if(src === 1){
			sound2.play(0,1,0.5)
			sound2.pan(pan)
		}
	}

	//pauses sample, calling the above function will start playing again from this paused position
	this.samplePause = function(src){
		if(src === 0){
			sound1.pause()
		} else if(src === 1){
			sound2.pause()
		}
	}

	//stops sample playback
	this.sampleStop = function(src){
		if(src === 0){
			sound1.stop()
		} else if(src === 1){
			sound2.stop()
		}
	}

	//loops sample
	this.loop = function(src){
		if(src === 0){
			sound1.loop(0,1,0.5,0);
		} else if (src === 1){
			sound2.loop(0,1,0.5,0)
		}				
	}
	//adds a step and value to the sequencer
	//src routes the data
	//pat is the value to be added to the end of the sequence
	//i guess you could write a function that allows you to change specific steps
	this.add = function(src,pat){
		if(src === 0){								
			pats1[pat1pos] = pat 					//adds value to end of pattern array
			samp1.replaceSequence("samp1",pats1)	//adds newly updated pattern to the Part
			pat1pos++								//increments count (total length) ready for next time
			if(pat1pos === 16){pat1pos = 0}			//if the count goes above a threshold reset to 0
		} else if(src === 1){
			pats2[pat2pos] = pat
			samp2.replaceSequence("samp2",pats2)
			pat2pos++
			if(pat2pos === 16){pat2pos = 0}
		} 
	}

	//clears patterns
	this.init = function(src) {
		if(src === 0){
			if(pats1.length<16){
				pats1 = []
				samp1.replaceSequence("samp1",pats1)
			} else {
				return null
			}
		} else if(src === 1){
			if(pats2.length<16){
				pats2 = []
				samp2.replaceSequence("samp2",pats2)
			} else {
				return null
			}
		} 
	}

	//removes the last step from a pattern
	this.del = function(src){
		if(src === 0){
			pats1.pop()
			samp1.replaceSequence("samp1",pats1)
		} else if(src === 1){
			pats2.pop()
			samp2.replaceSequence("samp2",pats2)
		}
	}


	//sets some delay params, not super useful tbh
	this.delay = function(src,del,fdbk){
		if(src === 0){
			del1.process(sound1,del,fdbk,500)
		} else if (src === 1){
			del2.process(sound2,del,fdbk,500)
		}
	}

	//sets filter params
	this.filt = function(src,f,r){ //which filter, frequency, resonance
		if(src === 0){
			filt1.set(f,r)
		} else if (src === 1){
			filt2.set(f,r)
		}
	}

	//sets sample pan
	this.panner = function(src,p){
		if(src === 0){
			s1.pan(p)
		} else if (src === 1){
			s2.pan(p)
		}
	}

	//returns the duration of the sample
	//REQUIRED if you want to do lots of skipping
	//p5 often needs an "end point" to work with
	//i call this in the setup() portion after a delay of about 2s to allow the samples to load (using setTimeout())
	//if you call this before the sample loads it will return 0
	this.length1 = function(){
		dur1 = sound1.duration()
		return(dur1)
	}

	this.length2 = function(){
		dur2 = sound2.duration()
		return(dur2)
	}

		//plays both samples on their independent sequences but in parallel fifths (look at the "rate" method)
	//THIS WON'T WORK STRAIGHT OUT THE BOX
	//this function requires each sample to be doubled (loaded twice into two separate arguments)

// 	this.fifths = function(src){
// 		if(src === 0){
// 			filt1.freq(filt1Pat[place1])
// 			del1.process(sound1,del1Pat[place1],fdbk1Pat[place1])
// 			del1.process(sound1b,del1Pat[place1],fdbk1Pat[place1])
// 			sound1.play()
// 			sound1.jump(pats1[place1],0.1)
// 			sound1.rate(rate1Pat[place1])
// 			sound1.pan(-1)
// 
// 			sound1b.play()
// 			sound1b.jump(pats1[place1],0.1)
// 			sound1b.rate(rate1Pat[place1]+0.5)
// 			sound1b.pan(1)
// 
// 			place1++
// 			if(place1 === pats1.length-1){place1 = 0}
// 		} else if (src === 1){
// 			filt2.freq(filt2Pat[place2])
// 			del2.process(sound2,del2Pat[place2],fdbk2Pat[place2])
// 			del2.process(sound2b,del2Pat[place2],fdbk2Pat[place2])
// 			sound2.play()
// 			sound2.jump(pats2[place2],0.1)
// 			sound2.rate(rate2Pat[place2])
// 			sound2.pan(-1)
// 
// 			sound2b.play()
// 			sound2b.jump(pats2[place2],0.1)
// 			sound2b.rate(rate2Pat[place2]+0.5)
// 			sound2b.pan(1)
// 
// 			place2++
// 			if(place2 === pats2.length-1){place2 = 0}
// 		}
//	}

	//sets the effect params
	//i call this in setup()
	//its all randomised because i haven't got time to pull numbers out my arse
	//these are some good starting values
	//rate is by default set to 1 for every step
	//sometimes i add a conditional statement which instead has a random rate generator
	//for this i use the type argument (otherwise unused)
	//if type === 0 then all rates = 1
	//if type === 1 then all rates = random
	//recommend calling this after a delay in the setup() to allow for the samples to load
	this.params = function(type){
		for(i=0;i<16;i++){
			filt1Pat[i] = Math.random()*10000
			rate1Pat[i] = 1
			del1Pat[i] = Math.random()
			fdbk1Pat[i] = Math.random()*0.5
			durs1[i] = Math.random()*dur1

			filt2Pat[i] = Math.random()*10000
			rate2Pat[i] = 1
			del2Pat[i] = Math.random()
			fdbk2Pat[i] = Math.random()*0.5
			durs2[i] = Math.random()*dur2
		}
	}

	function seq1(time,start){ 
		filt1.freq(filt1Pat[place1])

		del1.process(sound1,del1Pat[place1],fdbk1Pat[place1])
		
		sound1.play()
		sound1.jump(start,durs1[place1])
		sound1.rate(rate1Pat[place1])
		sound1.pan(random(2)-1)

		place1++
		if(place1 === pats1.length-1){place1 = 0}
	}

	function seq2(time,start){	
		filt2.freq(filt2Pat[place2])
	
		del2.process(sound2,del2Pat[place2],fdbk2Pat[place2])

		sound2.play()
		sound2.jump(start,durs2[place2])
		sound2.rate(rate2Pat[place2])
		sound2.pan(random(2)-1)

		place2++
		if(place2 === pats2.length-1){place2 = 0}
	}


}


	