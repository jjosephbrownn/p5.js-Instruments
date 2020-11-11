# p5.js-Instruments
A repo of unusual soundmakers and synths for p5.js

This repo serves as documentation and round about explanation of some of the processes I used to create the sound environment [The Dream Lens](dreamlens.netlify.app), the code for which can be accessed in [this repo](https://github.com/jjosephbrownn/TheDreamLens).

This website used quite a lot of relatively unusual sound design and sound sequencing which is controlled (obliquely and confusingly) by the visitor.  Basically I did a lot of work making warped drum machines, strange sequencers and quirky samplers and I think it covers a lot of interesting ground and maybe even expands on the usual ways in which computer/internet music is made.  Myabe you'll get something out of it.  When I started coding music I frustrated myself endlessly and it took years of tweaking and experimenting before I got to a place that I liked: wild, warped music which wasn't totally random and was relatively simple to control.  Sounds easy, it isn't. 

The instruments also display a number of quirks which probably stop them being universally useful but allow them to do some very specific and exciting things:

The Glitchy Sampler works like a tracker and allows sequencing of effect parameters to each step of the pattern including playback rate, pan, filter and delay.  The model has plenty of space for more effects to be added!

The Organum Synths write melodies mapped into seven note modes.  They are harmonising synthesisers that use basic input data to create lush harmonic patterns and chords.  They are influenced by two techniques of mediaeval vocal composition: parallel organum and the later Notre Dame School Florid Organum.

Songer cuts up longer sections of samples to create a sort of "song making synth".  This works really well with short repetitive samples like bass guitar lines or drum parts.

LindenStrings is a string quartet synthesiser that generates melodies and textures uing a Lindenmayer System.  This is basically a simple set of rules that can be used to orchestrate huge melodies and counter melodies.  L-systems are also used for drawing trees!

Beats is a simple drum sampler that has a set of initial values to allow more "musical" patterns to arise.  I usually find "random" drum sequencers can only really make knock-off Aphex Twin music (which is fine) so I designed something that makes more "normal" sounding beats (ie not the "cat on a keyboard" sound) that are still randomised and surprising.  I actually use this a lot because it tempers some of the other random synths in this repo and provides a cool, rock-steady counterpoint.

This is it for now but I might add some more stuff later.  I haven't included the interactive elements of these instruments which may reduce them slightly as they rely so much on wonky contexts for their full range of sounds.  Check out the Dream Lens repo if you're interested in that sorta thing.  In any case I have included an example file fo reach synth to get you started.

Please email me if you want any help or want to chat about this project :)
