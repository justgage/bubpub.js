bubpub.js
=========
##bubbling publishing
> a SubPubish library, that avoids duplication on the cue when multiple events are fired on the same
namespace

##format
### listener
```code=javascript
    listeners = {
        "full": [ callback1, callback2, callback3, ...]
        "full/structure": [ callback1, ...]
    }
```

## bub.listen
    split at " "
        -> each added to listeners

        each
            NOT exists? -> create
            add.

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

#$bub.fire
usually async! (unless called directly which is not recomended)
go through que backwards  from the leaves down to the root. 
