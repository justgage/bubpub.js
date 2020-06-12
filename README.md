BUBPUB.JS
=========
_a pubsub(ish) library that allows you to tie actions to events in a bubbling, non-duplicating, and non-blocking way._

__bubbling?__

Meaning if you call a child event every parent event gets called. 

eg: you call `parent/cool/child` then `parent`, `parent/cool` also get called.

__non-duplicating?__

This means when you publish the __same event multiple__ times before the code is done executing it only gets called __once__ when the queue is emptied.

__non-blocking?__

also called 'async'. This means that the events don't publish till your code is done running


## Features:

 - "Talking objects" that publish events when the change.
 - Event queue that doesn't duplicate or interrupt code.
 - Nesting (or name spacing) events that "bubble" up the chain when they are fired.

# Uses
__bubpub__ is great for updating the view because the events are non-duplicating they won't touch the DOM more than they need to. 

How it works:
=============
## Overview

1. __listen__ to a event with a callback.
2. __say__ (publish) a event which gets queued to fire async with setTimout.
3. __fire__ the queue for all the callbacks listening to those events. 


### 1. listen (subscribe)
_listen or subscribe to an event. This means the callback will fire anytime the event is fired_

```javascript
bubpub.listen({string} names, {function} callback)
```

```javascript
//listen to one event
bubpub.listen("rat", function () {...}); 

//listen to two events
bubpub.listen("dog cat", function () {...});  

//listen to a nested event
bubpub.listen("dog/bark", function () {...}); 

//listen to a different nested event
bubpub.listen("dog/sit", function () {...}); 

//listen to parent event which will fire on any of the following changes:
// 'dog'
// 'dog/bark'
// 'dog/sit'
bubpub.listen("dog", function () {...});
```

### 2. say (publish)
_add an event to the queue. that will fire all listening events._

```javascript
// adds "dog" and "dog/bark" to the queue
bubpub.say("dog/bark");

// dog already exists on the queue thus this is ignored.
bubpub.say("dog");

// this adds 'dog/sit' to the queue but ignores 'dog'
bubpub.say("dog/sit");


// queue is fired async in the following order
//
// fire: 'dog/bark'
// fire: 'dog/sit'
// fire: 'dog'
```

### Pulling it together. 

```javascript
bubpub.listen("people", function () {
    console.log("hello all people");
});

bubpub.listen("people/hi", function () {
    console.log("hi people");
});

bubpub.listen("people/spanish", function () {
    console.log("¡Hola people");
});

bubpub.say("people/hi people/hi people/spanish");

/***
 * console.log says: 
 *
 * hi people 
 * ¡Hola people 
 * hello all people
 */
```

### Talking objects
These are objects that have their own bubpub event that they fire whenever they change. 

they will not change in the following conditions

- the value is the same
- the value does not pass the validator function. (true = valid, false = invalid (don't change)) 


```javascript
var object = bubpub.obj('route/something', "start_value", validation_func);

var get_val = object(); // get value ("start_value")

object("cool"); // set value to "cool"

// listen to the changes to the object
bubpub.listen('route/something', function () {...});
```

## How the javascript event queue works
bubpub is an async queue which means that it piles up the queue till the current code is done running then it allows a little time for the browser to redraw then emptys the queue. 

__how the event system works__

- Any async event (setTimeout, click events, ajax calls, etc...) will never interupt code! they will just get pushed to the event queue.
- the event queue is what the browser fires after the current code is done and it's looking for somthing to do. 
- the browser window is only redrawn whenever there is _nothing_ on the event queue. 
- setTimeout will queue the event AFTER the timer minimum is passesd. Thus if you set the timer to more than 25ms then it allows time for the browser to redraw before adding new code to the queue. 


# The queue structure
```javascript
// adding base/mid/top
queue = [
    0 : ["base"]
    1 : ["base/mid"]
    2 : ["base/mid/top"]
]
// adding base/mid/top again would provide no change
// 
// adding base/branch/top

queue = [
    0 : ["base"]
    1 : ["base/mid", "base/branch"]
    2 : ["base/mid/top", "base/branch/top"]
]
```

### listener
````javascript
listeners = {
    "full": [ callback1, callback2, callback3, ...]
    "full/structure": [ callback1, ...]
}
````
