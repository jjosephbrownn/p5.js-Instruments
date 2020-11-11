# Fracture - A Tracker Sampler

As was already stated in the readme this instrument is similar in style (and effect) to the Glitchmachines plugin "Fracture".  This plugin processes incoming sound by saving it in a buffer and then pushing it through a number of playback effects (such as a repeats and speed) then passing these segments through a filter and delay.  Interestingly you can also modulate the parameters of these effects with syncable LFOs.

Essentially, this instrument does the same thing.  You can get really fast chopped up, highly modulated, dynamic and almost granular sounds or, if you want, a placid easy playback with smooth filter sweeps and delays.

The best way to imagine this instrument is as a [tracker] (https://en.wikipedia.org/wiki/Music_tracker#Selected_list_of_music_trackers).  Each sequencer step has an array of commands which can be used to manipulate the sample.  When the first step is played Fracture looks through all of the pattern data and says "ok, play the sample from 1s to 2s, at 1.5 normal rate, with a filter frequency of 2000, resonance of 0.75, -0.5 pan, with a delay time of 0.5s and feedback of 0.2.  Load the next step..."

The pattern data is initialised using the this.params() function which automatically fills an array (one for each effect type, filter frequency, playback speed, delay time and delay feedback) with 16 randomised (and appropriately scaled) values.  No reason why I chose 16 or the randomness, it just worked well for this project.  The actual playback sequencer is not initialised in the same way as I wanted the page visitor to be able to add steps themselves.  This is handled with the this.add() function which adds steps to the end of the playback pattern ("pat1" and "pat1").  A tally of the total length is kept allowing the sequencer to wrap back round to the beginning again no matter the length, avoiding lots of empty spaces.

P5.js has a rather complicated system for setting up a sequencer, but this setup is handled in the javascript file.  The important thing to know is that it needs a pattern of zero and non-zero numbers (an array is perfect) which it can reel through and a callback function to execute at each step.  A non-zero number is understood as a "go" command and the function supplied is called and passed the appropriate index from the array.  If the index in the array is a zero this is understood as a "do nothing".  

For example we might have an array which looks like:
```
Let pattern1 = [1,2,1,0,1,2];
```
the sequencer will read the first step (1) and pass that to the function.  This value can be used for anything but in this I use it as a "position" value and the sample is played from 1s (NOTE: annoyingly, p5 works in SECONDS not ms so 1 = 1 second.  This is baffling and weird by what you gonna do).  The sequencer then goes on to the second step (2).  This happens until we hit step 3 (starting from 0) with a zero; the sequencer simply waits until the next beat.  Sequencers run off a bpm value which controls the read-through speed and can be set with a setBPM() method.

The callback function also has a set of commands to apply various effects to this step that are drawn from the pattern arrays discussed earlier.  A counter is incremented and reset to keep tally of the position in the "master" playback position array.  This means that each step in the playback pattern has a corresponding step in the filter and delay patterns which allows a certain amount of repetition whilst still having an element of randomness.

See the example file for a fun execution.
