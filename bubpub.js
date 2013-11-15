var bubpub = {
    que : [],
    listeners : {},
    timeout_fired: false,

    listen : function (topic_str, callback) {
        // if it already exists
        if (!(topic_str in this.listeners)) {
            this.listeners[topic_str] = [];
        }

        if (typeof callback === "function" ) {
            this.listeners[topic_str].push(callback);
        } else {
            console.error("no callback function!");
        }
    },

    say : function (topic_str) {
        
        console.log("SAY");
        var topics = topic_str.split(" ");

        console.log("topics" , topics);

        for (var i=0, l = topics.length; i < l; i++) {
            this.bubble(topics[i]);
        }

        /***
         * deploy async fire if needed
         */
        if (this.timeout_fired === false) {
            this.timeout_fired = true;
            
            //needed for the 'this' problem
            var that = this;
            var fire = this.fire;
            setTimeout(function () {
                fire(that);
            }, 1); // IE doesn't like -> 0
        }
    },
    
    /***
     * add's a event to each part of the que
     */
    bubble : function (topic) {
        var chain = topic.split("/");
        var i = chain.length + 1;

        while(--i) {
            var event = chain.slice(0, i).join("/");
            var worked = this.que_one(i ,event);
        }
    },
    // ques it only if it hasn't been qued
    que_one : function (i, event) {
        this.que[i] = this.que[i] || [];


        if ($.inArray(event, this.que[i]) === -1) {
            this.que[i].push(event);
            return true;
        }    
        return false;
    },
    // fires all the events in the que
    fire : function (that) {
        var que = that.que;
        that.que = [];
        that.timeout_fired = false;
        console.error("FIRE");
        console.log(que);

        i = que.length;

        while(--i) {
            level = que[i];

            for (var j=0, l = level.length; j < l; j++) {
                var item = level[j];

                if (item in that.listeners) {
                    for (var k=0, ll = that.listeners[item].length; k < ll; k++) {
                        that.listeners[item][k](); // run each callback!
                    }
                }
            }
        }

        

        /*

        for (i=0, l = que.length; i < l; i++) {
            item = que[i];

            if (item in that.listeners) {
                for (j=0, ll = that.listeners[item].length; j < ll; j++) {
                    that.listeners[item][j](); // run callback
                }
            }
        }


       */

    }
};
