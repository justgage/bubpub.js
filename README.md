bubpub.js
=========
_a SubPub(ish) library, that avoids duplication on the que,_

__STATUS:__ beta

##Features:
 - Events don't duplicate or interrupt code.
 - Nesting pubs that "bubble" up the chain when they are fired.

How it works:
=============
##Overview

1. __listen__ to a event with a callback.
2. __say__ (publish) a event which gets qued to fire async with setTimout.
3. __fire__ the que for all the callbacks listening to those events. 


###1. listen (subscribe)
_listen or subscribe to an event. This means the callback will fire anytime the event is fired_

```javascript
bubpub.listen({string} names, {function} callback)
```

```javascript
//listen to one event
bubpub.listen("dog", function () {...}); 

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

###2. say (publish)
_add an event to the que. that will fire all listening events._

```javascript
// adds "dog" and "dog/bark" to the que
bubpub.say("dog/bark");

// dog already exists on the que thus this is ignored.
bubpub.say("dog");

// this adds 'dob/sit' to the que but ignores 'dog'
bubpub.say("dog/sit");


// que is fired async in the following order
//
// fire: 'dog/bark'
// fire: 'dog/sit'
// fire: 'dog'
```

###Pulling it together. 

````javascript

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

````

#Code structure
_information for people working on bubpub_
### listener
````javascript
    listeners = {
        "full": [ callback1, callback2, callback3, ...]
        "full/structure": [ callback1, ...]
    }
````

## bub.que
    // adding base/mid/top
    que = [
        0 : ["base"]
        1 : ["base/mid"]
        2 : ["base/mid/top"]
    ]
    // adding base/mid/top again would provide no change
    // 
    // adding base/branch/top

    que = [
        0 : ["base"]
        1 : ["base/mid", "base/branch"]
        2 : ["base/mid/top", "base/branch/top"]
    ]



