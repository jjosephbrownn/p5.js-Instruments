# The Repo Depot

This bunch of code requires p5.js to work.  There are number of ways to link this to your page (check out the [p5.js site](https://p5js.org/get-started/)) but it needs to be there. Also p5.sound which comes bundled with the library now which is nice.  All of example HTML files have links to CDNs for both of these so if you're just using the files here, you're good to go.

If you download (or clone) this repo all of the files will work out of the box - the filepaths are all set up to work in this current folder structure.  If you download one file only, you'll have to go through and change the filepaths.  This is mostly in the HTML examples so it might not even be a problem.

P5 also requires a server to be working.  The one I use is [Web Server for Chrome](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb?hl=en) which is really simple to use - you just point it at what you want to be the root folder and it opens a server in that place.

Each instrument comes with the object file (the instrument), an example JS file (the program) and an example HTML file ("the page").  p5 is a little like React.js in that an HTML file works as a sort of "empty" vessel which is drawn into by the JS file.  You can obviously add other stuff in the HTML (and p5 has a great DOM system) but for these examples all you need is a file with the correct <head> links and the <script> which points to the example JS file.  This latter does all of the work and renders into the browser window. Neat.

Each instrument is a so-called "object".  This is an external file which you reference in your JS code.  The "name" of the object is the wrapper function in the object file.  For example, the glitchy sampler object is wrapped in a function called "fracture" so that is the name you reference in your code.  It is instantiated with "new" and, in some instances, can be supplied with arguments for initial setup.  If you're working in p5 then this is best done in the setup() part.  If you're not then I guess you can do what you want:
```
let zillophone = new lifeform("carbon-based","silicon-based");
zillophone.bringLove();
zillophone.breakItsLegs();
```
in this case we have an object called lifeform, for some reason, with a method bringLove().  Each instrument comes with all of the methods I ended up using for my project but it is really easy to add some more into the object code:
```
this.dentalPlan = function() {
      return ("lisa needs braces")
};
```
if you plan to just drop these instruments into your site then you're in luck!  They will all work out of the box if linked in the <head> section of your page.  Some instruments that are sample-based will require an array of strings representing filepaths for soundfiles - these are all labelled.  Have fun making mint tunes.
