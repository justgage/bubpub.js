bubpub.js
=========
> a SubPubish library, that avoids duplication on the cue when multiple events are fired on the same
namespace
Way things are going to propigate. 

##Listeners format
```code=javascript
    listeners = {
        "full": [ callback1, callback2, callback3, ...]
        "full/structure": [ callback1, ...]
    }
```

listeners are added:
    split at " "
        -> each added to listeners

        each
            NOT exists? -> create
            add.

// Que format------------
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


// fire---------------
// usually async! (unless called directly which is not recomended)
// go through que backwards  from the leaves down to the root. 
