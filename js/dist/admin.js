/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/eventemitter3/index.js":
/*!*********************************************!*\
  !*** ./node_modules/eventemitter3/index.js ***!
  \*********************************************/
/***/ ((module) => {

"use strict";


var has = Object.prototype.hasOwnProperty,
  prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @private
 */
function Events() {}

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
  Events.prototype = Object.create(null);

  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) prefix = false;
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */
function addListener(emitter, event, fn, context, once) {
  if (typeof fn !== 'function') {
    throw new TypeError('The listener must be a function');
  }
  var listener = new EE(fn, context || emitter, once),
    evt = prefix ? prefix + event : event;
  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);else emitter._events[evt] = [emitter._events[evt], listener];
  return emitter;
}

/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt The Event name.
 * @private
 */
function clearEvent(emitter, evt) {
  if (--emitter._eventsCount === 0) emitter._events = new Events();else delete emitter._events[evt];
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
 */
function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var names = [],
    events,
    name;
  if (this._eventsCount === 0) return names;
  for (name in events = this._events) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }
  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }
  return names;
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Array} The registered listeners.
 * @public
 */
EventEmitter.prototype.listeners = function listeners(event) {
  var evt = prefix ? prefix + event : event,
    handlers = this._events[evt];
  if (!handlers) return [];
  if (handlers.fn) return [handlers.fn];
  for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
    ee[i] = handlers[i].fn;
  }
  return ee;
};

/**
 * Return the number of listeners listening to a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Number} The number of listeners.
 * @public
 */
EventEmitter.prototype.listenerCount = function listenerCount(event) {
  var evt = prefix ? prefix + event : event,
    listeners = this._events[evt];
  if (!listeners) return 0;
  if (listeners.fn) return 1;
  return listeners.length;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;
  if (!this._events[evt]) return false;
  var listeners = this._events[evt],
    len = arguments.length,
    args,
    i;
  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);
    switch (len) {
      case 1:
        return listeners.fn.call(listeners.context), true;
      case 2:
        return listeners.fn.call(listeners.context, a1), true;
      case 3:
        return listeners.fn.call(listeners.context, a1, a2), true;
      case 4:
        return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5:
        return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6:
        return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }
    for (i = 1, args = new Array(len - 1); i < len; i++) {
      args[i - 1] = arguments[i];
    }
    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length,
      j;
    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);
      switch (len) {
        case 1:
          listeners[i].fn.call(listeners[i].context);
          break;
        case 2:
          listeners[i].fn.call(listeners[i].context, a1);
          break;
        case 3:
          listeners[i].fn.call(listeners[i].context, a1, a2);
          break;
        case 4:
          listeners[i].fn.call(listeners[i].context, a1, a2, a3);
          break;
        default:
          if (!args) for (j = 1, args = new Array(len - 1); j < len; j++) {
            args[j - 1] = arguments[j];
          }
          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }
  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  return addListener(this, event, fn, context, false);
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  return addListener(this, event, fn, context, true);
};

/**
 * Remove the listeners of a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;
  if (!this._events[evt]) return this;
  if (!fn) {
    clearEvent(this, evt);
    return this;
  }
  var listeners = this._events[evt];
  if (listeners.fn) {
    if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
      clearEvent(this, evt);
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;else clearEvent(this, evt);
  }
  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;
  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) clearEvent(this, evt);
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }
  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;

//
// Expose the module.
//
if (true) {
  module.exports = EventEmitter;
}

/***/ }),

/***/ "./node_modules/fast-diff/diff.js":
/*!****************************************!*\
  !*** ./node_modules/fast-diff/diff.js ***!
  \****************************************/
/***/ ((module) => {

/**
 * This library modifies the diff-patch-match library by Neil Fraser
 * by removing the patch and match functionality and certain advanced
 * options in the diff function. The original license is as follows:
 *
 * ===
 *
 * Diff Match and Patch
 *
 * Copyright 2006 Google Inc.
 * http://code.google.com/p/google-diff-match-patch/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * The data structure representing a diff is an array of tuples:
 * [[DIFF_DELETE, 'Hello'], [DIFF_INSERT, 'Goodbye'], [DIFF_EQUAL, ' world.']]
 * which means: delete 'Hello', add 'Goodbye' and keep ' world.'
 */
var DIFF_DELETE = -1;
var DIFF_INSERT = 1;
var DIFF_EQUAL = 0;

/**
 * Find the differences between two texts.  Simplifies the problem by stripping
 * any common prefix or suffix off the texts before diffing.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {Int|Object} [cursor_pos] Edit position in text1 or object with more info
 * @param {boolean} [cleanup] Apply semantic cleanup before returning.
 * @return {Array} Array of diff tuples.
 */
function diff_main(text1, text2, cursor_pos, cleanup, _fix_unicode) {
  // Check for equality
  if (text1 === text2) {
    if (text1) {
      return [[DIFF_EQUAL, text1]];
    }
    return [];
  }
  if (cursor_pos != null) {
    var editdiff = find_cursor_edit_diff(text1, text2, cursor_pos);
    if (editdiff) {
      return editdiff;
    }
  }

  // Trim off common prefix (speedup).
  var commonlength = diff_commonPrefix(text1, text2);
  var commonprefix = text1.substring(0, commonlength);
  text1 = text1.substring(commonlength);
  text2 = text2.substring(commonlength);

  // Trim off common suffix (speedup).
  commonlength = diff_commonSuffix(text1, text2);
  var commonsuffix = text1.substring(text1.length - commonlength);
  text1 = text1.substring(0, text1.length - commonlength);
  text2 = text2.substring(0, text2.length - commonlength);

  // Compute the diff on the middle block.
  var diffs = diff_compute_(text1, text2);

  // Restore the prefix and suffix.
  if (commonprefix) {
    diffs.unshift([DIFF_EQUAL, commonprefix]);
  }
  if (commonsuffix) {
    diffs.push([DIFF_EQUAL, commonsuffix]);
  }
  diff_cleanupMerge(diffs, _fix_unicode);
  if (cleanup) {
    diff_cleanupSemantic(diffs);
  }
  return diffs;
}

/**
 * Find the differences between two texts.  Assumes that the texts do not
 * have any common prefix or suffix.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @return {Array} Array of diff tuples.
 */
function diff_compute_(text1, text2) {
  var diffs;
  if (!text1) {
    // Just add some text (speedup).
    return [[DIFF_INSERT, text2]];
  }
  if (!text2) {
    // Just delete some text (speedup).
    return [[DIFF_DELETE, text1]];
  }
  var longtext = text1.length > text2.length ? text1 : text2;
  var shorttext = text1.length > text2.length ? text2 : text1;
  var i = longtext.indexOf(shorttext);
  if (i !== -1) {
    // Shorter text is inside the longer text (speedup).
    diffs = [[DIFF_INSERT, longtext.substring(0, i)], [DIFF_EQUAL, shorttext], [DIFF_INSERT, longtext.substring(i + shorttext.length)]];
    // Swap insertions for deletions if diff is reversed.
    if (text1.length > text2.length) {
      diffs[0][0] = diffs[2][0] = DIFF_DELETE;
    }
    return diffs;
  }
  if (shorttext.length === 1) {
    // Single character string.
    // After the previous speedup, the character can't be an equality.
    return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
  }

  // Check to see if the problem can be split in two.
  var hm = diff_halfMatch_(text1, text2);
  if (hm) {
    // A half-match was found, sort out the return data.
    var text1_a = hm[0];
    var text1_b = hm[1];
    var text2_a = hm[2];
    var text2_b = hm[3];
    var mid_common = hm[4];
    // Send both pairs off for separate processing.
    var diffs_a = diff_main(text1_a, text2_a);
    var diffs_b = diff_main(text1_b, text2_b);
    // Merge the results.
    return diffs_a.concat([[DIFF_EQUAL, mid_common]], diffs_b);
  }
  return diff_bisect_(text1, text2);
}

/**
 * Find the 'middle snake' of a diff, split the problem in two
 * and return the recursively constructed diff.
 * See Myers 1986 paper: An O(ND) Difference Algorithm and Its Variations.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @return {Array} Array of diff tuples.
 * @private
 */
function diff_bisect_(text1, text2) {
  // Cache the text lengths to prevent multiple calls.
  var text1_length = text1.length;
  var text2_length = text2.length;
  var max_d = Math.ceil((text1_length + text2_length) / 2);
  var v_offset = max_d;
  var v_length = 2 * max_d;
  var v1 = new Array(v_length);
  var v2 = new Array(v_length);
  // Setting all elements to -1 is faster in Chrome & Firefox than mixing
  // integers and undefined.
  for (var x = 0; x < v_length; x++) {
    v1[x] = -1;
    v2[x] = -1;
  }
  v1[v_offset + 1] = 0;
  v2[v_offset + 1] = 0;
  var delta = text1_length - text2_length;
  // If the total number of characters is odd, then the front path will collide
  // with the reverse path.
  var front = delta % 2 !== 0;
  // Offsets for start and end of k loop.
  // Prevents mapping of space beyond the grid.
  var k1start = 0;
  var k1end = 0;
  var k2start = 0;
  var k2end = 0;
  for (var d = 0; d < max_d; d++) {
    // Walk the front path one step.
    for (var k1 = -d + k1start; k1 <= d - k1end; k1 += 2) {
      var k1_offset = v_offset + k1;
      var x1;
      if (k1 === -d || k1 !== d && v1[k1_offset - 1] < v1[k1_offset + 1]) {
        x1 = v1[k1_offset + 1];
      } else {
        x1 = v1[k1_offset - 1] + 1;
      }
      var y1 = x1 - k1;
      while (x1 < text1_length && y1 < text2_length && text1.charAt(x1) === text2.charAt(y1)) {
        x1++;
        y1++;
      }
      v1[k1_offset] = x1;
      if (x1 > text1_length) {
        // Ran off the right of the graph.
        k1end += 2;
      } else if (y1 > text2_length) {
        // Ran off the bottom of the graph.
        k1start += 2;
      } else if (front) {
        var k2_offset = v_offset + delta - k1;
        if (k2_offset >= 0 && k2_offset < v_length && v2[k2_offset] !== -1) {
          // Mirror x2 onto top-left coordinate system.
          var x2 = text1_length - v2[k2_offset];
          if (x1 >= x2) {
            // Overlap detected.
            return diff_bisectSplit_(text1, text2, x1, y1);
          }
        }
      }
    }

    // Walk the reverse path one step.
    for (var k2 = -d + k2start; k2 <= d - k2end; k2 += 2) {
      var k2_offset = v_offset + k2;
      var x2;
      if (k2 === -d || k2 !== d && v2[k2_offset - 1] < v2[k2_offset + 1]) {
        x2 = v2[k2_offset + 1];
      } else {
        x2 = v2[k2_offset - 1] + 1;
      }
      var y2 = x2 - k2;
      while (x2 < text1_length && y2 < text2_length && text1.charAt(text1_length - x2 - 1) === text2.charAt(text2_length - y2 - 1)) {
        x2++;
        y2++;
      }
      v2[k2_offset] = x2;
      if (x2 > text1_length) {
        // Ran off the left of the graph.
        k2end += 2;
      } else if (y2 > text2_length) {
        // Ran off the top of the graph.
        k2start += 2;
      } else if (!front) {
        var k1_offset = v_offset + delta - k2;
        if (k1_offset >= 0 && k1_offset < v_length && v1[k1_offset] !== -1) {
          var x1 = v1[k1_offset];
          var y1 = v_offset + x1 - k1_offset;
          // Mirror x2 onto top-left coordinate system.
          x2 = text1_length - x2;
          if (x1 >= x2) {
            // Overlap detected.
            return diff_bisectSplit_(text1, text2, x1, y1);
          }
        }
      }
    }
  }
  // Diff took too long and hit the deadline or
  // number of diffs equals number of characters, no commonality at all.
  return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
}

/**
 * Given the location of the 'middle snake', split the diff in two parts
 * and recurse.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {number} x Index of split point in text1.
 * @param {number} y Index of split point in text2.
 * @return {Array} Array of diff tuples.
 */
function diff_bisectSplit_(text1, text2, x, y) {
  var text1a = text1.substring(0, x);
  var text2a = text2.substring(0, y);
  var text1b = text1.substring(x);
  var text2b = text2.substring(y);

  // Compute both diffs serially.
  var diffs = diff_main(text1a, text2a);
  var diffsb = diff_main(text1b, text2b);
  return diffs.concat(diffsb);
}

/**
 * Determine the common prefix of two strings.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {number} The number of characters common to the start of each
 *     string.
 */
function diff_commonPrefix(text1, text2) {
  // Quick check for common null cases.
  if (!text1 || !text2 || text1.charAt(0) !== text2.charAt(0)) {
    return 0;
  }
  // Binary search.
  // Performance analysis: http://neil.fraser.name/news/2007/10/09/
  var pointermin = 0;
  var pointermax = Math.min(text1.length, text2.length);
  var pointermid = pointermax;
  var pointerstart = 0;
  while (pointermin < pointermid) {
    if (text1.substring(pointerstart, pointermid) == text2.substring(pointerstart, pointermid)) {
      pointermin = pointermid;
      pointerstart = pointermin;
    } else {
      pointermax = pointermid;
    }
    pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
  }
  if (is_surrogate_pair_start(text1.charCodeAt(pointermid - 1))) {
    pointermid--;
  }
  return pointermid;
}

/**
 * Determine if the suffix of one string is the prefix of another.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {number} The number of characters common to the end of the first
 *     string and the start of the second string.
 * @private
 */
function diff_commonOverlap_(text1, text2) {
  // Cache the text lengths to prevent multiple calls.
  var text1_length = text1.length;
  var text2_length = text2.length;
  // Eliminate the null case.
  if (text1_length == 0 || text2_length == 0) {
    return 0;
  }
  // Truncate the longer string.
  if (text1_length > text2_length) {
    text1 = text1.substring(text1_length - text2_length);
  } else if (text1_length < text2_length) {
    text2 = text2.substring(0, text1_length);
  }
  var text_length = Math.min(text1_length, text2_length);
  // Quick check for the worst case.
  if (text1 == text2) {
    return text_length;
  }

  // Start by looking for a single character match
  // and increase length until no match is found.
  // Performance analysis: http://neil.fraser.name/news/2010/11/04/
  var best = 0;
  var length = 1;
  while (true) {
    var pattern = text1.substring(text_length - length);
    var found = text2.indexOf(pattern);
    if (found == -1) {
      return best;
    }
    length += found;
    if (found == 0 || text1.substring(text_length - length) == text2.substring(0, length)) {
      best = length;
      length++;
    }
  }
}

/**
 * Determine the common suffix of two strings.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {number} The number of characters common to the end of each string.
 */
function diff_commonSuffix(text1, text2) {
  // Quick check for common null cases.
  if (!text1 || !text2 || text1.slice(-1) !== text2.slice(-1)) {
    return 0;
  }
  // Binary search.
  // Performance analysis: http://neil.fraser.name/news/2007/10/09/
  var pointermin = 0;
  var pointermax = Math.min(text1.length, text2.length);
  var pointermid = pointermax;
  var pointerend = 0;
  while (pointermin < pointermid) {
    if (text1.substring(text1.length - pointermid, text1.length - pointerend) == text2.substring(text2.length - pointermid, text2.length - pointerend)) {
      pointermin = pointermid;
      pointerend = pointermin;
    } else {
      pointermax = pointermid;
    }
    pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
  }
  if (is_surrogate_pair_end(text1.charCodeAt(text1.length - pointermid))) {
    pointermid--;
  }
  return pointermid;
}

/**
 * Do the two texts share a substring which is at least half the length of the
 * longer text?
 * This speedup can produce non-minimal diffs.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {Array.<string>} Five element Array, containing the prefix of
 *     text1, the suffix of text1, the prefix of text2, the suffix of
 *     text2 and the common middle.  Or null if there was no match.
 */
function diff_halfMatch_(text1, text2) {
  var longtext = text1.length > text2.length ? text1 : text2;
  var shorttext = text1.length > text2.length ? text2 : text1;
  if (longtext.length < 4 || shorttext.length * 2 < longtext.length) {
    return null; // Pointless.
  }

  /**
   * Does a substring of shorttext exist within longtext such that the substring
   * is at least half the length of longtext?
   * Closure, but does not reference any external variables.
   * @param {string} longtext Longer string.
   * @param {string} shorttext Shorter string.
   * @param {number} i Start index of quarter length substring within longtext.
   * @return {Array.<string>} Five element Array, containing the prefix of
   *     longtext, the suffix of longtext, the prefix of shorttext, the suffix
   *     of shorttext and the common middle.  Or null if there was no match.
   * @private
   */
  function diff_halfMatchI_(longtext, shorttext, i) {
    // Start with a 1/4 length substring at position i as a seed.
    var seed = longtext.substring(i, i + Math.floor(longtext.length / 4));
    var j = -1;
    var best_common = "";
    var best_longtext_a, best_longtext_b, best_shorttext_a, best_shorttext_b;
    while ((j = shorttext.indexOf(seed, j + 1)) !== -1) {
      var prefixLength = diff_commonPrefix(longtext.substring(i), shorttext.substring(j));
      var suffixLength = diff_commonSuffix(longtext.substring(0, i), shorttext.substring(0, j));
      if (best_common.length < suffixLength + prefixLength) {
        best_common = shorttext.substring(j - suffixLength, j) + shorttext.substring(j, j + prefixLength);
        best_longtext_a = longtext.substring(0, i - suffixLength);
        best_longtext_b = longtext.substring(i + prefixLength);
        best_shorttext_a = shorttext.substring(0, j - suffixLength);
        best_shorttext_b = shorttext.substring(j + prefixLength);
      }
    }
    if (best_common.length * 2 >= longtext.length) {
      return [best_longtext_a, best_longtext_b, best_shorttext_a, best_shorttext_b, best_common];
    } else {
      return null;
    }
  }

  // First check if the second quarter is the seed for a half-match.
  var hm1 = diff_halfMatchI_(longtext, shorttext, Math.ceil(longtext.length / 4));
  // Check again based on the third quarter.
  var hm2 = diff_halfMatchI_(longtext, shorttext, Math.ceil(longtext.length / 2));
  var hm;
  if (!hm1 && !hm2) {
    return null;
  } else if (!hm2) {
    hm = hm1;
  } else if (!hm1) {
    hm = hm2;
  } else {
    // Both matched.  Select the longest.
    hm = hm1[4].length > hm2[4].length ? hm1 : hm2;
  }

  // A half-match was found, sort out the return data.
  var text1_a, text1_b, text2_a, text2_b;
  if (text1.length > text2.length) {
    text1_a = hm[0];
    text1_b = hm[1];
    text2_a = hm[2];
    text2_b = hm[3];
  } else {
    text2_a = hm[0];
    text2_b = hm[1];
    text1_a = hm[2];
    text1_b = hm[3];
  }
  var mid_common = hm[4];
  return [text1_a, text1_b, text2_a, text2_b, mid_common];
}

/**
 * Reduce the number of edits by eliminating semantically trivial equalities.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 */
function diff_cleanupSemantic(diffs) {
  var changes = false;
  var equalities = []; // Stack of indices where equalities are found.
  var equalitiesLength = 0; // Keeping our own length var is faster in JS.
  /** @type {?string} */
  var lastequality = null;
  // Always equal to diffs[equalities[equalitiesLength - 1]][1]
  var pointer = 0; // Index of current position.
  // Number of characters that changed prior to the equality.
  var length_insertions1 = 0;
  var length_deletions1 = 0;
  // Number of characters that changed after the equality.
  var length_insertions2 = 0;
  var length_deletions2 = 0;
  while (pointer < diffs.length) {
    if (diffs[pointer][0] == DIFF_EQUAL) {
      // Equality found.
      equalities[equalitiesLength++] = pointer;
      length_insertions1 = length_insertions2;
      length_deletions1 = length_deletions2;
      length_insertions2 = 0;
      length_deletions2 = 0;
      lastequality = diffs[pointer][1];
    } else {
      // An insertion or deletion.
      if (diffs[pointer][0] == DIFF_INSERT) {
        length_insertions2 += diffs[pointer][1].length;
      } else {
        length_deletions2 += diffs[pointer][1].length;
      }
      // Eliminate an equality that is smaller or equal to the edits on both
      // sides of it.
      if (lastequality && lastequality.length <= Math.max(length_insertions1, length_deletions1) && lastequality.length <= Math.max(length_insertions2, length_deletions2)) {
        // Duplicate record.
        diffs.splice(equalities[equalitiesLength - 1], 0, [DIFF_DELETE, lastequality]);
        // Change second copy to insert.
        diffs[equalities[equalitiesLength - 1] + 1][0] = DIFF_INSERT;
        // Throw away the equality we just deleted.
        equalitiesLength--;
        // Throw away the previous equality (it needs to be reevaluated).
        equalitiesLength--;
        pointer = equalitiesLength > 0 ? equalities[equalitiesLength - 1] : -1;
        length_insertions1 = 0; // Reset the counters.
        length_deletions1 = 0;
        length_insertions2 = 0;
        length_deletions2 = 0;
        lastequality = null;
        changes = true;
      }
    }
    pointer++;
  }

  // Normalize the diff.
  if (changes) {
    diff_cleanupMerge(diffs);
  }
  diff_cleanupSemanticLossless(diffs);

  // Find any overlaps between deletions and insertions.
  // e.g: <del>abcxxx</del><ins>xxxdef</ins>
  //   -> <del>abc</del>xxx<ins>def</ins>
  // e.g: <del>xxxabc</del><ins>defxxx</ins>
  //   -> <ins>def</ins>xxx<del>abc</del>
  // Only extract an overlap if it is as big as the edit ahead or behind it.
  pointer = 1;
  while (pointer < diffs.length) {
    if (diffs[pointer - 1][0] == DIFF_DELETE && diffs[pointer][0] == DIFF_INSERT) {
      var deletion = diffs[pointer - 1][1];
      var insertion = diffs[pointer][1];
      var overlap_length1 = diff_commonOverlap_(deletion, insertion);
      var overlap_length2 = diff_commonOverlap_(insertion, deletion);
      if (overlap_length1 >= overlap_length2) {
        if (overlap_length1 >= deletion.length / 2 || overlap_length1 >= insertion.length / 2) {
          // Overlap found.  Insert an equality and trim the surrounding edits.
          diffs.splice(pointer, 0, [DIFF_EQUAL, insertion.substring(0, overlap_length1)]);
          diffs[pointer - 1][1] = deletion.substring(0, deletion.length - overlap_length1);
          diffs[pointer + 1][1] = insertion.substring(overlap_length1);
          pointer++;
        }
      } else {
        if (overlap_length2 >= deletion.length / 2 || overlap_length2 >= insertion.length / 2) {
          // Reverse overlap found.
          // Insert an equality and swap and trim the surrounding edits.
          diffs.splice(pointer, 0, [DIFF_EQUAL, deletion.substring(0, overlap_length2)]);
          diffs[pointer - 1][0] = DIFF_INSERT;
          diffs[pointer - 1][1] = insertion.substring(0, insertion.length - overlap_length2);
          diffs[pointer + 1][0] = DIFF_DELETE;
          diffs[pointer + 1][1] = deletion.substring(overlap_length2);
          pointer++;
        }
      }
      pointer++;
    }
    pointer++;
  }
}
var nonAlphaNumericRegex_ = /[^a-zA-Z0-9]/;
var whitespaceRegex_ = /\s/;
var linebreakRegex_ = /[\r\n]/;
var blanklineEndRegex_ = /\n\r?\n$/;
var blanklineStartRegex_ = /^\r?\n\r?\n/;

/**
 * Look for single edits surrounded on both sides by equalities
 * which can be shifted sideways to align the edit to a word boundary.
 * e.g: The c<ins>at c</ins>ame. -> The <ins>cat </ins>came.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 */
function diff_cleanupSemanticLossless(diffs) {
  /**
   * Given two strings, compute a score representing whether the internal
   * boundary falls on logical boundaries.
   * Scores range from 6 (best) to 0 (worst).
   * Closure, but does not reference any external variables.
   * @param {string} one First string.
   * @param {string} two Second string.
   * @return {number} The score.
   * @private
   */
  function diff_cleanupSemanticScore_(one, two) {
    if (!one || !two) {
      // Edges are the best.
      return 6;
    }

    // Each port of this function behaves slightly differently due to
    // subtle differences in each language's definition of things like
    // 'whitespace'.  Since this function's purpose is largely cosmetic,
    // the choice has been made to use each language's native features
    // rather than force total conformity.
    var char1 = one.charAt(one.length - 1);
    var char2 = two.charAt(0);
    var nonAlphaNumeric1 = char1.match(nonAlphaNumericRegex_);
    var nonAlphaNumeric2 = char2.match(nonAlphaNumericRegex_);
    var whitespace1 = nonAlphaNumeric1 && char1.match(whitespaceRegex_);
    var whitespace2 = nonAlphaNumeric2 && char2.match(whitespaceRegex_);
    var lineBreak1 = whitespace1 && char1.match(linebreakRegex_);
    var lineBreak2 = whitespace2 && char2.match(linebreakRegex_);
    var blankLine1 = lineBreak1 && one.match(blanklineEndRegex_);
    var blankLine2 = lineBreak2 && two.match(blanklineStartRegex_);
    if (blankLine1 || blankLine2) {
      // Five points for blank lines.
      return 5;
    } else if (lineBreak1 || lineBreak2) {
      // Four points for line breaks.
      return 4;
    } else if (nonAlphaNumeric1 && !whitespace1 && whitespace2) {
      // Three points for end of sentences.
      return 3;
    } else if (whitespace1 || whitespace2) {
      // Two points for whitespace.
      return 2;
    } else if (nonAlphaNumeric1 || nonAlphaNumeric2) {
      // One point for non-alphanumeric.
      return 1;
    }
    return 0;
  }
  var pointer = 1;
  // Intentionally ignore the first and last element (don't need checking).
  while (pointer < diffs.length - 1) {
    if (diffs[pointer - 1][0] == DIFF_EQUAL && diffs[pointer + 1][0] == DIFF_EQUAL) {
      // This is a single edit surrounded by equalities.
      var equality1 = diffs[pointer - 1][1];
      var edit = diffs[pointer][1];
      var equality2 = diffs[pointer + 1][1];

      // First, shift the edit as far left as possible.
      var commonOffset = diff_commonSuffix(equality1, edit);
      if (commonOffset) {
        var commonString = edit.substring(edit.length - commonOffset);
        equality1 = equality1.substring(0, equality1.length - commonOffset);
        edit = commonString + edit.substring(0, edit.length - commonOffset);
        equality2 = commonString + equality2;
      }

      // Second, step character by character right, looking for the best fit.
      var bestEquality1 = equality1;
      var bestEdit = edit;
      var bestEquality2 = equality2;
      var bestScore = diff_cleanupSemanticScore_(equality1, edit) + diff_cleanupSemanticScore_(edit, equality2);
      while (edit.charAt(0) === equality2.charAt(0)) {
        equality1 += edit.charAt(0);
        edit = edit.substring(1) + equality2.charAt(0);
        equality2 = equality2.substring(1);
        var score = diff_cleanupSemanticScore_(equality1, edit) + diff_cleanupSemanticScore_(edit, equality2);
        // The >= encourages trailing rather than leading whitespace on edits.
        if (score >= bestScore) {
          bestScore = score;
          bestEquality1 = equality1;
          bestEdit = edit;
          bestEquality2 = equality2;
        }
      }
      if (diffs[pointer - 1][1] != bestEquality1) {
        // We have an improvement, save it back to the diff.
        if (bestEquality1) {
          diffs[pointer - 1][1] = bestEquality1;
        } else {
          diffs.splice(pointer - 1, 1);
          pointer--;
        }
        diffs[pointer][1] = bestEdit;
        if (bestEquality2) {
          diffs[pointer + 1][1] = bestEquality2;
        } else {
          diffs.splice(pointer + 1, 1);
          pointer--;
        }
      }
    }
    pointer++;
  }
}

/**
 * Reorder and merge like edit sections.  Merge equalities.
 * Any edit section can move as long as it doesn't cross an equality.
 * @param {Array} diffs Array of diff tuples.
 * @param {boolean} fix_unicode Whether to normalize to a unicode-correct diff
 */
function diff_cleanupMerge(diffs, fix_unicode) {
  diffs.push([DIFF_EQUAL, ""]); // Add a dummy entry at the end.
  var pointer = 0;
  var count_delete = 0;
  var count_insert = 0;
  var text_delete = "";
  var text_insert = "";
  var commonlength;
  while (pointer < diffs.length) {
    if (pointer < diffs.length - 1 && !diffs[pointer][1]) {
      diffs.splice(pointer, 1);
      continue;
    }
    switch (diffs[pointer][0]) {
      case DIFF_INSERT:
        count_insert++;
        text_insert += diffs[pointer][1];
        pointer++;
        break;
      case DIFF_DELETE:
        count_delete++;
        text_delete += diffs[pointer][1];
        pointer++;
        break;
      case DIFF_EQUAL:
        var previous_equality = pointer - count_insert - count_delete - 1;
        if (fix_unicode) {
          // prevent splitting of unicode surrogate pairs.  when fix_unicode is true,
          // we assume that the old and new text in the diff are complete and correct
          // unicode-encoded JS strings, but the tuple boundaries may fall between
          // surrogate pairs.  we fix this by shaving off stray surrogates from the end
          // of the previous equality and the beginning of this equality.  this may create
          // empty equalities or a common prefix or suffix.  for example, if AB and AC are
          // emojis, `[[0, 'A'], [-1, 'BA'], [0, 'C']]` would turn into deleting 'ABAC' and
          // inserting 'AC', and then the common suffix 'AC' will be eliminated.  in this
          // particular case, both equalities go away, we absorb any previous inequalities,
          // and we keep scanning for the next equality before rewriting the tuples.
          if (previous_equality >= 0 && ends_with_pair_start(diffs[previous_equality][1])) {
            var stray = diffs[previous_equality][1].slice(-1);
            diffs[previous_equality][1] = diffs[previous_equality][1].slice(0, -1);
            text_delete = stray + text_delete;
            text_insert = stray + text_insert;
            if (!diffs[previous_equality][1]) {
              // emptied out previous equality, so delete it and include previous delete/insert
              diffs.splice(previous_equality, 1);
              pointer--;
              var k = previous_equality - 1;
              if (diffs[k] && diffs[k][0] === DIFF_INSERT) {
                count_insert++;
                text_insert = diffs[k][1] + text_insert;
                k--;
              }
              if (diffs[k] && diffs[k][0] === DIFF_DELETE) {
                count_delete++;
                text_delete = diffs[k][1] + text_delete;
                k--;
              }
              previous_equality = k;
            }
          }
          if (starts_with_pair_end(diffs[pointer][1])) {
            var stray = diffs[pointer][1].charAt(0);
            diffs[pointer][1] = diffs[pointer][1].slice(1);
            text_delete += stray;
            text_insert += stray;
          }
        }
        if (pointer < diffs.length - 1 && !diffs[pointer][1]) {
          // for empty equality not at end, wait for next equality
          diffs.splice(pointer, 1);
          break;
        }
        if (text_delete.length > 0 || text_insert.length > 0) {
          // note that diff_commonPrefix and diff_commonSuffix are unicode-aware
          if (text_delete.length > 0 && text_insert.length > 0) {
            // Factor out any common prefixes.
            commonlength = diff_commonPrefix(text_insert, text_delete);
            if (commonlength !== 0) {
              if (previous_equality >= 0) {
                diffs[previous_equality][1] += text_insert.substring(0, commonlength);
              } else {
                diffs.splice(0, 0, [DIFF_EQUAL, text_insert.substring(0, commonlength)]);
                pointer++;
              }
              text_insert = text_insert.substring(commonlength);
              text_delete = text_delete.substring(commonlength);
            }
            // Factor out any common suffixes.
            commonlength = diff_commonSuffix(text_insert, text_delete);
            if (commonlength !== 0) {
              diffs[pointer][1] = text_insert.substring(text_insert.length - commonlength) + diffs[pointer][1];
              text_insert = text_insert.substring(0, text_insert.length - commonlength);
              text_delete = text_delete.substring(0, text_delete.length - commonlength);
            }
          }
          // Delete the offending records and add the merged ones.
          var n = count_insert + count_delete;
          if (text_delete.length === 0 && text_insert.length === 0) {
            diffs.splice(pointer - n, n);
            pointer = pointer - n;
          } else if (text_delete.length === 0) {
            diffs.splice(pointer - n, n, [DIFF_INSERT, text_insert]);
            pointer = pointer - n + 1;
          } else if (text_insert.length === 0) {
            diffs.splice(pointer - n, n, [DIFF_DELETE, text_delete]);
            pointer = pointer - n + 1;
          } else {
            diffs.splice(pointer - n, n, [DIFF_DELETE, text_delete], [DIFF_INSERT, text_insert]);
            pointer = pointer - n + 2;
          }
        }
        if (pointer !== 0 && diffs[pointer - 1][0] === DIFF_EQUAL) {
          // Merge this equality with the previous one.
          diffs[pointer - 1][1] += diffs[pointer][1];
          diffs.splice(pointer, 1);
        } else {
          pointer++;
        }
        count_insert = 0;
        count_delete = 0;
        text_delete = "";
        text_insert = "";
        break;
    }
  }
  if (diffs[diffs.length - 1][1] === "") {
    diffs.pop(); // Remove the dummy entry at the end.
  }

  // Second pass: look for single edits surrounded on both sides by equalities
  // which can be shifted sideways to eliminate an equality.
  // e.g: A<ins>BA</ins>C -> <ins>AB</ins>AC
  var changes = false;
  pointer = 1;
  // Intentionally ignore the first and last element (don't need checking).
  while (pointer < diffs.length - 1) {
    if (diffs[pointer - 1][0] === DIFF_EQUAL && diffs[pointer + 1][0] === DIFF_EQUAL) {
      // This is a single edit surrounded by equalities.
      if (diffs[pointer][1].substring(diffs[pointer][1].length - diffs[pointer - 1][1].length) === diffs[pointer - 1][1]) {
        // Shift the edit over the previous equality.
        diffs[pointer][1] = diffs[pointer - 1][1] + diffs[pointer][1].substring(0, diffs[pointer][1].length - diffs[pointer - 1][1].length);
        diffs[pointer + 1][1] = diffs[pointer - 1][1] + diffs[pointer + 1][1];
        diffs.splice(pointer - 1, 1);
        changes = true;
      } else if (diffs[pointer][1].substring(0, diffs[pointer + 1][1].length) == diffs[pointer + 1][1]) {
        // Shift the edit over the next equality.
        diffs[pointer - 1][1] += diffs[pointer + 1][1];
        diffs[pointer][1] = diffs[pointer][1].substring(diffs[pointer + 1][1].length) + diffs[pointer + 1][1];
        diffs.splice(pointer + 1, 1);
        changes = true;
      }
    }
    pointer++;
  }
  // If shifts were made, the diff needs reordering and another shift sweep.
  if (changes) {
    diff_cleanupMerge(diffs, fix_unicode);
  }
}
function is_surrogate_pair_start(charCode) {
  return charCode >= 0xd800 && charCode <= 0xdbff;
}
function is_surrogate_pair_end(charCode) {
  return charCode >= 0xdc00 && charCode <= 0xdfff;
}
function starts_with_pair_end(str) {
  return is_surrogate_pair_end(str.charCodeAt(0));
}
function ends_with_pair_start(str) {
  return is_surrogate_pair_start(str.charCodeAt(str.length - 1));
}
function remove_empty_tuples(tuples) {
  var ret = [];
  for (var i = 0; i < tuples.length; i++) {
    if (tuples[i][1].length > 0) {
      ret.push(tuples[i]);
    }
  }
  return ret;
}
function make_edit_splice(before, oldMiddle, newMiddle, after) {
  if (ends_with_pair_start(before) || starts_with_pair_end(after)) {
    return null;
  }
  return remove_empty_tuples([[DIFF_EQUAL, before], [DIFF_DELETE, oldMiddle], [DIFF_INSERT, newMiddle], [DIFF_EQUAL, after]]);
}
function find_cursor_edit_diff(oldText, newText, cursor_pos) {
  // note: this runs after equality check has ruled out exact equality
  var oldRange = typeof cursor_pos === "number" ? {
    index: cursor_pos,
    length: 0
  } : cursor_pos.oldRange;
  var newRange = typeof cursor_pos === "number" ? null : cursor_pos.newRange;
  // take into account the old and new selection to generate the best diff
  // possible for a text edit.  for example, a text change from "xxx" to "xx"
  // could be a delete or forwards-delete of any one of the x's, or the
  // result of selecting two of the x's and typing "x".
  var oldLength = oldText.length;
  var newLength = newText.length;
  if (oldRange.length === 0 && (newRange === null || newRange.length === 0)) {
    // see if we have an insert or delete before or after cursor
    var oldCursor = oldRange.index;
    var oldBefore = oldText.slice(0, oldCursor);
    var oldAfter = oldText.slice(oldCursor);
    var maybeNewCursor = newRange ? newRange.index : null;
    editBefore: {
      // is this an insert or delete right before oldCursor?
      var newCursor = oldCursor + newLength - oldLength;
      if (maybeNewCursor !== null && maybeNewCursor !== newCursor) {
        break editBefore;
      }
      if (newCursor < 0 || newCursor > newLength) {
        break editBefore;
      }
      var newBefore = newText.slice(0, newCursor);
      var newAfter = newText.slice(newCursor);
      if (newAfter !== oldAfter) {
        break editBefore;
      }
      var prefixLength = Math.min(oldCursor, newCursor);
      var oldPrefix = oldBefore.slice(0, prefixLength);
      var newPrefix = newBefore.slice(0, prefixLength);
      if (oldPrefix !== newPrefix) {
        break editBefore;
      }
      var oldMiddle = oldBefore.slice(prefixLength);
      var newMiddle = newBefore.slice(prefixLength);
      return make_edit_splice(oldPrefix, oldMiddle, newMiddle, oldAfter);
    }
    editAfter: {
      // is this an insert or delete right after oldCursor?
      if (maybeNewCursor !== null && maybeNewCursor !== oldCursor) {
        break editAfter;
      }
      var cursor = oldCursor;
      var newBefore = newText.slice(0, cursor);
      var newAfter = newText.slice(cursor);
      if (newBefore !== oldBefore) {
        break editAfter;
      }
      var suffixLength = Math.min(oldLength - cursor, newLength - cursor);
      var oldSuffix = oldAfter.slice(oldAfter.length - suffixLength);
      var newSuffix = newAfter.slice(newAfter.length - suffixLength);
      if (oldSuffix !== newSuffix) {
        break editAfter;
      }
      var oldMiddle = oldAfter.slice(0, oldAfter.length - suffixLength);
      var newMiddle = newAfter.slice(0, newAfter.length - suffixLength);
      return make_edit_splice(oldBefore, oldMiddle, newMiddle, oldSuffix);
    }
  }
  if (oldRange.length > 0 && newRange && newRange.length === 0) {
    replaceRange: {
      // see if diff could be a splice of the old selection range
      var oldPrefix = oldText.slice(0, oldRange.index);
      var oldSuffix = oldText.slice(oldRange.index + oldRange.length);
      var prefixLength = oldPrefix.length;
      var suffixLength = oldSuffix.length;
      if (newLength < prefixLength + suffixLength) {
        break replaceRange;
      }
      var newPrefix = newText.slice(0, prefixLength);
      var newSuffix = newText.slice(newLength - suffixLength);
      if (oldPrefix !== newPrefix || oldSuffix !== newSuffix) {
        break replaceRange;
      }
      var oldMiddle = oldText.slice(prefixLength, oldLength - suffixLength);
      var newMiddle = newText.slice(prefixLength, newLength - suffixLength);
      return make_edit_splice(oldPrefix, oldMiddle, newMiddle, oldSuffix);
    }
  }
  return null;
}
function diff(text1, text2, cursor_pos, cleanup) {
  // only pass fix_unicode=true at the top level, not when diff_main is
  // recursively invoked
  return diff_main(text1, text2, cursor_pos, cleanup, true);
}
diff.INSERT = DIFF_INSERT;
diff.DELETE = DIFF_DELETE;
diff.EQUAL = DIFF_EQUAL;
module.exports = diff;

/***/ }),

/***/ "./node_modules/lodash.clonedeep/index.js":
/*!************************************************!*\
  !*** ./node_modules/lodash.clonedeep/index.js ***!
  \************************************************/
/***/ ((module, exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
  arrayTag = '[object Array]',
  boolTag = '[object Boolean]',
  dateTag = '[object Date]',
  errorTag = '[object Error]',
  funcTag = '[object Function]',
  genTag = '[object GeneratorFunction]',
  mapTag = '[object Map]',
  numberTag = '[object Number]',
  objectTag = '[object Object]',
  promiseTag = '[object Promise]',
  regexpTag = '[object RegExp]',
  setTag = '[object Set]',
  stringTag = '[object String]',
  symbolTag = '[object Symbol]',
  weakMapTag = '[object WeakMap]';
var arrayBufferTag = '[object ArrayBuffer]',
  dataViewTag = '[object DataView]',
  float32Tag = '[object Float32Array]',
  float64Tag = '[object Float64Array]',
  int8Tag = '[object Int8Array]',
  int16Tag = '[object Int16Array]',
  int32Tag = '[object Int32Array]',
  uint8Tag = '[object Uint8Array]',
  uint8ClampedTag = '[object Uint8ClampedArray]',
  uint16Tag = '[object Uint16Array]',
  uint32Tag = '[object Uint32Array]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof __webpack_require__.g == 'object' && __webpack_require__.g && __webpack_require__.g.Object === Object && __webpack_require__.g;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && "object" == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/**
 * Adds the key-value `pair` to `map`.
 *
 * @private
 * @param {Object} map The map to modify.
 * @param {Array} pair The key-value pair to add.
 * @returns {Object} Returns `map`.
 */
function addMapEntry(map, pair) {
  // Don't return `map.set` because it's not chainable in IE 11.
  map.set(pair[0], pair[1]);
  return map;
}

/**
 * Adds `value` to `set`.
 *
 * @private
 * @param {Object} set The set to modify.
 * @param {*} value The value to add.
 * @returns {Object} Returns `set`.
 */
function addSetEntry(set, value) {
  // Don't return `set.add` because it's not chainable in IE 11.
  set.add(value);
  return set;
}

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
    length = array ? array.length : 0;
  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
    length = values.length,
    offset = array.length;
  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
    length = array ? array.length : 0;
  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
    result = Array(n);
  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
    result = Array(map.size);
  map.forEach(function (value, key) {
    result[++index] = [key, value];
  });
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function (arg) {
    return func(transform(arg));
  };
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
    result = Array(set.size);
  set.forEach(function (value) {
    result[++index] = value;
  });
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
  funcProto = Function.prototype,
  objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = function () {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? 'Symbol(src)_1.' + uid : '';
}();

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' + funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
  Symbol = root.Symbol,
  Uint8Array = root.Uint8Array,
  getPrototype = overArg(Object.getPrototypeOf, Object),
  objectCreate = Object.create,
  propertyIsEnumerable = objectProto.propertyIsEnumerable,
  splice = arrayProto.splice;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols,
  nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
  nativeKeys = overArg(Object.keys, Object);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView'),
  Map = getNative(root, 'Map'),
  Promise = getNative(root, 'Promise'),
  Set = getNative(root, 'Set'),
  WeakMap = getNative(root, 'WeakMap'),
  nativeCreate = getNative(Object, 'create');

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
  mapCtorString = toSource(Map),
  promiseCtorString = toSource(Promise),
  setCtorString = toSource(Set),
  weakMapCtorString = toSource(WeakMap);

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
  symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
    length = entries ? entries.length : 0;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = nativeCreate && value === undefined ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
    length = entries ? entries.length : 0;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
    index = assocIndexOf(data, key);
  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
    index = assocIndexOf(data, key);
  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
    index = assocIndexOf(data, key);
  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
    length = entries ? entries.length : 0;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash(),
    'map': new (Map || ListCache)(),
    'string': new Hash()
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  this.__data__ = new ListCache(entries);
}

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache();
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  return this.__data__['delete'](key);
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var cache = this.__data__;
  if (cache instanceof ListCache) {
    var pairs = cache.__data__;
    if (!Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
      pairs.push([key, value]);
      return this;
    }
    cache = this.__data__ = new MapCache(pairs);
  }
  cache.set(key, value);
  return this;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  // Safari 9 makes `arguments.length` enumerable in strict mode.
  var result = isArray(value) || isArguments(value) ? baseTimes(value.length, String) : [];
  var length = result.length,
    skipIndexes = !!length;
  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === undefined && !(key in object)) {
    object[key] = value;
  }
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @param {boolean} [isFull] Specify a clone including symbols.
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
  var result;
  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag(value),
      isFunc = tag == funcTag || tag == genTag;
    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || isFunc && !object) {
      if (isHostObject(value)) {
        return object ? value : {};
      }
      result = initCloneObject(isFunc ? {} : value);
      if (!isDeep) {
        return copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, baseClone, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack());
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);
  if (!isArr) {
    var props = isFull ? getAllKeys(value) : keys(value);
  }
  arrayEach(props || value, function (subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    assignValue(result, key, baseClone(subValue, isDeep, isFull, customizer, key, value, stack));
  });
  return result;
}

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} prototype The object to inherit from.
 * @returns {Object} Returns the new object.
 */
function baseCreate(proto) {
  return isObject(proto) ? objectCreate(proto) : {};
}

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

/**
 * The base implementation of `getTag`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  return objectToString.call(value);
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) || isHostObject(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var result = new buffer.constructor(buffer.length);
  buffer.copy(result);
  return result;
}

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

/**
 * Creates a clone of `map`.
 *
 * @private
 * @param {Object} map The map to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned map.
 */
function cloneMap(map, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(mapToArray(map), true) : mapToArray(map);
  return arrayReduce(array, addMapEntry, new map.constructor());
}

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

/**
 * Creates a clone of `set`.
 *
 * @private
 * @param {Object} set The set to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned set.
 */
function cloneSet(set, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(setToArray(set), true) : setToArray(set);
  return arrayReduce(array, addSetEntry, new set.constructor());
}

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
    length = source.length;
  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  object || (object = {});
  var index = -1,
    length = props.length;
  while (++index < length) {
    var key = props[index];
    var newValue = customizer ? customizer(object[key], source[key], key, object, source) : undefined;
    assignValue(object, key, newValue === undefined ? source[key] : newValue);
  }
  return object;
}

/**
 * Copies own symbol properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object);
}

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Creates an array of the own enumerable symbol properties of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = nativeGetSymbols ? overArg(nativeGetSymbols, Object) : stubArray;

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11,
// for data views in Edge < 14, and promises in Node.js.
if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map && getTag(new Map()) != mapTag || Promise && getTag(Promise.resolve()) != promiseTag || Set && getTag(new Set()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) {
  getTag = function getTag(value) {
    var result = objectToString.call(value),
      Ctor = result == objectTag ? value.constructor : undefined,
      ctorString = Ctor ? toSource(Ctor) : undefined;
    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString:
          return dataViewTag;
        case mapCtorString:
          return mapTag;
        case promiseCtorString:
          return promiseTag;
        case setCtorString:
          return setTag;
        case weakMapCtorString:
          return weakMapTag;
      }
    }
    return result;
  };
}

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
    result = array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return typeof object.constructor == 'function' && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
}

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, cloneFunc, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return cloneArrayBuffer(object);
    case boolTag:
    case dateTag:
      return new Ctor(+object);
    case dataViewTag:
      return cloneDataView(object, isDeep);
    case float32Tag:
    case float64Tag:
    case int8Tag:
    case int16Tag:
    case int32Tag:
    case uint8Tag:
    case uint8ClampedTag:
    case uint16Tag:
    case uint32Tag:
      return cloneTypedArray(object, isDeep);
    case mapTag:
      return cloneMap(object, isDeep, cloneFunc);
    case numberTag:
    case stringTag:
      return new Ctor(object);
    case regexpTag:
      return cloneRegExp(object);
    case setTag:
      return cloneSet(object, isDeep, cloneFunc);
    case symbolTag:
      return cloneSymbol(object);
  }
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length && (typeof value == 'number' || reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean' ? value !== '__proto__' : value === null;
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && maskSrcKey in func;
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
    proto = typeof Ctor == 'function' && Ctor.prototype || objectProto;
  return value === proto;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return func + '';
    } catch (e) {}
  }
  return '';
}

/**
 * This method is like `_.clone` except that it recursively clones `value`.
 *
 * @static
 * @memberOf _
 * @since 1.0.0
 * @category Lang
 * @param {*} value The value to recursively clone.
 * @returns {*} Returns the deep cloned value.
 * @see _.clone
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var deep = _.cloneDeep(objects);
 * console.log(deep[0] === objects[0]);
 * // => false
 */
function cloneDeep(value) {
  return baseClone(value, true, true);
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || value !== value && other !== other;
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') && (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}
module.exports = cloneDeep;

/***/ }),

/***/ "./node_modules/lodash.isequal/index.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash.isequal/index.js ***!
  \**********************************************/
/***/ ((module, exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);
/**
 * Lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright JS Foundation and other contributors <https://js.foundation/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
  COMPARE_UNORDERED_FLAG = 2;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
  arrayTag = '[object Array]',
  asyncTag = '[object AsyncFunction]',
  boolTag = '[object Boolean]',
  dateTag = '[object Date]',
  errorTag = '[object Error]',
  funcTag = '[object Function]',
  genTag = '[object GeneratorFunction]',
  mapTag = '[object Map]',
  numberTag = '[object Number]',
  nullTag = '[object Null]',
  objectTag = '[object Object]',
  promiseTag = '[object Promise]',
  proxyTag = '[object Proxy]',
  regexpTag = '[object RegExp]',
  setTag = '[object Set]',
  stringTag = '[object String]',
  symbolTag = '[object Symbol]',
  undefinedTag = '[object Undefined]',
  weakMapTag = '[object WeakMap]';
var arrayBufferTag = '[object ArrayBuffer]',
  dataViewTag = '[object DataView]',
  float32Tag = '[object Float32Array]',
  float64Tag = '[object Float64Array]',
  int8Tag = '[object Int8Array]',
  int16Tag = '[object Int16Array]',
  int32Tag = '[object Int32Array]',
  uint8Tag = '[object Uint8Array]',
  uint8ClampedTag = '[object Uint8ClampedArray]',
  uint16Tag = '[object Uint16Array]',
  uint32Tag = '[object Uint32Array]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof __webpack_require__.g == 'object' && __webpack_require__.g && __webpack_require__.g.Object === Object && __webpack_require__.g;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && "object" == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = function () {
  try {
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}();

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
    length = array == null ? 0 : array.length,
    resIndex = 0,
    result = [];
  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
    length = values.length,
    offset = array.length;
  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
    length = array == null ? 0 : array.length;
  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
    result = Array(n);
  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function (value) {
    return func(value);
  };
}

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
    result = Array(map.size);
  map.forEach(function (value, key) {
    result[++index] = [key, value];
  });
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function (arg) {
    return func(transform(arg));
  };
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
    result = Array(set.size);
  set.forEach(function (value) {
    result[++index] = value;
  });
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
  funcProto = Function.prototype,
  objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect methods masquerading as native. */
var maskSrcKey = function () {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? 'Symbol(src)_1.' + uid : '';
}();

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' + funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
  Symbol = root.Symbol,
  Uint8Array = root.Uint8Array,
  propertyIsEnumerable = objectProto.propertyIsEnumerable,
  splice = arrayProto.splice,
  symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols,
  nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
  nativeKeys = overArg(Object.keys, Object);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView'),
  Map = getNative(root, 'Map'),
  Promise = getNative(root, 'Promise'),
  Set = getNative(root, 'Set'),
  WeakMap = getNative(root, 'WeakMap'),
  nativeCreate = getNative(Object, 'create');

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
  mapCtorString = toSource(Map),
  promiseCtorString = toSource(Promise),
  setCtorString = toSource(Set),
  weakMapCtorString = toSource(WeakMap);

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
  symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
    length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = nativeCreate && value === undefined ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
    length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
    index = assocIndexOf(data, key);
  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
    index = assocIndexOf(data, key);
  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
    index = assocIndexOf(data, key);
  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
    length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash(),
    'map': new (Map || ListCache)(),
    'string': new Hash()
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
    size = data.size;
  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
    length = values == null ? 0 : values.length;
  this.__data__ = new MapCache();
  while (++index < length) {
    this.add(values[index]);
  }
}

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache();
  this.size = 0;
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
    result = data['delete'](key);
  this.size = data.size;
  return result;
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
    isArg = !isArr && isArguments(value),
    isBuff = !isArr && !isArg && isBuffer(value),
    isType = !isArr && !isArg && !isBuff && isTypedArray(value),
    skipIndexes = isArr || isArg || isBuff || isType,
    result = skipIndexes ? baseTimes(value.length, String) : [],
    length = result.length;
  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (
    // Safari 9 has enumerable `arguments.length` in strict mode.
    key == 'length' ||
    // Node.js 0.10 has enumerable non-index properties on buffers.
    isBuff && (key == 'offset' || key == 'parent') ||
    // PhantomJS 2 has enumerable non-index properties on typed arrays.
    isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset') ||
    // Skip index properties.
    isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
}

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray(object),
    othIsArr = isArray(other),
    objTag = objIsArr ? arrayTag : getTag(object),
    othTag = othIsArr ? arrayTag : getTag(other);
  objTag = objTag == argsTag ? objectTag : objTag;
  othTag = othTag == argsTag ? objectTag : othTag;
  var objIsObj = objTag == objectTag,
    othIsObj = othTag == objectTag,
    isSameTag = objTag == othTag;
  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack());
    return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
      othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');
    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
        othUnwrapped = othIsWrapped ? other.value() : other;
      stack || (stack = new Stack());
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack());
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
    arrLength = array.length,
    othLength = other.length;
  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
    result = true,
    seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache() : undefined;
  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
      othValue = other[index];
    if (customizer) {
      var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function (othValue, othIndex) {
        if (!cacheHas(seen, othIndex) && (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
          return seen.push(othIndex);
        }
      })) {
        result = false;
        break;
      }
    } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;
    case arrayBufferTag:
      if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;
    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);
    case errorTag:
      return object.name == other.name && object.message == other.message;
    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == other + '';
    case mapTag:
      var convert = mapToArray;
    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
      convert || (convert = setToArray);
      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;
    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
    objProps = getAllKeys(object),
    objLength = objProps.length,
    othProps = getAllKeys(other),
    othLength = othProps.length;
  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);
  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
      othValue = other[key];
    if (customizer) {
      var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
      othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor && 'constructor' in object && 'constructor' in other && !(typeof objCtor == 'function' && objCtor instanceof objCtor && typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
    tag = value[symToStringTag];
  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}
  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function (object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function (symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map && getTag(new Map()) != mapTag || Promise && getTag(Promise.resolve()) != promiseTag || Set && getTag(new Set()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) {
  getTag = function getTag(value) {
    var result = baseGetTag(value),
      Ctor = result == objectTag ? value.constructor : undefined,
      ctorString = Ctor ? toSource(Ctor) : '';
    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString:
          return dataViewTag;
        case mapCtorString:
          return mapTag;
        case promiseCtorString:
          return promiseTag;
        case setCtorString:
          return setTag;
        case weakMapCtorString:
          return weakMapTag;
      }
    }
    return result;
  };
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length && (typeof value == 'number' || reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean' ? value !== '__proto__' : value === null;
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && maskSrcKey in func;
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
    proto = typeof Ctor == 'function' && Ctor.prototype || objectProto;
  return value === proto;
}

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return func + '';
    } catch (e) {}
  }
  return '';
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || value !== value && other !== other;
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function () {
  return arguments;
}()) ? baseIsArguments : function (value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
};

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/**
 * Performs a deep comparison between two values to determine if they are
 * equivalent.
 *
 * **Note:** This method supports comparing arrays, array buffers, booleans,
 * date objects, error objects, maps, numbers, `Object` objects, regexes,
 * sets, strings, symbols, and typed arrays. `Object` objects are compared
 * by their own, not inherited, enumerable properties. Functions and DOM
 * nodes are compared by strict equality, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.isEqual(object, other);
 * // => true
 *
 * object === other;
 * // => false
 */
function isEqual(value, other) {
  return baseIsEqual(value, other);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}
module.exports = isEqual;

/***/ }),

/***/ "./node_modules/quill-delta/dist/AttributeMap.js":
/*!*******************************************************!*\
  !*** ./node_modules/quill-delta/dist/AttributeMap.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
var cloneDeep = __webpack_require__(/*! lodash.clonedeep */ "./node_modules/lodash.clonedeep/index.js");
var isEqual = __webpack_require__(/*! lodash.isequal */ "./node_modules/lodash.isequal/index.js");
var AttributeMap;
(function (AttributeMap) {
  function compose(a, b, keepNull) {
    if (a === void 0) {
      a = {};
    }
    if (b === void 0) {
      b = {};
    }
    if (keepNull === void 0) {
      keepNull = false;
    }
    if (typeof a !== 'object') {
      a = {};
    }
    if (typeof b !== 'object') {
      b = {};
    }
    var attributes = cloneDeep(b);
    if (!keepNull) {
      attributes = Object.keys(attributes).reduce(function (copy, key) {
        if (attributes[key] != null) {
          copy[key] = attributes[key];
        }
        return copy;
      }, {});
    }
    for (var key in a) {
      if (a[key] !== undefined && b[key] === undefined) {
        attributes[key] = a[key];
      }
    }
    return Object.keys(attributes).length > 0 ? attributes : undefined;
  }
  AttributeMap.compose = compose;
  function diff(a, b) {
    if (a === void 0) {
      a = {};
    }
    if (b === void 0) {
      b = {};
    }
    if (typeof a !== 'object') {
      a = {};
    }
    if (typeof b !== 'object') {
      b = {};
    }
    var attributes = Object.keys(a).concat(Object.keys(b)).reduce(function (attrs, key) {
      if (!isEqual(a[key], b[key])) {
        attrs[key] = b[key] === undefined ? null : b[key];
      }
      return attrs;
    }, {});
    return Object.keys(attributes).length > 0 ? attributes : undefined;
  }
  AttributeMap.diff = diff;
  function invert(attr, base) {
    if (attr === void 0) {
      attr = {};
    }
    if (base === void 0) {
      base = {};
    }
    attr = attr || {};
    var baseInverted = Object.keys(base).reduce(function (memo, key) {
      if (base[key] !== attr[key] && attr[key] !== undefined) {
        memo[key] = base[key];
      }
      return memo;
    }, {});
    return Object.keys(attr).reduce(function (memo, key) {
      if (attr[key] !== base[key] && base[key] === undefined) {
        memo[key] = null;
      }
      return memo;
    }, baseInverted);
  }
  AttributeMap.invert = invert;
  function transform(a, b, priority) {
    if (priority === void 0) {
      priority = false;
    }
    if (typeof a !== 'object') {
      return b;
    }
    if (typeof b !== 'object') {
      return undefined;
    }
    if (!priority) {
      return b; // b simply overwrites us without priority
    }
    var attributes = Object.keys(b).reduce(function (attrs, key) {
      if (a[key] === undefined) {
        attrs[key] = b[key]; // null is a valid value
      }
      return attrs;
    }, {});
    return Object.keys(attributes).length > 0 ? attributes : undefined;
  }
  AttributeMap.transform = transform;
})(AttributeMap || (AttributeMap = {}));
exports["default"] = AttributeMap;

/***/ }),

/***/ "./node_modules/quill-delta/dist/Delta.js":
/*!************************************************!*\
  !*** ./node_modules/quill-delta/dist/Delta.js ***!
  \************************************************/
/***/ ((module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.AttributeMap = exports.OpIterator = exports.Op = void 0;
var _diff = __webpack_require__(/*! fast-diff */ "./node_modules/fast-diff/diff.js");
var cloneDeep = __webpack_require__(/*! lodash.clonedeep */ "./node_modules/lodash.clonedeep/index.js");
var isEqual = __webpack_require__(/*! lodash.isequal */ "./node_modules/lodash.isequal/index.js");
var AttributeMap_1 = __webpack_require__(/*! ./AttributeMap */ "./node_modules/quill-delta/dist/AttributeMap.js");
exports.AttributeMap = AttributeMap_1["default"];
var Op_1 = __webpack_require__(/*! ./Op */ "./node_modules/quill-delta/dist/Op.js");
exports.Op = Op_1["default"];
var OpIterator_1 = __webpack_require__(/*! ./OpIterator */ "./node_modules/quill-delta/dist/OpIterator.js");
exports.OpIterator = OpIterator_1["default"];
var NULL_CHARACTER = String.fromCharCode(0); // Placeholder char for embed in diff()
var getEmbedTypeAndData = function getEmbedTypeAndData(a, b) {
  if (typeof a !== 'object' || a === null) {
    throw new Error("cannot retain a " + typeof a);
  }
  if (typeof b !== 'object' || b === null) {
    throw new Error("cannot retain a " + typeof b);
  }
  var embedType = Object.keys(a)[0];
  if (!embedType || embedType !== Object.keys(b)[0]) {
    throw new Error("embed types not matched: " + embedType + " != " + Object.keys(b)[0]);
  }
  return [embedType, a[embedType], b[embedType]];
};
var Delta = /*#__PURE__*/function () {
  function Delta(ops) {
    // Assume we are given a well formed ops
    if (Array.isArray(ops)) {
      this.ops = ops;
    } else if (ops != null && Array.isArray(ops.ops)) {
      this.ops = ops.ops;
    } else {
      this.ops = [];
    }
  }
  Delta.registerEmbed = function registerEmbed(embedType, handler) {
    this.handlers[embedType] = handler;
  };
  Delta.unregisterEmbed = function unregisterEmbed(embedType) {
    delete this.handlers[embedType];
  };
  Delta.getHandler = function getHandler(embedType) {
    var handler = this.handlers[embedType];
    if (!handler) {
      throw new Error("no handlers for embed type \"" + embedType + "\"");
    }
    return handler;
  };
  var _proto = Delta.prototype;
  _proto.insert = function insert(arg, attributes) {
    var newOp = {};
    if (typeof arg === 'string' && arg.length === 0) {
      return this;
    }
    newOp.insert = arg;
    if (attributes != null && typeof attributes === 'object' && Object.keys(attributes).length > 0) {
      newOp.attributes = attributes;
    }
    return this.push(newOp);
  };
  _proto["delete"] = function _delete(length) {
    if (length <= 0) {
      return this;
    }
    return this.push({
      "delete": length
    });
  };
  _proto.retain = function retain(length, attributes) {
    if (typeof length === 'number' && length <= 0) {
      return this;
    }
    var newOp = {
      retain: length
    };
    if (attributes != null && typeof attributes === 'object' && Object.keys(attributes).length > 0) {
      newOp.attributes = attributes;
    }
    return this.push(newOp);
  };
  _proto.push = function push(newOp) {
    var index = this.ops.length;
    var lastOp = this.ops[index - 1];
    newOp = cloneDeep(newOp);
    if (typeof lastOp === 'object') {
      if (typeof newOp["delete"] === 'number' && typeof lastOp["delete"] === 'number') {
        this.ops[index - 1] = {
          "delete": lastOp["delete"] + newOp["delete"]
        };
        return this;
      }
      // Since it does not matter if we insert before or after deleting at the same index,
      // always prefer to insert first
      if (typeof lastOp["delete"] === 'number' && newOp.insert != null) {
        index -= 1;
        lastOp = this.ops[index - 1];
        if (typeof lastOp !== 'object') {
          this.ops.unshift(newOp);
          return this;
        }
      }
      if (isEqual(newOp.attributes, lastOp.attributes)) {
        if (typeof newOp.insert === 'string' && typeof lastOp.insert === 'string') {
          this.ops[index - 1] = {
            insert: lastOp.insert + newOp.insert
          };
          if (typeof newOp.attributes === 'object') {
            this.ops[index - 1].attributes = newOp.attributes;
          }
          return this;
        } else if (typeof newOp.retain === 'number' && typeof lastOp.retain === 'number') {
          this.ops[index - 1] = {
            retain: lastOp.retain + newOp.retain
          };
          if (typeof newOp.attributes === 'object') {
            this.ops[index - 1].attributes = newOp.attributes;
          }
          return this;
        }
      }
    }
    if (index === this.ops.length) {
      this.ops.push(newOp);
    } else {
      this.ops.splice(index, 0, newOp);
    }
    return this;
  };
  _proto.chop = function chop() {
    var lastOp = this.ops[this.ops.length - 1];
    if (lastOp && typeof lastOp.retain === 'number' && !lastOp.attributes) {
      this.ops.pop();
    }
    return this;
  };
  _proto.filter = function filter(predicate) {
    return this.ops.filter(predicate);
  };
  _proto.forEach = function forEach(predicate) {
    this.ops.forEach(predicate);
  };
  _proto.map = function map(predicate) {
    return this.ops.map(predicate);
  };
  _proto.partition = function partition(predicate) {
    var passed = [];
    var failed = [];
    this.forEach(function (op) {
      var target = predicate(op) ? passed : failed;
      target.push(op);
    });
    return [passed, failed];
  };
  _proto.reduce = function reduce(predicate, initialValue) {
    return this.ops.reduce(predicate, initialValue);
  };
  _proto.changeLength = function changeLength() {
    return this.reduce(function (length, elem) {
      if (elem.insert) {
        return length + Op_1["default"].length(elem);
      } else if (elem["delete"]) {
        return length - elem["delete"];
      }
      return length;
    }, 0);
  };
  _proto.length = function length() {
    return this.reduce(function (length, elem) {
      return length + Op_1["default"].length(elem);
    }, 0);
  };
  _proto.slice = function slice(start, end) {
    if (start === void 0) {
      start = 0;
    }
    if (end === void 0) {
      end = Infinity;
    }
    var ops = [];
    var iter = new OpIterator_1["default"](this.ops);
    var index = 0;
    while (index < end && iter.hasNext()) {
      var nextOp = void 0;
      if (index < start) {
        nextOp = iter.next(start - index);
      } else {
        nextOp = iter.next(end - index);
        ops.push(nextOp);
      }
      index += Op_1["default"].length(nextOp);
    }
    return new Delta(ops);
  };
  _proto.compose = function compose(other) {
    var thisIter = new OpIterator_1["default"](this.ops);
    var otherIter = new OpIterator_1["default"](other.ops);
    var ops = [];
    var firstOther = otherIter.peek();
    if (firstOther != null && typeof firstOther.retain === 'number' && firstOther.attributes == null) {
      var firstLeft = firstOther.retain;
      while (thisIter.peekType() === 'insert' && thisIter.peekLength() <= firstLeft) {
        firstLeft -= thisIter.peekLength();
        ops.push(thisIter.next());
      }
      if (firstOther.retain - firstLeft > 0) {
        otherIter.next(firstOther.retain - firstLeft);
      }
    }
    var delta = new Delta(ops);
    while (thisIter.hasNext() || otherIter.hasNext()) {
      if (otherIter.peekType() === 'insert') {
        delta.push(otherIter.next());
      } else if (thisIter.peekType() === 'delete') {
        delta.push(thisIter.next());
      } else {
        var length = Math.min(thisIter.peekLength(), otherIter.peekLength());
        var thisOp = thisIter.next(length);
        var otherOp = otherIter.next(length);
        if (otherOp.retain) {
          var newOp = {};
          if (typeof thisOp.retain === 'number') {
            newOp.retain = typeof otherOp.retain === 'number' ? length : otherOp.retain;
          } else {
            if (typeof otherOp.retain === 'number') {
              if (thisOp.retain == null) {
                newOp.insert = thisOp.insert;
              } else {
                newOp.retain = thisOp.retain;
              }
            } else {
              var _newOp$action;
              var action = thisOp.retain == null ? 'insert' : 'retain';
              var _getEmbedTypeAndData = getEmbedTypeAndData(thisOp[action], otherOp.retain),
                embedType = _getEmbedTypeAndData[0],
                thisData = _getEmbedTypeAndData[1],
                otherData = _getEmbedTypeAndData[2];
              var handler = Delta.getHandler(embedType);
              newOp[action] = (_newOp$action = {}, _newOp$action[embedType] = handler.compose(thisData, otherData, action === 'retain'), _newOp$action);
            }
          }
          // Preserve null when composing with a retain, otherwise remove it for inserts
          var attributes = AttributeMap_1["default"].compose(thisOp.attributes, otherOp.attributes, typeof thisOp.retain === 'number');
          if (attributes) {
            newOp.attributes = attributes;
          }
          delta.push(newOp);
          // Optimization if rest of other is just retain
          if (!otherIter.hasNext() && isEqual(delta.ops[delta.ops.length - 1], newOp)) {
            var rest = new Delta(thisIter.rest());
            return delta.concat(rest).chop();
          }
          // Other op should be delete, we could be an insert or retain
          // Insert + delete cancels out
        } else if (typeof otherOp["delete"] === 'number' && (typeof thisOp.retain === 'number' || typeof thisOp.retain === 'object' && thisOp.retain !== null)) {
          delta.push(otherOp);
        }
      }
    }
    return delta.chop();
  };
  _proto.concat = function concat(other) {
    var delta = new Delta(this.ops.slice());
    if (other.ops.length > 0) {
      delta.push(other.ops[0]);
      delta.ops = delta.ops.concat(other.ops.slice(1));
    }
    return delta;
  };
  _proto.diff = function diff(other, cursor) {
    if (this.ops === other.ops) {
      return new Delta();
    }
    var strings = [this, other].map(function (delta) {
      return delta.map(function (op) {
        if (op.insert != null) {
          return typeof op.insert === 'string' ? op.insert : NULL_CHARACTER;
        }
        var prep = delta === other ? 'on' : 'with';
        throw new Error('diff() called ' + prep + ' non-document');
      }).join('');
    });
    var retDelta = new Delta();
    var diffResult = _diff(strings[0], strings[1], cursor, true);
    var thisIter = new OpIterator_1["default"](this.ops);
    var otherIter = new OpIterator_1["default"](other.ops);
    diffResult.forEach(function (component) {
      var length = component[1].length;
      while (length > 0) {
        var opLength = 0;
        switch (component[0]) {
          case _diff.INSERT:
            opLength = Math.min(otherIter.peekLength(), length);
            retDelta.push(otherIter.next(opLength));
            break;
          case _diff.DELETE:
            opLength = Math.min(length, thisIter.peekLength());
            thisIter.next(opLength);
            retDelta["delete"](opLength);
            break;
          case _diff.EQUAL:
            opLength = Math.min(thisIter.peekLength(), otherIter.peekLength(), length);
            var thisOp = thisIter.next(opLength);
            var otherOp = otherIter.next(opLength);
            if (isEqual(thisOp.insert, otherOp.insert)) {
              retDelta.retain(opLength, AttributeMap_1["default"].diff(thisOp.attributes, otherOp.attributes));
            } else {
              retDelta.push(otherOp)["delete"](opLength);
            }
            break;
        }
        length -= opLength;
      }
    });
    return retDelta.chop();
  };
  _proto.eachLine = function eachLine(predicate, newline) {
    if (newline === void 0) {
      newline = '\n';
    }
    var iter = new OpIterator_1["default"](this.ops);
    var line = new Delta();
    var i = 0;
    while (iter.hasNext()) {
      if (iter.peekType() !== 'insert') {
        return;
      }
      var thisOp = iter.peek();
      var start = Op_1["default"].length(thisOp) - iter.peekLength();
      var index = typeof thisOp.insert === 'string' ? thisOp.insert.indexOf(newline, start) - start : -1;
      if (index < 0) {
        line.push(iter.next());
      } else if (index > 0) {
        line.push(iter.next(index));
      } else {
        if (predicate(line, iter.next(1).attributes || {}, i) === false) {
          return;
        }
        i += 1;
        line = new Delta();
      }
    }
    if (line.length() > 0) {
      predicate(line, {}, i);
    }
  };
  _proto.invert = function invert(base) {
    var inverted = new Delta();
    this.reduce(function (baseIndex, op) {
      if (op.insert) {
        inverted["delete"](Op_1["default"].length(op));
      } else if (typeof op.retain === 'number' && op.attributes == null) {
        inverted.retain(op.retain);
        return baseIndex + op.retain;
      } else if (op["delete"] || typeof op.retain === 'number') {
        var length = op["delete"] || op.retain;
        var slice = base.slice(baseIndex, baseIndex + length);
        slice.forEach(function (baseOp) {
          if (op["delete"]) {
            inverted.push(baseOp);
          } else if (op.retain && op.attributes) {
            inverted.retain(Op_1["default"].length(baseOp), AttributeMap_1["default"].invert(op.attributes, baseOp.attributes));
          }
        });
        return baseIndex + length;
      } else if (typeof op.retain === 'object' && op.retain !== null) {
        var _inverted$retain;
        var _slice = base.slice(baseIndex, baseIndex + 1);
        var baseOp = new OpIterator_1["default"](_slice.ops).next();
        var _getEmbedTypeAndData2 = getEmbedTypeAndData(op.retain, baseOp.insert),
          embedType = _getEmbedTypeAndData2[0],
          opData = _getEmbedTypeAndData2[1],
          baseOpData = _getEmbedTypeAndData2[2];
        var handler = Delta.getHandler(embedType);
        inverted.retain((_inverted$retain = {}, _inverted$retain[embedType] = handler.invert(opData, baseOpData), _inverted$retain), AttributeMap_1["default"].invert(op.attributes, baseOp.attributes));
        return baseIndex + 1;
      }
      return baseIndex;
    }, 0);
    return inverted.chop();
  };
  _proto.transform = function transform(arg, priority) {
    if (priority === void 0) {
      priority = false;
    }
    priority = !!priority;
    if (typeof arg === 'number') {
      return this.transformPosition(arg, priority);
    }
    var other = arg;
    var thisIter = new OpIterator_1["default"](this.ops);
    var otherIter = new OpIterator_1["default"](other.ops);
    var delta = new Delta();
    while (thisIter.hasNext() || otherIter.hasNext()) {
      if (thisIter.peekType() === 'insert' && (priority || otherIter.peekType() !== 'insert')) {
        delta.retain(Op_1["default"].length(thisIter.next()));
      } else if (otherIter.peekType() === 'insert') {
        delta.push(otherIter.next());
      } else {
        var length = Math.min(thisIter.peekLength(), otherIter.peekLength());
        var thisOp = thisIter.next(length);
        var otherOp = otherIter.next(length);
        if (thisOp["delete"]) {
          // Our delete either makes their delete redundant or removes their retain
          continue;
        } else if (otherOp["delete"]) {
          delta.push(otherOp);
        } else {
          var thisData = thisOp.retain;
          var otherData = otherOp.retain;
          var transformedData = typeof otherData === 'object' && otherData !== null ? otherData : length;
          if (typeof thisData === 'object' && thisData !== null && typeof otherData === 'object' && otherData !== null) {
            var embedType = Object.keys(thisData)[0];
            if (embedType === Object.keys(otherData)[0]) {
              var handler = Delta.getHandler(embedType);
              if (handler) {
                var _transformedData;
                transformedData = (_transformedData = {}, _transformedData[embedType] = handler.transform(thisData[embedType], otherData[embedType], priority), _transformedData);
              }
            }
          }
          // We retain either their retain or insert
          delta.retain(transformedData, AttributeMap_1["default"].transform(thisOp.attributes, otherOp.attributes, priority));
        }
      }
    }
    return delta.chop();
  };
  _proto.transformPosition = function transformPosition(index, priority) {
    if (priority === void 0) {
      priority = false;
    }
    priority = !!priority;
    var thisIter = new OpIterator_1["default"](this.ops);
    var offset = 0;
    while (thisIter.hasNext() && offset <= index) {
      var length = thisIter.peekLength();
      var nextType = thisIter.peekType();
      thisIter.next();
      if (nextType === 'delete') {
        index -= Math.min(length, index - offset);
        continue;
      } else if (nextType === 'insert' && (offset < index || !priority)) {
        index += length;
      }
      offset += length;
    }
    return index;
  };
  return Delta;
}();
Delta.Op = Op_1["default"];
Delta.OpIterator = OpIterator_1["default"];
Delta.AttributeMap = AttributeMap_1["default"];
Delta.handlers = {};
exports["default"] = Delta;
if (true) {
  module.exports = Delta;
  module.exports["default"] = Delta;
}

/***/ }),

/***/ "./node_modules/quill-delta/dist/Op.js":
/*!*********************************************!*\
  !*** ./node_modules/quill-delta/dist/Op.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
var Op;
(function (Op) {
  function length(op) {
    if (typeof op["delete"] === 'number') {
      return op["delete"];
    } else if (typeof op.retain === 'number') {
      return op.retain;
    } else if (typeof op.retain === 'object' && op.retain !== null) {
      return 1;
    } else {
      return typeof op.insert === 'string' ? op.insert.length : 1;
    }
  }
  Op.length = length;
})(Op || (Op = {}));
exports["default"] = Op;

/***/ }),

/***/ "./node_modules/quill-delta/dist/OpIterator.js":
/*!*****************************************************!*\
  !*** ./node_modules/quill-delta/dist/OpIterator.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
var Op_1 = __webpack_require__(/*! ./Op */ "./node_modules/quill-delta/dist/Op.js");
var Iterator = /*#__PURE__*/function () {
  function Iterator(ops) {
    this.ops = ops;
    this.index = 0;
    this.offset = 0;
  }
  var _proto = Iterator.prototype;
  _proto.hasNext = function hasNext() {
    return this.peekLength() < Infinity;
  };
  _proto.next = function next(length) {
    if (!length) {
      length = Infinity;
    }
    var nextOp = this.ops[this.index];
    if (nextOp) {
      var offset = this.offset;
      var opLength = Op_1["default"].length(nextOp);
      if (length >= opLength - offset) {
        length = opLength - offset;
        this.index += 1;
        this.offset = 0;
      } else {
        this.offset += length;
      }
      if (typeof nextOp["delete"] === 'number') {
        return {
          "delete": length
        };
      } else {
        var retOp = {};
        if (nextOp.attributes) {
          retOp.attributes = nextOp.attributes;
        }
        if (typeof nextOp.retain === 'number') {
          retOp.retain = length;
        } else if (typeof nextOp.retain === 'object' && nextOp.retain !== null) {
          // offset should === 0, length should === 1
          retOp.retain = nextOp.retain;
        } else if (typeof nextOp.insert === 'string') {
          retOp.insert = nextOp.insert.substr(offset, length);
        } else {
          // offset should === 0, length should === 1
          retOp.insert = nextOp.insert;
        }
        return retOp;
      }
    } else {
      return {
        retain: Infinity
      };
    }
  };
  _proto.peek = function peek() {
    return this.ops[this.index];
  };
  _proto.peekLength = function peekLength() {
    if (this.ops[this.index]) {
      // Should never return 0 if our index is being managed correctly
      return Op_1["default"].length(this.ops[this.index]) - this.offset;
    } else {
      return Infinity;
    }
  };
  _proto.peekType = function peekType() {
    var op = this.ops[this.index];
    if (op) {
      if (typeof op["delete"] === 'number') {
        return 'delete';
      } else if (typeof op.retain === 'number' || typeof op.retain === 'object' && op.retain !== null) {
        return 'retain';
      } else {
        return 'insert';
      }
    }
    return 'retain';
  };
  _proto.rest = function rest() {
    if (!this.hasNext()) {
      return [];
    } else if (this.offset === 0) {
      return this.ops.slice(this.index);
    } else {
      var offset = this.offset;
      var index = this.index;
      var next = this.next();
      var _rest = this.ops.slice(this.index);
      this.offset = offset;
      this.index = index;
      return [next].concat(_rest);
    }
  };
  return Iterator;
}();
exports["default"] = Iterator;

/***/ }),

/***/ "./src/admin/components/SendEmailPage.tsx":
/*!************************************************!*\
  !*** ./src/admin/components/SendEmailPage.tsx ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SendEmailPage)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_admin_components_ExtensionPage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/admin/components/ExtensionPage */ "flarum/admin/components/ExtensionPage");
/* harmony import */ var flarum_admin_components_ExtensionPage__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_admin_components_ExtensionPage__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_admin_app__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/admin/app */ "flarum/admin/app");
/* harmony import */ var flarum_admin_app__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_admin_app__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var quill__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! quill */ "./node_modules/quill/quill.js");

// @ts-nocheck



var SendEmailPage = /*#__PURE__*/function (_ExtensionPage) {
  function SendEmailPage() {
    return _ExtensionPage.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(SendEmailPage, _ExtensionPage);
  var _proto = SendEmailPage.prototype;
  _proto.oninit = function oninit(vnode) {
    _ExtensionPage.prototype.oninit.call(this, vnode);
    this.loading = false;
    this.getTotalSubscribers();
    this.totalSubscribers = 0;
    this.toolbarOptions = [[{
      font: []
    }], [{
      header: [1, 2, 3]
    }], ["bold", "italic", "underline", "strike"], [{
      color: []
    }, {
      background: []
    }], [{
      list: "ordered"
    }, {
      list: "bullet"
    }, {
      list: "check"
    }], ["blockquote", "code-block"], ["link"], [{
      align: []
    }]];
  };
  _proto.oncreate = function oncreate(vnode) {
    var _this = this;
    _ExtensionPage.prototype.oncreate.call(this, vnode);
    this.quill = new quill__WEBPACK_IMPORTED_MODULE_3__["default"]("#editor-container", {
      theme: "snow",
      modules: {
        toolbar: this.toolbarOptions
      }
    });
    this.quill.on("text-change", function () {
      _this.body = _this.quill.getSemanticHTML();
      m.redraw();
    });
  };
  _proto.content = function content(vnode) {
    var _this2 = this;
    return m("div", {
      className: "container"
    }, m("p", {
      "class": "newsletter-subscribers-count"
    }, flarum_admin_app__WEBPACK_IMPORTED_MODULE_2___default().translator.trans('justoverclock-newsletter.admin.newsletterCountText'), " ", m("span", {
      className: "subscribers-count"
    }, this.totalSubscribers), " ", flarum_admin_app__WEBPACK_IMPORTED_MODULE_2___default().translator.trans('justoverclock-newsletter.admin.newsletterCountTextTwo')), m("div", {
      className: "Form-group"
    }, m("label", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_2___default().translator.trans('justoverclock-newsletter.admin.emailTitle')), m("input", {
      className: "FormControl",
      type: "text",
      placeholder: "Email title",
      oninput: function oninput(e) {
        return _this2.subject = e.target.value;
      }
    })), m("div", {
      className: "Form-group"
    }, m("label", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_2___default().translator.trans('justoverclock-newsletter.admin.textOrHtml')), m("div", {
      className: "editor-container FormControl",
      id: "editor-container"
    })), m("button", {
      className: "Button Button--primary",
      onclick: this.sendEmail.bind(this),
      disabled: !this.subject || !this.body
    }, this.loading ? "" + flarum_admin_app__WEBPACK_IMPORTED_MODULE_2___default().translator.trans('justoverclock-newsletter.admin.sendingText') : "" + flarum_admin_app__WEBPACK_IMPORTED_MODULE_2___default().translator.trans('justoverclock-newsletter.admin.sendEmailButtonText')));
  };
  _proto.getTotalSubscribers = function getTotalSubscribers() {
    var _this3 = this;
    flarum_admin_app__WEBPACK_IMPORTED_MODULE_2___default().request({
      method: 'GET',
      url: flarum_admin_app__WEBPACK_IMPORTED_MODULE_2___default().forum.attribute('apiUrl') + '/newsletter/subscribers'
    }).then(function (data) {
      _this3.totalSubscribers = data.data.length;
      m.redraw();
    });
  };
  _proto.sendEmail = function sendEmail() {
    var _this4 = this;
    this.loading = true;
    this.body = this.quill.getSemanticHTML();
    console.log(this.body);
    flarum_admin_app__WEBPACK_IMPORTED_MODULE_2___default().request({
      method: 'POST',
      url: flarum_admin_app__WEBPACK_IMPORTED_MODULE_2___default().forum.attribute('apiUrl') + '/newsletter/sendall',
      body: {
        email: this.email,
        subject: this.subject,
        body: this.body,
        html: this.html
      }
    }).then(function () {
      _this4.loading = false;
      flarum_admin_app__WEBPACK_IMPORTED_MODULE_2___default().alerts.show({
        type: 'success'
      }, "" + flarum_admin_app__WEBPACK_IMPORTED_MODULE_2___default().translator.trans('justoverclock-newsletter.admin.emailSentSuccessMessage'));
    })["catch"](function () {
      flarum_admin_app__WEBPACK_IMPORTED_MODULE_2___default().alerts.show({
        type: 'error'
      }, "" + flarum_admin_app__WEBPACK_IMPORTED_MODULE_2___default().translator.trans('justoverclock-newsletter.admin.emailSentErrorMessage'));
    });
  };
  return SendEmailPage;
}((flarum_admin_components_ExtensionPage__WEBPACK_IMPORTED_MODULE_1___default()));


/***/ }),

/***/ "./src/admin/index.ts":
/*!****************************!*\
  !*** ./src/admin/index.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_admin_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/admin/app */ "flarum/admin/app");
/* harmony import */ var flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_admin_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _components_SendEmailPage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/SendEmailPage */ "./src/admin/components/SendEmailPage.tsx");


flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().initializers.add('justoverclock/newsletter', function () {
  flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().extensionData["for"]('justoverclock-newsletter').registerPage(_components_SendEmailPage__WEBPACK_IMPORTED_MODULE_1__["default"]);
});

/***/ }),

/***/ "./src/common/index.ts":
/*!*****************************!*\
  !*** ./src/common/index.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_common_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/common/app */ "flarum/common/app");
/* harmony import */ var flarum_common_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_common_app__WEBPACK_IMPORTED_MODULE_0__);

flarum_common_app__WEBPACK_IMPORTED_MODULE_0___default().initializers.add('justoverclock/newsletter', function () {
  console.log('[justoverclock/newsletter] Hello, forum and admin!');
});

/***/ }),

/***/ "flarum/admin/app":
/*!**************************************************!*\
  !*** external "flarum.core.compat['admin/app']" ***!
  \**************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['admin/app'];

/***/ }),

/***/ "flarum/admin/components/ExtensionPage":
/*!***********************************************************************!*\
  !*** external "flarum.core.compat['admin/components/ExtensionPage']" ***!
  \***********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['admin/components/ExtensionPage'];

/***/ }),

/***/ "flarum/common/app":
/*!***************************************************!*\
  !*** external "flarum.core.compat['common/app']" ***!
  \***************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/app'];

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _assertThisInitialized)
/* harmony export */ });
function _assertThisInitialized(e) {
  if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/construct.js":
/*!**************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/construct.js ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _construct)
/* harmony export */ });
/* harmony import */ var _isNativeReflectConstruct_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isNativeReflectConstruct.js */ "./node_modules/@babel/runtime/helpers/esm/isNativeReflectConstruct.js");
/* harmony import */ var _setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./setPrototypeOf.js */ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js");


function _construct(t, e, r) {
  if ((0,_isNativeReflectConstruct_js__WEBPACK_IMPORTED_MODULE_0__["default"])()) return Reflect.construct.apply(null, arguments);
  var o = [null];
  o.push.apply(o, e);
  var p = new (t.bind.apply(t, o))();
  return r && (0,_setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_1__["default"])(p, r.prototype), p;
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/createClass.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/createClass.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _createClass)
/* harmony export */ });
/* harmony import */ var _toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toPropertyKey.js */ "./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js");

function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, (0,_toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__["default"])(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
    writable: !1
  }), e;
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/extends.js":
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/extends.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _extends)
/* harmony export */ });
function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _getPrototypeOf)
/* harmony export */ });
function _getPrototypeOf(t) {
  return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) {
    return t.__proto__ || Object.getPrototypeOf(t);
  }, _getPrototypeOf(t);
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _inheritsLoose)
/* harmony export */ });
/* harmony import */ var _setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./setPrototypeOf.js */ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js");

function _inheritsLoose(t, o) {
  t.prototype = Object.create(o.prototype), t.prototype.constructor = t, (0,_setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__["default"])(t, o);
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/isNativeFunction.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/isNativeFunction.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _isNativeFunction)
/* harmony export */ });
function _isNativeFunction(t) {
  try {
    return -1 !== Function.toString.call(t).indexOf("[native code]");
  } catch (n) {
    return "function" == typeof t;
  }
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/isNativeReflectConstruct.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/isNativeReflectConstruct.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _isNativeReflectConstruct)
/* harmony export */ });
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
    return !!t;
  })();
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _objectWithoutPropertiesLoose)
/* harmony export */ });
function _objectWithoutPropertiesLoose(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (e.includes(n)) continue;
    t[n] = r[n];
  }
  return t;
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/readOnlyError.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/readOnlyError.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _readOnlyError)
/* harmony export */ });
function _readOnlyError(r) {
  throw new TypeError('"' + r + '" is read-only');
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _setPrototypeOf)
/* harmony export */ });
function _setPrototypeOf(t, e) {
  return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) {
    return t.__proto__ = e, t;
  }, _setPrototypeOf(t, e);
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/toPrimitive.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/toPrimitive.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ toPrimitive)
/* harmony export */ });
/* harmony import */ var _typeof_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./typeof.js */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");

function toPrimitive(t, r) {
  if ("object" != (0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != (0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ toPropertyKey)
/* harmony export */ });
/* harmony import */ var _typeof_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./typeof.js */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _toPrimitive_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./toPrimitive.js */ "./node_modules/@babel/runtime/helpers/esm/toPrimitive.js");


function toPropertyKey(t) {
  var i = (0,_toPrimitive_js__WEBPACK_IMPORTED_MODULE_1__["default"])(t, "string");
  return "symbol" == (0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(i) ? i : i + "";
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/typeof.js":
/*!***********************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/typeof.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _typeof)
/* harmony export */ });
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/wrapNativeSuper.js":
/*!********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/wrapNativeSuper.js ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _wrapNativeSuper)
/* harmony export */ });
/* harmony import */ var _getPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getPrototypeOf.js */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var _setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./setPrototypeOf.js */ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js");
/* harmony import */ var _isNativeFunction_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isNativeFunction.js */ "./node_modules/@babel/runtime/helpers/esm/isNativeFunction.js");
/* harmony import */ var _construct_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./construct.js */ "./node_modules/@babel/runtime/helpers/esm/construct.js");




function _wrapNativeSuper(t) {
  var r = "function" == typeof Map ? new Map() : void 0;
  return _wrapNativeSuper = function _wrapNativeSuper(t) {
    if (null === t || !(0,_isNativeFunction_js__WEBPACK_IMPORTED_MODULE_2__["default"])(t)) return t;
    if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function");
    if (void 0 !== r) {
      if (r.has(t)) return r.get(t);
      r.set(t, Wrapper);
    }
    function Wrapper() {
      return (0,_construct_js__WEBPACK_IMPORTED_MODULE_3__["default"])(t, arguments, (0,_getPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__["default"])(this).constructor);
    }
    return Wrapper.prototype = Object.create(t.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: !1,
        writable: !0,
        configurable: !0
      }
    }), (0,_setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_1__["default"])(Wrapper, t);
  }, _wrapNativeSuper(t);
}


/***/ }),

/***/ "./node_modules/lodash-es/_DataView.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/_DataView.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _getNative_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_getNative.js */ "./node_modules/lodash-es/_getNative.js");
/* harmony import */ var _root_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_root.js */ "./node_modules/lodash-es/_root.js");



/* Built-in method references that are verified to be native. */
var DataView = (0,_getNative_js__WEBPACK_IMPORTED_MODULE_0__["default"])(_root_js__WEBPACK_IMPORTED_MODULE_1__["default"], 'DataView');
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DataView);

/***/ }),

/***/ "./node_modules/lodash-es/_Hash.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash-es/_Hash.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _hashClear_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_hashClear.js */ "./node_modules/lodash-es/_hashClear.js");
/* harmony import */ var _hashDelete_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_hashDelete.js */ "./node_modules/lodash-es/_hashDelete.js");
/* harmony import */ var _hashGet_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_hashGet.js */ "./node_modules/lodash-es/_hashGet.js");
/* harmony import */ var _hashHas_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_hashHas.js */ "./node_modules/lodash-es/_hashHas.js");
/* harmony import */ var _hashSet_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./_hashSet.js */ "./node_modules/lodash-es/_hashSet.js");






/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
    length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = _hashClear_js__WEBPACK_IMPORTED_MODULE_0__["default"];
Hash.prototype['delete'] = _hashDelete_js__WEBPACK_IMPORTED_MODULE_1__["default"];
Hash.prototype.get = _hashGet_js__WEBPACK_IMPORTED_MODULE_2__["default"];
Hash.prototype.has = _hashHas_js__WEBPACK_IMPORTED_MODULE_3__["default"];
Hash.prototype.set = _hashSet_js__WEBPACK_IMPORTED_MODULE_4__["default"];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Hash);

/***/ }),

/***/ "./node_modules/lodash-es/_ListCache.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash-es/_ListCache.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _listCacheClear_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_listCacheClear.js */ "./node_modules/lodash-es/_listCacheClear.js");
/* harmony import */ var _listCacheDelete_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_listCacheDelete.js */ "./node_modules/lodash-es/_listCacheDelete.js");
/* harmony import */ var _listCacheGet_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_listCacheGet.js */ "./node_modules/lodash-es/_listCacheGet.js");
/* harmony import */ var _listCacheHas_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_listCacheHas.js */ "./node_modules/lodash-es/_listCacheHas.js");
/* harmony import */ var _listCacheSet_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./_listCacheSet.js */ "./node_modules/lodash-es/_listCacheSet.js");






/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
    length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = _listCacheClear_js__WEBPACK_IMPORTED_MODULE_0__["default"];
ListCache.prototype['delete'] = _listCacheDelete_js__WEBPACK_IMPORTED_MODULE_1__["default"];
ListCache.prototype.get = _listCacheGet_js__WEBPACK_IMPORTED_MODULE_2__["default"];
ListCache.prototype.has = _listCacheHas_js__WEBPACK_IMPORTED_MODULE_3__["default"];
ListCache.prototype.set = _listCacheSet_js__WEBPACK_IMPORTED_MODULE_4__["default"];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ListCache);

/***/ }),

/***/ "./node_modules/lodash-es/_Map.js":
/*!****************************************!*\
  !*** ./node_modules/lodash-es/_Map.js ***!
  \****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _getNative_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_getNative.js */ "./node_modules/lodash-es/_getNative.js");
/* harmony import */ var _root_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_root.js */ "./node_modules/lodash-es/_root.js");



/* Built-in method references that are verified to be native. */
var Map = (0,_getNative_js__WEBPACK_IMPORTED_MODULE_0__["default"])(_root_js__WEBPACK_IMPORTED_MODULE_1__["default"], 'Map');
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Map);

/***/ }),

/***/ "./node_modules/lodash-es/_MapCache.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/_MapCache.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _mapCacheClear_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_mapCacheClear.js */ "./node_modules/lodash-es/_mapCacheClear.js");
/* harmony import */ var _mapCacheDelete_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_mapCacheDelete.js */ "./node_modules/lodash-es/_mapCacheDelete.js");
/* harmony import */ var _mapCacheGet_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_mapCacheGet.js */ "./node_modules/lodash-es/_mapCacheGet.js");
/* harmony import */ var _mapCacheHas_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_mapCacheHas.js */ "./node_modules/lodash-es/_mapCacheHas.js");
/* harmony import */ var _mapCacheSet_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./_mapCacheSet.js */ "./node_modules/lodash-es/_mapCacheSet.js");






/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
    length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = _mapCacheClear_js__WEBPACK_IMPORTED_MODULE_0__["default"];
MapCache.prototype['delete'] = _mapCacheDelete_js__WEBPACK_IMPORTED_MODULE_1__["default"];
MapCache.prototype.get = _mapCacheGet_js__WEBPACK_IMPORTED_MODULE_2__["default"];
MapCache.prototype.has = _mapCacheHas_js__WEBPACK_IMPORTED_MODULE_3__["default"];
MapCache.prototype.set = _mapCacheSet_js__WEBPACK_IMPORTED_MODULE_4__["default"];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MapCache);

/***/ }),

/***/ "./node_modules/lodash-es/_Promise.js":
/*!********************************************!*\
  !*** ./node_modules/lodash-es/_Promise.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _getNative_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_getNative.js */ "./node_modules/lodash-es/_getNative.js");
/* harmony import */ var _root_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_root.js */ "./node_modules/lodash-es/_root.js");



/* Built-in method references that are verified to be native. */
var Promise = (0,_getNative_js__WEBPACK_IMPORTED_MODULE_0__["default"])(_root_js__WEBPACK_IMPORTED_MODULE_1__["default"], 'Promise');
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Promise);

/***/ }),

/***/ "./node_modules/lodash-es/_Set.js":
/*!****************************************!*\
  !*** ./node_modules/lodash-es/_Set.js ***!
  \****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _getNative_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_getNative.js */ "./node_modules/lodash-es/_getNative.js");
/* harmony import */ var _root_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_root.js */ "./node_modules/lodash-es/_root.js");



/* Built-in method references that are verified to be native. */
var Set = (0,_getNative_js__WEBPACK_IMPORTED_MODULE_0__["default"])(_root_js__WEBPACK_IMPORTED_MODULE_1__["default"], 'Set');
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Set);

/***/ }),

/***/ "./node_modules/lodash-es/_SetCache.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/_SetCache.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _MapCache_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_MapCache.js */ "./node_modules/lodash-es/_MapCache.js");
/* harmony import */ var _setCacheAdd_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_setCacheAdd.js */ "./node_modules/lodash-es/_setCacheAdd.js");
/* harmony import */ var _setCacheHas_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_setCacheHas.js */ "./node_modules/lodash-es/_setCacheHas.js");




/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
    length = values == null ? 0 : values.length;
  this.__data__ = new _MapCache_js__WEBPACK_IMPORTED_MODULE_0__["default"]();
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = _setCacheAdd_js__WEBPACK_IMPORTED_MODULE_1__["default"];
SetCache.prototype.has = _setCacheHas_js__WEBPACK_IMPORTED_MODULE_2__["default"];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SetCache);

/***/ }),

/***/ "./node_modules/lodash-es/_Stack.js":
/*!******************************************!*\
  !*** ./node_modules/lodash-es/_Stack.js ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ListCache_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_ListCache.js */ "./node_modules/lodash-es/_ListCache.js");
/* harmony import */ var _stackClear_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_stackClear.js */ "./node_modules/lodash-es/_stackClear.js");
/* harmony import */ var _stackDelete_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_stackDelete.js */ "./node_modules/lodash-es/_stackDelete.js");
/* harmony import */ var _stackGet_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_stackGet.js */ "./node_modules/lodash-es/_stackGet.js");
/* harmony import */ var _stackHas_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./_stackHas.js */ "./node_modules/lodash-es/_stackHas.js");
/* harmony import */ var _stackSet_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./_stackSet.js */ "./node_modules/lodash-es/_stackSet.js");







/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new _ListCache_js__WEBPACK_IMPORTED_MODULE_0__["default"](entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = _stackClear_js__WEBPACK_IMPORTED_MODULE_1__["default"];
Stack.prototype['delete'] = _stackDelete_js__WEBPACK_IMPORTED_MODULE_2__["default"];
Stack.prototype.get = _stackGet_js__WEBPACK_IMPORTED_MODULE_3__["default"];
Stack.prototype.has = _stackHas_js__WEBPACK_IMPORTED_MODULE_4__["default"];
Stack.prototype.set = _stackSet_js__WEBPACK_IMPORTED_MODULE_5__["default"];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Stack);

/***/ }),

/***/ "./node_modules/lodash-es/_Symbol.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash-es/_Symbol.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _root_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_root.js */ "./node_modules/lodash-es/_root.js");


/** Built-in value references. */
var Symbol = _root_js__WEBPACK_IMPORTED_MODULE_0__["default"].Symbol;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Symbol);

/***/ }),

/***/ "./node_modules/lodash-es/_Uint8Array.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_Uint8Array.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _root_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_root.js */ "./node_modules/lodash-es/_root.js");


/** Built-in value references. */
var Uint8Array = _root_js__WEBPACK_IMPORTED_MODULE_0__["default"].Uint8Array;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Uint8Array);

/***/ }),

/***/ "./node_modules/lodash-es/_WeakMap.js":
/*!********************************************!*\
  !*** ./node_modules/lodash-es/_WeakMap.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _getNative_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_getNative.js */ "./node_modules/lodash-es/_getNative.js");
/* harmony import */ var _root_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_root.js */ "./node_modules/lodash-es/_root.js");



/* Built-in method references that are verified to be native. */
var WeakMap = (0,_getNative_js__WEBPACK_IMPORTED_MODULE_0__["default"])(_root_js__WEBPACK_IMPORTED_MODULE_1__["default"], 'WeakMap');
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (WeakMap);

/***/ }),

/***/ "./node_modules/lodash-es/_apply.js":
/*!******************************************!*\
  !*** ./node_modules/lodash-es/_apply.js ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0:
      return func.call(thisArg);
    case 1:
      return func.call(thisArg, args[0]);
    case 2:
      return func.call(thisArg, args[0], args[1]);
    case 3:
      return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (apply);

/***/ }),

/***/ "./node_modules/lodash-es/_arrayEach.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash-es/_arrayEach.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
    length = array == null ? 0 : array.length;
  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (arrayEach);

/***/ }),

/***/ "./node_modules/lodash-es/_arrayFilter.js":
/*!************************************************!*\
  !*** ./node_modules/lodash-es/_arrayFilter.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
    length = array == null ? 0 : array.length,
    resIndex = 0,
    result = [];
  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (arrayFilter);

/***/ }),

/***/ "./node_modules/lodash-es/_arrayLikeKeys.js":
/*!**************************************************!*\
  !*** ./node_modules/lodash-es/_arrayLikeKeys.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _baseTimes_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./_baseTimes.js */ "./node_modules/lodash-es/_baseTimes.js");
/* harmony import */ var _isArguments_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isArguments.js */ "./node_modules/lodash-es/isArguments.js");
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isArray.js */ "./node_modules/lodash-es/isArray.js");
/* harmony import */ var _isBuffer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isBuffer.js */ "./node_modules/lodash-es/isBuffer.js");
/* harmony import */ var _isIndex_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./_isIndex.js */ "./node_modules/lodash-es/_isIndex.js");
/* harmony import */ var _isTypedArray_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./isTypedArray.js */ "./node_modules/lodash-es/isTypedArray.js");







/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = (0,_isArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value),
    isArg = !isArr && (0,_isArguments_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value),
    isBuff = !isArr && !isArg && (0,_isBuffer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(value),
    isType = !isArr && !isArg && !isBuff && (0,_isTypedArray_js__WEBPACK_IMPORTED_MODULE_3__["default"])(value),
    skipIndexes = isArr || isArg || isBuff || isType,
    result = skipIndexes ? (0,_baseTimes_js__WEBPACK_IMPORTED_MODULE_4__["default"])(value.length, String) : [],
    length = result.length;
  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (
    // Safari 9 has enumerable `arguments.length` in strict mode.
    key == 'length' ||
    // Node.js 0.10 has enumerable non-index properties on buffers.
    isBuff && (key == 'offset' || key == 'parent') ||
    // PhantomJS 2 has enumerable non-index properties on typed arrays.
    isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset') ||
    // Skip index properties.
    (0,_isIndex_js__WEBPACK_IMPORTED_MODULE_5__["default"])(key, length)))) {
      result.push(key);
    }
  }
  return result;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (arrayLikeKeys);

/***/ }),

/***/ "./node_modules/lodash-es/_arrayPush.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash-es/_arrayPush.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
    length = values.length,
    offset = array.length;
  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (arrayPush);

/***/ }),

/***/ "./node_modules/lodash-es/_arraySome.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash-es/_arraySome.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
    length = array == null ? 0 : array.length;
  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (arraySome);

/***/ }),

/***/ "./node_modules/lodash-es/_assignMergeValue.js":
/*!*****************************************************!*\
  !*** ./node_modules/lodash-es/_assignMergeValue.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _baseAssignValue_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseAssignValue.js */ "./node_modules/lodash-es/_baseAssignValue.js");
/* harmony import */ var _eq_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./eq.js */ "./node_modules/lodash-es/eq.js");



/**
 * This function is like `assignValue` except that it doesn't assign
 * `undefined` values.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignMergeValue(object, key, value) {
  if (value !== undefined && !(0,_eq_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object[key], value) || value === undefined && !(key in object)) {
    (0,_baseAssignValue_js__WEBPACK_IMPORTED_MODULE_1__["default"])(object, key, value);
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (assignMergeValue);

/***/ }),

/***/ "./node_modules/lodash-es/_assignValue.js":
/*!************************************************!*\
  !*** ./node_modules/lodash-es/_assignValue.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _baseAssignValue_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseAssignValue.js */ "./node_modules/lodash-es/_baseAssignValue.js");
/* harmony import */ var _eq_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./eq.js */ "./node_modules/lodash-es/eq.js");



/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && (0,_eq_js__WEBPACK_IMPORTED_MODULE_0__["default"])(objValue, value)) || value === undefined && !(key in object)) {
    (0,_baseAssignValue_js__WEBPACK_IMPORTED_MODULE_1__["default"])(object, key, value);
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (assignValue);

/***/ }),

/***/ "./node_modules/lodash-es/_assocIndexOf.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash-es/_assocIndexOf.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _eq_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./eq.js */ "./node_modules/lodash-es/eq.js");


/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if ((0,_eq_js__WEBPACK_IMPORTED_MODULE_0__["default"])(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (assocIndexOf);

/***/ }),

/***/ "./node_modules/lodash-es/_baseAssign.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_baseAssign.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _copyObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_copyObject.js */ "./node_modules/lodash-es/_copyObject.js");
/* harmony import */ var _keys_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./keys.js */ "./node_modules/lodash-es/keys.js");



/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && (0,_copyObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(source, (0,_keys_js__WEBPACK_IMPORTED_MODULE_1__["default"])(source), object);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseAssign);

/***/ }),

/***/ "./node_modules/lodash-es/_baseAssignIn.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash-es/_baseAssignIn.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _copyObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_copyObject.js */ "./node_modules/lodash-es/_copyObject.js");
/* harmony import */ var _keysIn_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./keysIn.js */ "./node_modules/lodash-es/keysIn.js");



/**
 * The base implementation of `_.assignIn` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssignIn(object, source) {
  return object && (0,_copyObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(source, (0,_keysIn_js__WEBPACK_IMPORTED_MODULE_1__["default"])(source), object);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseAssignIn);

/***/ }),

/***/ "./node_modules/lodash-es/_baseAssignValue.js":
/*!****************************************************!*\
  !*** ./node_modules/lodash-es/_baseAssignValue.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _defineProperty_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_defineProperty.js */ "./node_modules/lodash-es/_defineProperty.js");


/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && _defineProperty_js__WEBPACK_IMPORTED_MODULE_0__["default"]) {
    (0,_defineProperty_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseAssignValue);

/***/ }),

/***/ "./node_modules/lodash-es/_baseClone.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash-es/_baseClone.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Stack_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./_Stack.js */ "./node_modules/lodash-es/_Stack.js");
/* harmony import */ var _arrayEach_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./_arrayEach.js */ "./node_modules/lodash-es/_arrayEach.js");
/* harmony import */ var _assignValue_js__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./_assignValue.js */ "./node_modules/lodash-es/_assignValue.js");
/* harmony import */ var _baseAssign_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./_baseAssign.js */ "./node_modules/lodash-es/_baseAssign.js");
/* harmony import */ var _baseAssignIn_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./_baseAssignIn.js */ "./node_modules/lodash-es/_baseAssignIn.js");
/* harmony import */ var _cloneBuffer_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./_cloneBuffer.js */ "./node_modules/lodash-es/_cloneBuffer.js");
/* harmony import */ var _copyArray_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_copyArray.js */ "./node_modules/lodash-es/_copyArray.js");
/* harmony import */ var _copySymbols_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./_copySymbols.js */ "./node_modules/lodash-es/_copySymbols.js");
/* harmony import */ var _copySymbolsIn_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./_copySymbolsIn.js */ "./node_modules/lodash-es/_copySymbolsIn.js");
/* harmony import */ var _getAllKeys_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./_getAllKeys.js */ "./node_modules/lodash-es/_getAllKeys.js");
/* harmony import */ var _getAllKeysIn_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./_getAllKeysIn.js */ "./node_modules/lodash-es/_getAllKeysIn.js");
/* harmony import */ var _getTag_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./_getTag.js */ "./node_modules/lodash-es/_getTag.js");
/* harmony import */ var _initCloneArray_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_initCloneArray.js */ "./node_modules/lodash-es/_initCloneArray.js");
/* harmony import */ var _initCloneByTag_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./_initCloneByTag.js */ "./node_modules/lodash-es/_initCloneByTag.js");
/* harmony import */ var _initCloneObject_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./_initCloneObject.js */ "./node_modules/lodash-es/_initCloneObject.js");
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isArray.js */ "./node_modules/lodash-es/isArray.js");
/* harmony import */ var _isBuffer_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./isBuffer.js */ "./node_modules/lodash-es/isBuffer.js");
/* harmony import */ var _isMap_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./isMap.js */ "./node_modules/lodash-es/isMap.js");
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isObject.js */ "./node_modules/lodash-es/isObject.js");
/* harmony import */ var _isSet_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./isSet.js */ "./node_modules/lodash-es/isSet.js");
/* harmony import */ var _keys_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./keys.js */ "./node_modules/lodash-es/keys.js");
/* harmony import */ var _keysIn_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./keysIn.js */ "./node_modules/lodash-es/keysIn.js");























/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
  CLONE_FLAT_FLAG = 2,
  CLONE_SYMBOLS_FLAG = 4;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
  arrayTag = '[object Array]',
  boolTag = '[object Boolean]',
  dateTag = '[object Date]',
  errorTag = '[object Error]',
  funcTag = '[object Function]',
  genTag = '[object GeneratorFunction]',
  mapTag = '[object Map]',
  numberTag = '[object Number]',
  objectTag = '[object Object]',
  regexpTag = '[object RegExp]',
  setTag = '[object Set]',
  stringTag = '[object String]',
  symbolTag = '[object Symbol]',
  weakMapTag = '[object WeakMap]';
var arrayBufferTag = '[object ArrayBuffer]',
  dataViewTag = '[object DataView]',
  float32Tag = '[object Float32Array]',
  float64Tag = '[object Float64Array]',
  int8Tag = '[object Int8Array]',
  int16Tag = '[object Int16Array]',
  int32Tag = '[object Int32Array]',
  uint8Tag = '[object Uint8Array]',
  uint8ClampedTag = '[object Uint8ClampedArray]',
  uint16Tag = '[object Uint16Array]',
  uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Deep clone
 *  2 - Flatten inherited properties
 *  4 - Clone symbols
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, bitmask, customizer, key, object, stack) {
  var result,
    isDeep = bitmask & CLONE_DEEP_FLAG,
    isFlat = bitmask & CLONE_FLAT_FLAG,
    isFull = bitmask & CLONE_SYMBOLS_FLAG;
  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!(0,_isObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value)) {
    return value;
  }
  var isArr = (0,_isArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value);
  if (isArr) {
    result = (0,_initCloneArray_js__WEBPACK_IMPORTED_MODULE_2__["default"])(value);
    if (!isDeep) {
      return (0,_copyArray_js__WEBPACK_IMPORTED_MODULE_3__["default"])(value, result);
    }
  } else {
    var tag = (0,_getTag_js__WEBPACK_IMPORTED_MODULE_4__["default"])(value),
      isFunc = tag == funcTag || tag == genTag;
    if ((0,_isBuffer_js__WEBPACK_IMPORTED_MODULE_5__["default"])(value)) {
      return (0,_cloneBuffer_js__WEBPACK_IMPORTED_MODULE_6__["default"])(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || isFunc && !object) {
      result = isFlat || isFunc ? {} : (0,_initCloneObject_js__WEBPACK_IMPORTED_MODULE_7__["default"])(value);
      if (!isDeep) {
        return isFlat ? (0,_copySymbolsIn_js__WEBPACK_IMPORTED_MODULE_8__["default"])(value, (0,_baseAssignIn_js__WEBPACK_IMPORTED_MODULE_9__["default"])(result, value)) : (0,_copySymbols_js__WEBPACK_IMPORTED_MODULE_10__["default"])(value, (0,_baseAssign_js__WEBPACK_IMPORTED_MODULE_11__["default"])(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = (0,_initCloneByTag_js__WEBPACK_IMPORTED_MODULE_12__["default"])(value, tag, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new _Stack_js__WEBPACK_IMPORTED_MODULE_13__["default"]());
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);
  if ((0,_isSet_js__WEBPACK_IMPORTED_MODULE_14__["default"])(value)) {
    value.forEach(function (subValue) {
      result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
    });
  } else if ((0,_isMap_js__WEBPACK_IMPORTED_MODULE_15__["default"])(value)) {
    value.forEach(function (subValue, key) {
      result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
    });
  }
  var keysFunc = isFull ? isFlat ? _getAllKeysIn_js__WEBPACK_IMPORTED_MODULE_16__["default"] : _getAllKeys_js__WEBPACK_IMPORTED_MODULE_17__["default"] : isFlat ? _keysIn_js__WEBPACK_IMPORTED_MODULE_18__["default"] : _keys_js__WEBPACK_IMPORTED_MODULE_19__["default"];
  var props = isArr ? undefined : keysFunc(value);
  (0,_arrayEach_js__WEBPACK_IMPORTED_MODULE_20__["default"])(props || value, function (subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    (0,_assignValue_js__WEBPACK_IMPORTED_MODULE_21__["default"])(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
  });
  return result;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseClone);

/***/ }),

/***/ "./node_modules/lodash-es/_baseCreate.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_baseCreate.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isObject.js */ "./node_modules/lodash-es/isObject.js");


/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = function () {
  function object() {}
  return function (proto) {
    if (!(0,_isObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object();
    object.prototype = undefined;
    return result;
  };
}();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseCreate);

/***/ }),

/***/ "./node_modules/lodash-es/_baseFor.js":
/*!********************************************!*\
  !*** ./node_modules/lodash-es/_baseFor.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _createBaseFor_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_createBaseFor.js */ "./node_modules/lodash-es/_createBaseFor.js");


/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = (0,_createBaseFor_js__WEBPACK_IMPORTED_MODULE_0__["default"])();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseFor);

/***/ }),

/***/ "./node_modules/lodash-es/_baseGetAllKeys.js":
/*!***************************************************!*\
  !*** ./node_modules/lodash-es/_baseGetAllKeys.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _arrayPush_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_arrayPush.js */ "./node_modules/lodash-es/_arrayPush.js");
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isArray.js */ "./node_modules/lodash-es/isArray.js");



/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return (0,_isArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object) ? result : (0,_arrayPush_js__WEBPACK_IMPORTED_MODULE_1__["default"])(result, symbolsFunc(object));
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseGetAllKeys);

/***/ }),

/***/ "./node_modules/lodash-es/_baseGetTag.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_baseGetTag.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_Symbol.js */ "./node_modules/lodash-es/_Symbol.js");
/* harmony import */ var _getRawTag_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_getRawTag.js */ "./node_modules/lodash-es/_getRawTag.js");
/* harmony import */ var _objectToString_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_objectToString.js */ "./node_modules/lodash-es/_objectToString.js");




/** `Object#toString` result references. */
var nullTag = '[object Null]',
  undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = _Symbol_js__WEBPACK_IMPORTED_MODULE_0__["default"] ? _Symbol_js__WEBPACK_IMPORTED_MODULE_0__["default"].toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return symToStringTag && symToStringTag in Object(value) ? (0,_getRawTag_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value) : (0,_objectToString_js__WEBPACK_IMPORTED_MODULE_2__["default"])(value);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseGetTag);

/***/ }),

/***/ "./node_modules/lodash-es/_baseIsArguments.js":
/*!****************************************************!*\
  !*** ./node_modules/lodash-es/_baseIsArguments.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _baseGetTag_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseGetTag.js */ "./node_modules/lodash-es/_baseGetTag.js");
/* harmony import */ var _isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isObjectLike.js */ "./node_modules/lodash-es/isObjectLike.js");



/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return (0,_isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value) && (0,_baseGetTag_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value) == argsTag;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseIsArguments);

/***/ }),

/***/ "./node_modules/lodash-es/_baseIsEqual.js":
/*!************************************************!*\
  !*** ./node_modules/lodash-es/_baseIsEqual.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _baseIsEqualDeep_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseIsEqualDeep.js */ "./node_modules/lodash-es/_baseIsEqualDeep.js");
/* harmony import */ var _isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isObjectLike.js */ "./node_modules/lodash-es/isObjectLike.js");



/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || !(0,_isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value) && !(0,_isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__["default"])(other)) {
    return value !== value && other !== other;
  }
  return (0,_baseIsEqualDeep_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value, other, bitmask, customizer, baseIsEqual, stack);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseIsEqual);

/***/ }),

/***/ "./node_modules/lodash-es/_baseIsEqualDeep.js":
/*!****************************************************!*\
  !*** ./node_modules/lodash-es/_baseIsEqualDeep.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Stack_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_Stack.js */ "./node_modules/lodash-es/_Stack.js");
/* harmony import */ var _equalArrays_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./_equalArrays.js */ "./node_modules/lodash-es/_equalArrays.js");
/* harmony import */ var _equalByTag_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./_equalByTag.js */ "./node_modules/lodash-es/_equalByTag.js");
/* harmony import */ var _equalObjects_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./_equalObjects.js */ "./node_modules/lodash-es/_equalObjects.js");
/* harmony import */ var _getTag_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_getTag.js */ "./node_modules/lodash-es/_getTag.js");
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isArray.js */ "./node_modules/lodash-es/isArray.js");
/* harmony import */ var _isBuffer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isBuffer.js */ "./node_modules/lodash-es/isBuffer.js");
/* harmony import */ var _isTypedArray_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./isTypedArray.js */ "./node_modules/lodash-es/isTypedArray.js");









/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
  arrayTag = '[object Array]',
  objectTag = '[object Object]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = (0,_isArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object),
    othIsArr = (0,_isArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(other),
    objTag = objIsArr ? arrayTag : (0,_getTag_js__WEBPACK_IMPORTED_MODULE_1__["default"])(object),
    othTag = othIsArr ? arrayTag : (0,_getTag_js__WEBPACK_IMPORTED_MODULE_1__["default"])(other);
  objTag = objTag == argsTag ? objectTag : objTag;
  othTag = othTag == argsTag ? objectTag : othTag;
  var objIsObj = objTag == objectTag,
    othIsObj = othTag == objectTag,
    isSameTag = objTag == othTag;
  if (isSameTag && (0,_isBuffer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(object)) {
    if (!(0,_isBuffer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new _Stack_js__WEBPACK_IMPORTED_MODULE_3__["default"]());
    return objIsArr || (0,_isTypedArray_js__WEBPACK_IMPORTED_MODULE_4__["default"])(object) ? (0,_equalArrays_js__WEBPACK_IMPORTED_MODULE_5__["default"])(object, other, bitmask, customizer, equalFunc, stack) : (0,_equalByTag_js__WEBPACK_IMPORTED_MODULE_6__["default"])(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
      othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');
    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
        othUnwrapped = othIsWrapped ? other.value() : other;
      stack || (stack = new _Stack_js__WEBPACK_IMPORTED_MODULE_3__["default"]());
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new _Stack_js__WEBPACK_IMPORTED_MODULE_3__["default"]());
  return (0,_equalObjects_js__WEBPACK_IMPORTED_MODULE_7__["default"])(object, other, bitmask, customizer, equalFunc, stack);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseIsEqualDeep);

/***/ }),

/***/ "./node_modules/lodash-es/_baseIsMap.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash-es/_baseIsMap.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _getTag_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_getTag.js */ "./node_modules/lodash-es/_getTag.js");
/* harmony import */ var _isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isObjectLike.js */ "./node_modules/lodash-es/isObjectLike.js");



/** `Object#toString` result references. */
var mapTag = '[object Map]';

/**
 * The base implementation of `_.isMap` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 */
function baseIsMap(value) {
  return (0,_isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value) && (0,_getTag_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value) == mapTag;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseIsMap);

/***/ }),

/***/ "./node_modules/lodash-es/_baseIsNative.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash-es/_baseIsNative.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _isFunction_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isFunction.js */ "./node_modules/lodash-es/isFunction.js");
/* harmony import */ var _isMasked_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_isMasked.js */ "./node_modules/lodash-es/_isMasked.js");
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isObject.js */ "./node_modules/lodash-es/isObject.js");
/* harmony import */ var _toSource_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_toSource.js */ "./node_modules/lodash-es/_toSource.js");





/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
  objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' + funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!(0,_isObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value) || (0,_isMasked_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value)) {
    return false;
  }
  var pattern = (0,_isFunction_js__WEBPACK_IMPORTED_MODULE_2__["default"])(value) ? reIsNative : reIsHostCtor;
  return pattern.test((0,_toSource_js__WEBPACK_IMPORTED_MODULE_3__["default"])(value));
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseIsNative);

/***/ }),

/***/ "./node_modules/lodash-es/_baseIsSet.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash-es/_baseIsSet.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _getTag_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_getTag.js */ "./node_modules/lodash-es/_getTag.js");
/* harmony import */ var _isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isObjectLike.js */ "./node_modules/lodash-es/isObjectLike.js");



/** `Object#toString` result references. */
var setTag = '[object Set]';

/**
 * The base implementation of `_.isSet` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 */
function baseIsSet(value) {
  return (0,_isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value) && (0,_getTag_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value) == setTag;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseIsSet);

/***/ }),

/***/ "./node_modules/lodash-es/_baseIsTypedArray.js":
/*!*****************************************************!*\
  !*** ./node_modules/lodash-es/_baseIsTypedArray.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _baseGetTag_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_baseGetTag.js */ "./node_modules/lodash-es/_baseGetTag.js");
/* harmony import */ var _isLength_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isLength.js */ "./node_modules/lodash-es/isLength.js");
/* harmony import */ var _isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isObjectLike.js */ "./node_modules/lodash-es/isObjectLike.js");




/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
  arrayTag = '[object Array]',
  boolTag = '[object Boolean]',
  dateTag = '[object Date]',
  errorTag = '[object Error]',
  funcTag = '[object Function]',
  mapTag = '[object Map]',
  numberTag = '[object Number]',
  objectTag = '[object Object]',
  regexpTag = '[object RegExp]',
  setTag = '[object Set]',
  stringTag = '[object String]',
  weakMapTag = '[object WeakMap]';
var arrayBufferTag = '[object ArrayBuffer]',
  dataViewTag = '[object DataView]',
  float32Tag = '[object Float32Array]',
  float64Tag = '[object Float64Array]',
  int8Tag = '[object Int8Array]',
  int16Tag = '[object Int16Array]',
  int32Tag = '[object Int32Array]',
  uint8Tag = '[object Uint8Array]',
  uint8ClampedTag = '[object Uint8ClampedArray]',
  uint16Tag = '[object Uint16Array]',
  uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return (0,_isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value) && (0,_isLength_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value.length) && !!typedArrayTags[(0,_baseGetTag_js__WEBPACK_IMPORTED_MODULE_2__["default"])(value)];
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseIsTypedArray);

/***/ }),

/***/ "./node_modules/lodash-es/_baseKeys.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/_baseKeys.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _isPrototype_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_isPrototype.js */ "./node_modules/lodash-es/_isPrototype.js");
/* harmony import */ var _nativeKeys_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_nativeKeys.js */ "./node_modules/lodash-es/_nativeKeys.js");



/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!(0,_isPrototype_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object)) {
    return (0,_nativeKeys_js__WEBPACK_IMPORTED_MODULE_1__["default"])(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseKeys);

/***/ }),

/***/ "./node_modules/lodash-es/_baseKeysIn.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_baseKeysIn.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isObject.js */ "./node_modules/lodash-es/isObject.js");
/* harmony import */ var _isPrototype_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_isPrototype.js */ "./node_modules/lodash-es/_isPrototype.js");
/* harmony import */ var _nativeKeysIn_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_nativeKeysIn.js */ "./node_modules/lodash-es/_nativeKeysIn.js");




/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!(0,_isObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object)) {
    return (0,_nativeKeysIn_js__WEBPACK_IMPORTED_MODULE_1__["default"])(object);
  }
  var isProto = (0,_isPrototype_js__WEBPACK_IMPORTED_MODULE_2__["default"])(object),
    result = [];
  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseKeysIn);

/***/ }),

/***/ "./node_modules/lodash-es/_baseMerge.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash-es/_baseMerge.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Stack_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_Stack.js */ "./node_modules/lodash-es/_Stack.js");
/* harmony import */ var _assignMergeValue_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./_assignMergeValue.js */ "./node_modules/lodash-es/_assignMergeValue.js");
/* harmony import */ var _baseFor_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_baseFor.js */ "./node_modules/lodash-es/_baseFor.js");
/* harmony import */ var _baseMergeDeep_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_baseMergeDeep.js */ "./node_modules/lodash-es/_baseMergeDeep.js");
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isObject.js */ "./node_modules/lodash-es/isObject.js");
/* harmony import */ var _keysIn_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./keysIn.js */ "./node_modules/lodash-es/keysIn.js");
/* harmony import */ var _safeGet_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./_safeGet.js */ "./node_modules/lodash-es/_safeGet.js");








/**
 * The base implementation of `_.merge` without support for multiple sources.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} [customizer] The function to customize merged values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMerge(object, source, srcIndex, customizer, stack) {
  if (object === source) {
    return;
  }
  (0,_baseFor_js__WEBPACK_IMPORTED_MODULE_0__["default"])(source, function (srcValue, key) {
    stack || (stack = new _Stack_js__WEBPACK_IMPORTED_MODULE_1__["default"]());
    if ((0,_isObject_js__WEBPACK_IMPORTED_MODULE_2__["default"])(srcValue)) {
      (0,_baseMergeDeep_js__WEBPACK_IMPORTED_MODULE_3__["default"])(object, source, key, srcIndex, baseMerge, customizer, stack);
    } else {
      var newValue = customizer ? customizer((0,_safeGet_js__WEBPACK_IMPORTED_MODULE_4__["default"])(object, key), srcValue, key + '', object, source, stack) : undefined;
      if (newValue === undefined) {
        newValue = srcValue;
      }
      (0,_assignMergeValue_js__WEBPACK_IMPORTED_MODULE_5__["default"])(object, key, newValue);
    }
  }, _keysIn_js__WEBPACK_IMPORTED_MODULE_6__["default"]);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseMerge);

/***/ }),

/***/ "./node_modules/lodash-es/_baseMergeDeep.js":
/*!**************************************************!*\
  !*** ./node_modules/lodash-es/_baseMergeDeep.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _assignMergeValue_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_assignMergeValue.js */ "./node_modules/lodash-es/_assignMergeValue.js");
/* harmony import */ var _cloneBuffer_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./_cloneBuffer.js */ "./node_modules/lodash-es/_cloneBuffer.js");
/* harmony import */ var _cloneTypedArray_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./_cloneTypedArray.js */ "./node_modules/lodash-es/_cloneTypedArray.js");
/* harmony import */ var _copyArray_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./_copyArray.js */ "./node_modules/lodash-es/_copyArray.js");
/* harmony import */ var _initCloneObject_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./_initCloneObject.js */ "./node_modules/lodash-es/_initCloneObject.js");
/* harmony import */ var _isArguments_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./isArguments.js */ "./node_modules/lodash-es/isArguments.js");
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isArray.js */ "./node_modules/lodash-es/isArray.js");
/* harmony import */ var _isArrayLikeObject_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./isArrayLikeObject.js */ "./node_modules/lodash-es/isArrayLikeObject.js");
/* harmony import */ var _isBuffer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./isBuffer.js */ "./node_modules/lodash-es/isBuffer.js");
/* harmony import */ var _isFunction_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./isFunction.js */ "./node_modules/lodash-es/isFunction.js");
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./isObject.js */ "./node_modules/lodash-es/isObject.js");
/* harmony import */ var _isPlainObject_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./isPlainObject.js */ "./node_modules/lodash-es/isPlainObject.js");
/* harmony import */ var _isTypedArray_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./isTypedArray.js */ "./node_modules/lodash-es/isTypedArray.js");
/* harmony import */ var _safeGet_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_safeGet.js */ "./node_modules/lodash-es/_safeGet.js");
/* harmony import */ var _toPlainObject_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./toPlainObject.js */ "./node_modules/lodash-es/toPlainObject.js");
















/**
 * A specialized version of `baseMerge` for arrays and objects which performs
 * deep merges and tracks traversed objects enabling objects with circular
 * references to be merged.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {string} key The key of the value to merge.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} mergeFunc The function to merge values.
 * @param {Function} [customizer] The function to customize assigned values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
  var objValue = (0,_safeGet_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object, key),
    srcValue = (0,_safeGet_js__WEBPACK_IMPORTED_MODULE_0__["default"])(source, key),
    stacked = stack.get(srcValue);
  if (stacked) {
    (0,_assignMergeValue_js__WEBPACK_IMPORTED_MODULE_1__["default"])(object, key, stacked);
    return;
  }
  var newValue = customizer ? customizer(objValue, srcValue, key + '', object, source, stack) : undefined;
  var isCommon = newValue === undefined;
  if (isCommon) {
    var isArr = (0,_isArray_js__WEBPACK_IMPORTED_MODULE_2__["default"])(srcValue),
      isBuff = !isArr && (0,_isBuffer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(srcValue),
      isTyped = !isArr && !isBuff && (0,_isTypedArray_js__WEBPACK_IMPORTED_MODULE_4__["default"])(srcValue);
    newValue = srcValue;
    if (isArr || isBuff || isTyped) {
      if ((0,_isArray_js__WEBPACK_IMPORTED_MODULE_2__["default"])(objValue)) {
        newValue = objValue;
      } else if ((0,_isArrayLikeObject_js__WEBPACK_IMPORTED_MODULE_5__["default"])(objValue)) {
        newValue = (0,_copyArray_js__WEBPACK_IMPORTED_MODULE_6__["default"])(objValue);
      } else if (isBuff) {
        isCommon = false;
        newValue = (0,_cloneBuffer_js__WEBPACK_IMPORTED_MODULE_7__["default"])(srcValue, true);
      } else if (isTyped) {
        isCommon = false;
        newValue = (0,_cloneTypedArray_js__WEBPACK_IMPORTED_MODULE_8__["default"])(srcValue, true);
      } else {
        newValue = [];
      }
    } else if ((0,_isPlainObject_js__WEBPACK_IMPORTED_MODULE_9__["default"])(srcValue) || (0,_isArguments_js__WEBPACK_IMPORTED_MODULE_10__["default"])(srcValue)) {
      newValue = objValue;
      if ((0,_isArguments_js__WEBPACK_IMPORTED_MODULE_10__["default"])(objValue)) {
        newValue = (0,_toPlainObject_js__WEBPACK_IMPORTED_MODULE_11__["default"])(objValue);
      } else if (!(0,_isObject_js__WEBPACK_IMPORTED_MODULE_12__["default"])(objValue) || (0,_isFunction_js__WEBPACK_IMPORTED_MODULE_13__["default"])(objValue)) {
        newValue = (0,_initCloneObject_js__WEBPACK_IMPORTED_MODULE_14__["default"])(srcValue);
      }
    } else {
      isCommon = false;
    }
  }
  if (isCommon) {
    // Recursively merge objects and arrays (susceptible to call stack limits).
    stack.set(srcValue, newValue);
    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
    stack['delete'](srcValue);
  }
  (0,_assignMergeValue_js__WEBPACK_IMPORTED_MODULE_1__["default"])(object, key, newValue);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseMergeDeep);

/***/ }),

/***/ "./node_modules/lodash-es/_baseRest.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/_baseRest.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _identity_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./identity.js */ "./node_modules/lodash-es/identity.js");
/* harmony import */ var _overRest_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_overRest.js */ "./node_modules/lodash-es/_overRest.js");
/* harmony import */ var _setToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_setToString.js */ "./node_modules/lodash-es/_setToString.js");




/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  return (0,_setToString_js__WEBPACK_IMPORTED_MODULE_0__["default"])((0,_overRest_js__WEBPACK_IMPORTED_MODULE_1__["default"])(func, start, _identity_js__WEBPACK_IMPORTED_MODULE_2__["default"]), func + '');
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseRest);

/***/ }),

/***/ "./node_modules/lodash-es/_baseSetToString.js":
/*!****************************************************!*\
  !*** ./node_modules/lodash-es/_baseSetToString.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _constant_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constant.js */ "./node_modules/lodash-es/constant.js");
/* harmony import */ var _defineProperty_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_defineProperty.js */ "./node_modules/lodash-es/_defineProperty.js");
/* harmony import */ var _identity_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./identity.js */ "./node_modules/lodash-es/identity.js");




/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !_defineProperty_js__WEBPACK_IMPORTED_MODULE_0__["default"] ? _identity_js__WEBPACK_IMPORTED_MODULE_1__["default"] : function (func, string) {
  return (0,_defineProperty_js__WEBPACK_IMPORTED_MODULE_0__["default"])(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': (0,_constant_js__WEBPACK_IMPORTED_MODULE_2__["default"])(string),
    'writable': true
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseSetToString);

/***/ }),

/***/ "./node_modules/lodash-es/_baseTimes.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash-es/_baseTimes.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
    result = Array(n);
  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseTimes);

/***/ }),

/***/ "./node_modules/lodash-es/_baseUnary.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash-es/_baseUnary.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function (value) {
    return func(value);
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseUnary);

/***/ }),

/***/ "./node_modules/lodash-es/_cacheHas.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/_cacheHas.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (cacheHas);

/***/ }),

/***/ "./node_modules/lodash-es/_cloneArrayBuffer.js":
/*!*****************************************************!*\
  !*** ./node_modules/lodash-es/_cloneArrayBuffer.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Uint8Array_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_Uint8Array.js */ "./node_modules/lodash-es/_Uint8Array.js");


/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new _Uint8Array_js__WEBPACK_IMPORTED_MODULE_0__["default"](result).set(new _Uint8Array_js__WEBPACK_IMPORTED_MODULE_0__["default"](arrayBuffer));
  return result;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (cloneArrayBuffer);

/***/ }),

/***/ "./node_modules/lodash-es/_cloneBuffer.js":
/*!************************************************!*\
  !*** ./node_modules/lodash-es/_cloneBuffer.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _root_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_root.js */ "./node_modules/lodash-es/_root.js");


/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? _root_js__WEBPACK_IMPORTED_MODULE_0__["default"].Buffer : undefined,
  allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
    result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
  buffer.copy(result);
  return result;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (cloneBuffer);

/***/ }),

/***/ "./node_modules/lodash-es/_cloneDataView.js":
/*!**************************************************!*\
  !*** ./node_modules/lodash-es/_cloneDataView.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _cloneArrayBuffer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_cloneArrayBuffer.js */ "./node_modules/lodash-es/_cloneArrayBuffer.js");


/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? (0,_cloneArrayBuffer_js__WEBPACK_IMPORTED_MODULE_0__["default"])(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (cloneDataView);

/***/ }),

/***/ "./node_modules/lodash-es/_cloneRegExp.js":
/*!************************************************!*\
  !*** ./node_modules/lodash-es/_cloneRegExp.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (cloneRegExp);

/***/ }),

/***/ "./node_modules/lodash-es/_cloneSymbol.js":
/*!************************************************!*\
  !*** ./node_modules/lodash-es/_cloneSymbol.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_Symbol.js */ "./node_modules/lodash-es/_Symbol.js");


/** Used to convert symbols to primitives and strings. */
var symbolProto = _Symbol_js__WEBPACK_IMPORTED_MODULE_0__["default"] ? _Symbol_js__WEBPACK_IMPORTED_MODULE_0__["default"].prototype : undefined,
  symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (cloneSymbol);

/***/ }),

/***/ "./node_modules/lodash-es/_cloneTypedArray.js":
/*!****************************************************!*\
  !*** ./node_modules/lodash-es/_cloneTypedArray.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _cloneArrayBuffer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_cloneArrayBuffer.js */ "./node_modules/lodash-es/_cloneArrayBuffer.js");


/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? (0,_cloneArrayBuffer_js__WEBPACK_IMPORTED_MODULE_0__["default"])(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (cloneTypedArray);

/***/ }),

/***/ "./node_modules/lodash-es/_copyArray.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash-es/_copyArray.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
    length = source.length;
  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (copyArray);

/***/ }),

/***/ "./node_modules/lodash-es/_copyObject.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_copyObject.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _assignValue_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_assignValue.js */ "./node_modules/lodash-es/_assignValue.js");
/* harmony import */ var _baseAssignValue_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_baseAssignValue.js */ "./node_modules/lodash-es/_baseAssignValue.js");



/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});
  var index = -1,
    length = props.length;
  while (++index < length) {
    var key = props[index];
    var newValue = customizer ? customizer(object[key], source[key], key, object, source) : undefined;
    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      (0,_baseAssignValue_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object, key, newValue);
    } else {
      (0,_assignValue_js__WEBPACK_IMPORTED_MODULE_1__["default"])(object, key, newValue);
    }
  }
  return object;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (copyObject);

/***/ }),

/***/ "./node_modules/lodash-es/_copySymbols.js":
/*!************************************************!*\
  !*** ./node_modules/lodash-es/_copySymbols.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _copyObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_copyObject.js */ "./node_modules/lodash-es/_copyObject.js");
/* harmony import */ var _getSymbols_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_getSymbols.js */ "./node_modules/lodash-es/_getSymbols.js");



/**
 * Copies own symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return (0,_copyObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(source, (0,_getSymbols_js__WEBPACK_IMPORTED_MODULE_1__["default"])(source), object);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (copySymbols);

/***/ }),

/***/ "./node_modules/lodash-es/_copySymbolsIn.js":
/*!**************************************************!*\
  !*** ./node_modules/lodash-es/_copySymbolsIn.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _copyObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_copyObject.js */ "./node_modules/lodash-es/_copyObject.js");
/* harmony import */ var _getSymbolsIn_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_getSymbolsIn.js */ "./node_modules/lodash-es/_getSymbolsIn.js");



/**
 * Copies own and inherited symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbolsIn(source, object) {
  return (0,_copyObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(source, (0,_getSymbolsIn_js__WEBPACK_IMPORTED_MODULE_1__["default"])(source), object);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (copySymbolsIn);

/***/ }),

/***/ "./node_modules/lodash-es/_coreJsData.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_coreJsData.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _root_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_root.js */ "./node_modules/lodash-es/_root.js");


/** Used to detect overreaching core-js shims. */
var coreJsData = _root_js__WEBPACK_IMPORTED_MODULE_0__["default"]['__core-js_shared__'];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (coreJsData);

/***/ }),

/***/ "./node_modules/lodash-es/_createAssigner.js":
/*!***************************************************!*\
  !*** ./node_modules/lodash-es/_createAssigner.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _baseRest_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_baseRest.js */ "./node_modules/lodash-es/_baseRest.js");
/* harmony import */ var _isIterateeCall_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_isIterateeCall.js */ "./node_modules/lodash-es/_isIterateeCall.js");



/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return (0,_baseRest_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function (object, sources) {
    var index = -1,
      length = sources.length,
      customizer = length > 1 ? sources[length - 1] : undefined,
      guard = length > 2 ? sources[2] : undefined;
    customizer = assigner.length > 3 && typeof customizer == 'function' ? (length--, customizer) : undefined;
    if (guard && (0,_isIterateeCall_js__WEBPACK_IMPORTED_MODULE_1__["default"])(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createAssigner);

/***/ }),

/***/ "./node_modules/lodash-es/_createBaseFor.js":
/*!**************************************************!*\
  !*** ./node_modules/lodash-es/_createBaseFor.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function (object, iteratee, keysFunc) {
    var index = -1,
      iterable = Object(object),
      props = keysFunc(object),
      length = props.length;
    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createBaseFor);

/***/ }),

/***/ "./node_modules/lodash-es/_defineProperty.js":
/*!***************************************************!*\
  !*** ./node_modules/lodash-es/_defineProperty.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _getNative_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_getNative.js */ "./node_modules/lodash-es/_getNative.js");

var defineProperty = function () {
  try {
    var func = (0,_getNative_js__WEBPACK_IMPORTED_MODULE_0__["default"])(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (defineProperty);

/***/ }),

/***/ "./node_modules/lodash-es/_equalArrays.js":
/*!************************************************!*\
  !*** ./node_modules/lodash-es/_equalArrays.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _SetCache_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_SetCache.js */ "./node_modules/lodash-es/_SetCache.js");
/* harmony import */ var _arraySome_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_arraySome.js */ "./node_modules/lodash-es/_arraySome.js");
/* harmony import */ var _cacheHas_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_cacheHas.js */ "./node_modules/lodash-es/_cacheHas.js");




/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
  COMPARE_UNORDERED_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
    arrLength = array.length,
    othLength = other.length;
  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Check that cyclic values are equal.
  var arrStacked = stack.get(array);
  var othStacked = stack.get(other);
  if (arrStacked && othStacked) {
    return arrStacked == other && othStacked == array;
  }
  var index = -1,
    result = true,
    seen = bitmask & COMPARE_UNORDERED_FLAG ? new _SetCache_js__WEBPACK_IMPORTED_MODULE_0__["default"]() : undefined;
  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
      othValue = other[index];
    if (customizer) {
      var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!(0,_arraySome_js__WEBPACK_IMPORTED_MODULE_1__["default"])(other, function (othValue, othIndex) {
        if (!(0,_cacheHas_js__WEBPACK_IMPORTED_MODULE_2__["default"])(seen, othIndex) && (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
          return seen.push(othIndex);
        }
      })) {
        result = false;
        break;
      }
    } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (equalArrays);

/***/ }),

/***/ "./node_modules/lodash-es/_equalByTag.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_equalByTag.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_Symbol.js */ "./node_modules/lodash-es/_Symbol.js");
/* harmony import */ var _Uint8Array_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_Uint8Array.js */ "./node_modules/lodash-es/_Uint8Array.js");
/* harmony import */ var _eq_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./eq.js */ "./node_modules/lodash-es/eq.js");
/* harmony import */ var _equalArrays_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./_equalArrays.js */ "./node_modules/lodash-es/_equalArrays.js");
/* harmony import */ var _mapToArray_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_mapToArray.js */ "./node_modules/lodash-es/_mapToArray.js");
/* harmony import */ var _setToArray_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./_setToArray.js */ "./node_modules/lodash-es/_setToArray.js");







/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
  COMPARE_UNORDERED_FLAG = 2;

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
  dateTag = '[object Date]',
  errorTag = '[object Error]',
  mapTag = '[object Map]',
  numberTag = '[object Number]',
  regexpTag = '[object RegExp]',
  setTag = '[object Set]',
  stringTag = '[object String]',
  symbolTag = '[object Symbol]';
var arrayBufferTag = '[object ArrayBuffer]',
  dataViewTag = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto = _Symbol_js__WEBPACK_IMPORTED_MODULE_0__["default"] ? _Symbol_js__WEBPACK_IMPORTED_MODULE_0__["default"].prototype : undefined,
  symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;
    case arrayBufferTag:
      if (object.byteLength != other.byteLength || !equalFunc(new _Uint8Array_js__WEBPACK_IMPORTED_MODULE_1__["default"](object), new _Uint8Array_js__WEBPACK_IMPORTED_MODULE_1__["default"](other))) {
        return false;
      }
      return true;
    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return (0,_eq_js__WEBPACK_IMPORTED_MODULE_2__["default"])(+object, +other);
    case errorTag:
      return object.name == other.name && object.message == other.message;
    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == other + '';
    case mapTag:
      var convert = _mapToArray_js__WEBPACK_IMPORTED_MODULE_3__["default"];
    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
      convert || (convert = _setToArray_js__WEBPACK_IMPORTED_MODULE_4__["default"]);
      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = (0,_equalArrays_js__WEBPACK_IMPORTED_MODULE_5__["default"])(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;
    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (equalByTag);

/***/ }),

/***/ "./node_modules/lodash-es/_equalObjects.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash-es/_equalObjects.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _getAllKeys_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_getAllKeys.js */ "./node_modules/lodash-es/_getAllKeys.js");


/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
    objProps = (0,_getAllKeys_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object),
    objLength = objProps.length,
    othProps = (0,_getAllKeys_js__WEBPACK_IMPORTED_MODULE_0__["default"])(other),
    othLength = othProps.length;
  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Check that cyclic values are equal.
  var objStacked = stack.get(object);
  var othStacked = stack.get(other);
  if (objStacked && othStacked) {
    return objStacked == other && othStacked == object;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);
  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
      othValue = other[key];
    if (customizer) {
      var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
      othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor && 'constructor' in object && 'constructor' in other && !(typeof objCtor == 'function' && objCtor instanceof objCtor && typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (equalObjects);

/***/ }),

/***/ "./node_modules/lodash-es/_freeGlobal.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_freeGlobal.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (freeGlobal);

/***/ }),

/***/ "./node_modules/lodash-es/_getAllKeys.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_getAllKeys.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _baseGetAllKeys_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_baseGetAllKeys.js */ "./node_modules/lodash-es/_baseGetAllKeys.js");
/* harmony import */ var _getSymbols_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_getSymbols.js */ "./node_modules/lodash-es/_getSymbols.js");
/* harmony import */ var _keys_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./keys.js */ "./node_modules/lodash-es/keys.js");




/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return (0,_baseGetAllKeys_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object, _keys_js__WEBPACK_IMPORTED_MODULE_1__["default"], _getSymbols_js__WEBPACK_IMPORTED_MODULE_2__["default"]);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getAllKeys);

/***/ }),

/***/ "./node_modules/lodash-es/_getAllKeysIn.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash-es/_getAllKeysIn.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _baseGetAllKeys_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_baseGetAllKeys.js */ "./node_modules/lodash-es/_baseGetAllKeys.js");
/* harmony import */ var _getSymbolsIn_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_getSymbolsIn.js */ "./node_modules/lodash-es/_getSymbolsIn.js");
/* harmony import */ var _keysIn_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./keysIn.js */ "./node_modules/lodash-es/keysIn.js");




/**
 * Creates an array of own and inherited enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeysIn(object) {
  return (0,_baseGetAllKeys_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object, _keysIn_js__WEBPACK_IMPORTED_MODULE_1__["default"], _getSymbolsIn_js__WEBPACK_IMPORTED_MODULE_2__["default"]);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getAllKeysIn);

/***/ }),

/***/ "./node_modules/lodash-es/_getMapData.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_getMapData.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _isKeyable_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_isKeyable.js */ "./node_modules/lodash-es/_isKeyable.js");


/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return (0,_isKeyable_js__WEBPACK_IMPORTED_MODULE_0__["default"])(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getMapData);

/***/ }),

/***/ "./node_modules/lodash-es/_getNative.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash-es/_getNative.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _baseIsNative_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseIsNative.js */ "./node_modules/lodash-es/_baseIsNative.js");
/* harmony import */ var _getValue_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_getValue.js */ "./node_modules/lodash-es/_getValue.js");



/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = (0,_getValue_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object, key);
  return (0,_baseIsNative_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value) ? value : undefined;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getNative);

/***/ }),

/***/ "./node_modules/lodash-es/_getPrototype.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash-es/_getPrototype.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _overArg_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_overArg.js */ "./node_modules/lodash-es/_overArg.js");


/** Built-in value references. */
var getPrototype = (0,_overArg_js__WEBPACK_IMPORTED_MODULE_0__["default"])(Object.getPrototypeOf, Object);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getPrototype);

/***/ }),

/***/ "./node_modules/lodash-es/_getRawTag.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash-es/_getRawTag.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_Symbol.js */ "./node_modules/lodash-es/_Symbol.js");


/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = _Symbol_js__WEBPACK_IMPORTED_MODULE_0__["default"] ? _Symbol_js__WEBPACK_IMPORTED_MODULE_0__["default"].toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
    tag = value[symToStringTag];
  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}
  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getRawTag);

/***/ }),

/***/ "./node_modules/lodash-es/_getSymbols.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_getSymbols.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _arrayFilter_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_arrayFilter.js */ "./node_modules/lodash-es/_arrayFilter.js");
/* harmony import */ var _stubArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./stubArray.js */ "./node_modules/lodash-es/stubArray.js");



/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? _stubArray_js__WEBPACK_IMPORTED_MODULE_0__["default"] : function (object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return (0,_arrayFilter_js__WEBPACK_IMPORTED_MODULE_1__["default"])(nativeGetSymbols(object), function (symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getSymbols);

/***/ }),

/***/ "./node_modules/lodash-es/_getSymbolsIn.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash-es/_getSymbolsIn.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _arrayPush_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_arrayPush.js */ "./node_modules/lodash-es/_arrayPush.js");
/* harmony import */ var _getPrototype_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_getPrototype.js */ "./node_modules/lodash-es/_getPrototype.js");
/* harmony import */ var _getSymbols_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_getSymbols.js */ "./node_modules/lodash-es/_getSymbols.js");
/* harmony import */ var _stubArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./stubArray.js */ "./node_modules/lodash-es/stubArray.js");





/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own and inherited enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbolsIn = !nativeGetSymbols ? _stubArray_js__WEBPACK_IMPORTED_MODULE_0__["default"] : function (object) {
  var result = [];
  while (object) {
    (0,_arrayPush_js__WEBPACK_IMPORTED_MODULE_1__["default"])(result, (0,_getSymbols_js__WEBPACK_IMPORTED_MODULE_2__["default"])(object));
    object = (0,_getPrototype_js__WEBPACK_IMPORTED_MODULE_3__["default"])(object);
  }
  return result;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getSymbolsIn);

/***/ }),

/***/ "./node_modules/lodash-es/_getTag.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash-es/_getTag.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _DataView_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_DataView.js */ "./node_modules/lodash-es/_DataView.js");
/* harmony import */ var _Map_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_Map.js */ "./node_modules/lodash-es/_Map.js");
/* harmony import */ var _Promise_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_Promise.js */ "./node_modules/lodash-es/_Promise.js");
/* harmony import */ var _Set_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./_Set.js */ "./node_modules/lodash-es/_Set.js");
/* harmony import */ var _WeakMap_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./_WeakMap.js */ "./node_modules/lodash-es/_WeakMap.js");
/* harmony import */ var _baseGetTag_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./_baseGetTag.js */ "./node_modules/lodash-es/_baseGetTag.js");
/* harmony import */ var _toSource_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_toSource.js */ "./node_modules/lodash-es/_toSource.js");








/** `Object#toString` result references. */
var mapTag = '[object Map]',
  objectTag = '[object Object]',
  promiseTag = '[object Promise]',
  setTag = '[object Set]',
  weakMapTag = '[object WeakMap]';
var dataViewTag = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = (0,_toSource_js__WEBPACK_IMPORTED_MODULE_0__["default"])(_DataView_js__WEBPACK_IMPORTED_MODULE_1__["default"]),
  mapCtorString = (0,_toSource_js__WEBPACK_IMPORTED_MODULE_0__["default"])(_Map_js__WEBPACK_IMPORTED_MODULE_2__["default"]),
  promiseCtorString = (0,_toSource_js__WEBPACK_IMPORTED_MODULE_0__["default"])(_Promise_js__WEBPACK_IMPORTED_MODULE_3__["default"]),
  setCtorString = (0,_toSource_js__WEBPACK_IMPORTED_MODULE_0__["default"])(_Set_js__WEBPACK_IMPORTED_MODULE_4__["default"]),
  weakMapCtorString = (0,_toSource_js__WEBPACK_IMPORTED_MODULE_0__["default"])(_WeakMap_js__WEBPACK_IMPORTED_MODULE_5__["default"]);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = _baseGetTag_js__WEBPACK_IMPORTED_MODULE_6__["default"];

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if (_DataView_js__WEBPACK_IMPORTED_MODULE_1__["default"] && getTag(new _DataView_js__WEBPACK_IMPORTED_MODULE_1__["default"](new ArrayBuffer(1))) != dataViewTag || _Map_js__WEBPACK_IMPORTED_MODULE_2__["default"] && getTag(new _Map_js__WEBPACK_IMPORTED_MODULE_2__["default"]()) != mapTag || _Promise_js__WEBPACK_IMPORTED_MODULE_3__["default"] && getTag(_Promise_js__WEBPACK_IMPORTED_MODULE_3__["default"].resolve()) != promiseTag || _Set_js__WEBPACK_IMPORTED_MODULE_4__["default"] && getTag(new _Set_js__WEBPACK_IMPORTED_MODULE_4__["default"]()) != setTag || _WeakMap_js__WEBPACK_IMPORTED_MODULE_5__["default"] && getTag(new _WeakMap_js__WEBPACK_IMPORTED_MODULE_5__["default"]()) != weakMapTag) {
  getTag = function getTag(value) {
    var result = (0,_baseGetTag_js__WEBPACK_IMPORTED_MODULE_6__["default"])(value),
      Ctor = result == objectTag ? value.constructor : undefined,
      ctorString = Ctor ? (0,_toSource_js__WEBPACK_IMPORTED_MODULE_0__["default"])(Ctor) : '';
    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString:
          return dataViewTag;
        case mapCtorString:
          return mapTag;
        case promiseCtorString:
          return promiseTag;
        case setCtorString:
          return setTag;
        case weakMapCtorString:
          return weakMapTag;
      }
    }
    return result;
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getTag);

/***/ }),

/***/ "./node_modules/lodash-es/_getValue.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/_getValue.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getValue);

/***/ }),

/***/ "./node_modules/lodash-es/_hashClear.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash-es/_hashClear.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _nativeCreate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_nativeCreate.js */ "./node_modules/lodash-es/_nativeCreate.js");


/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = _nativeCreate_js__WEBPACK_IMPORTED_MODULE_0__["default"] ? (0,_nativeCreate_js__WEBPACK_IMPORTED_MODULE_0__["default"])(null) : {};
  this.size = 0;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (hashClear);

/***/ }),

/***/ "./node_modules/lodash-es/_hashDelete.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_hashDelete.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (hashDelete);

/***/ }),

/***/ "./node_modules/lodash-es/_hashGet.js":
/*!********************************************!*\
  !*** ./node_modules/lodash-es/_hashGet.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _nativeCreate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_nativeCreate.js */ "./node_modules/lodash-es/_nativeCreate.js");


/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (_nativeCreate_js__WEBPACK_IMPORTED_MODULE_0__["default"]) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (hashGet);

/***/ }),

/***/ "./node_modules/lodash-es/_hashHas.js":
/*!********************************************!*\
  !*** ./node_modules/lodash-es/_hashHas.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _nativeCreate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_nativeCreate.js */ "./node_modules/lodash-es/_nativeCreate.js");


/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return _nativeCreate_js__WEBPACK_IMPORTED_MODULE_0__["default"] ? data[key] !== undefined : hasOwnProperty.call(data, key);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (hashHas);

/***/ }),

/***/ "./node_modules/lodash-es/_hashSet.js":
/*!********************************************!*\
  !*** ./node_modules/lodash-es/_hashSet.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _nativeCreate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_nativeCreate.js */ "./node_modules/lodash-es/_nativeCreate.js");


/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = _nativeCreate_js__WEBPACK_IMPORTED_MODULE_0__["default"] && value === undefined ? HASH_UNDEFINED : value;
  return this;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (hashSet);

/***/ }),

/***/ "./node_modules/lodash-es/_initCloneArray.js":
/*!***************************************************!*\
  !*** ./node_modules/lodash-es/_initCloneArray.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
    result = new array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (initCloneArray);

/***/ }),

/***/ "./node_modules/lodash-es/_initCloneByTag.js":
/*!***************************************************!*\
  !*** ./node_modules/lodash-es/_initCloneByTag.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _cloneArrayBuffer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_cloneArrayBuffer.js */ "./node_modules/lodash-es/_cloneArrayBuffer.js");
/* harmony import */ var _cloneDataView_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_cloneDataView.js */ "./node_modules/lodash-es/_cloneDataView.js");
/* harmony import */ var _cloneRegExp_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_cloneRegExp.js */ "./node_modules/lodash-es/_cloneRegExp.js");
/* harmony import */ var _cloneSymbol_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./_cloneSymbol.js */ "./node_modules/lodash-es/_cloneSymbol.js");
/* harmony import */ var _cloneTypedArray_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_cloneTypedArray.js */ "./node_modules/lodash-es/_cloneTypedArray.js");






/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
  dateTag = '[object Date]',
  mapTag = '[object Map]',
  numberTag = '[object Number]',
  regexpTag = '[object RegExp]',
  setTag = '[object Set]',
  stringTag = '[object String]',
  symbolTag = '[object Symbol]';
var arrayBufferTag = '[object ArrayBuffer]',
  dataViewTag = '[object DataView]',
  float32Tag = '[object Float32Array]',
  float64Tag = '[object Float64Array]',
  int8Tag = '[object Int8Array]',
  int16Tag = '[object Int16Array]',
  int32Tag = '[object Int32Array]',
  uint8Tag = '[object Uint8Array]',
  uint8ClampedTag = '[object Uint8ClampedArray]',
  uint16Tag = '[object Uint16Array]',
  uint32Tag = '[object Uint32Array]';

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return (0,_cloneArrayBuffer_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object);
    case boolTag:
    case dateTag:
      return new Ctor(+object);
    case dataViewTag:
      return (0,_cloneDataView_js__WEBPACK_IMPORTED_MODULE_1__["default"])(object, isDeep);
    case float32Tag:
    case float64Tag:
    case int8Tag:
    case int16Tag:
    case int32Tag:
    case uint8Tag:
    case uint8ClampedTag:
    case uint16Tag:
    case uint32Tag:
      return (0,_cloneTypedArray_js__WEBPACK_IMPORTED_MODULE_2__["default"])(object, isDeep);
    case mapTag:
      return new Ctor();
    case numberTag:
    case stringTag:
      return new Ctor(object);
    case regexpTag:
      return (0,_cloneRegExp_js__WEBPACK_IMPORTED_MODULE_3__["default"])(object);
    case setTag:
      return new Ctor();
    case symbolTag:
      return (0,_cloneSymbol_js__WEBPACK_IMPORTED_MODULE_4__["default"])(object);
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (initCloneByTag);

/***/ }),

/***/ "./node_modules/lodash-es/_initCloneObject.js":
/*!****************************************************!*\
  !*** ./node_modules/lodash-es/_initCloneObject.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _baseCreate_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseCreate.js */ "./node_modules/lodash-es/_baseCreate.js");
/* harmony import */ var _getPrototype_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_getPrototype.js */ "./node_modules/lodash-es/_getPrototype.js");
/* harmony import */ var _isPrototype_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_isPrototype.js */ "./node_modules/lodash-es/_isPrototype.js");




/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return typeof object.constructor == 'function' && !(0,_isPrototype_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object) ? (0,_baseCreate_js__WEBPACK_IMPORTED_MODULE_1__["default"])((0,_getPrototype_js__WEBPACK_IMPORTED_MODULE_2__["default"])(object)) : {};
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (initCloneObject);

/***/ }),

/***/ "./node_modules/lodash-es/_isIndex.js":
/*!********************************************!*\
  !*** ./node_modules/lodash-es/_isIndex.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length && (type == 'number' || type != 'symbol' && reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isIndex);

/***/ }),

/***/ "./node_modules/lodash-es/_isIterateeCall.js":
/*!***************************************************!*\
  !*** ./node_modules/lodash-es/_isIterateeCall.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _eq_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./eq.js */ "./node_modules/lodash-es/eq.js");
/* harmony import */ var _isArrayLike_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isArrayLike.js */ "./node_modules/lodash-es/isArrayLike.js");
/* harmony import */ var _isIndex_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_isIndex.js */ "./node_modules/lodash-es/_isIndex.js");
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isObject.js */ "./node_modules/lodash-es/isObject.js");





/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!(0,_isObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number' ? (0,_isArrayLike_js__WEBPACK_IMPORTED_MODULE_1__["default"])(object) && (0,_isIndex_js__WEBPACK_IMPORTED_MODULE_2__["default"])(index, object.length) : type == 'string' && index in object) {
    return (0,_eq_js__WEBPACK_IMPORTED_MODULE_3__["default"])(object[index], value);
  }
  return false;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isIterateeCall);

/***/ }),

/***/ "./node_modules/lodash-es/_isKeyable.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash-es/_isKeyable.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean' ? value !== '__proto__' : value === null;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isKeyable);

/***/ }),

/***/ "./node_modules/lodash-es/_isMasked.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/_isMasked.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _coreJsData_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_coreJsData.js */ "./node_modules/lodash-es/_coreJsData.js");


/** Used to detect methods masquerading as native. */
var maskSrcKey = function () {
  var uid = /[^.]+$/.exec(_coreJsData_js__WEBPACK_IMPORTED_MODULE_0__["default"] && _coreJsData_js__WEBPACK_IMPORTED_MODULE_0__["default"].keys && _coreJsData_js__WEBPACK_IMPORTED_MODULE_0__["default"].keys.IE_PROTO || '');
  return uid ? 'Symbol(src)_1.' + uid : '';
}();

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && maskSrcKey in func;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isMasked);

/***/ }),

/***/ "./node_modules/lodash-es/_isPrototype.js":
/*!************************************************!*\
  !*** ./node_modules/lodash-es/_isPrototype.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
    proto = typeof Ctor == 'function' && Ctor.prototype || objectProto;
  return value === proto;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isPrototype);

/***/ }),

/***/ "./node_modules/lodash-es/_listCacheClear.js":
/*!***************************************************!*\
  !*** ./node_modules/lodash-es/_listCacheClear.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (listCacheClear);

/***/ }),

/***/ "./node_modules/lodash-es/_listCacheDelete.js":
/*!****************************************************!*\
  !*** ./node_modules/lodash-es/_listCacheDelete.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _assocIndexOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_assocIndexOf.js */ "./node_modules/lodash-es/_assocIndexOf.js");


/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
    index = (0,_assocIndexOf_js__WEBPACK_IMPORTED_MODULE_0__["default"])(data, key);
  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (listCacheDelete);

/***/ }),

/***/ "./node_modules/lodash-es/_listCacheGet.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash-es/_listCacheGet.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _assocIndexOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_assocIndexOf.js */ "./node_modules/lodash-es/_assocIndexOf.js");


/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
    index = (0,_assocIndexOf_js__WEBPACK_IMPORTED_MODULE_0__["default"])(data, key);
  return index < 0 ? undefined : data[index][1];
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (listCacheGet);

/***/ }),

/***/ "./node_modules/lodash-es/_listCacheHas.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash-es/_listCacheHas.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _assocIndexOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_assocIndexOf.js */ "./node_modules/lodash-es/_assocIndexOf.js");


/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return (0,_assocIndexOf_js__WEBPACK_IMPORTED_MODULE_0__["default"])(this.__data__, key) > -1;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (listCacheHas);

/***/ }),

/***/ "./node_modules/lodash-es/_listCacheSet.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash-es/_listCacheSet.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _assocIndexOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_assocIndexOf.js */ "./node_modules/lodash-es/_assocIndexOf.js");


/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
    index = (0,_assocIndexOf_js__WEBPACK_IMPORTED_MODULE_0__["default"])(data, key);
  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (listCacheSet);

/***/ }),

/***/ "./node_modules/lodash-es/_mapCacheClear.js":
/*!**************************************************!*\
  !*** ./node_modules/lodash-es/_mapCacheClear.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Hash_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_Hash.js */ "./node_modules/lodash-es/_Hash.js");
/* harmony import */ var _ListCache_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_ListCache.js */ "./node_modules/lodash-es/_ListCache.js");
/* harmony import */ var _Map_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_Map.js */ "./node_modules/lodash-es/_Map.js");




/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new _Hash_js__WEBPACK_IMPORTED_MODULE_0__["default"](),
    'map': new (_Map_js__WEBPACK_IMPORTED_MODULE_1__["default"] || _ListCache_js__WEBPACK_IMPORTED_MODULE_2__["default"])(),
    'string': new _Hash_js__WEBPACK_IMPORTED_MODULE_0__["default"]()
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (mapCacheClear);

/***/ }),

/***/ "./node_modules/lodash-es/_mapCacheDelete.js":
/*!***************************************************!*\
  !*** ./node_modules/lodash-es/_mapCacheDelete.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _getMapData_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_getMapData.js */ "./node_modules/lodash-es/_getMapData.js");


/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = (0,_getMapData_js__WEBPACK_IMPORTED_MODULE_0__["default"])(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (mapCacheDelete);

/***/ }),

/***/ "./node_modules/lodash-es/_mapCacheGet.js":
/*!************************************************!*\
  !*** ./node_modules/lodash-es/_mapCacheGet.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _getMapData_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_getMapData.js */ "./node_modules/lodash-es/_getMapData.js");


/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return (0,_getMapData_js__WEBPACK_IMPORTED_MODULE_0__["default"])(this, key).get(key);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (mapCacheGet);

/***/ }),

/***/ "./node_modules/lodash-es/_mapCacheHas.js":
/*!************************************************!*\
  !*** ./node_modules/lodash-es/_mapCacheHas.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _getMapData_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_getMapData.js */ "./node_modules/lodash-es/_getMapData.js");


/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return (0,_getMapData_js__WEBPACK_IMPORTED_MODULE_0__["default"])(this, key).has(key);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (mapCacheHas);

/***/ }),

/***/ "./node_modules/lodash-es/_mapCacheSet.js":
/*!************************************************!*\
  !*** ./node_modules/lodash-es/_mapCacheSet.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _getMapData_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_getMapData.js */ "./node_modules/lodash-es/_getMapData.js");


/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = (0,_getMapData_js__WEBPACK_IMPORTED_MODULE_0__["default"])(this, key),
    size = data.size;
  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (mapCacheSet);

/***/ }),

/***/ "./node_modules/lodash-es/_mapToArray.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_mapToArray.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
    result = Array(map.size);
  map.forEach(function (value, key) {
    result[++index] = [key, value];
  });
  return result;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (mapToArray);

/***/ }),

/***/ "./node_modules/lodash-es/_nativeCreate.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash-es/_nativeCreate.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _getNative_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_getNative.js */ "./node_modules/lodash-es/_getNative.js");


/* Built-in method references that are verified to be native. */
var nativeCreate = (0,_getNative_js__WEBPACK_IMPORTED_MODULE_0__["default"])(Object, 'create');
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (nativeCreate);

/***/ }),

/***/ "./node_modules/lodash-es/_nativeKeys.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_nativeKeys.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _overArg_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_overArg.js */ "./node_modules/lodash-es/_overArg.js");


/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = (0,_overArg_js__WEBPACK_IMPORTED_MODULE_0__["default"])(Object.keys, Object);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (nativeKeys);

/***/ }),

/***/ "./node_modules/lodash-es/_nativeKeysIn.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash-es/_nativeKeysIn.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (nativeKeysIn);

/***/ }),

/***/ "./node_modules/lodash-es/_nodeUtil.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/_nodeUtil.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _freeGlobal_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_freeGlobal.js */ "./node_modules/lodash-es/_freeGlobal.js");


/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && _freeGlobal_js__WEBPACK_IMPORTED_MODULE_0__["default"].process;

/** Used to access faster Node.js helpers. */
var nodeUtil = function () {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule && freeModule.require && freeModule.require('util').types;
    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (nodeUtil);

/***/ }),

/***/ "./node_modules/lodash-es/_objectToString.js":
/*!***************************************************!*\
  !*** ./node_modules/lodash-es/_objectToString.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (objectToString);

/***/ }),

/***/ "./node_modules/lodash-es/_overArg.js":
/*!********************************************!*\
  !*** ./node_modules/lodash-es/_overArg.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function (arg) {
    return func(transform(arg));
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (overArg);

/***/ }),

/***/ "./node_modules/lodash-es/_overRest.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/_overRest.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _apply_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_apply.js */ "./node_modules/lodash-es/_apply.js");


/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? func.length - 1 : start, 0);
  return function () {
    var args = arguments,
      index = -1,
      length = nativeMax(args.length - start, 0),
      array = Array(length);
    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return (0,_apply_js__WEBPACK_IMPORTED_MODULE_0__["default"])(func, this, otherArgs);
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (overRest);

/***/ }),

/***/ "./node_modules/lodash-es/_root.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash-es/_root.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _freeGlobal_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_freeGlobal.js */ "./node_modules/lodash-es/_freeGlobal.js");


/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = _freeGlobal_js__WEBPACK_IMPORTED_MODULE_0__["default"] || freeSelf || Function('return this')();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (root);

/***/ }),

/***/ "./node_modules/lodash-es/_safeGet.js":
/*!********************************************!*\
  !*** ./node_modules/lodash-es/_safeGet.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Gets the value at `key`, unless `key` is "__proto__" or "constructor".
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function safeGet(object, key) {
  if (key === 'constructor' && typeof object[key] === 'function') {
    return;
  }
  if (key == '__proto__') {
    return;
  }
  return object[key];
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (safeGet);

/***/ }),

/***/ "./node_modules/lodash-es/_setCacheAdd.js":
/*!************************************************!*\
  !*** ./node_modules/lodash-es/_setCacheAdd.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (setCacheAdd);

/***/ }),

/***/ "./node_modules/lodash-es/_setCacheHas.js":
/*!************************************************!*\
  !*** ./node_modules/lodash-es/_setCacheHas.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (setCacheHas);

/***/ }),

/***/ "./node_modules/lodash-es/_setToArray.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_setToArray.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
    result = Array(set.size);
  set.forEach(function (value) {
    result[++index] = value;
  });
  return result;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (setToArray);

/***/ }),

/***/ "./node_modules/lodash-es/_setToString.js":
/*!************************************************!*\
  !*** ./node_modules/lodash-es/_setToString.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _baseSetToString_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseSetToString.js */ "./node_modules/lodash-es/_baseSetToString.js");
/* harmony import */ var _shortOut_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_shortOut.js */ "./node_modules/lodash-es/_shortOut.js");



/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = (0,_shortOut_js__WEBPACK_IMPORTED_MODULE_0__["default"])(_baseSetToString_js__WEBPACK_IMPORTED_MODULE_1__["default"]);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (setToString);

/***/ }),

/***/ "./node_modules/lodash-es/_shortOut.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/_shortOut.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800,
  HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
    lastCalled = 0;
  return function () {
    var stamp = nativeNow(),
      remaining = HOT_SPAN - (stamp - lastCalled);
    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (shortOut);

/***/ }),

/***/ "./node_modules/lodash-es/_stackClear.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_stackClear.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ListCache_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_ListCache.js */ "./node_modules/lodash-es/_ListCache.js");


/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new _ListCache_js__WEBPACK_IMPORTED_MODULE_0__["default"]();
  this.size = 0;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stackClear);

/***/ }),

/***/ "./node_modules/lodash-es/_stackDelete.js":
/*!************************************************!*\
  !*** ./node_modules/lodash-es/_stackDelete.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
    result = data['delete'](key);
  this.size = data.size;
  return result;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stackDelete);

/***/ }),

/***/ "./node_modules/lodash-es/_stackGet.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/_stackGet.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stackGet);

/***/ }),

/***/ "./node_modules/lodash-es/_stackHas.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/_stackHas.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stackHas);

/***/ }),

/***/ "./node_modules/lodash-es/_stackSet.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/_stackSet.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ListCache_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_ListCache.js */ "./node_modules/lodash-es/_ListCache.js");
/* harmony import */ var _Map_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_Map.js */ "./node_modules/lodash-es/_Map.js");
/* harmony import */ var _MapCache_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_MapCache.js */ "./node_modules/lodash-es/_MapCache.js");




/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof _ListCache_js__WEBPACK_IMPORTED_MODULE_0__["default"]) {
    var pairs = data.__data__;
    if (!_Map_js__WEBPACK_IMPORTED_MODULE_1__["default"] || pairs.length < LARGE_ARRAY_SIZE - 1) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new _MapCache_js__WEBPACK_IMPORTED_MODULE_2__["default"](pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stackSet);

/***/ }),

/***/ "./node_modules/lodash-es/_toSource.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/_toSource.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return func + '';
    } catch (e) {}
  }
  return '';
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (toSource);

/***/ }),

/***/ "./node_modules/lodash-es/cloneDeep.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/cloneDeep.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _baseClone_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_baseClone.js */ "./node_modules/lodash-es/_baseClone.js");


/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
  CLONE_SYMBOLS_FLAG = 4;

/**
 * This method is like `_.clone` except that it recursively clones `value`.
 *
 * @static
 * @memberOf _
 * @since 1.0.0
 * @category Lang
 * @param {*} value The value to recursively clone.
 * @returns {*} Returns the deep cloned value.
 * @see _.clone
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var deep = _.cloneDeep(objects);
 * console.log(deep[0] === objects[0]);
 * // => false
 */
function cloneDeep(value) {
  return (0,_baseClone_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (cloneDeep);

/***/ }),

/***/ "./node_modules/lodash-es/constant.js":
/*!********************************************!*\
  !*** ./node_modules/lodash-es/constant.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function () {
    return value;
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (constant);

/***/ }),

/***/ "./node_modules/lodash-es/eq.js":
/*!**************************************!*\
  !*** ./node_modules/lodash-es/eq.js ***!
  \**************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || value !== value && other !== other;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (eq);

/***/ }),

/***/ "./node_modules/lodash-es/identity.js":
/*!********************************************!*\
  !*** ./node_modules/lodash-es/identity.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (identity);

/***/ }),

/***/ "./node_modules/lodash-es/isArguments.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/isArguments.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _baseIsArguments_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_baseIsArguments.js */ "./node_modules/lodash-es/_baseIsArguments.js");
/* harmony import */ var _isObjectLike_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isObjectLike.js */ "./node_modules/lodash-es/isObjectLike.js");



/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = (0,_baseIsArguments_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function () {
  return arguments;
}()) ? _baseIsArguments_js__WEBPACK_IMPORTED_MODULE_0__["default"] : function (value) {
  return (0,_isObjectLike_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value) && hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isArguments);

/***/ }),

/***/ "./node_modules/lodash-es/isArray.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash-es/isArray.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isArray);

/***/ }),

/***/ "./node_modules/lodash-es/isArrayLike.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/isArrayLike.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _isFunction_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isFunction.js */ "./node_modules/lodash-es/isFunction.js");
/* harmony import */ var _isLength_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isLength.js */ "./node_modules/lodash-es/isLength.js");



/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && (0,_isLength_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value.length) && !(0,_isFunction_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isArrayLike);

/***/ }),

/***/ "./node_modules/lodash-es/isArrayLikeObject.js":
/*!*****************************************************!*\
  !*** ./node_modules/lodash-es/isArrayLikeObject.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _isArrayLike_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isArrayLike.js */ "./node_modules/lodash-es/isArrayLike.js");
/* harmony import */ var _isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isObjectLike.js */ "./node_modules/lodash-es/isObjectLike.js");



/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return (0,_isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value) && (0,_isArrayLike_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isArrayLikeObject);

/***/ }),

/***/ "./node_modules/lodash-es/isBuffer.js":
/*!********************************************!*\
  !*** ./node_modules/lodash-es/isBuffer.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _root_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_root.js */ "./node_modules/lodash-es/_root.js");
/* harmony import */ var _stubFalse_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./stubFalse.js */ "./node_modules/lodash-es/stubFalse.js");



/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? _root_js__WEBPACK_IMPORTED_MODULE_0__["default"].Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || _stubFalse_js__WEBPACK_IMPORTED_MODULE_1__["default"];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isBuffer);

/***/ }),

/***/ "./node_modules/lodash-es/isEqual.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash-es/isEqual.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _baseIsEqual_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_baseIsEqual.js */ "./node_modules/lodash-es/_baseIsEqual.js");


/**
 * Performs a deep comparison between two values to determine if they are
 * equivalent.
 *
 * **Note:** This method supports comparing arrays, array buffers, booleans,
 * date objects, error objects, maps, numbers, `Object` objects, regexes,
 * sets, strings, symbols, and typed arrays. `Object` objects are compared
 * by their own, not inherited, enumerable properties. Functions and DOM
 * nodes are compared by strict equality, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.isEqual(object, other);
 * // => true
 *
 * object === other;
 * // => false
 */
function isEqual(value, other) {
  return (0,_baseIsEqual_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value, other);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isEqual);

/***/ }),

/***/ "./node_modules/lodash-es/isFunction.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash-es/isFunction.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _baseGetTag_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseGetTag.js */ "./node_modules/lodash-es/_baseGetTag.js");
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isObject.js */ "./node_modules/lodash-es/isObject.js");



/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
  funcTag = '[object Function]',
  genTag = '[object GeneratorFunction]',
  proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!(0,_isObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = (0,_baseGetTag_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isFunction);

/***/ }),

/***/ "./node_modules/lodash-es/isLength.js":
/*!********************************************!*\
  !*** ./node_modules/lodash-es/isLength.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isLength);

/***/ }),

/***/ "./node_modules/lodash-es/isMap.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash-es/isMap.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _baseIsMap_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_baseIsMap.js */ "./node_modules/lodash-es/_baseIsMap.js");
/* harmony import */ var _baseUnary_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseUnary.js */ "./node_modules/lodash-es/_baseUnary.js");
/* harmony import */ var _nodeUtil_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_nodeUtil.js */ "./node_modules/lodash-es/_nodeUtil.js");




/* Node.js helper references. */
var nodeIsMap = _nodeUtil_js__WEBPACK_IMPORTED_MODULE_0__["default"] && _nodeUtil_js__WEBPACK_IMPORTED_MODULE_0__["default"].isMap;

/**
 * Checks if `value` is classified as a `Map` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 * @example
 *
 * _.isMap(new Map);
 * // => true
 *
 * _.isMap(new WeakMap);
 * // => false
 */
var isMap = nodeIsMap ? (0,_baseUnary_js__WEBPACK_IMPORTED_MODULE_1__["default"])(nodeIsMap) : _baseIsMap_js__WEBPACK_IMPORTED_MODULE_2__["default"];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isMap);

/***/ }),

/***/ "./node_modules/lodash-es/isObject.js":
/*!********************************************!*\
  !*** ./node_modules/lodash-es/isObject.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isObject);

/***/ }),

/***/ "./node_modules/lodash-es/isObjectLike.js":
/*!************************************************!*\
  !*** ./node_modules/lodash-es/isObjectLike.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isObjectLike);

/***/ }),

/***/ "./node_modules/lodash-es/isPlainObject.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash-es/isPlainObject.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _baseGetTag_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseGetTag.js */ "./node_modules/lodash-es/_baseGetTag.js");
/* harmony import */ var _getPrototype_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_getPrototype.js */ "./node_modules/lodash-es/_getPrototype.js");
/* harmony import */ var _isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isObjectLike.js */ "./node_modules/lodash-es/isObjectLike.js");




/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto = Function.prototype,
  objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!(0,_isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value) || (0,_baseGetTag_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value) != objectTag) {
    return false;
  }
  var proto = (0,_getPrototype_js__WEBPACK_IMPORTED_MODULE_2__["default"])(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isPlainObject);

/***/ }),

/***/ "./node_modules/lodash-es/isSet.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash-es/isSet.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _baseIsSet_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_baseIsSet.js */ "./node_modules/lodash-es/_baseIsSet.js");
/* harmony import */ var _baseUnary_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseUnary.js */ "./node_modules/lodash-es/_baseUnary.js");
/* harmony import */ var _nodeUtil_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_nodeUtil.js */ "./node_modules/lodash-es/_nodeUtil.js");




/* Node.js helper references. */
var nodeIsSet = _nodeUtil_js__WEBPACK_IMPORTED_MODULE_0__["default"] && _nodeUtil_js__WEBPACK_IMPORTED_MODULE_0__["default"].isSet;

/**
 * Checks if `value` is classified as a `Set` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 * @example
 *
 * _.isSet(new Set);
 * // => true
 *
 * _.isSet(new WeakSet);
 * // => false
 */
var isSet = nodeIsSet ? (0,_baseUnary_js__WEBPACK_IMPORTED_MODULE_1__["default"])(nodeIsSet) : _baseIsSet_js__WEBPACK_IMPORTED_MODULE_2__["default"];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isSet);

/***/ }),

/***/ "./node_modules/lodash-es/isTypedArray.js":
/*!************************************************!*\
  !*** ./node_modules/lodash-es/isTypedArray.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _baseIsTypedArray_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_baseIsTypedArray.js */ "./node_modules/lodash-es/_baseIsTypedArray.js");
/* harmony import */ var _baseUnary_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseUnary.js */ "./node_modules/lodash-es/_baseUnary.js");
/* harmony import */ var _nodeUtil_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_nodeUtil.js */ "./node_modules/lodash-es/_nodeUtil.js");




/* Node.js helper references. */
var nodeIsTypedArray = _nodeUtil_js__WEBPACK_IMPORTED_MODULE_0__["default"] && _nodeUtil_js__WEBPACK_IMPORTED_MODULE_0__["default"].isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? (0,_baseUnary_js__WEBPACK_IMPORTED_MODULE_1__["default"])(nodeIsTypedArray) : _baseIsTypedArray_js__WEBPACK_IMPORTED_MODULE_2__["default"];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isTypedArray);

/***/ }),

/***/ "./node_modules/lodash-es/keys.js":
/*!****************************************!*\
  !*** ./node_modules/lodash-es/keys.js ***!
  \****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _arrayLikeKeys_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_arrayLikeKeys.js */ "./node_modules/lodash-es/_arrayLikeKeys.js");
/* harmony import */ var _baseKeys_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_baseKeys.js */ "./node_modules/lodash-es/_baseKeys.js");
/* harmony import */ var _isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isArrayLike.js */ "./node_modules/lodash-es/isArrayLike.js");




/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return (0,_isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object) ? (0,_arrayLikeKeys_js__WEBPACK_IMPORTED_MODULE_1__["default"])(object) : (0,_baseKeys_js__WEBPACK_IMPORTED_MODULE_2__["default"])(object);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (keys);

/***/ }),

/***/ "./node_modules/lodash-es/keysIn.js":
/*!******************************************!*\
  !*** ./node_modules/lodash-es/keysIn.js ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _arrayLikeKeys_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_arrayLikeKeys.js */ "./node_modules/lodash-es/_arrayLikeKeys.js");
/* harmony import */ var _baseKeysIn_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_baseKeysIn.js */ "./node_modules/lodash-es/_baseKeysIn.js");
/* harmony import */ var _isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isArrayLike.js */ "./node_modules/lodash-es/isArrayLike.js");




/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  return (0,_isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object) ? (0,_arrayLikeKeys_js__WEBPACK_IMPORTED_MODULE_1__["default"])(object, true) : (0,_baseKeysIn_js__WEBPACK_IMPORTED_MODULE_2__["default"])(object);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (keysIn);

/***/ }),

/***/ "./node_modules/lodash-es/merge.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash-es/merge.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _baseMerge_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseMerge.js */ "./node_modules/lodash-es/_baseMerge.js");
/* harmony import */ var _createAssigner_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_createAssigner.js */ "./node_modules/lodash-es/_createAssigner.js");



/**
 * This method is like `_.assign` except that it recursively merges own and
 * inherited enumerable string keyed properties of source objects into the
 * destination object. Source properties that resolve to `undefined` are
 * skipped if a destination value exists. Array and plain object properties
 * are merged recursively. Other objects and value types are overridden by
 * assignment. Source objects are applied from left to right. Subsequent
 * sources overwrite property assignments of previous sources.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 0.5.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = {
 *   'a': [{ 'b': 2 }, { 'd': 4 }]
 * };
 *
 * var other = {
 *   'a': [{ 'c': 3 }, { 'e': 5 }]
 * };
 *
 * _.merge(object, other);
 * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
 */
var merge = (0,_createAssigner_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function (object, source, srcIndex) {
  (0,_baseMerge_js__WEBPACK_IMPORTED_MODULE_1__["default"])(object, source, srcIndex);
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (merge);

/***/ }),

/***/ "./node_modules/lodash-es/stubArray.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/stubArray.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stubArray);

/***/ }),

/***/ "./node_modules/lodash-es/stubFalse.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/stubFalse.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stubFalse);

/***/ }),

/***/ "./node_modules/lodash-es/toPlainObject.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash-es/toPlainObject.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _copyObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_copyObject.js */ "./node_modules/lodash-es/_copyObject.js");
/* harmony import */ var _keysIn_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./keysIn.js */ "./node_modules/lodash-es/keysIn.js");



/**
 * Converts `value` to a plain object flattening inherited enumerable string
 * keyed properties of `value` to own properties of the plain object.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {Object} Returns the converted plain object.
 * @example
 *
 * function Foo() {
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.assign({ 'a': 1 }, new Foo);
 * // => { 'a': 1, 'b': 2 }
 *
 * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
 * // => { 'a': 1, 'b': 2, 'c': 3 }
 */
function toPlainObject(value) {
  return (0,_copyObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value, (0,_keysIn_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value));
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (toPlainObject);

/***/ }),

/***/ "./node_modules/parchment/dist/parchment.js":
/*!**************************************************!*\
  !*** ./node_modules/parchment/dist/parchment.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Attributor: () => (/* binding */ Attributor),
/* harmony export */   AttributorStore: () => (/* binding */ AttributorStore$1),
/* harmony export */   BlockBlot: () => (/* binding */ BlockBlot$1),
/* harmony export */   ClassAttributor: () => (/* binding */ ClassAttributor$1),
/* harmony export */   ContainerBlot: () => (/* binding */ ContainerBlot$1),
/* harmony export */   EmbedBlot: () => (/* binding */ EmbedBlot$1),
/* harmony export */   InlineBlot: () => (/* binding */ InlineBlot$1),
/* harmony export */   LeafBlot: () => (/* binding */ LeafBlot$1),
/* harmony export */   ParentBlot: () => (/* binding */ ParentBlot$1),
/* harmony export */   Registry: () => (/* binding */ Registry),
/* harmony export */   Scope: () => (/* binding */ Scope),
/* harmony export */   ScrollBlot: () => (/* binding */ ScrollBlot$1),
/* harmony export */   StyleAttributor: () => (/* binding */ StyleAttributor$1),
/* harmony export */   TextBlot: () => (/* binding */ TextBlot$1)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js");
/* harmony import */ var _babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var _babel_runtime_helpers_esm_wrapNativeSuper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/esm/wrapNativeSuper */ "./node_modules/@babel/runtime/helpers/esm/wrapNativeSuper.js");
/* harmony import */ var _babel_runtime_helpers_esm_readOnlyError__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/esm/readOnlyError */ "./node_modules/@babel/runtime/helpers/esm/readOnlyError.js");





var Scope = /* @__PURE__ */function (Scope2) {
  return Scope2[Scope2.TYPE = 3] = "TYPE", Scope2[Scope2.LEVEL = 12] = "LEVEL", Scope2[Scope2.ATTRIBUTE = 13] = "ATTRIBUTE", Scope2[Scope2.BLOT = 14] = "BLOT", Scope2[Scope2.INLINE = 7] = "INLINE", Scope2[Scope2.BLOCK = 11] = "BLOCK", Scope2[Scope2.BLOCK_BLOT = 10] = "BLOCK_BLOT", Scope2[Scope2.INLINE_BLOT = 6] = "INLINE_BLOT", Scope2[Scope2.BLOCK_ATTRIBUTE = 9] = "BLOCK_ATTRIBUTE", Scope2[Scope2.INLINE_ATTRIBUTE = 5] = "INLINE_ATTRIBUTE", Scope2[Scope2.ANY = 15] = "ANY", Scope2;
}(Scope || {});
var Attributor = /*#__PURE__*/function () {
  function Attributor(attrName, keyName, options) {
    if (options === void 0) {
      options = {};
    }
    this.attrName = attrName, this.keyName = keyName;
    var attributeBit = Scope.TYPE & Scope.ATTRIBUTE;
    this.scope = options.scope != null ?
    // Ignore type bits, force attribute bit
    options.scope & Scope.LEVEL | attributeBit : Scope.ATTRIBUTE, options.whitelist != null && (this.whitelist = options.whitelist);
  }
  Attributor.keys = function keys(node) {
    return Array.from(node.attributes).map(function (item) {
      return item.name;
    });
  };
  var _proto = Attributor.prototype;
  _proto.add = function add(node, value) {
    return this.canAdd(node, value) ? (node.setAttribute(this.keyName, value), !0) : !1;
  };
  _proto.canAdd = function canAdd(_node, value) {
    return this.whitelist == null ? !0 : typeof value == "string" ? this.whitelist.indexOf(value.replace(/["']/g, "")) > -1 : this.whitelist.indexOf(value) > -1;
  };
  _proto.remove = function remove(node) {
    node.removeAttribute(this.keyName);
  };
  _proto.value = function value(node) {
    var value = node.getAttribute(this.keyName);
    return this.canAdd(node, value) && value ? value : "";
  };
  return Attributor;
}();
var ParchmentError = /*#__PURE__*/function (_Error) {
  function ParchmentError(message) {
    var _this;
    message = "[Parchment] " + message, _this = _Error.call(this, message) || this, _this.message = message, _this.name = _this.constructor.name;
    return _this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_2__["default"])(ParchmentError, _Error);
  return ParchmentError;
}(/*#__PURE__*/(0,_babel_runtime_helpers_esm_wrapNativeSuper__WEBPACK_IMPORTED_MODULE_3__["default"])(Error));
var _Registry = /*#__PURE__*/function () {
  function _Registry() {
    this.attributes = {}, this.classes = {}, this.tags = {}, this.types = {};
  }
  _Registry.find = function find(node, bubble) {
    if (bubble === void 0) {
      bubble = !1;
    }
    if (node == null) return null;
    if (this.blots.has(node)) return this.blots.get(node) || null;
    if (bubble) {
      var parentNode = null;
      try {
        parentNode = node.parentNode;
      } catch (_unused) {
        return null;
      }
      return this.find(parentNode, bubble);
    }
    return null;
  };
  var _proto2 = _Registry.prototype;
  _proto2.create = function create(scroll, input, value) {
    var match2 = this.query(input);
    if (match2 == null) throw new ParchmentError("Unable to create " + input + " blot");
    var blotClass = match2,
      node =
      // @ts-expect-error Fix me later
      input instanceof Node || input.nodeType === Node.TEXT_NODE ? input : blotClass.create(value),
      blot = new blotClass(scroll, node, value);
    return _Registry.blots.set(blot.domNode, blot), blot;
  };
  _proto2.find = function find(node, bubble) {
    if (bubble === void 0) {
      bubble = !1;
    }
    return _Registry.find(node, bubble);
  };
  _proto2.query = function query(_query, scope) {
    var _this2 = this;
    if (scope === void 0) {
      scope = Scope.ANY;
    }
    var match2;
    return typeof _query == "string" ? match2 = this.types[_query] || this.attributes[_query] : _query instanceof Text || _query.nodeType === Node.TEXT_NODE ? match2 = this.types.text : typeof _query == "number" ? _query & Scope.LEVEL & Scope.BLOCK ? match2 = this.types.block : _query & Scope.LEVEL & Scope.INLINE && (match2 = this.types.inline) : _query instanceof Element && ((_query.getAttribute("class") || "").split(/\s+/).some(function (name) {
      return match2 = _this2.classes[name], !!match2;
    }), match2 = match2 || this.tags[_query.tagName]), match2 == null ? null : "scope" in match2 && scope & Scope.LEVEL & match2.scope && scope & Scope.TYPE & match2.scope ? match2 : null;
  };
  _proto2.register = function register() {
    var _this3 = this;
    for (var _len = arguments.length, definitions = new Array(_len), _key = 0; _key < _len; _key++) {
      definitions[_key] = arguments[_key];
    }
    return definitions.map(function (definition) {
      var isBlot = "blotName" in definition,
        isAttr = "attrName" in definition;
      if (!isBlot && !isAttr) throw new ParchmentError("Invalid definition");
      if (isBlot && definition.blotName === "abstract") throw new ParchmentError("Cannot register abstract class");
      var key = isBlot ? definition.blotName : isAttr ? definition.attrName : void 0;
      return _this3.types[key] = definition, isAttr ? typeof definition.keyName == "string" && (_this3.attributes[definition.keyName] = definition) : isBlot && (definition.className && (_this3.classes[definition.className] = definition), definition.tagName && (Array.isArray(definition.tagName) ? definition.tagName = definition.tagName.map(function (tagName) {
        return tagName.toUpperCase();
      }) : definition.tagName = definition.tagName.toUpperCase(), (Array.isArray(definition.tagName) ? definition.tagName : [definition.tagName]).forEach(function (tag) {
        (_this3.tags[tag] == null || definition.className == null) && (_this3.tags[tag] = definition);
      }))), definition;
    });
  };
  return _Registry;
}();
_Registry.blots = /* @__PURE__ */new WeakMap();
var Registry = _Registry;
function match(node, prefix) {
  return (node.getAttribute("class") || "").split(/\s+/).filter(function (name) {
    return name.indexOf(prefix + "-") === 0;
  });
}
var ClassAttributor = /*#__PURE__*/function (_Attributor) {
  function ClassAttributor() {
    return _Attributor.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_2__["default"])(ClassAttributor, _Attributor);
  ClassAttributor.keys = function keys(node) {
    return (node.getAttribute("class") || "").split(/\s+/).map(function (name) {
      return name.split("-").slice(0, -1).join("-");
    });
  };
  var _proto3 = ClassAttributor.prototype;
  _proto3.add = function add(node, value) {
    return this.canAdd(node, value) ? (this.remove(node), node.classList.add(this.keyName + "-" + value), !0) : !1;
  };
  _proto3.remove = function remove(node) {
    match(node, this.keyName).forEach(function (name) {
      node.classList.remove(name);
    }), node.classList.length === 0 && node.removeAttribute("class");
  };
  _proto3.value = function value(node) {
    var value = (match(node, this.keyName)[0] || "").slice(this.keyName.length + 1);
    return this.canAdd(node, value) ? value : "";
  };
  return ClassAttributor;
}(Attributor);
var ClassAttributor$1 = ClassAttributor;
function camelize(name) {
  var parts = name.split("-"),
    rest = parts.slice(1).map(function (part) {
      return part[0].toUpperCase() + part.slice(1);
    }).join("");
  return parts[0] + rest;
}
var StyleAttributor = /*#__PURE__*/function (_Attributor2) {
  function StyleAttributor() {
    return _Attributor2.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_2__["default"])(StyleAttributor, _Attributor2);
  StyleAttributor.keys = function keys(node) {
    return (node.getAttribute("style") || "").split(";").map(function (value) {
      return value.split(":")[0].trim();
    });
  };
  var _proto4 = StyleAttributor.prototype;
  _proto4.add = function add(node, value) {
    return this.canAdd(node, value) ? (node.style[camelize(this.keyName)] = value, !0) : !1;
  };
  _proto4.remove = function remove(node) {
    node.style[camelize(this.keyName)] = "", node.getAttribute("style") || node.removeAttribute("style");
  };
  _proto4.value = function value(node) {
    var value = node.style[camelize(this.keyName)];
    return this.canAdd(node, value) ? value : "";
  };
  return StyleAttributor;
}(Attributor);
var StyleAttributor$1 = StyleAttributor;
var AttributorStore = /*#__PURE__*/function () {
  function AttributorStore(domNode) {
    this.attributes = {}, this.domNode = domNode, this.build();
  }
  var _proto5 = AttributorStore.prototype;
  _proto5.attribute = function attribute(_attribute, value) {
    value ? _attribute.add(this.domNode, value) && (_attribute.value(this.domNode) != null ? this.attributes[_attribute.attrName] = _attribute : delete this.attributes[_attribute.attrName]) : (_attribute.remove(this.domNode), delete this.attributes[_attribute.attrName]);
  };
  _proto5.build = function build() {
    var _this4 = this;
    this.attributes = {};
    var blot = Registry.find(this.domNode);
    if (blot == null) return;
    var attributes = Attributor.keys(this.domNode),
      classes = ClassAttributor$1.keys(this.domNode),
      styles = StyleAttributor$1.keys(this.domNode);
    attributes.concat(classes).concat(styles).forEach(function (name) {
      var attr = blot.scroll.query(name, Scope.ATTRIBUTE);
      attr instanceof Attributor && (_this4.attributes[attr.attrName] = attr);
    });
  };
  _proto5.copy = function copy(target) {
    var _this5 = this;
    Object.keys(this.attributes).forEach(function (key) {
      var value = _this5.attributes[key].value(_this5.domNode);
      target.format(key, value);
    });
  };
  _proto5.move = function move(target) {
    var _this6 = this;
    this.copy(target), Object.keys(this.attributes).forEach(function (key) {
      _this6.attributes[key].remove(_this6.domNode);
    }), this.attributes = {};
  };
  _proto5.values = function values() {
    var _this7 = this;
    return Object.keys(this.attributes).reduce(function (attributes, name) {
      return attributes[name] = _this7.attributes[name].value(_this7.domNode), attributes;
    }, {});
  };
  return AttributorStore;
}();
var AttributorStore$1 = AttributorStore,
  _ShadowBlot = /*#__PURE__*/function () {
    function _ShadowBlot(scroll, domNode) {
      this.scroll = scroll, this.domNode = domNode, Registry.blots.set(domNode, this), this.prev = null, this.next = null;
    }
    _ShadowBlot.create = function create(rawValue) {
      if (this.tagName == null) throw new ParchmentError("Blot definition missing tagName");
      var node, value;
      return Array.isArray(this.tagName) ? (typeof rawValue == "string" ? (value = rawValue.toUpperCase(), parseInt(value, 10).toString() === value && (value = parseInt(value, 10))) : typeof rawValue == "number" && (value = rawValue), typeof value == "number" ? node = document.createElement(this.tagName[value - 1]) : value && this.tagName.indexOf(value) > -1 ? node = document.createElement(value) : node = document.createElement(this.tagName[0])) : node = document.createElement(this.tagName), this.className && node.classList.add(this.className), node;
    }
    // Hack for accessing inherited static methods
    ;
    var _proto6 = _ShadowBlot.prototype;
    _proto6.attach = function attach() {};
    _proto6.clone = function clone() {
      var domNode = this.domNode.cloneNode(!1);
      return this.scroll.create(domNode);
    };
    _proto6.detach = function detach() {
      this.parent != null && this.parent.removeChild(this), Registry.blots["delete"](this.domNode);
    };
    _proto6.deleteAt = function deleteAt(index, length) {
      this.isolate(index, length).remove();
    };
    _proto6.formatAt = function formatAt(index, length, name, value) {
      var blot = this.isolate(index, length);
      if (this.scroll.query(name, Scope.BLOT) != null && value) blot.wrap(name, value);else if (this.scroll.query(name, Scope.ATTRIBUTE) != null) {
        var parent = this.scroll.create(this.statics.scope);
        blot.wrap(parent), parent.format(name, value);
      }
    };
    _proto6.insertAt = function insertAt(index, value, def) {
      var blot = def == null ? this.scroll.create("text", value) : this.scroll.create(value, def),
        ref = this.split(index);
      this.parent.insertBefore(blot, ref || void 0);
    };
    _proto6.isolate = function isolate(index, length) {
      var target = this.split(index);
      if (target == null) throw new Error("Attempt to isolate at end");
      return target.split(length), target;
    };
    _proto6.length = function length() {
      return 1;
    };
    _proto6.offset = function offset(root) {
      if (root === void 0) {
        root = this.parent;
      }
      return this.parent == null || this === root ? 0 : this.parent.children.offset(this) + this.parent.offset(root);
    };
    _proto6.optimize = function optimize(_context) {
      this.statics.requiredContainer && !(this.parent instanceof this.statics.requiredContainer) && this.wrap(this.statics.requiredContainer.blotName);
    };
    _proto6.remove = function remove() {
      this.domNode.parentNode != null && this.domNode.parentNode.removeChild(this.domNode), this.detach();
    };
    _proto6.replaceWith = function replaceWith(name, value) {
      var replacement = typeof name == "string" ? this.scroll.create(name, value) : name;
      return this.parent != null && (this.parent.insertBefore(replacement, this.next || void 0), this.remove()), replacement;
    };
    _proto6.split = function split(index, _force) {
      return index === 0 ? this : this.next;
    };
    _proto6.update = function update(_mutations, _context) {};
    _proto6.wrap = function wrap(name, value) {
      var wrapper = typeof name == "string" ? this.scroll.create(name, value) : name;
      if (this.parent != null && this.parent.insertBefore(wrapper, this.next || void 0), typeof wrapper.appendChild != "function") throw new ParchmentError("Cannot wrap " + name);
      return wrapper.appendChild(this), wrapper;
    };
    return (0,_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(_ShadowBlot, [{
      key: "statics",
      get: function get() {
        return this.constructor;
      }
    }]);
  }();
_ShadowBlot.blotName = "abstract";
var ShadowBlot = _ShadowBlot;
var _LeafBlot = /*#__PURE__*/function (_ShadowBlot2) {
  function _LeafBlot() {
    return _ShadowBlot2.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_2__["default"])(_LeafBlot, _ShadowBlot2);
  /**
   * Returns the value represented by domNode if it is this Blot's type
   * No checking that domNode can represent this Blot type is required so
   * applications needing it should check externally before calling.
   */
  _LeafBlot.value = function value(_domNode) {
    return !0;
  }
  /**
   * Given location represented by node and offset from DOM Selection Range,
   * return index to that location.
   */;
  var _proto7 = _LeafBlot.prototype;
  _proto7.index = function index(node, offset) {
    return this.domNode === node || this.domNode.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_CONTAINED_BY ? Math.min(offset, 1) : -1;
  }
  /**
   * Given index to location within blot, return node and offset representing
   * that location, consumable by DOM Selection Range
   */;
  _proto7.position = function position(index, _inclusive) {
    var offset = Array.from(this.parent.domNode.childNodes).indexOf(this.domNode);
    return index > 0 && (offset += 1), [this.parent.domNode, offset];
  }
  /**
   * Return value represented by this blot
   * Should not change without interaction from API or
   * user change detectable by update()
   */;
  _proto7.value = function value() {
    var _ref;
    return _ref = {}, _ref[this.statics.blotName] = this.statics.value(this.domNode) || !0, _ref;
  };
  return _LeafBlot;
}(ShadowBlot);
_LeafBlot.scope = Scope.INLINE_BLOT;
var LeafBlot = _LeafBlot;
var LeafBlot$1 = LeafBlot;
var LinkedList = /*#__PURE__*/function () {
  function LinkedList() {
    this.head = null, this.tail = null, this.length = 0;
  }
  var _proto8 = LinkedList.prototype;
  _proto8.append = function append() {
    for (var _len2 = arguments.length, nodes = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      nodes[_key2] = arguments[_key2];
    }
    if (this.insertBefore(nodes[0], null), nodes.length > 1) {
      var rest = nodes.slice(1);
      this.append.apply(this, rest);
    }
  };
  _proto8.at = function at(index) {
    var next = this.iterator();
    var cur = next();
    for (; cur && index > 0;) index -= 1, cur = next();
    return cur;
  };
  _proto8.contains = function contains(node) {
    var next = this.iterator();
    var cur = next();
    for (; cur;) {
      if (cur === node) return !0;
      cur = next();
    }
    return !1;
  };
  _proto8.indexOf = function indexOf(node) {
    var next = this.iterator();
    var cur = next(),
      index = 0;
    for (; cur;) {
      if (cur === node) return index;
      index += 1, cur = next();
    }
    return -1;
  };
  _proto8.insertBefore = function insertBefore(node, refNode) {
    node != null && (this.remove(node), node.next = refNode, refNode != null ? (node.prev = refNode.prev, refNode.prev != null && (refNode.prev.next = node), refNode.prev = node, refNode === this.head && (this.head = node)) : this.tail != null ? (this.tail.next = node, node.prev = this.tail, this.tail = node) : (node.prev = null, this.head = this.tail = node), this.length += 1);
  };
  _proto8.offset = function offset(target) {
    var index = 0,
      cur = this.head;
    for (; cur != null;) {
      if (cur === target) return index;
      index += cur.length(), cur = cur.next;
    }
    return -1;
  };
  _proto8.remove = function remove(node) {
    this.contains(node) && (node.prev != null && (node.prev.next = node.next), node.next != null && (node.next.prev = node.prev), node === this.head && (this.head = node.next), node === this.tail && (this.tail = node.prev), this.length -= 1);
  };
  _proto8.iterator = function iterator(curNode) {
    if (curNode === void 0) {
      curNode = this.head;
    }
    return function () {
      var ret = curNode;
      return curNode != null && (curNode = curNode.next), ret;
    };
  };
  _proto8.find = function find(index, inclusive) {
    if (inclusive === void 0) {
      inclusive = !1;
    }
    var next = this.iterator();
    var cur = next();
    for (; cur;) {
      var length = cur.length();
      if (index < length || inclusive && index === length && (cur.next == null || cur.next.length() !== 0)) return [cur, index];
      index -= length, cur = next();
    }
    return [null, 0];
  };
  _proto8.forEach = function forEach(callback) {
    var next = this.iterator();
    var cur = next();
    for (; cur;) callback(cur), cur = next();
  };
  _proto8.forEachAt = function forEachAt(index, length, callback) {
    if (length <= 0) return;
    var _this$find = this.find(index),
      startNode = _this$find[0],
      offset = _this$find[1];
    var curIndex = index - offset;
    var next = this.iterator(startNode);
    var cur = next();
    for (; cur && curIndex < index + length;) {
      var curLength = cur.length();
      index > curIndex ? callback(cur, index - curIndex, Math.min(length, curIndex + curLength - index)) : callback(cur, 0, Math.min(curLength, index + length - curIndex)), curIndex += curLength, cur = next();
    }
  };
  _proto8.map = function map(callback) {
    return this.reduce(function (memo, cur) {
      return memo.push(callback(cur)), memo;
    }, []);
  };
  _proto8.reduce = function reduce(callback, memo) {
    var next = this.iterator();
    var cur = next();
    for (; cur;) memo = callback(memo, cur), cur = next();
    return memo;
  };
  return LinkedList;
}();
function makeAttachedBlot(node, scroll) {
  var found = scroll.find(node);
  if (found) return found;
  try {
    return scroll.create(node);
  } catch (_unused2) {
    var blot = scroll.create(Scope.INLINE);
    return Array.from(node.childNodes).forEach(function (child) {
      blot.domNode.appendChild(child);
    }), node.parentNode && node.parentNode.replaceChild(blot.domNode, node), blot.attach(), blot;
  }
}
var _ParentBlot = /*#__PURE__*/function (_ShadowBlot3) {
  function _ParentBlot(scroll, domNode) {
    var _this8;
    _this8 = _ShadowBlot3.call(this, scroll, domNode) || this, _this8.uiNode = null, _this8.build();
    return _this8;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_2__["default"])(_ParentBlot, _ShadowBlot3);
  var _proto9 = _ParentBlot.prototype;
  _proto9.appendChild = function appendChild(other) {
    this.insertBefore(other);
  };
  _proto9.attach = function attach() {
    _ShadowBlot3.prototype.attach.call(this), this.children.forEach(function (child) {
      child.attach();
    });
  };
  _proto9.attachUI = function attachUI(node) {
    this.uiNode != null && this.uiNode.remove(), this.uiNode = node, _ParentBlot.uiClass && this.uiNode.classList.add(_ParentBlot.uiClass), this.uiNode.setAttribute("contenteditable", "false"), this.domNode.insertBefore(this.uiNode, this.domNode.firstChild);
  }
  /**
   * Called during construction, should fill its own children LinkedList.
   */;
  _proto9.build = function build() {
    var _this9 = this;
    this.children = new LinkedList(), Array.from(this.domNode.childNodes).filter(function (node) {
      return node !== _this9.uiNode;
    }).reverse().forEach(function (node) {
      try {
        var child = makeAttachedBlot(node, _this9.scroll);
        _this9.insertBefore(child, _this9.children.head || void 0);
      } catch (err) {
        if (err instanceof ParchmentError) return;
        throw err;
      }
    });
  };
  _proto9.deleteAt = function deleteAt(index, length) {
    if (index === 0 && length === this.length()) return this.remove();
    this.children.forEachAt(index, length, function (child, offset, childLength) {
      child.deleteAt(offset, childLength);
    });
  };
  _proto9.descendant = function descendant(criteria, index) {
    if (index === void 0) {
      index = 0;
    }
    var _this$children$find = this.children.find(index),
      child = _this$children$find[0],
      offset = _this$children$find[1];
    return criteria.blotName == null && criteria(child) || criteria.blotName != null && child instanceof criteria ? [child, offset] : child instanceof _ParentBlot ? child.descendant(criteria, offset) : [null, -1];
  };
  _proto9.descendants = function descendants(criteria, index, length) {
    if (index === void 0) {
      index = 0;
    }
    if (length === void 0) {
      length = Number.MAX_VALUE;
    }
    var descendants = [],
      lengthLeft = length;
    return this.children.forEachAt(index, length, function (child, childIndex, childLength) {
      (criteria.blotName == null && criteria(child) || criteria.blotName != null && child instanceof criteria) && descendants.push(child), child instanceof _ParentBlot && (descendants = descendants.concat(child.descendants(criteria, childIndex, lengthLeft))), lengthLeft -= childLength;
    }), descendants;
  };
  _proto9.detach = function detach() {
    this.children.forEach(function (child) {
      child.detach();
    }), _ShadowBlot3.prototype.detach.call(this);
  };
  _proto9.enforceAllowedChildren = function enforceAllowedChildren() {
    var _this10 = this;
    var done = !1;
    this.children.forEach(function (child) {
      done || _this10.statics.allowedChildren.some(function (def) {
        return child instanceof def;
      }) || (child.statics.scope === Scope.BLOCK_BLOT ? (child.next != null && _this10.splitAfter(child), child.prev != null && _this10.splitAfter(child.prev), child.parent.unwrap(), done = !0) : child instanceof _ParentBlot ? child.unwrap() : child.remove());
    });
  };
  _proto9.formatAt = function formatAt(index, length, name, value) {
    this.children.forEachAt(index, length, function (child, offset, childLength) {
      child.formatAt(offset, childLength, name, value);
    });
  };
  _proto9.insertAt = function insertAt(index, value, def) {
    var _this$children$find2 = this.children.find(index),
      child = _this$children$find2[0],
      offset = _this$children$find2[1];
    if (child) child.insertAt(offset, value, def);else {
      var blot = def == null ? this.scroll.create("text", value) : this.scroll.create(value, def);
      this.appendChild(blot);
    }
  };
  _proto9.insertBefore = function insertBefore(childBlot, refBlot) {
    childBlot.parent != null && childBlot.parent.children.remove(childBlot);
    var refDomNode = null;
    this.children.insertBefore(childBlot, refBlot || null), childBlot.parent = this, refBlot != null && (refDomNode = refBlot.domNode), (this.domNode.parentNode !== childBlot.domNode || this.domNode.nextSibling !== refDomNode) && this.domNode.insertBefore(childBlot.domNode, refDomNode), childBlot.attach();
  };
  _proto9.length = function length() {
    return this.children.reduce(function (memo, child) {
      return memo + child.length();
    }, 0);
  };
  _proto9.moveChildren = function moveChildren(targetParent, refNode) {
    this.children.forEach(function (child) {
      targetParent.insertBefore(child, refNode);
    });
  };
  _proto9.optimize = function optimize(context) {
    if (_ShadowBlot3.prototype.optimize.call(this, context), this.enforceAllowedChildren(), this.uiNode != null && this.uiNode !== this.domNode.firstChild && this.domNode.insertBefore(this.uiNode, this.domNode.firstChild), this.children.length === 0) if (this.statics.defaultChild != null) {
      var child = this.scroll.create(this.statics.defaultChild.blotName);
      this.appendChild(child);
    } else this.remove();
  };
  _proto9.path = function path(index, inclusive) {
    if (inclusive === void 0) {
      inclusive = !1;
    }
    var _this$children$find3 = this.children.find(index, inclusive),
      child = _this$children$find3[0],
      offset = _this$children$find3[1],
      position = [[this, index]];
    return child instanceof _ParentBlot ? position.concat(child.path(offset, inclusive)) : (child != null && position.push([child, offset]), position);
  };
  _proto9.removeChild = function removeChild(child) {
    this.children.remove(child);
  };
  _proto9.replaceWith = function replaceWith(name, value) {
    var replacement = typeof name == "string" ? this.scroll.create(name, value) : name;
    return replacement instanceof _ParentBlot && this.moveChildren(replacement), _ShadowBlot3.prototype.replaceWith.call(this, replacement);
  };
  _proto9.split = function split(index, force) {
    if (force === void 0) {
      force = !1;
    }
    if (!force) {
      if (index === 0) return this;
      if (index === this.length()) return this.next;
    }
    var after = this.clone();
    return this.parent && this.parent.insertBefore(after, this.next || void 0), this.children.forEachAt(index, this.length(), function (child, offset, _length) {
      var split = child.split(offset, force);
      split != null && after.appendChild(split);
    }), after;
  };
  _proto9.splitAfter = function splitAfter(child) {
    var after = this.clone();
    for (; child.next != null;) after.appendChild(child.next);
    return this.parent && this.parent.insertBefore(after, this.next || void 0), after;
  };
  _proto9.unwrap = function unwrap() {
    this.parent && this.moveChildren(this.parent, this.next || void 0), this.remove();
  };
  _proto9.update = function update(mutations, _context) {
    var _this11 = this;
    var addedNodes = [],
      removedNodes = [];
    mutations.forEach(function (mutation) {
      mutation.target === _this11.domNode && mutation.type === "childList" && (addedNodes.push.apply(addedNodes, mutation.addedNodes), removedNodes.push.apply(removedNodes, mutation.removedNodes));
    }), removedNodes.forEach(function (node) {
      if (node.parentNode != null &&
      // @ts-expect-error Fix me later
      node.tagName !== "IFRAME" && document.body.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_CONTAINED_BY) return;
      var blot = _this11.scroll.find(node);
      blot != null && (blot.domNode.parentNode == null || blot.domNode.parentNode === _this11.domNode) && blot.detach();
    }), addedNodes.filter(function (node) {
      return node.parentNode === _this11.domNode && node !== _this11.uiNode;
    }).sort(function (a, b) {
      return a === b ? 0 : a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? 1 : -1;
    }).forEach(function (node) {
      var refBlot = null;
      node.nextSibling != null && (refBlot = _this11.scroll.find(node.nextSibling));
      var blot = makeAttachedBlot(node, _this11.scroll);
      (blot.next !== refBlot || blot.next == null) && (blot.parent != null && blot.parent.removeChild(_this11), _this11.insertBefore(blot, refBlot || void 0));
    }), this.enforceAllowedChildren();
  };
  return _ParentBlot;
}(ShadowBlot);
_ParentBlot.uiClass = "";
var ParentBlot = _ParentBlot;
var ParentBlot$1 = ParentBlot;
function isEqual(obj1, obj2) {
  if (Object.keys(obj1).length !== Object.keys(obj2).length) return !1;
  for (var prop in obj1) if (obj1[prop] !== obj2[prop]) return !1;
  return !0;
}
var _InlineBlot = /*#__PURE__*/function (_ParentBlot$) {
  function _InlineBlot(scroll, domNode) {
    var _this12;
    _this12 = _ParentBlot$.call(this, scroll, domNode) || this, _this12.attributes = new AttributorStore$1(_this12.domNode);
    return _this12;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_2__["default"])(_InlineBlot, _ParentBlot$);
  _InlineBlot.create = function create(value) {
    return _ParentBlot$.create.call(this, value);
  };
  _InlineBlot.formats = function formats(domNode, scroll) {
    var match2 = scroll.query(_InlineBlot.blotName);
    if (!(match2 != null && domNode.tagName === match2.tagName)) {
      if (typeof this.tagName == "string") return !0;
      if (Array.isArray(this.tagName)) return domNode.tagName.toLowerCase();
    }
  };
  var _proto10 = _InlineBlot.prototype;
  _proto10.format = function format(name, value) {
    var _this13 = this;
    if (name === this.statics.blotName && !value) this.children.forEach(function (child) {
      child instanceof _InlineBlot || (child = child.wrap(_InlineBlot.blotName, !0)), _this13.attributes.copy(child);
    }), this.unwrap();else {
      var _format = this.scroll.query(name, Scope.INLINE);
      if (_format == null) return;
      _format instanceof Attributor ? this.attributes.attribute(_format, value) : value && (name !== this.statics.blotName || this.formats()[name] !== value) && this.replaceWith(name, value);
    }
  };
  _proto10.formats = function formats() {
    var formats = this.attributes.values(),
      format = this.statics.formats(this.domNode, this.scroll);
    return format != null && (formats[this.statics.blotName] = format), formats;
  };
  _proto10.formatAt = function formatAt(index, length, name, value) {
    this.formats()[name] != null || this.scroll.query(name, Scope.ATTRIBUTE) ? this.isolate(index, length).format(name, value) : _ParentBlot$.prototype.formatAt.call(this, index, length, name, value);
  };
  _proto10.optimize = function optimize(context) {
    _ParentBlot$.prototype.optimize.call(this, context);
    var formats = this.formats();
    if (Object.keys(formats).length === 0) return this.unwrap();
    var next = this.next;
    next instanceof _InlineBlot && next.prev === this && isEqual(formats, next.formats()) && (next.moveChildren(this), next.remove());
  };
  _proto10.replaceWith = function replaceWith(name, value) {
    var replacement = _ParentBlot$.prototype.replaceWith.call(this, name, value);
    return this.attributes.copy(replacement), replacement;
  };
  _proto10.update = function update(mutations, context) {
    var _this14 = this;
    _ParentBlot$.prototype.update.call(this, mutations, context), mutations.some(function (mutation) {
      return mutation.target === _this14.domNode && mutation.type === "attributes";
    }) && this.attributes.build();
  };
  _proto10.wrap = function wrap(name, value) {
    var wrapper = _ParentBlot$.prototype.wrap.call(this, name, value);
    return wrapper instanceof _InlineBlot && this.attributes.move(wrapper), wrapper;
  };
  return _InlineBlot;
}(ParentBlot$1);
_InlineBlot.allowedChildren = [_InlineBlot, LeafBlot$1], _InlineBlot.blotName = "inline", _InlineBlot.scope = Scope.INLINE_BLOT, _InlineBlot.tagName = "SPAN";
var InlineBlot = _InlineBlot;
var InlineBlot$1 = InlineBlot,
  _BlockBlot = /*#__PURE__*/function (_ParentBlot$2) {
    function _BlockBlot(scroll, domNode) {
      var _this15;
      _this15 = _ParentBlot$2.call(this, scroll, domNode) || this, _this15.attributes = new AttributorStore$1(_this15.domNode);
      return _this15;
    }
    (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_2__["default"])(_BlockBlot, _ParentBlot$2);
    _BlockBlot.create = function create(value) {
      return _ParentBlot$2.create.call(this, value);
    };
    _BlockBlot.formats = function formats(domNode, scroll) {
      var match2 = scroll.query(_BlockBlot.blotName);
      if (!(match2 != null && domNode.tagName === match2.tagName)) {
        if (typeof this.tagName == "string") return !0;
        if (Array.isArray(this.tagName)) return domNode.tagName.toLowerCase();
      }
    };
    var _proto11 = _BlockBlot.prototype;
    _proto11.format = function format(name, value) {
      var format = this.scroll.query(name, Scope.BLOCK);
      format != null && (format instanceof Attributor ? this.attributes.attribute(format, value) : name === this.statics.blotName && !value ? this.replaceWith(_BlockBlot.blotName) : value && (name !== this.statics.blotName || this.formats()[name] !== value) && this.replaceWith(name, value));
    };
    _proto11.formats = function formats() {
      var formats = this.attributes.values(),
        format = this.statics.formats(this.domNode, this.scroll);
      return format != null && (formats[this.statics.blotName] = format), formats;
    };
    _proto11.formatAt = function formatAt(index, length, name, value) {
      this.scroll.query(name, Scope.BLOCK) != null ? this.format(name, value) : _ParentBlot$2.prototype.formatAt.call(this, index, length, name, value);
    };
    _proto11.insertAt = function insertAt(index, value, def) {
      if (def == null || this.scroll.query(value, Scope.INLINE) != null) _ParentBlot$2.prototype.insertAt.call(this, index, value, def);else {
        var after = this.split(index);
        if (after != null) {
          var blot = this.scroll.create(value, def);
          after.parent.insertBefore(blot, after);
        } else throw new Error("Attempt to insertAt after block boundaries");
      }
    };
    _proto11.replaceWith = function replaceWith(name, value) {
      var replacement = _ParentBlot$2.prototype.replaceWith.call(this, name, value);
      return this.attributes.copy(replacement), replacement;
    };
    _proto11.update = function update(mutations, context) {
      var _this16 = this;
      _ParentBlot$2.prototype.update.call(this, mutations, context), mutations.some(function (mutation) {
        return mutation.target === _this16.domNode && mutation.type === "attributes";
      }) && this.attributes.build();
    };
    return _BlockBlot;
  }(ParentBlot$1);
_BlockBlot.blotName = "block", _BlockBlot.scope = Scope.BLOCK_BLOT, _BlockBlot.tagName = "P", _BlockBlot.allowedChildren = [InlineBlot$1, _BlockBlot, LeafBlot$1];
var BlockBlot = _BlockBlot;
var BlockBlot$1 = BlockBlot,
  _ContainerBlot = /*#__PURE__*/function (_ParentBlot$3) {
    function _ContainerBlot() {
      return _ParentBlot$3.apply(this, arguments) || this;
    }
    (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_2__["default"])(_ContainerBlot, _ParentBlot$3);
    var _proto12 = _ContainerBlot.prototype;
    _proto12.checkMerge = function checkMerge() {
      return this.next !== null && this.next.statics.blotName === this.statics.blotName;
    };
    _proto12.deleteAt = function deleteAt(index, length) {
      _ParentBlot$3.prototype.deleteAt.call(this, index, length), this.enforceAllowedChildren();
    };
    _proto12.formatAt = function formatAt(index, length, name, value) {
      _ParentBlot$3.prototype.formatAt.call(this, index, length, name, value), this.enforceAllowedChildren();
    };
    _proto12.insertAt = function insertAt(index, value, def) {
      _ParentBlot$3.prototype.insertAt.call(this, index, value, def), this.enforceAllowedChildren();
    };
    _proto12.optimize = function optimize(context) {
      _ParentBlot$3.prototype.optimize.call(this, context), this.children.length > 0 && this.next != null && this.checkMerge() && (this.next.moveChildren(this), this.next.remove());
    };
    return _ContainerBlot;
  }(ParentBlot$1);
_ContainerBlot.blotName = "container", _ContainerBlot.scope = Scope.BLOCK_BLOT;
var ContainerBlot = _ContainerBlot;
var ContainerBlot$1 = ContainerBlot;
var EmbedBlot = /*#__PURE__*/function (_LeafBlot$) {
  function EmbedBlot() {
    return _LeafBlot$.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_2__["default"])(EmbedBlot, _LeafBlot$);
  EmbedBlot.formats = function formats(_domNode, _scroll) {};
  var _proto13 = EmbedBlot.prototype;
  _proto13.format = function format(name, value) {
    _LeafBlot$.prototype.formatAt.call(this, 0, this.length(), name, value);
  };
  _proto13.formatAt = function formatAt(index, length, name, value) {
    index === 0 && length === this.length() ? this.format(name, value) : _LeafBlot$.prototype.formatAt.call(this, index, length, name, value);
  };
  _proto13.formats = function formats() {
    return this.statics.formats(this.domNode, this.scroll);
  };
  return EmbedBlot;
}(LeafBlot$1);
var EmbedBlot$1 = EmbedBlot,
  OBSERVER_CONFIG = {
    attributes: !0,
    characterData: !0,
    characterDataOldValue: !0,
    childList: !0,
    subtree: !0
  },
  MAX_OPTIMIZE_ITERATIONS = 100,
  _ScrollBlot = /*#__PURE__*/function (_ParentBlot$4) {
    function _ScrollBlot(registry, node) {
      var _this17;
      _this17 = _ParentBlot$4.call(this, null, node) || this, _this17.registry = registry, _this17.scroll = (0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0__["default"])(_this17), _this17.build(), _this17.observer = new MutationObserver(function (mutations) {
        _this17.update(mutations);
      }), _this17.observer.observe(_this17.domNode, OBSERVER_CONFIG), _this17.attach();
      return _this17;
    }
    (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_2__["default"])(_ScrollBlot, _ParentBlot$4);
    var _proto14 = _ScrollBlot.prototype;
    _proto14.create = function create(input, value) {
      return this.registry.create(this, input, value);
    };
    _proto14.find = function find(node, bubble) {
      if (bubble === void 0) {
        bubble = !1;
      }
      var blot = this.registry.find(node, bubble);
      return blot ? blot.scroll === this ? blot : bubble ? this.find(blot.scroll.domNode.parentNode, !0) : null : null;
    };
    _proto14.query = function query(_query2, scope) {
      if (scope === void 0) {
        scope = Scope.ANY;
      }
      return this.registry.query(_query2, scope);
    };
    _proto14.register = function register() {
      var _this$registry;
      return (_this$registry = this.registry).register.apply(_this$registry, arguments);
    };
    _proto14.build = function build() {
      this.scroll != null && _ParentBlot$4.prototype.build.call(this);
    };
    _proto14.detach = function detach() {
      _ParentBlot$4.prototype.detach.call(this), this.observer.disconnect();
    };
    _proto14.deleteAt = function deleteAt(index, length) {
      this.update(), index === 0 && length === this.length() ? this.children.forEach(function (child) {
        child.remove();
      }) : _ParentBlot$4.prototype.deleteAt.call(this, index, length);
    };
    _proto14.formatAt = function formatAt(index, length, name, value) {
      this.update(), _ParentBlot$4.prototype.formatAt.call(this, index, length, name, value);
    };
    _proto14.insertAt = function insertAt(index, value, def) {
      this.update(), _ParentBlot$4.prototype.insertAt.call(this, index, value, def);
    };
    _proto14.optimize = function _optimize(mutations, context) {
      var _this18 = this;
      if (mutations === void 0) {
        mutations = [];
      }
      if (context === void 0) {
        context = {};
      }
      _ParentBlot$4.prototype.optimize.call(this, context);
      var mutationsMap = context.mutationsMap || /* @__PURE__ */new WeakMap();
      var records = Array.from(this.observer.takeRecords());
      for (; records.length > 0;) mutations.push(records.pop());
      var _mark = function mark(blot, markParent) {
          if (markParent === void 0) {
            markParent = !0;
          }
          blot == null || blot === _this18 || blot.domNode.parentNode != null && (mutationsMap.has(blot.domNode) || mutationsMap.set(blot.domNode, []), markParent && _mark(blot.parent));
        },
        _optimize = function optimize(blot) {
          mutationsMap.has(blot.domNode) && (blot instanceof ParentBlot$1 && blot.children.forEach(_optimize), mutationsMap["delete"](blot.domNode), blot.optimize(context));
        };
      var remaining = mutations;
      for (var i = 0; remaining.length > 0; i += 1) {
        if (i >= MAX_OPTIMIZE_ITERATIONS) throw new Error("[Parchment] Maximum optimize iterations reached");
        for (remaining.forEach(function (mutation) {
          var blot = _this18.find(mutation.target, !0);
          blot != null && (blot.domNode === mutation.target && (mutation.type === "childList" ? (_mark(_this18.find(mutation.previousSibling, !1)), Array.from(mutation.addedNodes).forEach(function (node) {
            var child = _this18.find(node, !1);
            _mark(child, !1), child instanceof ParentBlot$1 && child.children.forEach(function (grandChild) {
              _mark(grandChild, !1);
            });
          })) : mutation.type === "attributes" && _mark(blot.prev)), _mark(blot));
        }), this.children.forEach(_optimize), remaining = Array.from(this.observer.takeRecords()), records = remaining.slice(); records.length > 0;) mutations.push(records.pop());
      }
    };
    _proto14.update = function update(mutations, context) {
      var _this19 = this;
      if (context === void 0) {
        context = {};
      }
      mutations = mutations || this.observer.takeRecords();
      var mutationsMap = /* @__PURE__ */new WeakMap();
      mutations.map(function (mutation) {
        var blot = _this19.find(mutation.target, !0);
        return blot == null ? null : mutationsMap.has(blot.domNode) ? (mutationsMap.get(blot.domNode).push(mutation), null) : (mutationsMap.set(blot.domNode, [mutation]), blot);
      }).forEach(function (blot) {
        blot != null && blot !== _this19 && mutationsMap.has(blot.domNode) && blot.update(mutationsMap.get(blot.domNode) || [], context);
      }), context.mutationsMap = mutationsMap, mutationsMap.has(this.domNode) && _ParentBlot$4.prototype.update.call(this, mutationsMap.get(this.domNode), context), this.optimize(mutations, context);
    };
    return _ScrollBlot;
  }(ParentBlot$1);
_ScrollBlot.blotName = "scroll", _ScrollBlot.defaultChild = BlockBlot$1, _ScrollBlot.allowedChildren = [BlockBlot$1, ContainerBlot$1], _ScrollBlot.scope = Scope.BLOCK_BLOT, _ScrollBlot.tagName = "DIV";
var ScrollBlot = _ScrollBlot;
var ScrollBlot$1 = ScrollBlot,
  _TextBlot = /*#__PURE__*/function (_LeafBlot$2) {
    function _TextBlot(scroll, node) {
      var _this20;
      _this20 = _LeafBlot$2.call(this, scroll, node) || this, _this20.text = _this20.statics.value(_this20.domNode);
      return _this20;
    }
    (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_2__["default"])(_TextBlot, _LeafBlot$2);
    _TextBlot.create = function create(value) {
      return document.createTextNode(value);
    };
    _TextBlot.value = function value(domNode) {
      return domNode.data;
    };
    var _proto15 = _TextBlot.prototype;
    _proto15.deleteAt = function deleteAt(index, length) {
      this.domNode.data = this.text = this.text.slice(0, index) + this.text.slice(index + length);
    };
    _proto15.index = function index(node, offset) {
      return this.domNode === node ? offset : -1;
    };
    _proto15.insertAt = function insertAt(index, value, def) {
      def == null ? (this.text = this.text.slice(0, index) + value + this.text.slice(index), this.domNode.data = this.text) : _LeafBlot$2.prototype.insertAt.call(this, index, value, def);
    };
    _proto15.length = function length() {
      return this.text.length;
    };
    _proto15.optimize = function optimize(context) {
      _LeafBlot$2.prototype.optimize.call(this, context), this.text = this.statics.value(this.domNode), this.text.length === 0 ? this.remove() : this.next instanceof _TextBlot && this.next.prev === this && (this.insertAt(this.length(), this.next.value()), this.next.remove());
    };
    _proto15.position = function position(index, _inclusive) {
      if (_inclusive === void 0) {
        _inclusive = !1;
      }
      return [this.domNode, index];
    };
    _proto15.split = function split(index, force) {
      if (force === void 0) {
        force = !1;
      }
      if (!force) {
        if (index === 0) return this;
        if (index === this.length()) return this.next;
      }
      var after = this.scroll.create(this.domNode.splitText(index));
      return this.parent.insertBefore(after, this.next || void 0), this.text = this.statics.value(this.domNode), after;
    };
    _proto15.update = function update(mutations, _context) {
      var _this21 = this;
      mutations.some(function (mutation) {
        return mutation.type === "characterData" && mutation.target === _this21.domNode;
      }) && (this.text = this.statics.value(this.domNode));
    };
    _proto15.value = function value() {
      return this.text;
    };
    return _TextBlot;
  }(LeafBlot$1);
_TextBlot.blotName = "text", _TextBlot.scope = Scope.INLINE_BLOT;
var TextBlot = _TextBlot;
var TextBlot$1 = TextBlot;


/***/ }),

/***/ "./node_modules/quill/blots/block.js":
/*!*******************************************!*\
  !*** ./node_modules/quill/blots/block.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BlockEmbed: () => (/* binding */ BlockEmbed),
/* harmony export */   blockDelta: () => (/* binding */ blockDelta),
/* harmony export */   bubbleFormats: () => (/* binding */ bubbleFormats),
/* harmony export */   "default": () => (/* binding */ Block)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var parchment__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! parchment */ "./node_modules/parchment/dist/parchment.js");
/* harmony import */ var quill_delta__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! quill-delta */ "./node_modules/quill-delta/dist/Delta.js");
/* harmony import */ var _break_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./break.js */ "./node_modules/quill/blots/break.js");
/* harmony import */ var _inline_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./inline.js */ "./node_modules/quill/blots/inline.js");
/* harmony import */ var _text_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./text.js */ "./node_modules/quill/blots/text.js");







var NEWLINE_LENGTH = 1;
var Block = /*#__PURE__*/function (_BlockBlot) {
  function Block() {
    var _this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _BlockBlot.call.apply(_BlockBlot, [this].concat(args)) || this;
    _this.cache = {};
    return _this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__["default"])(Block, _BlockBlot);
  var _proto = Block.prototype;
  _proto.delta = function delta() {
    if (this.cache.delta == null) {
      this.cache.delta = blockDelta(this);
    }
    return this.cache.delta;
  };
  _proto.deleteAt = function deleteAt(index, length) {
    _BlockBlot.prototype.deleteAt.call(this, index, length);
    this.cache = {};
  };
  _proto.formatAt = function formatAt(index, length, name, value) {
    if (length <= 0) return;
    if (this.scroll.query(name, parchment__WEBPACK_IMPORTED_MODULE_6__.Scope.BLOCK)) {
      if (index + length === this.length()) {
        this.format(name, value);
      }
    } else {
      _BlockBlot.prototype.formatAt.call(this, index, Math.min(length, this.length() - index - 1), name, value);
    }
    this.cache = {};
  };
  _proto.insertAt = function insertAt(index, value, def) {
    if (def != null) {
      _BlockBlot.prototype.insertAt.call(this, index, value, def);
      this.cache = {};
      return;
    }
    if (value.length === 0) return;
    var lines = value.split('\n');
    var text = lines.shift();
    if (text.length > 0) {
      if (index < this.length() - 1 || this.children.tail == null) {
        _BlockBlot.prototype.insertAt.call(this, Math.min(index, this.length() - 1), text);
      } else {
        this.children.tail.insertAt(this.children.tail.length(), text);
      }
      this.cache = {};
    }
    // TODO: Fix this next time the file is edited.
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    var block = this;
    lines.reduce(function (lineIndex, line) {
      // @ts-expect-error Fix me later
      block = block.split(lineIndex, true);
      block.insertAt(0, line);
      return line.length;
    }, index + text.length);
  };
  _proto.insertBefore = function insertBefore(blot, ref) {
    var head = this.children.head;
    _BlockBlot.prototype.insertBefore.call(this, blot, ref);
    if (head instanceof _break_js__WEBPACK_IMPORTED_MODULE_3__["default"]) {
      head.remove();
    }
    this.cache = {};
  };
  _proto.length = function length() {
    if (this.cache.length == null) {
      this.cache.length = _BlockBlot.prototype.length.call(this) + NEWLINE_LENGTH;
    }
    return this.cache.length;
  };
  _proto.moveChildren = function moveChildren(target, ref) {
    _BlockBlot.prototype.moveChildren.call(this, target, ref);
    this.cache = {};
  };
  _proto.optimize = function optimize(context) {
    _BlockBlot.prototype.optimize.call(this, context);
    this.cache = {};
  };
  _proto.path = function path(index) {
    return _BlockBlot.prototype.path.call(this, index, true);
  };
  _proto.removeChild = function removeChild(child) {
    _BlockBlot.prototype.removeChild.call(this, child);
    this.cache = {};
  };
  _proto.split = function split(index) {
    var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    if (force && (index === 0 || index >= this.length() - NEWLINE_LENGTH)) {
      var clone = this.clone();
      if (index === 0) {
        this.parent.insertBefore(clone, this);
        return this;
      }
      this.parent.insertBefore(clone, this.next);
      return clone;
    }
    var next = _BlockBlot.prototype.split.call(this, index, force);
    this.cache = {};
    return next;
  };
  return Block;
}(parchment__WEBPACK_IMPORTED_MODULE_6__.BlockBlot);
Block.blotName = 'block';
Block.tagName = 'P';
Block.defaultChild = _break_js__WEBPACK_IMPORTED_MODULE_3__["default"];
Block.allowedChildren = [_break_js__WEBPACK_IMPORTED_MODULE_3__["default"], _inline_js__WEBPACK_IMPORTED_MODULE_4__["default"], parchment__WEBPACK_IMPORTED_MODULE_6__.EmbedBlot, _text_js__WEBPACK_IMPORTED_MODULE_5__["default"]];
var BlockEmbed = /*#__PURE__*/function (_EmbedBlot) {
  function BlockEmbed() {
    return _EmbedBlot.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__["default"])(BlockEmbed, _EmbedBlot);
  var _proto2 = BlockEmbed.prototype;
  _proto2.attach = function attach() {
    _EmbedBlot.prototype.attach.call(this);
    this.attributes = new parchment__WEBPACK_IMPORTED_MODULE_6__.AttributorStore(this.domNode);
  };
  _proto2.delta = function delta() {
    return new quill_delta__WEBPACK_IMPORTED_MODULE_2__().insert(this.value(), (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, this.formats(), this.attributes.values()));
  };
  _proto2.format = function format(name, value) {
    var attribute = this.scroll.query(name, parchment__WEBPACK_IMPORTED_MODULE_6__.Scope.BLOCK_ATTRIBUTE);
    if (attribute != null) {
      // @ts-expect-error TODO: Scroll#query() should return Attributor when scope is attribute
      this.attributes.attribute(attribute, value);
    }
  };
  _proto2.formatAt = function formatAt(index, length, name, value) {
    this.format(name, value);
  };
  _proto2.insertAt = function insertAt(index, value, def) {
    var _this2 = this;
    if (def != null) {
      _EmbedBlot.prototype.insertAt.call(this, index, value, def);
      return;
    }
    var lines = value.split('\n');
    var text = lines.pop();
    var blocks = lines.map(function (line) {
      var block = _this2.scroll.create(Block.blotName);
      block.insertAt(0, line);
      return block;
    });
    var ref = this.split(index);
    blocks.forEach(function (block) {
      _this2.parent.insertBefore(block, ref);
    });
    if (text) {
      this.parent.insertBefore(this.scroll.create('text', text), ref);
    }
  };
  return BlockEmbed;
}(parchment__WEBPACK_IMPORTED_MODULE_6__.EmbedBlot);
BlockEmbed.scope = parchment__WEBPACK_IMPORTED_MODULE_6__.Scope.BLOCK_BLOT;
// It is important for cursor behavior BlockEmbeds use tags that are block level elements

function blockDelta(blot) {
  var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  return blot.descendants(parchment__WEBPACK_IMPORTED_MODULE_6__.LeafBlot).reduce(function (delta, leaf) {
    if (leaf.length() === 0) {
      return delta;
    }
    return delta.insert(leaf.value(), bubbleFormats(leaf, {}, filter));
  }, new quill_delta__WEBPACK_IMPORTED_MODULE_2__()).insert('\n', bubbleFormats(blot));
}
function bubbleFormats(blot) {
  var formats = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var filter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  if (blot == null) return formats;
  if ('formats' in blot && typeof blot.formats === 'function') {
    formats = (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, formats, blot.formats());
    if (filter) {
      // exclude syntax highlighting from deltas and getFormat()
      delete formats['code-token'];
    }
  }
  if (blot.parent == null || blot.parent.statics.blotName === 'scroll' || blot.parent.statics.scope !== blot.statics.scope) {
    return formats;
  }
  return bubbleFormats(blot.parent, formats, filter);
}


/***/ }),

/***/ "./node_modules/quill/blots/break.js":
/*!*******************************************!*\
  !*** ./node_modules/quill/blots/break.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var parchment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! parchment */ "./node_modules/parchment/dist/parchment.js");


var Break = /*#__PURE__*/function (_EmbedBlot) {
  function Break() {
    return _EmbedBlot.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(Break, _EmbedBlot);
  Break.value = function value() {
    return undefined;
  };
  var _proto = Break.prototype;
  _proto.optimize = function optimize() {
    if (this.prev || this.next) {
      this.remove();
    }
  };
  _proto.length = function length() {
    return 0;
  };
  _proto.value = function value() {
    return '';
  };
  return Break;
}(parchment__WEBPACK_IMPORTED_MODULE_1__.EmbedBlot);
Break.blotName = 'break';
Break.tagName = 'BR';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Break);

/***/ }),

/***/ "./node_modules/quill/blots/container.js":
/*!***********************************************!*\
  !*** ./node_modules/quill/blots/container.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var parchment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! parchment */ "./node_modules/parchment/dist/parchment.js");


var Container = /*#__PURE__*/function (_ContainerBlot) {
  function Container() {
    return _ContainerBlot.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(Container, _ContainerBlot);
  return Container;
}(parchment__WEBPACK_IMPORTED_MODULE_1__.ContainerBlot);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Container);

/***/ }),

/***/ "./node_modules/quill/blots/cursor.js":
/*!********************************************!*\
  !*** ./node_modules/quill/blots/cursor.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var parchment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! parchment */ "./node_modules/parchment/dist/parchment.js");
/* harmony import */ var _text_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./text.js */ "./node_modules/quill/blots/text.js");



var Cursor = /*#__PURE__*/function (_EmbedBlot) {
  function Cursor(scroll, domNode, selection) {
    var _this;
    _this = _EmbedBlot.call(this, scroll, domNode) || this;
    _this.selection = selection;
    _this.textNode = document.createTextNode(Cursor.CONTENTS);
    _this.domNode.appendChild(_this.textNode);
    _this.savedLength = 0;
    return _this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(Cursor, _EmbedBlot);
  // Zero width no break space
  Cursor.value = function value() {
    return undefined;
  };
  var _proto = Cursor.prototype;
  _proto.detach = function detach() {
    // super.detach() will also clear domNode.__blot
    if (this.parent != null) this.parent.removeChild(this);
  };
  _proto.format = function format(name, value) {
    if (this.savedLength !== 0) {
      _EmbedBlot.prototype.format.call(this, name, value);
      return;
    }
    // TODO: Fix this next time the file is edited.
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    var target = this;
    var index = 0;
    while (target != null && target.statics.scope !== parchment__WEBPACK_IMPORTED_MODULE_2__.Scope.BLOCK_BLOT) {
      index += target.offset(target.parent);
      target = target.parent;
    }
    if (target != null) {
      this.savedLength = Cursor.CONTENTS.length;
      // @ts-expect-error TODO: allow empty context in Parchment
      target.optimize();
      target.formatAt(index, Cursor.CONTENTS.length, name, value);
      this.savedLength = 0;
    }
  };
  _proto.index = function index(node, offset) {
    if (node === this.textNode) return 0;
    return _EmbedBlot.prototype.index.call(this, node, offset);
  };
  _proto.length = function length() {
    return this.savedLength;
  };
  _proto.position = function position() {
    return [this.textNode, this.textNode.data.length];
  };
  _proto.remove = function remove() {
    _EmbedBlot.prototype.remove.call(this);
    // @ts-expect-error Fix me later
    this.parent = null;
  };
  _proto.restore = function restore() {
    if (this.selection.composing || this.parent == null) return null;
    var range = this.selection.getNativeRange();
    // Browser may push down styles/nodes inside the cursor blot.
    // https://dvcs.w3.org/hg/editing/raw-file/tip/editing.html#push-down-values
    while (this.domNode.lastChild != null && this.domNode.lastChild !== this.textNode) {
      // @ts-expect-error Fix me later
      this.domNode.parentNode.insertBefore(this.domNode.lastChild, this.domNode);
    }
    var prevTextBlot = this.prev instanceof _text_js__WEBPACK_IMPORTED_MODULE_1__["default"] ? this.prev : null;
    var prevTextLength = prevTextBlot ? prevTextBlot.length() : 0;
    var nextTextBlot = this.next instanceof _text_js__WEBPACK_IMPORTED_MODULE_1__["default"] ? this.next : null;
    // @ts-expect-error TODO: make TextBlot.text public
    var nextText = nextTextBlot ? nextTextBlot.text : '';
    var textNode = this.textNode;
    // take text from inside this blot and reset it
    var newText = textNode.data.split(Cursor.CONTENTS).join('');
    textNode.data = Cursor.CONTENTS;

    // proactively merge TextBlots around cursor so that optimization
    // doesn't lose the cursor.  the reason we are here in cursor.restore
    // could be that the user clicked in prevTextBlot or nextTextBlot, or
    // the user typed something.
    var mergedTextBlot;
    if (prevTextBlot) {
      mergedTextBlot = prevTextBlot;
      if (newText || nextTextBlot) {
        prevTextBlot.insertAt(prevTextBlot.length(), newText + nextText);
        if (nextTextBlot) {
          nextTextBlot.remove();
        }
      }
    } else if (nextTextBlot) {
      mergedTextBlot = nextTextBlot;
      nextTextBlot.insertAt(0, newText);
    } else {
      var newTextNode = document.createTextNode(newText);
      mergedTextBlot = this.scroll.create(newTextNode);
      this.parent.insertBefore(mergedTextBlot, this);
    }
    this.remove();
    if (range) {
      // calculate selection to restore
      var remapOffset = function remapOffset(node, offset) {
        if (prevTextBlot && node === prevTextBlot.domNode) {
          return offset;
        }
        if (node === textNode) {
          return prevTextLength + offset - 1;
        }
        if (nextTextBlot && node === nextTextBlot.domNode) {
          return prevTextLength + newText.length + offset;
        }
        return null;
      };
      var start = remapOffset(range.start.node, range.start.offset);
      var end = remapOffset(range.end.node, range.end.offset);
      if (start !== null && end !== null) {
        return {
          startNode: mergedTextBlot.domNode,
          startOffset: start,
          endNode: mergedTextBlot.domNode,
          endOffset: end
        };
      }
    }
    return null;
  };
  _proto.update = function update(mutations, context) {
    var _this2 = this;
    if (mutations.some(function (mutation) {
      return mutation.type === 'characterData' && mutation.target === _this2.textNode;
    })) {
      var range = this.restore();
      if (range) context.range = range;
    }
  }

  // Avoid .ql-cursor being a descendant of `<a/>`.
  // The reason is Safari pushes down `<a/>` on text insertion.
  // That will cause DOM nodes not sync with the model.
  //
  // For example ({I} is the caret), given the markup:
  //    <a><span class="ql-cursor">\uFEFF{I}</span></a>
  // When typing a char "x", `<a/>` will be pushed down inside the `<span>` first:
  //    <span class="ql-cursor"><a>\uFEFF{I}</a></span>
  // And then "x" will be inserted after `<a/>`:
  //    <span class="ql-cursor"><a>\uFEFF</a>d{I}</span>
  ;
  _proto.optimize = function optimize(context) {
    // @ts-expect-error Fix me later
    _EmbedBlot.prototype.optimize.call(this, context);
    var parent = this.parent;
    while (parent) {
      if (parent.domNode.tagName === 'A') {
        this.savedLength = Cursor.CONTENTS.length;
        // @ts-expect-error TODO: make isolate generic
        parent.isolate(this.offset(parent), this.length()).unwrap();
        this.savedLength = 0;
        break;
      }
      parent = parent.parent;
    }
  };
  _proto.value = function value() {
    return '';
  };
  return Cursor;
}(parchment__WEBPACK_IMPORTED_MODULE_2__.EmbedBlot);
Cursor.blotName = 'cursor';
Cursor.className = 'ql-cursor';
Cursor.tagName = 'span';
Cursor.CONTENTS = "\uFEFF";
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Cursor);

/***/ }),

/***/ "./node_modules/quill/blots/embed.js":
/*!*******************************************!*\
  !*** ./node_modules/quill/blots/embed.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var parchment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! parchment */ "./node_modules/parchment/dist/parchment.js");
/* harmony import */ var _text_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./text.js */ "./node_modules/quill/blots/text.js");



var GUARD_TEXT = "\uFEFF";
var Embed = /*#__PURE__*/function (_EmbedBlot) {
  function Embed(scroll, node) {
    var _this;
    _this = _EmbedBlot.call(this, scroll, node) || this;
    _this.contentNode = document.createElement('span');
    _this.contentNode.setAttribute('contenteditable', 'false');
    Array.from(_this.domNode.childNodes).forEach(function (childNode) {
      _this.contentNode.appendChild(childNode);
    });
    _this.leftGuard = document.createTextNode(GUARD_TEXT);
    _this.rightGuard = document.createTextNode(GUARD_TEXT);
    _this.domNode.appendChild(_this.leftGuard);
    _this.domNode.appendChild(_this.contentNode);
    _this.domNode.appendChild(_this.rightGuard);
    return _this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(Embed, _EmbedBlot);
  var _proto = Embed.prototype;
  _proto.index = function index(node, offset) {
    if (node === this.leftGuard) return 0;
    if (node === this.rightGuard) return 1;
    return _EmbedBlot.prototype.index.call(this, node, offset);
  };
  _proto.restore = function restore(node) {
    var range = null;
    var textNode;
    var text = node.data.split(GUARD_TEXT).join('');
    if (node === this.leftGuard) {
      if (this.prev instanceof _text_js__WEBPACK_IMPORTED_MODULE_1__["default"]) {
        var prevLength = this.prev.length();
        this.prev.insertAt(prevLength, text);
        range = {
          startNode: this.prev.domNode,
          startOffset: prevLength + text.length
        };
      } else {
        textNode = document.createTextNode(text);
        this.parent.insertBefore(this.scroll.create(textNode), this);
        range = {
          startNode: textNode,
          startOffset: text.length
        };
      }
    } else if (node === this.rightGuard) {
      if (this.next instanceof _text_js__WEBPACK_IMPORTED_MODULE_1__["default"]) {
        this.next.insertAt(0, text);
        range = {
          startNode: this.next.domNode,
          startOffset: text.length
        };
      } else {
        textNode = document.createTextNode(text);
        this.parent.insertBefore(this.scroll.create(textNode), this.next);
        range = {
          startNode: textNode,
          startOffset: text.length
        };
      }
    }
    node.data = GUARD_TEXT;
    return range;
  };
  _proto.update = function update(mutations, context) {
    var _this2 = this;
    mutations.forEach(function (mutation) {
      if (mutation.type === 'characterData' && (mutation.target === _this2.leftGuard || mutation.target === _this2.rightGuard)) {
        var range = _this2.restore(mutation.target);
        if (range) context.range = range;
      }
    });
  };
  return Embed;
}(parchment__WEBPACK_IMPORTED_MODULE_2__.EmbedBlot);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Embed);

/***/ }),

/***/ "./node_modules/quill/blots/inline.js":
/*!********************************************!*\
  !*** ./node_modules/quill/blots/inline.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var parchment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! parchment */ "./node_modules/parchment/dist/parchment.js");
/* harmony import */ var _break_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./break.js */ "./node_modules/quill/blots/break.js");
/* harmony import */ var _text_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./text.js */ "./node_modules/quill/blots/text.js");

var _Inline;



var Inline = /*#__PURE__*/function (_InlineBlot) {
  function Inline() {
    return _InlineBlot.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(Inline, _InlineBlot);
  Inline.compare = function compare(self, other) {
    var selfIndex = Inline.order.indexOf(self);
    var otherIndex = Inline.order.indexOf(other);
    if (selfIndex >= 0 || otherIndex >= 0) {
      return selfIndex - otherIndex;
    }
    if (self === other) {
      return 0;
    }
    if (self < other) {
      return -1;
    }
    return 1;
  };
  var _proto = Inline.prototype;
  _proto.formatAt = function formatAt(index, length, name, value) {
    if (Inline.compare(this.statics.blotName, name) < 0 && this.scroll.query(name, parchment__WEBPACK_IMPORTED_MODULE_3__.Scope.BLOT)) {
      var blot = this.isolate(index, length);
      if (value) {
        blot.wrap(name, value);
      }
    } else {
      _InlineBlot.prototype.formatAt.call(this, index, length, name, value);
    }
  };
  _proto.optimize = function optimize(context) {
    _InlineBlot.prototype.optimize.call(this, context);
    if (this.parent instanceof Inline && Inline.compare(this.statics.blotName, this.parent.statics.blotName) > 0) {
      var parent = this.parent.isolate(this.offset(), this.length());
      // @ts-expect-error TODO: make isolate generic
      this.moveChildren(parent);
      parent.wrap(this);
    }
  };
  return Inline;
}(parchment__WEBPACK_IMPORTED_MODULE_3__.InlineBlot);
_Inline = Inline;
Inline.allowedChildren = [_Inline, _break_js__WEBPACK_IMPORTED_MODULE_1__["default"], parchment__WEBPACK_IMPORTED_MODULE_3__.EmbedBlot, _text_js__WEBPACK_IMPORTED_MODULE_2__["default"]];
// Lower index means deeper in the DOM tree, since not found (-1) is for embeds
Inline.order = ['cursor', 'inline',
// Must be lower
'link',
// Chrome wants <a> to be lower
'underline', 'strike', 'italic', 'bold', 'script', 'code' // Must be higher
];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Inline);

/***/ }),

/***/ "./node_modules/quill/blots/scroll.js":
/*!********************************************!*\
  !*** ./node_modules/quill/blots/scroll.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var parchment__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! parchment */ "./node_modules/parchment/dist/parchment.js");
/* harmony import */ var quill_delta__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! quill-delta */ "./node_modules/quill-delta/dist/Delta.js");
/* harmony import */ var _core_emitter_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/emitter.js */ "./node_modules/quill/core/emitter.js");
/* harmony import */ var _block_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./block.js */ "./node_modules/quill/blots/block.js");
/* harmony import */ var _break_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./break.js */ "./node_modules/quill/blots/break.js");
/* harmony import */ var _container_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./container.js */ "./node_modules/quill/blots/container.js");







function isLine(blot) {
  return blot instanceof _block_js__WEBPACK_IMPORTED_MODULE_3__["default"] || blot instanceof _block_js__WEBPACK_IMPORTED_MODULE_3__.BlockEmbed;
}
function isUpdatable(blot) {
  return typeof blot.updateContent === 'function';
}
var Scroll = /*#__PURE__*/function (_ScrollBlot) {
  function Scroll(registry, domNode, _ref) {
    var _this;
    var emitter = _ref.emitter;
    _this = _ScrollBlot.call(this, registry, domNode) || this;
    _this.emitter = emitter;
    _this.batch = false;
    _this.optimize();
    _this.enable();
    _this.domNode.addEventListener('dragstart', function (e) {
      return _this.handleDragStart(e);
    });
    return _this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(Scroll, _ScrollBlot);
  var _proto = Scroll.prototype;
  _proto.batchStart = function batchStart() {
    if (!Array.isArray(this.batch)) {
      this.batch = [];
    }
  };
  _proto.batchEnd = function batchEnd() {
    if (!this.batch) return;
    var mutations = this.batch;
    this.batch = false;
    this.update(mutations);
  };
  _proto.emitMount = function emitMount(blot) {
    this.emitter.emit(_core_emitter_js__WEBPACK_IMPORTED_MODULE_2__["default"].events.SCROLL_BLOT_MOUNT, blot);
  };
  _proto.emitUnmount = function emitUnmount(blot) {
    this.emitter.emit(_core_emitter_js__WEBPACK_IMPORTED_MODULE_2__["default"].events.SCROLL_BLOT_UNMOUNT, blot);
  };
  _proto.emitEmbedUpdate = function emitEmbedUpdate(blot, change) {
    this.emitter.emit(_core_emitter_js__WEBPACK_IMPORTED_MODULE_2__["default"].events.SCROLL_EMBED_UPDATE, blot, change);
  };
  _proto.deleteAt = function deleteAt(index, length) {
    var _this$line = this.line(index),
      first = _this$line[0],
      offset = _this$line[1];
    var _this$line2 = this.line(index + length),
      last = _this$line2[0];
    _ScrollBlot.prototype.deleteAt.call(this, index, length);
    if (last != null && first !== last && offset > 0) {
      if (first instanceof _block_js__WEBPACK_IMPORTED_MODULE_3__.BlockEmbed || last instanceof _block_js__WEBPACK_IMPORTED_MODULE_3__.BlockEmbed) {
        this.optimize();
        return;
      }
      var ref = last.children.head instanceof _break_js__WEBPACK_IMPORTED_MODULE_4__["default"] ? null : last.children.head;
      // @ts-expect-error
      first.moveChildren(last, ref);
      // @ts-expect-error
      first.remove();
    }
    this.optimize();
  };
  _proto.enable = function enable() {
    var enabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    this.domNode.setAttribute('contenteditable', enabled ? 'true' : 'false');
  };
  _proto.formatAt = function formatAt(index, length, format, value) {
    _ScrollBlot.prototype.formatAt.call(this, index, length, format, value);
    this.optimize();
  };
  _proto.insertAt = function insertAt(index, value, def) {
    if (index >= this.length()) {
      if (def == null || this.scroll.query(value, parchment__WEBPACK_IMPORTED_MODULE_6__.Scope.BLOCK) == null) {
        var blot = this.scroll.create(this.statics.defaultChild.blotName);
        this.appendChild(blot);
        if (def == null && value.endsWith('\n')) {
          blot.insertAt(0, value.slice(0, -1), def);
        } else {
          blot.insertAt(0, value, def);
        }
      } else {
        var embed = this.scroll.create(value, def);
        this.appendChild(embed);
      }
    } else {
      _ScrollBlot.prototype.insertAt.call(this, index, value, def);
    }
    this.optimize();
  };
  _proto.insertBefore = function insertBefore(blot, ref) {
    if (blot.statics.scope === parchment__WEBPACK_IMPORTED_MODULE_6__.Scope.INLINE_BLOT) {
      var wrapper = this.scroll.create(this.statics.defaultChild.blotName);
      wrapper.appendChild(blot);
      _ScrollBlot.prototype.insertBefore.call(this, wrapper, ref);
    } else {
      _ScrollBlot.prototype.insertBefore.call(this, blot, ref);
    }
  };
  _proto.insertContents = function insertContents(index, delta) {
    var _this2 = this;
    var renderBlocks = this.deltaToRenderBlocks(delta.concat(new quill_delta__WEBPACK_IMPORTED_MODULE_1__().insert('\n')));
    var last = renderBlocks.pop();
    if (last == null) return;
    this.batchStart();
    var first = renderBlocks.shift();
    if (first) {
      var _Delta$insert;
      var shouldInsertNewlineChar = first.type === 'block' && (first.delta.length() === 0 || !this.descendant(_block_js__WEBPACK_IMPORTED_MODULE_3__.BlockEmbed, index)[0] && index < this.length());
      var _delta = first.type === 'block' ? first.delta : new quill_delta__WEBPACK_IMPORTED_MODULE_1__().insert((_Delta$insert = {}, _Delta$insert[first.key] = first.value, _Delta$insert));
      insertInlineContents(this, index, _delta);
      var newlineCharLength = first.type === 'block' ? 1 : 0;
      var lineEndIndex = index + _delta.length() + newlineCharLength;
      if (shouldInsertNewlineChar) {
        this.insertAt(lineEndIndex - 1, '\n');
      }
      var formats = (0,_block_js__WEBPACK_IMPORTED_MODULE_3__.bubbleFormats)(this.line(index)[0]);
      var attributes = quill_delta__WEBPACK_IMPORTED_MODULE_1__.AttributeMap.diff(formats, first.attributes) || {};
      Object.keys(attributes).forEach(function (name) {
        _this2.formatAt(lineEndIndex - 1, 1, name, attributes[name]);
      });
      index = lineEndIndex;
    }
    var _this$children$find = this.children.find(index),
      refBlot = _this$children$find[0],
      refBlotOffset = _this$children$find[1];
    if (renderBlocks.length) {
      if (refBlot) {
        refBlot = refBlot.split(refBlotOffset);
        refBlotOffset = 0;
      }
      renderBlocks.forEach(function (renderBlock) {
        if (renderBlock.type === 'block') {
          var block = _this2.createBlock(renderBlock.attributes, refBlot || undefined);
          insertInlineContents(block, 0, renderBlock.delta);
        } else {
          var blockEmbed = _this2.create(renderBlock.key, renderBlock.value);
          _this2.insertBefore(blockEmbed, refBlot || undefined);
          Object.keys(renderBlock.attributes).forEach(function (name) {
            blockEmbed.format(name, renderBlock.attributes[name]);
          });
        }
      });
    }
    if (last.type === 'block' && last.delta.length()) {
      var offset = refBlot ? refBlot.offset(refBlot.scroll) + refBlotOffset : this.length();
      insertInlineContents(this, offset, last.delta);
    }
    this.batchEnd();
    this.optimize();
  };
  _proto.isEnabled = function isEnabled() {
    return this.domNode.getAttribute('contenteditable') === 'true';
  };
  _proto.leaf = function leaf(index) {
    var last = this.path(index).pop();
    if (!last) {
      return [null, -1];
    }
    var blot = last[0],
      offset = last[1];
    return blot instanceof parchment__WEBPACK_IMPORTED_MODULE_6__.LeafBlot ? [blot, offset] : [null, -1];
  };
  _proto.line = function line(index) {
    if (index === this.length()) {
      return this.line(index - 1);
    }
    // @ts-expect-error TODO: make descendant() generic
    return this.descendant(isLine, index);
  };
  _proto.lines = function lines() {
    var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Number.MAX_VALUE;
    var _getLines = function getLines(blot, blotIndex, blotLength) {
      var lines = [];
      var lengthLeft = blotLength;
      blot.children.forEachAt(blotIndex, blotLength, function (child, childIndex, childLength) {
        if (isLine(child)) {
          lines.push(child);
        } else if (child instanceof parchment__WEBPACK_IMPORTED_MODULE_6__.ContainerBlot) {
          lines = lines.concat(_getLines(child, childIndex, lengthLeft));
        }
        lengthLeft -= childLength;
      });
      return lines;
    };
    return _getLines(this, index, length);
  };
  _proto.optimize = function optimize() {
    var mutations = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (this.batch) return;
    _ScrollBlot.prototype.optimize.call(this, mutations, context);
    if (mutations.length > 0) {
      this.emitter.emit(_core_emitter_js__WEBPACK_IMPORTED_MODULE_2__["default"].events.SCROLL_OPTIMIZE, mutations, context);
    }
  };
  _proto.path = function path(index) {
    return _ScrollBlot.prototype.path.call(this, index).slice(1); // Exclude self
  };
  _proto.remove = function remove() {
    // Never remove self
  };
  _proto.update = function update(mutations) {
    var _this3 = this;
    if (this.batch) {
      if (Array.isArray(mutations)) {
        this.batch = this.batch.concat(mutations);
      }
      return;
    }
    var source = _core_emitter_js__WEBPACK_IMPORTED_MODULE_2__["default"].sources.USER;
    if (typeof mutations === 'string') {
      source = mutations;
    }
    if (!Array.isArray(mutations)) {
      mutations = this.observer.takeRecords();
    }
    mutations = mutations.filter(function (_ref2) {
      var target = _ref2.target;
      var blot = _this3.find(target, true);
      return blot && !isUpdatable(blot);
    });
    if (mutations.length > 0) {
      this.emitter.emit(_core_emitter_js__WEBPACK_IMPORTED_MODULE_2__["default"].events.SCROLL_BEFORE_UPDATE, source, mutations);
    }
    _ScrollBlot.prototype.update.call(this, mutations.concat([])); // pass copy
    if (mutations.length > 0) {
      this.emitter.emit(_core_emitter_js__WEBPACK_IMPORTED_MODULE_2__["default"].events.SCROLL_UPDATE, source, mutations);
    }
  };
  _proto.updateEmbedAt = function updateEmbedAt(index, key, change) {
    // Currently it only supports top-level embeds (BlockEmbed).
    // We can update `ParentBlot` in parchment to support inline embeds.
    var _this$descendant = this.descendant(function (b) {
        return b instanceof _block_js__WEBPACK_IMPORTED_MODULE_3__.BlockEmbed;
      }, index),
      blot = _this$descendant[0];
    if (blot && blot.statics.blotName === key && isUpdatable(blot)) {
      blot.updateContent(change);
    }
  };
  _proto.handleDragStart = function handleDragStart(event) {
    event.preventDefault();
  };
  _proto.deltaToRenderBlocks = function deltaToRenderBlocks(delta) {
    var _this4 = this;
    var renderBlocks = [];
    var currentBlockDelta = new quill_delta__WEBPACK_IMPORTED_MODULE_1__();
    delta.forEach(function (op) {
      var insert = op == null ? void 0 : op.insert;
      if (!insert) return;
      if (typeof insert === 'string') {
        var splitted = insert.split('\n');
        splitted.slice(0, -1).forEach(function (text) {
          var _op$attributes;
          currentBlockDelta.insert(text, op.attributes);
          renderBlocks.push({
            type: 'block',
            delta: currentBlockDelta,
            attributes: (_op$attributes = op.attributes) != null ? _op$attributes : {}
          });
          currentBlockDelta = new quill_delta__WEBPACK_IMPORTED_MODULE_1__();
        });
        var last = splitted[splitted.length - 1];
        if (last) {
          currentBlockDelta.insert(last, op.attributes);
        }
      } else {
        var key = Object.keys(insert)[0];
        if (!key) return;
        if (_this4.query(key, parchment__WEBPACK_IMPORTED_MODULE_6__.Scope.INLINE)) {
          currentBlockDelta.push(op);
        } else {
          var _op$attributes2;
          if (currentBlockDelta.length()) {
            renderBlocks.push({
              type: 'block',
              delta: currentBlockDelta,
              attributes: {}
            });
          }
          currentBlockDelta = new quill_delta__WEBPACK_IMPORTED_MODULE_1__();
          renderBlocks.push({
            type: 'blockEmbed',
            key: key,
            value: insert[key],
            attributes: (_op$attributes2 = op.attributes) != null ? _op$attributes2 : {}
          });
        }
      }
    });
    if (currentBlockDelta.length()) {
      renderBlocks.push({
        type: 'block',
        delta: currentBlockDelta,
        attributes: {}
      });
    }
    return renderBlocks;
  };
  _proto.createBlock = function createBlock(attributes, refBlot) {
    var _this5 = this;
    var blotName;
    var formats = {};
    Object.entries(attributes).forEach(function (_ref3) {
      var key = _ref3[0],
        value = _ref3[1];
      var isBlockBlot = _this5.query(key, parchment__WEBPACK_IMPORTED_MODULE_6__.Scope.BLOCK & parchment__WEBPACK_IMPORTED_MODULE_6__.Scope.BLOT) != null;
      if (isBlockBlot) {
        blotName = key;
      } else {
        formats[key] = value;
      }
    });
    var block = this.create(blotName || this.statics.defaultChild.blotName, blotName ? attributes[blotName] : undefined);
    this.insertBefore(block, refBlot || undefined);
    var length = block.length();
    Object.entries(formats).forEach(function (_ref4) {
      var key = _ref4[0],
        value = _ref4[1];
      block.formatAt(0, length, key, value);
    });
    return block;
  };
  return Scroll;
}(parchment__WEBPACK_IMPORTED_MODULE_6__.ScrollBlot);
Scroll.blotName = 'scroll';
Scroll.className = 'ql-editor';
Scroll.tagName = 'DIV';
Scroll.defaultChild = _block_js__WEBPACK_IMPORTED_MODULE_3__["default"];
Scroll.allowedChildren = [_block_js__WEBPACK_IMPORTED_MODULE_3__["default"], _block_js__WEBPACK_IMPORTED_MODULE_3__.BlockEmbed, _container_js__WEBPACK_IMPORTED_MODULE_5__["default"]];
function insertInlineContents(parent, index, inlineContents) {
  inlineContents.reduce(function (index, op) {
    var length = quill_delta__WEBPACK_IMPORTED_MODULE_1__.Op.length(op);
    var attributes = op.attributes || {};
    if (op.insert != null) {
      if (typeof op.insert === 'string') {
        var text = op.insert;
        parent.insertAt(index, text);
        var _parent$descendant = parent.descendant(parchment__WEBPACK_IMPORTED_MODULE_6__.LeafBlot, index),
          leaf = _parent$descendant[0];
        var formats = (0,_block_js__WEBPACK_IMPORTED_MODULE_3__.bubbleFormats)(leaf);
        attributes = quill_delta__WEBPACK_IMPORTED_MODULE_1__.AttributeMap.diff(formats, attributes) || {};
      } else if (typeof op.insert === 'object') {
        var key = Object.keys(op.insert)[0]; // There should only be one key
        if (key == null) return index;
        parent.insertAt(index, key, op.insert[key]);
        var isInlineEmbed = parent.scroll.query(key, parchment__WEBPACK_IMPORTED_MODULE_6__.Scope.INLINE) != null;
        if (isInlineEmbed) {
          var _parent$descendant2 = parent.descendant(parchment__WEBPACK_IMPORTED_MODULE_6__.LeafBlot, index),
            _leaf = _parent$descendant2[0];
          var _formats = (0,_block_js__WEBPACK_IMPORTED_MODULE_3__.bubbleFormats)(_leaf);
          attributes = quill_delta__WEBPACK_IMPORTED_MODULE_1__.AttributeMap.diff(_formats, attributes) || {};
        }
      }
    }
    Object.keys(attributes).forEach(function (key) {
      parent.formatAt(index, length, key, attributes[key]);
    });
    return index + length;
  }, index);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Scroll);

/***/ }),

/***/ "./node_modules/quill/blots/text.js":
/*!******************************************!*\
  !*** ./node_modules/quill/blots/text.js ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Text),
/* harmony export */   escapeText: () => (/* binding */ escapeText)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var parchment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! parchment */ "./node_modules/parchment/dist/parchment.js");


var Text = /*#__PURE__*/function (_TextBlot) {
  function Text() {
    return _TextBlot.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(Text, _TextBlot);
  return Text;
}(parchment__WEBPACK_IMPORTED_MODULE_1__.TextBlot); // https://lodash.com/docs#escape
var entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};
function escapeText(text) {
  return text.replace(/[&<>"']/g, function (s) {
    return entityMap[s];
  });
}


/***/ }),

/***/ "./node_modules/quill/core.js":
/*!************************************!*\
  !*** ./node_modules/quill/core.js ***!
  \************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AttributeMap: () => (/* reexport safe */ quill_delta__WEBPACK_IMPORTED_MODULE_13__.AttributeMap),
/* harmony export */   Delta: () => (/* reexport default export from named module */ quill_delta__WEBPACK_IMPORTED_MODULE_13__),
/* harmony export */   Module: () => (/* reexport safe */ _core_module_js__WEBPACK_IMPORTED_MODULE_16__["default"]),
/* harmony export */   Op: () => (/* reexport safe */ quill_delta__WEBPACK_IMPORTED_MODULE_13__.Op),
/* harmony export */   OpIterator: () => (/* reexport safe */ quill_delta__WEBPACK_IMPORTED_MODULE_13__.OpIterator),
/* harmony export */   Parchment: () => (/* reexport safe */ _core_quill_js__WEBPACK_IMPORTED_MODULE_0__.Parchment),
/* harmony export */   Range: () => (/* reexport safe */ _core_quill_js__WEBPACK_IMPORTED_MODULE_0__.Range),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_quill_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core/quill.js */ "./node_modules/quill/core/quill.js");
/* harmony import */ var _blots_block_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./blots/block.js */ "./node_modules/quill/blots/block.js");
/* harmony import */ var _blots_break_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./blots/break.js */ "./node_modules/quill/blots/break.js");
/* harmony import */ var _blots_container_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./blots/container.js */ "./node_modules/quill/blots/container.js");
/* harmony import */ var _blots_cursor_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./blots/cursor.js */ "./node_modules/quill/blots/cursor.js");
/* harmony import */ var _blots_embed_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./blots/embed.js */ "./node_modules/quill/blots/embed.js");
/* harmony import */ var _blots_inline_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./blots/inline.js */ "./node_modules/quill/blots/inline.js");
/* harmony import */ var _blots_scroll_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./blots/scroll.js */ "./node_modules/quill/blots/scroll.js");
/* harmony import */ var _blots_text_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./blots/text.js */ "./node_modules/quill/blots/text.js");
/* harmony import */ var _modules_clipboard_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./modules/clipboard.js */ "./node_modules/quill/modules/clipboard.js");
/* harmony import */ var _modules_history_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./modules/history.js */ "./node_modules/quill/modules/history.js");
/* harmony import */ var _modules_keyboard_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./modules/keyboard.js */ "./node_modules/quill/modules/keyboard.js");
/* harmony import */ var _modules_uploader_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./modules/uploader.js */ "./node_modules/quill/modules/uploader.js");
/* harmony import */ var quill_delta__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! quill-delta */ "./node_modules/quill-delta/dist/Delta.js");
/* harmony import */ var _modules_input_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./modules/input.js */ "./node_modules/quill/modules/input.js");
/* harmony import */ var _modules_uiNode_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./modules/uiNode.js */ "./node_modules/quill/modules/uiNode.js");
/* harmony import */ var _core_module_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./core/module.js */ "./node_modules/quill/core/module.js");


















_core_quill_js__WEBPACK_IMPORTED_MODULE_0__["default"].register({
  'blots/block': _blots_block_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  'blots/block/embed': _blots_block_js__WEBPACK_IMPORTED_MODULE_1__.BlockEmbed,
  'blots/break': _blots_break_js__WEBPACK_IMPORTED_MODULE_2__["default"],
  'blots/container': _blots_container_js__WEBPACK_IMPORTED_MODULE_3__["default"],
  'blots/cursor': _blots_cursor_js__WEBPACK_IMPORTED_MODULE_4__["default"],
  'blots/embed': _blots_embed_js__WEBPACK_IMPORTED_MODULE_5__["default"],
  'blots/inline': _blots_inline_js__WEBPACK_IMPORTED_MODULE_6__["default"],
  'blots/scroll': _blots_scroll_js__WEBPACK_IMPORTED_MODULE_7__["default"],
  'blots/text': _blots_text_js__WEBPACK_IMPORTED_MODULE_8__["default"],
  'modules/clipboard': _modules_clipboard_js__WEBPACK_IMPORTED_MODULE_9__["default"],
  'modules/history': _modules_history_js__WEBPACK_IMPORTED_MODULE_10__["default"],
  'modules/keyboard': _modules_keyboard_js__WEBPACK_IMPORTED_MODULE_11__["default"],
  'modules/uploader': _modules_uploader_js__WEBPACK_IMPORTED_MODULE_12__["default"],
  'modules/input': _modules_input_js__WEBPACK_IMPORTED_MODULE_14__["default"],
  'modules/uiNode': _modules_uiNode_js__WEBPACK_IMPORTED_MODULE_15__["default"]
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_core_quill_js__WEBPACK_IMPORTED_MODULE_0__["default"]);

/***/ }),

/***/ "./node_modules/quill/core/composition.js":
/*!************************************************!*\
  !*** ./node_modules/quill/core/composition.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _blots_embed_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../blots/embed.js */ "./node_modules/quill/blots/embed.js");
/* harmony import */ var _emitter_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./emitter.js */ "./node_modules/quill/core/emitter.js");


var Composition = /*#__PURE__*/function () {
  function Composition(scroll, emitter) {
    this.isComposing = false;
    this.scroll = scroll;
    this.emitter = emitter;
    this.setupListeners();
  }
  var _proto = Composition.prototype;
  _proto.setupListeners = function setupListeners() {
    var _this = this;
    this.scroll.domNode.addEventListener('compositionstart', function (event) {
      if (!_this.isComposing) {
        _this.handleCompositionStart(event);
      }
    });
    this.scroll.domNode.addEventListener('compositionend', function (event) {
      if (_this.isComposing) {
        // Webkit makes DOM changes after compositionend, so we use microtask to
        // ensure the order.
        // https://bugs.webkit.org/show_bug.cgi?id=31902
        queueMicrotask(function () {
          _this.handleCompositionEnd(event);
        });
      }
    });
  };
  _proto.handleCompositionStart = function handleCompositionStart(event) {
    var blot = event.target instanceof Node ? this.scroll.find(event.target, true) : null;
    if (blot && !(blot instanceof _blots_embed_js__WEBPACK_IMPORTED_MODULE_0__["default"])) {
      this.emitter.emit(_emitter_js__WEBPACK_IMPORTED_MODULE_1__["default"].events.COMPOSITION_BEFORE_START, event);
      this.scroll.batchStart();
      this.emitter.emit(_emitter_js__WEBPACK_IMPORTED_MODULE_1__["default"].events.COMPOSITION_START, event);
      this.isComposing = true;
    }
  };
  _proto.handleCompositionEnd = function handleCompositionEnd(event) {
    this.emitter.emit(_emitter_js__WEBPACK_IMPORTED_MODULE_1__["default"].events.COMPOSITION_BEFORE_END, event);
    this.scroll.batchEnd();
    this.emitter.emit(_emitter_js__WEBPACK_IMPORTED_MODULE_1__["default"].events.COMPOSITION_END, event);
    this.isComposing = false;
  };
  return Composition;
}();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Composition);

/***/ }),

/***/ "./node_modules/quill/core/editor.js":
/*!*******************************************!*\
  !*** ./node_modules/quill/core/editor.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/merge.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/cloneDeep.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/isEqual.js");
/* harmony import */ var parchment__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! parchment */ "./node_modules/parchment/dist/parchment.js");
/* harmony import */ var quill_delta__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! quill-delta */ "./node_modules/quill-delta/dist/Delta.js");
/* harmony import */ var _blots_block_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../blots/block.js */ "./node_modules/quill/blots/block.js");
/* harmony import */ var _blots_break_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../blots/break.js */ "./node_modules/quill/blots/break.js");
/* harmony import */ var _blots_cursor_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../blots/cursor.js */ "./node_modules/quill/blots/cursor.js");
/* harmony import */ var _blots_text_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../blots/text.js */ "./node_modules/quill/blots/text.js");
/* harmony import */ var _selection_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./selection.js */ "./node_modules/quill/core/selection.js");









var ASCII = /^[ -~]*$/;
var Editor = /*#__PURE__*/function () {
  function Editor(scroll) {
    this.scroll = scroll;
    this.delta = this.getDelta();
  }
  var _proto = Editor.prototype;
  _proto.applyDelta = function applyDelta(delta) {
    var _this = this;
    this.scroll.update();
    var scrollLength = this.scroll.length();
    this.scroll.batchStart();
    var normalizedDelta = normalizeDelta(delta);
    var deleteDelta = new quill_delta__WEBPACK_IMPORTED_MODULE_1__();
    var normalizedOps = splitOpLines(normalizedDelta.ops.slice());
    normalizedOps.reduce(function (index, op) {
      var length = quill_delta__WEBPACK_IMPORTED_MODULE_1__.Op.length(op);
      var attributes = op.attributes || {};
      var isImplicitNewlinePrepended = false;
      var isImplicitNewlineAppended = false;
      if (op.insert != null) {
        deleteDelta.retain(length);
        if (typeof op.insert === 'string') {
          var text = op.insert;
          isImplicitNewlineAppended = !text.endsWith('\n') && (scrollLength <= index || !!_this.scroll.descendant(_blots_block_js__WEBPACK_IMPORTED_MODULE_2__.BlockEmbed, index)[0]);
          _this.scroll.insertAt(index, text);
          var _this$scroll$line = _this.scroll.line(index),
            line = _this$scroll$line[0],
            offset = _this$scroll$line[1];
          var formats = (0,lodash_es__WEBPACK_IMPORTED_MODULE_7__["default"])({}, (0,_blots_block_js__WEBPACK_IMPORTED_MODULE_2__.bubbleFormats)(line));
          if (line instanceof _blots_block_js__WEBPACK_IMPORTED_MODULE_2__["default"]) {
            var _line$descendant = line.descendant(parchment__WEBPACK_IMPORTED_MODULE_8__.LeafBlot, offset),
              leaf = _line$descendant[0];
            if (leaf) {
              formats = (0,lodash_es__WEBPACK_IMPORTED_MODULE_7__["default"])(formats, (0,_blots_block_js__WEBPACK_IMPORTED_MODULE_2__.bubbleFormats)(leaf));
            }
          }
          attributes = quill_delta__WEBPACK_IMPORTED_MODULE_1__.AttributeMap.diff(formats, attributes) || {};
        } else if (typeof op.insert === 'object') {
          var key = Object.keys(op.insert)[0]; // There should only be one key
          if (key == null) return index;
          var isInlineEmbed = _this.scroll.query(key, parchment__WEBPACK_IMPORTED_MODULE_8__.Scope.INLINE) != null;
          if (isInlineEmbed) {
            if (scrollLength <= index || !!_this.scroll.descendant(_blots_block_js__WEBPACK_IMPORTED_MODULE_2__.BlockEmbed, index)[0]) {
              isImplicitNewlineAppended = true;
            }
          } else if (index > 0) {
            var _this$scroll$descenda = _this.scroll.descendant(parchment__WEBPACK_IMPORTED_MODULE_8__.LeafBlot, index - 1),
              _leaf = _this$scroll$descenda[0],
              _offset = _this$scroll$descenda[1];
            if (_leaf instanceof _blots_text_js__WEBPACK_IMPORTED_MODULE_5__["default"]) {
              var _text = _leaf.value();
              if (_text[_offset] !== '\n') {
                isImplicitNewlinePrepended = true;
              }
            } else if (_leaf instanceof parchment__WEBPACK_IMPORTED_MODULE_8__.EmbedBlot && _leaf.statics.scope === parchment__WEBPACK_IMPORTED_MODULE_8__.Scope.INLINE_BLOT) {
              isImplicitNewlinePrepended = true;
            }
          }
          _this.scroll.insertAt(index, key, op.insert[key]);
          if (isInlineEmbed) {
            var _this$scroll$descenda2 = _this.scroll.descendant(parchment__WEBPACK_IMPORTED_MODULE_8__.LeafBlot, index),
              _leaf2 = _this$scroll$descenda2[0];
            if (_leaf2) {
              var _formats = (0,lodash_es__WEBPACK_IMPORTED_MODULE_7__["default"])({}, (0,_blots_block_js__WEBPACK_IMPORTED_MODULE_2__.bubbleFormats)(_leaf2));
              attributes = quill_delta__WEBPACK_IMPORTED_MODULE_1__.AttributeMap.diff(_formats, attributes) || {};
            }
          }
        }
        scrollLength += length;
      } else {
        deleteDelta.push(op);
        if (op.retain !== null && typeof op.retain === 'object') {
          var _key = Object.keys(op.retain)[0];
          if (_key == null) return index;
          _this.scroll.updateEmbedAt(index, _key, op.retain[_key]);
        }
      }
      Object.keys(attributes).forEach(function (name) {
        _this.scroll.formatAt(index, length, name, attributes[name]);
      });
      var prependedLength = isImplicitNewlinePrepended ? 1 : 0;
      var addedLength = isImplicitNewlineAppended ? 1 : 0;
      scrollLength += prependedLength + addedLength;
      deleteDelta.retain(prependedLength);
      deleteDelta["delete"](addedLength);
      return index + length + prependedLength + addedLength;
    }, 0);
    deleteDelta.reduce(function (index, op) {
      if (typeof op["delete"] === 'number') {
        _this.scroll.deleteAt(index, op["delete"]);
        return index;
      }
      return index + quill_delta__WEBPACK_IMPORTED_MODULE_1__.Op.length(op);
    }, 0);
    this.scroll.batchEnd();
    this.scroll.optimize();
    return this.update(normalizedDelta);
  };
  _proto.deleteText = function deleteText(index, length) {
    this.scroll.deleteAt(index, length);
    return this.update(new quill_delta__WEBPACK_IMPORTED_MODULE_1__().retain(index)["delete"](length));
  };
  _proto.formatLine = function formatLine(index, length) {
    var _this2 = this;
    var formats = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    this.scroll.update();
    Object.keys(formats).forEach(function (format) {
      _this2.scroll.lines(index, Math.max(length, 1)).forEach(function (line) {
        line.format(format, formats[format]);
      });
    });
    this.scroll.optimize();
    var delta = new quill_delta__WEBPACK_IMPORTED_MODULE_1__().retain(index).retain(length, (0,lodash_es__WEBPACK_IMPORTED_MODULE_9__["default"])(formats));
    return this.update(delta);
  };
  _proto.formatText = function formatText(index, length) {
    var _this3 = this;
    var formats = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    Object.keys(formats).forEach(function (format) {
      _this3.scroll.formatAt(index, length, format, formats[format]);
    });
    var delta = new quill_delta__WEBPACK_IMPORTED_MODULE_1__().retain(index).retain(length, (0,lodash_es__WEBPACK_IMPORTED_MODULE_9__["default"])(formats));
    return this.update(delta);
  };
  _proto.getContents = function getContents(index, length) {
    return this.delta.slice(index, index + length);
  };
  _proto.getDelta = function getDelta() {
    return this.scroll.lines().reduce(function (delta, line) {
      return delta.concat(line.delta());
    }, new quill_delta__WEBPACK_IMPORTED_MODULE_1__());
  };
  _proto.getFormat = function getFormat(index) {
    var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var lines = [];
    var leaves = [];
    if (length === 0) {
      this.scroll.path(index).forEach(function (path) {
        var blot = path[0];
        if (blot instanceof _blots_block_js__WEBPACK_IMPORTED_MODULE_2__["default"]) {
          lines.push(blot);
        } else if (blot instanceof parchment__WEBPACK_IMPORTED_MODULE_8__.LeafBlot) {
          leaves.push(blot);
        }
      });
    } else {
      lines = this.scroll.lines(index, length);
      leaves = this.scroll.descendants(parchment__WEBPACK_IMPORTED_MODULE_8__.LeafBlot, index, length);
    }
    var _map = [lines, leaves].map(function (blots) {
        var blot = blots.shift();
        if (blot == null) return {};
        var formats = (0,_blots_block_js__WEBPACK_IMPORTED_MODULE_2__.bubbleFormats)(blot);
        while (Object.keys(formats).length > 0) {
          var _blot = blots.shift();
          if (_blot == null) return formats;
          formats = combineFormats((0,_blots_block_js__WEBPACK_IMPORTED_MODULE_2__.bubbleFormats)(_blot), formats);
        }
        return formats;
      }),
      lineFormats = _map[0],
      leafFormats = _map[1];
    return (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, lineFormats, leafFormats);
  };
  _proto.getHTML = function getHTML(index, length) {
    var _this$scroll$line2 = this.scroll.line(index),
      line = _this$scroll$line2[0],
      lineOffset = _this$scroll$line2[1];
    if (line) {
      var lineLength = line.length();
      var isWithinLine = line.length() >= lineOffset + length;
      if (isWithinLine && !(lineOffset === 0 && length === lineLength)) {
        return convertHTML(line, lineOffset, length, true);
      }
      return convertHTML(this.scroll, index, length, true);
    }
    return '';
  };
  _proto.getText = function getText(index, length) {
    return this.getContents(index, length).filter(function (op) {
      return typeof op.insert === 'string';
    }).map(function (op) {
      return op.insert;
    }).join('');
  };
  _proto.insertContents = function insertContents(index, contents) {
    var normalizedDelta = normalizeDelta(contents);
    var change = new quill_delta__WEBPACK_IMPORTED_MODULE_1__().retain(index).concat(normalizedDelta);
    this.scroll.insertContents(index, normalizedDelta);
    return this.update(change);
  };
  _proto.insertEmbed = function insertEmbed(index, embed, value) {
    var _Delta$retain$insert;
    this.scroll.insertAt(index, embed, value);
    return this.update(new quill_delta__WEBPACK_IMPORTED_MODULE_1__().retain(index).insert((_Delta$retain$insert = {}, _Delta$retain$insert[embed] = value, _Delta$retain$insert)));
  };
  _proto.insertText = function insertText(index, text) {
    var _this4 = this;
    var formats = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    this.scroll.insertAt(index, text);
    Object.keys(formats).forEach(function (format) {
      _this4.scroll.formatAt(index, text.length, format, formats[format]);
    });
    return this.update(new quill_delta__WEBPACK_IMPORTED_MODULE_1__().retain(index).insert(text, (0,lodash_es__WEBPACK_IMPORTED_MODULE_9__["default"])(formats)));
  };
  _proto.isBlank = function isBlank() {
    if (this.scroll.children.length === 0) return true;
    if (this.scroll.children.length > 1) return false;
    var blot = this.scroll.children.head;
    if ((blot == null ? void 0 : blot.statics.blotName) !== _blots_block_js__WEBPACK_IMPORTED_MODULE_2__["default"].blotName) return false;
    var block = blot;
    if (block.children.length > 1) return false;
    return block.children.head instanceof _blots_break_js__WEBPACK_IMPORTED_MODULE_3__["default"];
  };
  _proto.removeFormat = function removeFormat(index, length) {
    var text = this.getText(index, length);
    var _this$scroll$line3 = this.scroll.line(index + length),
      line = _this$scroll$line3[0],
      offset = _this$scroll$line3[1];
    var suffixLength = 0;
    var suffix = new quill_delta__WEBPACK_IMPORTED_MODULE_1__();
    if (line != null) {
      suffixLength = line.length() - offset;
      suffix = line.delta().slice(offset, offset + suffixLength - 1).insert('\n');
    }
    var contents = this.getContents(index, length + suffixLength);
    var diff = contents.diff(new quill_delta__WEBPACK_IMPORTED_MODULE_1__().insert(text).concat(suffix));
    var delta = new quill_delta__WEBPACK_IMPORTED_MODULE_1__().retain(index).concat(diff);
    return this.applyDelta(delta);
  };
  _proto.update = function update(change) {
    var mutations = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var selectionInfo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
    var oldDelta = this.delta;
    if (mutations.length === 1 && mutations[0].type === 'characterData' &&
    // @ts-expect-error Fix me later
    mutations[0].target.data.match(ASCII) && this.scroll.find(mutations[0].target)) {
      // Optimization for character changes
      var textBlot = this.scroll.find(mutations[0].target);
      var formats = (0,_blots_block_js__WEBPACK_IMPORTED_MODULE_2__.bubbleFormats)(textBlot);
      var index = textBlot.offset(this.scroll);
      // @ts-expect-error Fix me later
      var oldValue = mutations[0].oldValue.replace(_blots_cursor_js__WEBPACK_IMPORTED_MODULE_4__["default"].CONTENTS, '');
      var oldText = new quill_delta__WEBPACK_IMPORTED_MODULE_1__().insert(oldValue);
      // @ts-expect-error
      var newText = new quill_delta__WEBPACK_IMPORTED_MODULE_1__().insert(textBlot.value());
      var relativeSelectionInfo = selectionInfo && {
        oldRange: shiftRange(selectionInfo.oldRange, -index),
        newRange: shiftRange(selectionInfo.newRange, -index)
      };
      var diffDelta = new quill_delta__WEBPACK_IMPORTED_MODULE_1__().retain(index).concat(oldText.diff(newText, relativeSelectionInfo));
      change = diffDelta.reduce(function (delta, op) {
        if (op.insert) {
          return delta.insert(op.insert, formats);
        }
        return delta.push(op);
      }, new quill_delta__WEBPACK_IMPORTED_MODULE_1__());
      this.delta = oldDelta.compose(change);
    } else {
      this.delta = this.getDelta();
      if (!change || !(0,lodash_es__WEBPACK_IMPORTED_MODULE_10__["default"])(oldDelta.compose(change), this.delta)) {
        change = oldDelta.diff(this.delta, selectionInfo);
      }
    }
    return change;
  };
  return Editor;
}();
function convertListHTML(items, lastIndent, types) {
  if (items.length === 0) {
    var _getListType = getListType(types.pop()),
      _endTag = _getListType[0];
    if (lastIndent <= 0) {
      return "</li></" + _endTag + ">";
    }
    return "</li></" + _endTag + ">" + convertListHTML([], lastIndent - 1, types);
  }
  var _items$ = items[0],
    child = _items$.child,
    offset = _items$.offset,
    length = _items$.length,
    indent = _items$.indent,
    type = _items$.type,
    rest = items.slice(1);
  var _getListType2 = getListType(type),
    tag = _getListType2[0],
    attribute = _getListType2[1];
  if (indent > lastIndent) {
    types.push(type);
    if (indent === lastIndent + 1) {
      return "<" + tag + "><li" + attribute + ">" + convertHTML(child, offset, length) + convertListHTML(rest, indent, types);
    }
    return "<" + tag + "><li>" + convertListHTML(items, lastIndent + 1, types);
  }
  var previousType = types[types.length - 1];
  if (indent === lastIndent && type === previousType) {
    return "</li><li" + attribute + ">" + convertHTML(child, offset, length) + convertListHTML(rest, indent, types);
  }
  var _getListType3 = getListType(types.pop()),
    endTag = _getListType3[0];
  return "</li></" + endTag + ">" + convertListHTML(items, lastIndent - 1, types);
}
function convertHTML(blot, index, length) {
  var isRoot = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if ('html' in blot && typeof blot.html === 'function') {
    return blot.html(index, length);
  }
  if (blot instanceof _blots_text_js__WEBPACK_IMPORTED_MODULE_5__["default"]) {
    var escapedText = (0,_blots_text_js__WEBPACK_IMPORTED_MODULE_5__.escapeText)(blot.value().slice(index, index + length));
    return escapedText.replaceAll(' ', '&nbsp;');
  }
  if (blot instanceof parchment__WEBPACK_IMPORTED_MODULE_8__.ParentBlot) {
    // TODO fix API
    if (blot.statics.blotName === 'list-container') {
      var items = [];
      blot.children.forEachAt(index, length, function (child, offset, childLength) {
        var formats = 'formats' in child && typeof child.formats === 'function' ? child.formats() : {};
        items.push({
          child: child,
          offset: offset,
          length: childLength,
          indent: formats.indent || 0,
          type: formats.list
        });
      });
      return convertListHTML(items, -1, []);
    }
    var parts = [];
    blot.children.forEachAt(index, length, function (child, offset, childLength) {
      parts.push(convertHTML(child, offset, childLength));
    });
    if (isRoot || blot.statics.blotName === 'list') {
      return parts.join('');
    }
    var _blot$domNode = blot.domNode,
      outerHTML = _blot$domNode.outerHTML,
      innerHTML = _blot$domNode.innerHTML;
    var _outerHTML$split = outerHTML.split(">" + innerHTML + "<"),
      start = _outerHTML$split[0],
      end = _outerHTML$split[1];
    // TODO cleanup
    if (start === '<table') {
      return "<table style=\"border: 1px solid #000;\">" + parts.join('') + "<" + end;
    }
    return start + ">" + parts.join('') + "<" + end;
  }
  return blot.domNode instanceof Element ? blot.domNode.outerHTML : '';
}
function combineFormats(formats, combined) {
  return Object.keys(combined).reduce(function (merged, name) {
    if (formats[name] == null) return merged;
    var combinedValue = combined[name];
    if (combinedValue === formats[name]) {
      merged[name] = combinedValue;
    } else if (Array.isArray(combinedValue)) {
      if (combinedValue.indexOf(formats[name]) < 0) {
        merged[name] = combinedValue.concat([formats[name]]);
      } else {
        // If style already exists, don't add to an array, but don't lose other styles
        merged[name] = combinedValue;
      }
    } else {
      merged[name] = [combinedValue, formats[name]];
    }
    return merged;
  }, {});
}
function getListType(type) {
  var tag = type === 'ordered' ? 'ol' : 'ul';
  switch (type) {
    case 'checked':
      return [tag, ' data-list="checked"'];
    case 'unchecked':
      return [tag, ' data-list="unchecked"'];
    default:
      return [tag, ''];
  }
}
function normalizeDelta(delta) {
  return delta.reduce(function (normalizedDelta, op) {
    if (typeof op.insert === 'string') {
      var text = op.insert.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
      return normalizedDelta.insert(text, op.attributes);
    }
    return normalizedDelta.push(op);
  }, new quill_delta__WEBPACK_IMPORTED_MODULE_1__());
}
function shiftRange(_ref, amount) {
  var index = _ref.index,
    length = _ref.length;
  return new _selection_js__WEBPACK_IMPORTED_MODULE_6__.Range(index + amount, length);
}
function splitOpLines(ops) {
  var split = [];
  ops.forEach(function (op) {
    if (typeof op.insert === 'string') {
      var lines = op.insert.split('\n');
      lines.forEach(function (line, index) {
        if (index) split.push({
          insert: '\n',
          attributes: op.attributes
        });
        if (line) split.push({
          insert: line,
          attributes: op.attributes
        });
      });
    } else {
      split.push(op);
    }
  });
  return split;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Editor);

/***/ }),

/***/ "./node_modules/quill/core/emitter.js":
/*!********************************************!*\
  !*** ./node_modules/quill/core/emitter.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var eventemitter3__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! eventemitter3 */ "./node_modules/eventemitter3/index.mjs");
/* harmony import */ var _instances_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./instances.js */ "./node_modules/quill/core/instances.js");
/* harmony import */ var _logger_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./logger.js */ "./node_modules/quill/core/logger.js");




var debug = (0,_logger_js__WEBPACK_IMPORTED_MODULE_3__["default"])('quill:events');
var EVENTS = ['selectionchange', 'mousedown', 'mouseup', 'click'];
EVENTS.forEach(function (eventName) {
  document.addEventListener(eventName, function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    Array.from(document.querySelectorAll('.ql-container')).forEach(function (node) {
      var quill = _instances_js__WEBPACK_IMPORTED_MODULE_2__["default"].get(node);
      if (quill && quill.emitter) {
        var _quill$emitter;
        (_quill$emitter = quill.emitter).handleDOM.apply(_quill$emitter, args);
      }
    });
  });
});
var Emitter = /*#__PURE__*/function (_EventEmitter) {
  function Emitter() {
    var _this;
    _this = _EventEmitter.call(this) || this;
    _this.domListeners = {};
    _this.on('error', debug.error);
    return _this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(Emitter, _EventEmitter);
  var _proto = Emitter.prototype;
  _proto.emit = function emit() {
    var _debug$log, _EventEmitter$prototy;
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    (_debug$log = debug.log).call.apply(_debug$log, [debug].concat(args));
    // @ts-expect-error
    return (_EventEmitter$prototy = _EventEmitter.prototype.emit).call.apply(_EventEmitter$prototy, [this].concat(args));
  };
  _proto.handleDOM = function handleDOM(event) {
    for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }
    (this.domListeners[event.type] || []).forEach(function (_ref) {
      var node = _ref.node,
        handler = _ref.handler;
      if (event.target === node || node.contains(event.target)) {
        handler.apply(void 0, [event].concat(args));
      }
    });
  };
  _proto.listenDOM = function listenDOM(eventName, node, handler) {
    if (!this.domListeners[eventName]) {
      this.domListeners[eventName] = [];
    }
    this.domListeners[eventName].push({
      node: node,
      handler: handler
    });
  };
  return Emitter;
}(eventemitter3__WEBPACK_IMPORTED_MODULE_1__.EventEmitter);
Emitter.events = {
  EDITOR_CHANGE: 'editor-change',
  SCROLL_BEFORE_UPDATE: 'scroll-before-update',
  SCROLL_BLOT_MOUNT: 'scroll-blot-mount',
  SCROLL_BLOT_UNMOUNT: 'scroll-blot-unmount',
  SCROLL_OPTIMIZE: 'scroll-optimize',
  SCROLL_UPDATE: 'scroll-update',
  SCROLL_EMBED_UPDATE: 'scroll-embed-update',
  SELECTION_CHANGE: 'selection-change',
  TEXT_CHANGE: 'text-change',
  COMPOSITION_BEFORE_START: 'composition-before-start',
  COMPOSITION_START: 'composition-start',
  COMPOSITION_BEFORE_END: 'composition-before-end',
  COMPOSITION_END: 'composition-end'
};
Emitter.sources = {
  API: 'api',
  SILENT: 'silent',
  USER: 'user'
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Emitter);

/***/ }),

/***/ "./node_modules/quill/core/instances.js":
/*!**********************************************!*\
  !*** ./node_modules/quill/core/instances.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new WeakMap());

/***/ }),

/***/ "./node_modules/quill/core/logger.js":
/*!*******************************************!*\
  !*** ./node_modules/quill/core/logger.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var levels = ['error', 'warn', 'log', 'info'];
var level = 'warn';
function debug(method) {
  if (level) {
    if (levels.indexOf(method) <= levels.indexOf(level)) {
      var _console;
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }
      (_console = console)[method].apply(_console, args); // eslint-disable-line no-console
    }
  }
}
function namespace(ns) {
  return levels.reduce(function (logger, method) {
    logger[method] = debug.bind(console, method, ns);
    return logger;
  }, {});
}
namespace.level = function (newLevel) {
  level = newLevel;
};
debug.level = namespace.level;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (namespace);

/***/ }),

/***/ "./node_modules/quill/core/module.js":
/*!*******************************************!*\
  !*** ./node_modules/quill/core/module.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var Module = function Module(quill) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  this.quill = quill;
  this.options = options;
};
Module.DEFAULTS = {};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Module);

/***/ }),

/***/ "./node_modules/quill/core/quill.js":
/*!******************************************!*\
  !*** ./node_modules/quill/core/quill.js ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Parchment: () => (/* reexport module object */ parchment__WEBPACK_IMPORTED_MODULE_13__),
/* harmony export */   Range: () => (/* reexport safe */ _selection_js__WEBPACK_IMPORTED_MODULE_8__.Range),
/* harmony export */   "default": () => (/* binding */ Quill),
/* harmony export */   expandConfig: () => (/* binding */ expandConfig),
/* harmony export */   globalRegistry: () => (/* binding */ globalRegistry),
/* harmony export */   overload: () => (/* binding */ overload)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_objectWithoutPropertiesLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/objectWithoutPropertiesLoose */ "./node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js");
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/merge.js");
/* harmony import */ var parchment__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! parchment */ "./node_modules/parchment/dist/parchment.js");
/* harmony import */ var quill_delta__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! quill-delta */ "./node_modules/quill-delta/dist/Delta.js");
/* harmony import */ var _editor_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./editor.js */ "./node_modules/quill/core/editor.js");
/* harmony import */ var _emitter_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./emitter.js */ "./node_modules/quill/core/emitter.js");
/* harmony import */ var _instances_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./instances.js */ "./node_modules/quill/core/instances.js");
/* harmony import */ var _logger_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./logger.js */ "./node_modules/quill/core/logger.js");
/* harmony import */ var _module_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./module.js */ "./node_modules/quill/core/module.js");
/* harmony import */ var _selection_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./selection.js */ "./node_modules/quill/core/selection.js");
/* harmony import */ var _composition_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./composition.js */ "./node_modules/quill/core/composition.js");
/* harmony import */ var _theme_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./theme.js */ "./node_modules/quill/core/theme.js");
/* harmony import */ var _utils_scrollRectIntoView_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./utils/scrollRectIntoView.js */ "./node_modules/quill/core/utils/scrollRectIntoView.js");
/* harmony import */ var _utils_createRegistryWithFormats_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./utils/createRegistryWithFormats.js */ "./node_modules/quill/core/utils/createRegistryWithFormats.js");


var _excluded = ["modules"],
  _excluded2 = ["modules"];













var debug = (0,_logger_js__WEBPACK_IMPORTED_MODULE_6__["default"])('quill');
var globalRegistry = new parchment__WEBPACK_IMPORTED_MODULE_13__.Registry();
parchment__WEBPACK_IMPORTED_MODULE_13__.ParentBlot.uiClass = 'ql-ui';

/**
 * Options for initializing a Quill instance
 */

/**
 * Similar to QuillOptions, but with all properties expanded to their default values,
 * and all selectors resolved to HTMLElements.
 */
var Quill = /*#__PURE__*/function () {
  function Quill(container) {
    var _this = this;
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    this.options = expandConfig(container, options);
    this.container = this.options.container;
    if (this.container == null) {
      debug.error('Invalid Quill container', container);
      return;
    }
    if (this.options.debug) {
      Quill.debug(this.options.debug);
    }
    var html = this.container.innerHTML.trim();
    this.container.classList.add('ql-container');
    this.container.innerHTML = '';
    _instances_js__WEBPACK_IMPORTED_MODULE_5__["default"].set(this.container, this);
    this.root = this.addContainer('ql-editor');
    this.root.classList.add('ql-blank');
    this.emitter = new _emitter_js__WEBPACK_IMPORTED_MODULE_4__["default"]();
    var scrollBlotName = parchment__WEBPACK_IMPORTED_MODULE_13__.ScrollBlot.blotName;
    var ScrollBlot = this.options.registry.query(scrollBlotName);
    if (!ScrollBlot || !('blotName' in ScrollBlot)) {
      throw new Error("Cannot initialize Quill without \"" + scrollBlotName + "\" blot");
    }
    this.scroll = new ScrollBlot(this.options.registry, this.root, {
      emitter: this.emitter
    });
    this.editor = new _editor_js__WEBPACK_IMPORTED_MODULE_3__["default"](this.scroll);
    this.selection = new _selection_js__WEBPACK_IMPORTED_MODULE_8__["default"](this.scroll, this.emitter);
    this.composition = new _composition_js__WEBPACK_IMPORTED_MODULE_9__["default"](this.scroll, this.emitter);
    this.theme = new this.options.theme(this, this.options); // eslint-disable-line new-cap
    this.keyboard = this.theme.addModule('keyboard');
    this.clipboard = this.theme.addModule('clipboard');
    this.history = this.theme.addModule('history');
    this.uploader = this.theme.addModule('uploader');
    this.theme.addModule('input');
    this.theme.addModule('uiNode');
    this.theme.init();
    this.emitter.on(_emitter_js__WEBPACK_IMPORTED_MODULE_4__["default"].events.EDITOR_CHANGE, function (type) {
      if (type === _emitter_js__WEBPACK_IMPORTED_MODULE_4__["default"].events.TEXT_CHANGE) {
        _this.root.classList.toggle('ql-blank', _this.editor.isBlank());
      }
    });
    this.emitter.on(_emitter_js__WEBPACK_IMPORTED_MODULE_4__["default"].events.SCROLL_UPDATE, function (source, mutations) {
      var oldRange = _this.selection.lastRange;
      var _this$selection$getRa = _this.selection.getRange(),
        newRange = _this$selection$getRa[0];
      var selectionInfo = oldRange && newRange ? {
        oldRange: oldRange,
        newRange: newRange
      } : undefined;
      modify.call(_this, function () {
        return _this.editor.update(null, mutations, selectionInfo);
      }, source);
    });
    this.emitter.on(_emitter_js__WEBPACK_IMPORTED_MODULE_4__["default"].events.SCROLL_EMBED_UPDATE, function (blot, delta) {
      var oldRange = _this.selection.lastRange;
      var _this$selection$getRa2 = _this.selection.getRange(),
        newRange = _this$selection$getRa2[0];
      var selectionInfo = oldRange && newRange ? {
        oldRange: oldRange,
        newRange: newRange
      } : undefined;
      modify.call(_this, function () {
        var _Delta$retain$retain;
        var change = new quill_delta__WEBPACK_IMPORTED_MODULE_2__().retain(blot.offset(_this)).retain((_Delta$retain$retain = {}, _Delta$retain$retain[blot.statics.blotName] = delta, _Delta$retain$retain));
        return _this.editor.update(change, [], selectionInfo);
      }, Quill.sources.USER);
    });
    if (html) {
      var contents = this.clipboard.convert({
        html: html + "<p><br></p>",
        text: '\n'
      });
      this.setContents(contents);
    }
    this.history.clear();
    if (this.options.placeholder) {
      this.root.setAttribute('data-placeholder', this.options.placeholder);
    }
    if (this.options.readOnly) {
      this.disable();
    }
    this.allowReadOnlyEdits = false;
  }
  Quill.debug = function debug(limit) {
    if (limit === true) {
      limit = 'log';
    }
    _logger_js__WEBPACK_IMPORTED_MODULE_6__["default"].level(limit);
  };
  Quill.find = function find(node) {
    var bubble = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    return _instances_js__WEBPACK_IMPORTED_MODULE_5__["default"].get(node) || globalRegistry.find(node, bubble);
  };
  Quill["import"] = function _import(name) {
    if (this.imports[name] == null) {
      debug.error("Cannot import " + name + ". Are you sure it was registered?");
    }
    return this.imports[name];
  };
  Quill.register = function register() {
    var _this2 = this;
    if (typeof (arguments.length <= 0 ? undefined : arguments[0]) !== 'string') {
      var target = arguments.length <= 0 ? undefined : arguments[0];
      var overwrite = !!(arguments.length <= 1 ? undefined : arguments[1]);
      var name = 'attrName' in target ? target.attrName : target.blotName;
      if (typeof name === 'string') {
        // Shortcut for formats:
        // register(Blot | Attributor, overwrite)
        this.register("formats/" + name, target, overwrite);
      } else {
        Object.keys(target).forEach(function (key) {
          _this2.register(key, target[key], overwrite);
        });
      }
    } else {
      var path = arguments.length <= 0 ? undefined : arguments[0];
      var _target = arguments.length <= 1 ? undefined : arguments[1];
      var _overwrite = !!(arguments.length <= 2 ? undefined : arguments[2]);
      if (this.imports[path] != null && !_overwrite) {
        debug.warn("Overwriting " + path + " with", _target);
      }
      this.imports[path] = _target;
      if ((path.startsWith('blots/') || path.startsWith('formats/')) && _target && typeof _target !== 'boolean' && _target.blotName !== 'abstract') {
        globalRegistry.register(_target);
      }
      if (typeof _target.register === 'function') {
        _target.register(globalRegistry);
      }
    }
  };
  var _proto = Quill.prototype;
  _proto.addContainer = function addContainer(container) {
    var refNode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    if (typeof container === 'string') {
      var className = container;
      container = document.createElement('div');
      container.classList.add(className);
    }
    this.container.insertBefore(container, refNode);
    return container;
  };
  _proto.blur = function blur() {
    this.selection.setRange(null);
  };
  _proto.deleteText = function deleteText(index, length, source) {
    var _this3 = this;
    // @ts-expect-error
    var _overload = overload(index, length, source);
    index = _overload[0];
    length = _overload[1];
    source = _overload[3];
    return modify.call(this, function () {
      return _this3.editor.deleteText(index, length);
    }, source, index, -1 * length);
  };
  _proto.disable = function disable() {
    this.enable(false);
  };
  _proto.editReadOnly = function editReadOnly(modifier) {
    this.allowReadOnlyEdits = true;
    var value = modifier();
    this.allowReadOnlyEdits = false;
    return value;
  };
  _proto.enable = function enable() {
    var enabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    this.scroll.enable(enabled);
    this.container.classList.toggle('ql-disabled', !enabled);
  };
  _proto.focus = function focus() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    this.selection.focus();
    if (!options.preventScroll) {
      this.scrollSelectionIntoView();
    }
  };
  _proto.format = function format(name, value) {
    var _this4 = this;
    var source = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _emitter_js__WEBPACK_IMPORTED_MODULE_4__["default"].sources.API;
    return modify.call(this, function () {
      var range = _this4.getSelection(true);
      var change = new quill_delta__WEBPACK_IMPORTED_MODULE_2__();
      if (range == null) return change;
      if (_this4.scroll.query(name, parchment__WEBPACK_IMPORTED_MODULE_13__.Scope.BLOCK)) {
        var _this4$editor$formatL;
        change = _this4.editor.formatLine(range.index, range.length, (_this4$editor$formatL = {}, _this4$editor$formatL[name] = value, _this4$editor$formatL));
      } else if (range.length === 0) {
        _this4.selection.format(name, value);
        return change;
      } else {
        var _this4$editor$formatT;
        change = _this4.editor.formatText(range.index, range.length, (_this4$editor$formatT = {}, _this4$editor$formatT[name] = value, _this4$editor$formatT));
      }
      _this4.setSelection(range, _emitter_js__WEBPACK_IMPORTED_MODULE_4__["default"].sources.SILENT);
      return change;
    }, source);
  };
  _proto.formatLine = function formatLine(index, length, name, value, source) {
    var _this5 = this;
    var formats;
    // eslint-disable-next-line prefer-const
    var _overload2 = overload(index, length,
    // @ts-expect-error
    name, value, source);
    index = _overload2[0];
    length = _overload2[1];
    formats = _overload2[2];
    source = _overload2[3];
    return modify.call(this, function () {
      return _this5.editor.formatLine(index, length, formats);
    }, source, index, 0);
  };
  _proto.formatText = function formatText(index, length, name, value, source) {
    var _this6 = this;
    var formats;
    // eslint-disable-next-line prefer-const
    var _overload3 = overload(
    // @ts-expect-error
    index, length, name, value, source);
    index = _overload3[0];
    length = _overload3[1];
    formats = _overload3[2];
    source = _overload3[3];
    return modify.call(this, function () {
      return _this6.editor.formatText(index, length, formats);
    }, source, index, 0);
  };
  _proto.getBounds = function getBounds(index) {
    var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var bounds = null;
    if (typeof index === 'number') {
      bounds = this.selection.getBounds(index, length);
    } else {
      bounds = this.selection.getBounds(index.index, index.length);
    }
    if (!bounds) return null;
    var containerBounds = this.container.getBoundingClientRect();
    return {
      bottom: bounds.bottom - containerBounds.top,
      height: bounds.height,
      left: bounds.left - containerBounds.left,
      right: bounds.right - containerBounds.left,
      top: bounds.top - containerBounds.top,
      width: bounds.width
    };
  };
  _proto.getContents = function getContents() {
    var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.getLength() - index;
    var _overload4 = overload(index, length);
    index = _overload4[0];
    length = _overload4[1];
    return this.editor.getContents(index, length);
  };
  _proto.getFormat = function getFormat() {
    var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.getSelection(true);
    var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    if (typeof index === 'number') {
      return this.editor.getFormat(index, length);
    }
    return this.editor.getFormat(index.index, index.length);
  };
  _proto.getIndex = function getIndex(blot) {
    return blot.offset(this.scroll);
  };
  _proto.getLength = function getLength() {
    return this.scroll.length();
  };
  _proto.getLeaf = function getLeaf(index) {
    return this.scroll.leaf(index);
  };
  _proto.getLine = function getLine(index) {
    return this.scroll.line(index);
  };
  _proto.getLines = function getLines() {
    var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Number.MAX_VALUE;
    if (typeof index !== 'number') {
      return this.scroll.lines(index.index, index.length);
    }
    return this.scroll.lines(index, length);
  };
  _proto.getModule = function getModule(name) {
    return this.theme.modules[name];
  };
  _proto.getSelection = function getSelection() {
    var focus = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    if (focus) this.focus();
    this.update(); // Make sure we access getRange with editor in consistent state
    return this.selection.getRange()[0];
  };
  _proto.getSemanticHTML = function getSemanticHTML() {
    var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var length = arguments.length > 1 ? arguments[1] : undefined;
    if (typeof index === 'number') {
      var _length;
      length = (_length = length) != null ? _length : this.getLength() - index;
    }
    // @ts-expect-error
    var _overload5 = overload(index, length);
    index = _overload5[0];
    length = _overload5[1];
    return this.editor.getHTML(index, length);
  };
  _proto.getText = function getText() {
    var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var length = arguments.length > 1 ? arguments[1] : undefined;
    if (typeof index === 'number') {
      var _length2;
      length = (_length2 = length) != null ? _length2 : this.getLength() - index;
    }
    // @ts-expect-error
    var _overload6 = overload(index, length);
    index = _overload6[0];
    length = _overload6[1];
    return this.editor.getText(index, length);
  };
  _proto.hasFocus = function hasFocus() {
    return this.selection.hasFocus();
  };
  _proto.insertEmbed = function insertEmbed(index, embed, value) {
    var _this7 = this;
    var source = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : Quill.sources.API;
    return modify.call(this, function () {
      return _this7.editor.insertEmbed(index, embed, value);
    }, source, index);
  };
  _proto.insertText = function insertText(index, text, name, value, source) {
    var _this8 = this;
    var formats;
    // eslint-disable-next-line prefer-const
    // @ts-expect-error
    var _overload7 = overload(index, 0, name, value, source);
    index = _overload7[0];
    formats = _overload7[2];
    source = _overload7[3];
    return modify.call(this, function () {
      return _this8.editor.insertText(index, text, formats);
    }, source, index, text.length);
  };
  _proto.isEnabled = function isEnabled() {
    return this.scroll.isEnabled();
  };
  _proto.off = function off() {
    var _this$emitter;
    return (_this$emitter = this.emitter).off.apply(_this$emitter, arguments);
  };
  _proto.on = function on() {
    var _this$emitter2;
    return (_this$emitter2 = this.emitter).on.apply(_this$emitter2, arguments);
  };
  _proto.once = function once() {
    var _this$emitter3;
    return (_this$emitter3 = this.emitter).once.apply(_this$emitter3, arguments);
  };
  _proto.removeFormat = function removeFormat(index, length, source) {
    var _this9 = this;
    var _overload8 = overload(index, length, source);
    index = _overload8[0];
    length = _overload8[1];
    source = _overload8[3];
    return modify.call(this, function () {
      return _this9.editor.removeFormat(index, length);
    }, source, index);
  };
  _proto.scrollRectIntoView = function scrollRectIntoView(rect) {
    (0,_utils_scrollRectIntoView_js__WEBPACK_IMPORTED_MODULE_11__["default"])(this.root, rect);
  }

  /**
   * @deprecated Use Quill#scrollSelectionIntoView() instead.
   */;
  _proto.scrollIntoView = function scrollIntoView() {
    console.warn('Quill#scrollIntoView() has been deprecated and will be removed in the near future. Please use Quill#scrollSelectionIntoView() instead.');
    this.scrollSelectionIntoView();
  }

  /**
   * Scroll the current selection into the visible area.
   * If the selection is already visible, no scrolling will occur.
   */;
  _proto.scrollSelectionIntoView = function scrollSelectionIntoView() {
    var range = this.selection.lastRange;
    var bounds = range && this.selection.getBounds(range.index, range.length);
    if (bounds) {
      this.scrollRectIntoView(bounds);
    }
  };
  _proto.setContents = function setContents(delta) {
    var _this10 = this;
    var source = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _emitter_js__WEBPACK_IMPORTED_MODULE_4__["default"].sources.API;
    return modify.call(this, function () {
      delta = new quill_delta__WEBPACK_IMPORTED_MODULE_2__(delta);
      var length = _this10.getLength();
      // Quill will set empty editor to \n
      var delete1 = _this10.editor.deleteText(0, length);
      var applied = _this10.editor.insertContents(0, delta);
      // Remove extra \n from empty editor initialization
      var delete2 = _this10.editor.deleteText(_this10.getLength() - 1, 1);
      return delete1.compose(applied).compose(delete2);
    }, source);
  };
  _proto.setSelection = function setSelection(index, length, source) {
    if (index == null) {
      // @ts-expect-error https://github.com/microsoft/TypeScript/issues/22609
      this.selection.setRange(null, length || Quill.sources.API);
    } else {
      // @ts-expect-error
      var _overload9 = overload(index, length, source);
      index = _overload9[0];
      length = _overload9[1];
      source = _overload9[3];
      this.selection.setRange(new _selection_js__WEBPACK_IMPORTED_MODULE_8__.Range(Math.max(0, index), length), source);
      if (source !== _emitter_js__WEBPACK_IMPORTED_MODULE_4__["default"].sources.SILENT) {
        this.scrollSelectionIntoView();
      }
    }
  };
  _proto.setText = function setText(text) {
    var source = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _emitter_js__WEBPACK_IMPORTED_MODULE_4__["default"].sources.API;
    var delta = new quill_delta__WEBPACK_IMPORTED_MODULE_2__().insert(text);
    return this.setContents(delta, source);
  };
  _proto.update = function update() {
    var source = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _emitter_js__WEBPACK_IMPORTED_MODULE_4__["default"].sources.USER;
    var change = this.scroll.update(source); // Will update selection before selection.update() does if text changes
    this.selection.update(source);
    // TODO this is usually undefined
    return change;
  };
  _proto.updateContents = function updateContents(delta) {
    var _this11 = this;
    var source = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _emitter_js__WEBPACK_IMPORTED_MODULE_4__["default"].sources.API;
    return modify.call(this, function () {
      delta = new quill_delta__WEBPACK_IMPORTED_MODULE_2__(delta);
      return _this11.editor.applyDelta(delta);
    }, source, true);
  };
  return Quill;
}();
Quill.DEFAULTS = {
  bounds: null,
  modules: {
    clipboard: true,
    keyboard: true,
    history: true,
    uploader: true
  },
  placeholder: '',
  readOnly: false,
  registry: globalRegistry,
  theme: 'default'
};
Quill.events = _emitter_js__WEBPACK_IMPORTED_MODULE_4__["default"].events;
Quill.sources = _emitter_js__WEBPACK_IMPORTED_MODULE_4__["default"].sources;
Quill.version =  false ? 0 : "2.0.3";
Quill.imports = {
  delta: quill_delta__WEBPACK_IMPORTED_MODULE_2__,
  parchment: parchment__WEBPACK_IMPORTED_MODULE_13__,
  'core/module': _module_js__WEBPACK_IMPORTED_MODULE_7__["default"],
  'core/theme': _theme_js__WEBPACK_IMPORTED_MODULE_10__["default"]
};
function resolveSelector(selector) {
  return typeof selector === 'string' ? document.querySelector(selector) : selector;
}
function expandModuleConfig(config) {
  return Object.entries(config != null ? config : {}).reduce(function (expanded, _ref) {
    var _extends2;
    var key = _ref[0],
      value = _ref[1];
    return (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({}, expanded, (_extends2 = {}, _extends2[key] = value === true ? {} : value, _extends2));
  }, {});
}
function omitUndefinedValuesFromOptions(obj) {
  return Object.fromEntries(Object.entries(obj).filter(function (entry) {
    return entry[1] !== undefined;
  }));
}
function expandConfig(containerOrSelector, options) {
  var container = resolveSelector(containerOrSelector);
  if (!container) {
    throw new Error('Invalid Quill container');
  }
  var shouldUseDefaultTheme = !options.theme || options.theme === Quill.DEFAULTS.theme;
  var theme = shouldUseDefaultTheme ? _theme_js__WEBPACK_IMPORTED_MODULE_10__["default"] : Quill["import"]("themes/" + options.theme);
  if (!theme) {
    throw new Error("Invalid theme " + options.theme + ". Did you register it?");
  }
  var _Quill$DEFAULTS = Quill.DEFAULTS,
    quillModuleDefaults = _Quill$DEFAULTS.modules,
    quillDefaults = (0,_babel_runtime_helpers_esm_objectWithoutPropertiesLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(_Quill$DEFAULTS, _excluded);
  var _theme$DEFAULTS = theme.DEFAULTS,
    themeModuleDefaults = _theme$DEFAULTS.modules,
    themeDefaults = (0,_babel_runtime_helpers_esm_objectWithoutPropertiesLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(_theme$DEFAULTS, _excluded2);
  var userModuleOptions = expandModuleConfig(options.modules);
  // Special case toolbar shorthand
  if (userModuleOptions != null && userModuleOptions.toolbar && userModuleOptions.toolbar.constructor !== Object) {
    userModuleOptions = (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({}, userModuleOptions, {
      toolbar: {
        container: userModuleOptions.toolbar
      }
    });
  }
  var modules = (0,lodash_es__WEBPACK_IMPORTED_MODULE_14__["default"])({}, expandModuleConfig(quillModuleDefaults), expandModuleConfig(themeModuleDefaults), userModuleOptions);
  var config = (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({}, quillDefaults, omitUndefinedValuesFromOptions(themeDefaults), omitUndefinedValuesFromOptions(options));
  var registry = options.registry;
  if (registry) {
    if (options.formats) {
      debug.warn('Ignoring "formats" option because "registry" is specified');
    }
  } else {
    registry = options.formats ? (0,_utils_createRegistryWithFormats_js__WEBPACK_IMPORTED_MODULE_12__["default"])(options.formats, config.registry, debug) : config.registry;
  }
  return (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({}, config, {
    registry: registry,
    container: container,
    theme: theme,
    modules: Object.entries(modules).reduce(function (modulesWithDefaults, _ref2) {
      var _extends3;
      var name = _ref2[0],
        value = _ref2[1];
      if (!value) return modulesWithDefaults;
      var moduleClass = Quill["import"]("modules/" + name);
      if (moduleClass == null) {
        debug.error("Cannot load " + name + " module. Are you sure you registered it?");
        return modulesWithDefaults;
      }
      return (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({}, modulesWithDefaults, (_extends3 = {}, _extends3[name] = (0,lodash_es__WEBPACK_IMPORTED_MODULE_14__["default"])({}, moduleClass.DEFAULTS || {}, value), _extends3));
    }, {}),
    bounds: resolveSelector(config.bounds)
  });
}

// Handle selection preservation and TEXT_CHANGE emission
// common to modification APIs
function modify(modifier, source, index, shift) {
  if (!this.isEnabled() && source === _emitter_js__WEBPACK_IMPORTED_MODULE_4__["default"].sources.USER && !this.allowReadOnlyEdits) {
    return new quill_delta__WEBPACK_IMPORTED_MODULE_2__();
  }
  var range = index == null ? null : this.getSelection();
  var oldDelta = this.editor.delta;
  var change = modifier();
  if (range != null) {
    if (index === true) {
      index = range.index; // eslint-disable-line prefer-destructuring
    }
    if (shift == null) {
      range = shiftRange(range, change, source);
    } else if (shift !== 0) {
      // @ts-expect-error index should always be number
      range = shiftRange(range, index, shift, source);
    }
    this.setSelection(range, _emitter_js__WEBPACK_IMPORTED_MODULE_4__["default"].sources.SILENT);
  }
  if (change.length() > 0) {
    var _this$emitter4;
    var args = [_emitter_js__WEBPACK_IMPORTED_MODULE_4__["default"].events.TEXT_CHANGE, change, oldDelta, source];
    (_this$emitter4 = this.emitter).emit.apply(_this$emitter4, [_emitter_js__WEBPACK_IMPORTED_MODULE_4__["default"].events.EDITOR_CHANGE].concat(args));
    if (source !== _emitter_js__WEBPACK_IMPORTED_MODULE_4__["default"].sources.SILENT) {
      var _this$emitter5;
      (_this$emitter5 = this.emitter).emit.apply(_this$emitter5, args);
    }
  }
  return change;
}
function overload(index, length, name, value, source) {
  var formats = {};
  // @ts-expect-error
  if (typeof index.index === 'number' && typeof index.length === 'number') {
    // Allow for throwaway end (used by insertText/insertEmbed)
    if (typeof length !== 'number') {
      // @ts-expect-error
      source = value;
      value = name;
      name = length;
      // @ts-expect-error
      length = index.length; // eslint-disable-line prefer-destructuring
      // @ts-expect-error
      index = index.index; // eslint-disable-line prefer-destructuring
    } else {
      // @ts-expect-error
      length = index.length; // eslint-disable-line prefer-destructuring
      // @ts-expect-error
      index = index.index; // eslint-disable-line prefer-destructuring
    }
  } else if (typeof length !== 'number') {
    // @ts-expect-error
    source = value;
    value = name;
    name = length;
    length = 0;
  }
  // Handle format being object, two format name/value strings or excluded
  if (typeof name === 'object') {
    // @ts-expect-error Fix me later
    formats = name;
    // @ts-expect-error
    source = value;
  } else if (typeof name === 'string') {
    if (value != null) {
      formats[name] = value;
    } else {
      // @ts-expect-error
      source = name;
    }
  }
  // Handle optional source
  source = source || _emitter_js__WEBPACK_IMPORTED_MODULE_4__["default"].sources.API;
  // @ts-expect-error
  return [index, length, formats, source];
}
function shiftRange(range, index, lengthOrSource, source) {
  var length = typeof lengthOrSource === 'number' ? lengthOrSource : 0;
  if (range == null) return null;
  var start;
  var end;
  // @ts-expect-error -- TODO: add a better type guard around `index`
  if (index && typeof index.transformPosition === 'function') {
    var _map = [range.index, range.index + range.length].map(function (pos) {
      return (
        // @ts-expect-error -- TODO: add a better type guard around `index`
        index.transformPosition(pos, source !== _emitter_js__WEBPACK_IMPORTED_MODULE_4__["default"].sources.USER)
      );
    });
    start = _map[0];
    end = _map[1];
  } else {
    var _map2 = [range.index, range.index + range.length].map(function (pos) {
      // @ts-expect-error -- TODO: add a better type guard around `index`
      if (pos < index || pos === index && source === _emitter_js__WEBPACK_IMPORTED_MODULE_4__["default"].sources.USER) return pos;
      if (length >= 0) {
        return pos + length;
      }
      // @ts-expect-error -- TODO: add a better type guard around `index`
      return Math.max(index, pos + length);
    });
    start = _map2[0];
    end = _map2[1];
  }
  return new _selection_js__WEBPACK_IMPORTED_MODULE_8__.Range(start, end - start);
}



/***/ }),

/***/ "./node_modules/quill/core/selection.js":
/*!**********************************************!*\
  !*** ./node_modules/quill/core/selection.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Range: () => (/* binding */ Range),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var parchment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! parchment */ "./node_modules/parchment/dist/parchment.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/isEqual.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/cloneDeep.js");
/* harmony import */ var _emitter_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./emitter.js */ "./node_modules/quill/core/emitter.js");
/* harmony import */ var _logger_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./logger.js */ "./node_modules/quill/core/logger.js");




var debug = (0,_logger_js__WEBPACK_IMPORTED_MODULE_1__["default"])('quill:selection');
var Range = function Range(index) {
  var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  this.index = index;
  this.length = length;
};
var Selection = /*#__PURE__*/function () {
  function Selection(scroll, emitter) {
    var _this = this;
    this.emitter = emitter;
    this.scroll = scroll;
    this.composing = false;
    this.mouseDown = false;
    this.root = this.scroll.domNode;
    // @ts-expect-error
    this.cursor = this.scroll.create('cursor', this);
    // savedRange is last non-null range
    this.savedRange = new Range(0, 0);
    this.lastRange = this.savedRange;
    this.lastNative = null;
    this.handleComposition();
    this.handleDragging();
    this.emitter.listenDOM('selectionchange', document, function () {
      if (!_this.mouseDown && !_this.composing) {
        setTimeout(_this.update.bind(_this, _emitter_js__WEBPACK_IMPORTED_MODULE_0__["default"].sources.USER), 1);
      }
    });
    this.emitter.on(_emitter_js__WEBPACK_IMPORTED_MODULE_0__["default"].events.SCROLL_BEFORE_UPDATE, function () {
      if (!_this.hasFocus()) return;
      var _native = _this.getNativeRange();
      if (_native == null) return;
      if (_native.start.node === _this.cursor.textNode) return; // cursor.restore() will handle
      _this.emitter.once(_emitter_js__WEBPACK_IMPORTED_MODULE_0__["default"].events.SCROLL_UPDATE, function (source, mutations) {
        try {
          if (_this.root.contains(_native.start.node) && _this.root.contains(_native.end.node)) {
            _this.setNativeRange(_native.start.node, _native.start.offset, _native.end.node, _native.end.offset);
          }
          var triggeredByTyping = mutations.some(function (mutation) {
            return mutation.type === 'characterData' || mutation.type === 'childList' || mutation.type === 'attributes' && mutation.target === _this.root;
          });
          _this.update(triggeredByTyping ? _emitter_js__WEBPACK_IMPORTED_MODULE_0__["default"].sources.SILENT : source);
        } catch (ignored) {
          // ignore
        }
      });
    });
    this.emitter.on(_emitter_js__WEBPACK_IMPORTED_MODULE_0__["default"].events.SCROLL_OPTIMIZE, function (mutations, context) {
      if (context.range) {
        var _context$range = context.range,
          startNode = _context$range.startNode,
          startOffset = _context$range.startOffset,
          endNode = _context$range.endNode,
          endOffset = _context$range.endOffset;
        _this.setNativeRange(startNode, startOffset, endNode, endOffset);
        _this.update(_emitter_js__WEBPACK_IMPORTED_MODULE_0__["default"].sources.SILENT);
      }
    });
    this.update(_emitter_js__WEBPACK_IMPORTED_MODULE_0__["default"].sources.SILENT);
  }
  var _proto = Selection.prototype;
  _proto.handleComposition = function handleComposition() {
    var _this2 = this;
    this.emitter.on(_emitter_js__WEBPACK_IMPORTED_MODULE_0__["default"].events.COMPOSITION_BEFORE_START, function () {
      _this2.composing = true;
    });
    this.emitter.on(_emitter_js__WEBPACK_IMPORTED_MODULE_0__["default"].events.COMPOSITION_END, function () {
      _this2.composing = false;
      if (_this2.cursor.parent) {
        var range = _this2.cursor.restore();
        if (!range) return;
        setTimeout(function () {
          _this2.setNativeRange(range.startNode, range.startOffset, range.endNode, range.endOffset);
        }, 1);
      }
    });
  };
  _proto.handleDragging = function handleDragging() {
    var _this3 = this;
    this.emitter.listenDOM('mousedown', document.body, function () {
      _this3.mouseDown = true;
    });
    this.emitter.listenDOM('mouseup', document.body, function () {
      _this3.mouseDown = false;
      _this3.update(_emitter_js__WEBPACK_IMPORTED_MODULE_0__["default"].sources.USER);
    });
  };
  _proto.focus = function focus() {
    if (this.hasFocus()) return;
    this.root.focus({
      preventScroll: true
    });
    this.setRange(this.savedRange);
  };
  _proto.format = function format(_format, value) {
    this.scroll.update();
    var nativeRange = this.getNativeRange();
    if (nativeRange == null || !nativeRange["native"].collapsed || this.scroll.query(_format, parchment__WEBPACK_IMPORTED_MODULE_2__.Scope.BLOCK)) return;
    if (nativeRange.start.node !== this.cursor.textNode) {
      var blot = this.scroll.find(nativeRange.start.node, false);
      if (blot == null) return;
      // TODO Give blot ability to not split
      if (blot instanceof parchment__WEBPACK_IMPORTED_MODULE_2__.LeafBlot) {
        var after = blot.split(nativeRange.start.offset);
        blot.parent.insertBefore(this.cursor, after);
      } else {
        // @ts-expect-error TODO: nativeRange.start.node doesn't seem to match function signature
        blot.insertBefore(this.cursor, nativeRange.start.node); // Should never happen
      }
      this.cursor.attach();
    }
    this.cursor.format(_format, value);
    this.scroll.optimize();
    this.setNativeRange(this.cursor.textNode, this.cursor.textNode.data.length);
    this.update();
  };
  _proto.getBounds = function getBounds(index) {
    var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var scrollLength = this.scroll.length();
    index = Math.min(index, scrollLength - 1);
    length = Math.min(index + length, scrollLength - 1) - index;
    var node;
    var _this$scroll$leaf = this.scroll.leaf(index),
      leaf = _this$scroll$leaf[0],
      offset = _this$scroll$leaf[1];
    if (leaf == null) return null;
    if (length > 0 && offset === leaf.length()) {
      var _this$scroll$leaf2 = this.scroll.leaf(index + 1),
        next = _this$scroll$leaf2[0];
      if (next) {
        var _this$scroll$line = this.scroll.line(index),
          line = _this$scroll$line[0];
        var _this$scroll$line2 = this.scroll.line(index + 1),
          nextLine = _this$scroll$line2[0];
        if (line === nextLine) {
          leaf = next;
          offset = 0;
        }
      }
    }
    var _leaf$position = leaf.position(offset, true);
    node = _leaf$position[0];
    offset = _leaf$position[1];
    var range = document.createRange();
    if (length > 0) {
      range.setStart(node, offset);
      var _this$scroll$leaf3 = this.scroll.leaf(index + length);
      leaf = _this$scroll$leaf3[0];
      offset = _this$scroll$leaf3[1];
      if (leaf == null) return null;
      var _leaf$position2 = leaf.position(offset, true);
      node = _leaf$position2[0];
      offset = _leaf$position2[1];
      range.setEnd(node, offset);
      return range.getBoundingClientRect();
    }
    var side = 'left';
    var rect;
    if (node instanceof Text) {
      // Return null if the text node is empty because it is
      // not able to get a useful client rect:
      // https://github.com/w3c/csswg-drafts/issues/2514.
      // Empty text nodes are most likely caused by TextBlot#optimize()
      // not getting called when editor content changes.
      if (!node.data.length) {
        return null;
      }
      if (offset < node.data.length) {
        range.setStart(node, offset);
        range.setEnd(node, offset + 1);
      } else {
        range.setStart(node, offset - 1);
        range.setEnd(node, offset);
        side = 'right';
      }
      rect = range.getBoundingClientRect();
    } else {
      if (!(leaf.domNode instanceof Element)) return null;
      rect = leaf.domNode.getBoundingClientRect();
      if (offset > 0) side = 'right';
    }
    return {
      bottom: rect.top + rect.height,
      height: rect.height,
      left: rect[side],
      right: rect[side],
      top: rect.top,
      width: 0
    };
  };
  _proto.getNativeRange = function getNativeRange() {
    var selection = document.getSelection();
    if (selection == null || selection.rangeCount <= 0) return null;
    var nativeRange = selection.getRangeAt(0);
    if (nativeRange == null) return null;
    var range = this.normalizeNative(nativeRange);
    debug.info('getNativeRange', range);
    return range;
  };
  _proto.getRange = function getRange() {
    var root = this.scroll.domNode;
    if ('isConnected' in root && !root.isConnected) {
      // document.getSelection() forces layout on Blink, so we trend to
      // not calling it.
      return [null, null];
    }
    var normalized = this.getNativeRange();
    if (normalized == null) return [null, null];
    var range = this.normalizedToRange(normalized);
    return [range, normalized];
  };
  _proto.hasFocus = function hasFocus() {
    return document.activeElement === this.root || document.activeElement != null && contains(this.root, document.activeElement);
  };
  _proto.normalizedToRange = function normalizedToRange(range) {
    var _this4 = this;
    var positions = [[range.start.node, range.start.offset]];
    if (!range["native"].collapsed) {
      positions.push([range.end.node, range.end.offset]);
    }
    var indexes = positions.map(function (position) {
      var node = position[0],
        offset = position[1];
      var blot = _this4.scroll.find(node, true);
      // @ts-expect-error Fix me later
      var index = blot.offset(_this4.scroll);
      if (offset === 0) {
        return index;
      }
      if (blot instanceof parchment__WEBPACK_IMPORTED_MODULE_2__.LeafBlot) {
        return index + blot.index(node, offset);
      }
      // @ts-expect-error Fix me later
      return index + blot.length();
    });
    var end = Math.min(Math.max.apply(Math, indexes), this.scroll.length() - 1);
    var start = Math.min.apply(Math, [end].concat(indexes));
    return new Range(start, end - start);
  };
  _proto.normalizeNative = function normalizeNative(nativeRange) {
    if (!contains(this.root, nativeRange.startContainer) || !nativeRange.collapsed && !contains(this.root, nativeRange.endContainer)) {
      return null;
    }
    var range = {
      start: {
        node: nativeRange.startContainer,
        offset: nativeRange.startOffset
      },
      end: {
        node: nativeRange.endContainer,
        offset: nativeRange.endOffset
      },
      "native": nativeRange
    };
    [range.start, range.end].forEach(function (position) {
      var node = position.node,
        offset = position.offset;
      while (!(node instanceof Text) && node.childNodes.length > 0) {
        if (node.childNodes.length > offset) {
          node = node.childNodes[offset];
          offset = 0;
        } else if (node.childNodes.length === offset) {
          // @ts-expect-error Fix me later
          node = node.lastChild;
          if (node instanceof Text) {
            offset = node.data.length;
          } else if (node.childNodes.length > 0) {
            // Container case
            offset = node.childNodes.length;
          } else {
            // Embed case
            offset = node.childNodes.length + 1;
          }
        } else {
          break;
        }
      }
      position.node = node;
      position.offset = offset;
    });
    return range;
  };
  _proto.rangeToNative = function rangeToNative(range) {
    var _this5 = this;
    var scrollLength = this.scroll.length();
    var getPosition = function getPosition(index, inclusive) {
      index = Math.min(scrollLength - 1, index);
      var _this5$scroll$leaf = _this5.scroll.leaf(index),
        leaf = _this5$scroll$leaf[0],
        leafOffset = _this5$scroll$leaf[1];
      return leaf ? leaf.position(leafOffset, inclusive) : [null, -1];
    };
    return [].concat(getPosition(range.index, false), getPosition(range.index + range.length, true));
  };
  _proto.setNativeRange = function setNativeRange(startNode, startOffset) {
    var endNode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : startNode;
    var endOffset = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : startOffset;
    var force = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
    debug.info('setNativeRange', startNode, startOffset, endNode, endOffset);
    if (startNode != null && (this.root.parentNode == null || startNode.parentNode == null ||
    // @ts-expect-error Fix me later
    endNode.parentNode == null)) {
      return;
    }
    var selection = document.getSelection();
    if (selection == null) return;
    if (startNode != null) {
      if (!this.hasFocus()) this.root.focus({
        preventScroll: true
      });
      var _ref = this.getNativeRange() || {},
        _native2 = _ref["native"];
      if (_native2 == null || force || startNode !== _native2.startContainer || startOffset !== _native2.startOffset || endNode !== _native2.endContainer || endOffset !== _native2.endOffset) {
        if (startNode instanceof Element && startNode.tagName === 'BR') {
          // @ts-expect-error Fix me later
          startOffset = Array.from(startNode.parentNode.childNodes).indexOf(startNode);
          startNode = startNode.parentNode;
        }
        if (endNode instanceof Element && endNode.tagName === 'BR') {
          // @ts-expect-error Fix me later
          endOffset = Array.from(endNode.parentNode.childNodes).indexOf(endNode);
          endNode = endNode.parentNode;
        }
        var range = document.createRange();
        // @ts-expect-error Fix me later
        range.setStart(startNode, startOffset);
        // @ts-expect-error Fix me later
        range.setEnd(endNode, endOffset);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    } else {
      selection.removeAllRanges();
      this.root.blur();
    }
  };
  _proto.setRange = function setRange(range) {
    var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var source = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _emitter_js__WEBPACK_IMPORTED_MODULE_0__["default"].sources.API;
    if (typeof force === 'string') {
      source = force;
      force = false;
    }
    debug.info('setRange', range);
    if (range != null) {
      var args = this.rangeToNative(range);
      this.setNativeRange.apply(this, args.concat([force]));
    } else {
      this.setNativeRange(null);
    }
    this.update(source);
  };
  _proto.update = function update() {
    var source = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _emitter_js__WEBPACK_IMPORTED_MODULE_0__["default"].sources.USER;
    var oldRange = this.lastRange;
    var _this$getRange = this.getRange(),
      lastRange = _this$getRange[0],
      nativeRange = _this$getRange[1];
    this.lastRange = lastRange;
    this.lastNative = nativeRange;
    if (this.lastRange != null) {
      this.savedRange = this.lastRange;
    }
    if (!(0,lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"])(oldRange, this.lastRange)) {
      var _this$emitter;
      if (!this.composing && nativeRange != null && nativeRange["native"].collapsed && nativeRange.start.node !== this.cursor.textNode) {
        var range = this.cursor.restore();
        if (range) {
          this.setNativeRange(range.startNode, range.startOffset, range.endNode, range.endOffset);
        }
      }
      var args = [_emitter_js__WEBPACK_IMPORTED_MODULE_0__["default"].events.SELECTION_CHANGE, (0,lodash_es__WEBPACK_IMPORTED_MODULE_4__["default"])(this.lastRange), (0,lodash_es__WEBPACK_IMPORTED_MODULE_4__["default"])(oldRange), source];
      (_this$emitter = this.emitter).emit.apply(_this$emitter, [_emitter_js__WEBPACK_IMPORTED_MODULE_0__["default"].events.EDITOR_CHANGE].concat(args));
      if (source !== _emitter_js__WEBPACK_IMPORTED_MODULE_0__["default"].sources.SILENT) {
        var _this$emitter2;
        (_this$emitter2 = this.emitter).emit.apply(_this$emitter2, args);
      }
    }
  };
  return Selection;
}();
function contains(parent, descendant) {
  try {
    // Firefox inserts inaccessible nodes around video elements
    descendant.parentNode; // eslint-disable-line @typescript-eslint/no-unused-expressions
  } catch (e) {
    return false;
  }
  return parent.contains(descendant);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Selection);

/***/ }),

/***/ "./node_modules/quill/core/theme.js":
/*!******************************************!*\
  !*** ./node_modules/quill/core/theme.js ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var _Theme;
var Theme = /*#__PURE__*/function () {
  function Theme(quill, options) {
    this.modules = {};
    this.quill = quill;
    this.options = options;
  }
  var _proto = Theme.prototype;
  _proto.init = function init() {
    var _this = this;
    Object.keys(this.options.modules).forEach(function (name) {
      if (_this.modules[name] == null) {
        _this.addModule(name);
      }
    });
  };
  _proto.addModule = function addModule(name) {
    // @ts-expect-error
    var ModuleClass = this.quill.constructor["import"]("modules/" + name);
    this.modules[name] = new ModuleClass(this.quill, this.options.modules[name] || {});
    return this.modules[name];
  };
  return Theme;
}();
_Theme = Theme;
Theme.DEFAULTS = {
  modules: {}
};
Theme.themes = {
  "default": _Theme
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Theme);

/***/ }),

/***/ "./node_modules/quill/core/utils/createRegistryWithFormats.js":
/*!********************************************************************!*\
  !*** ./node_modules/quill/core/utils/createRegistryWithFormats.js ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var parchment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! parchment */ "./node_modules/parchment/dist/parchment.js");

var MAX_REGISTER_ITERATIONS = 100;
var CORE_FORMATS = ['block', 'break', 'cursor', 'inline', 'scroll', 'text'];
var createRegistryWithFormats = function createRegistryWithFormats(formats, sourceRegistry, debug) {
  var registry = new parchment__WEBPACK_IMPORTED_MODULE_0__.Registry();
  CORE_FORMATS.forEach(function (name) {
    var coreBlot = sourceRegistry.query(name);
    if (coreBlot) registry.register(coreBlot);
  });
  formats.forEach(function (name) {
    var format = sourceRegistry.query(name);
    if (!format) {
      debug.error("Cannot register \"" + name + "\" specified in \"formats\" config. Are you sure it was registered?");
    }
    var iterations = 0;
    while (format) {
      var _format$requiredConta;
      registry.register(format);
      format = 'blotName' in format ? (_format$requiredConta = format.requiredContainer) != null ? _format$requiredConta : null : null;
      iterations += 1;
      if (iterations > MAX_REGISTER_ITERATIONS) {
        debug.error("Cycle detected in registering blot requiredContainer: \"" + name + "\"");
        break;
      }
    }
  });
  return registry;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createRegistryWithFormats);

/***/ }),

/***/ "./node_modules/quill/core/utils/scrollRectIntoView.js":
/*!*************************************************************!*\
  !*** ./node_modules/quill/core/utils/scrollRectIntoView.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var getParentElement = function getParentElement(element) {
  return element.parentElement || element.getRootNode().host || null;
};
var getElementRect = function getElementRect(element) {
  var rect = element.getBoundingClientRect();
  var scaleX = 'offsetWidth' in element && Math.abs(rect.width) / element.offsetWidth || 1;
  var scaleY = 'offsetHeight' in element && Math.abs(rect.height) / element.offsetHeight || 1;
  return {
    top: rect.top,
    right: rect.left + element.clientWidth * scaleX,
    bottom: rect.top + element.clientHeight * scaleY,
    left: rect.left
  };
};
var paddingValueToInt = function paddingValueToInt(value) {
  var number = parseInt(value, 10);
  return Number.isNaN(number) ? 0 : number;
};

// Follow the steps described in https://www.w3.org/TR/cssom-view-1/#element-scrolling-members,
// assuming that the scroll option is set to 'nearest'.
var getScrollDistance = function getScrollDistance(targetStart, targetEnd, scrollStart, scrollEnd, scrollPaddingStart, scrollPaddingEnd) {
  if (targetStart < scrollStart && targetEnd > scrollEnd) {
    return 0;
  }
  if (targetStart < scrollStart) {
    return -(scrollStart - targetStart + scrollPaddingStart);
  }
  if (targetEnd > scrollEnd) {
    return targetEnd - targetStart > scrollEnd - scrollStart ? targetStart + scrollPaddingStart - scrollStart : targetEnd - scrollEnd + scrollPaddingEnd;
  }
  return 0;
};
var scrollRectIntoView = function scrollRectIntoView(root, targetRect) {
  var document = root.ownerDocument;
  var rect = targetRect;
  var current = root;
  while (current) {
    var _window$visualViewpor, _window$visualViewpor2, _window$visualViewpor3, _window$visualViewpor4;
    var isDocumentBody = current === document.body;
    var bounding = isDocumentBody ? {
      top: 0,
      right: (_window$visualViewpor = (_window$visualViewpor2 = window.visualViewport) == null ? void 0 : _window$visualViewpor2.width) != null ? _window$visualViewpor : document.documentElement.clientWidth,
      bottom: (_window$visualViewpor3 = (_window$visualViewpor4 = window.visualViewport) == null ? void 0 : _window$visualViewpor4.height) != null ? _window$visualViewpor3 : document.documentElement.clientHeight,
      left: 0
    } : getElementRect(current);
    var style = getComputedStyle(current);
    var scrollDistanceX = getScrollDistance(rect.left, rect.right, bounding.left, bounding.right, paddingValueToInt(style.scrollPaddingLeft), paddingValueToInt(style.scrollPaddingRight));
    var scrollDistanceY = getScrollDistance(rect.top, rect.bottom, bounding.top, bounding.bottom, paddingValueToInt(style.scrollPaddingTop), paddingValueToInt(style.scrollPaddingBottom));
    if (scrollDistanceX || scrollDistanceY) {
      if (isDocumentBody) {
        var _document$defaultView;
        (_document$defaultView = document.defaultView) == null || _document$defaultView.scrollBy(scrollDistanceX, scrollDistanceY);
      } else {
        var _current = current,
          scrollLeft = _current.scrollLeft,
          scrollTop = _current.scrollTop;
        if (scrollDistanceY) {
          current.scrollTop += scrollDistanceY;
        }
        if (scrollDistanceX) {
          current.scrollLeft += scrollDistanceX;
        }
        var scrolledLeft = current.scrollLeft - scrollLeft;
        var scrolledTop = current.scrollTop - scrollTop;
        rect = {
          left: rect.left - scrolledLeft,
          top: rect.top - scrolledTop,
          right: rect.right - scrolledLeft,
          bottom: rect.bottom - scrolledTop
        };
      }
    }
    current = isDocumentBody || style.position === 'fixed' ? null : getParentElement(current);
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (scrollRectIntoView);

/***/ }),

/***/ "./node_modules/quill/formats/align.js":
/*!*********************************************!*\
  !*** ./node_modules/quill/formats/align.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AlignAttribute: () => (/* binding */ AlignAttribute),
/* harmony export */   AlignClass: () => (/* binding */ AlignClass),
/* harmony export */   AlignStyle: () => (/* binding */ AlignStyle)
/* harmony export */ });
/* harmony import */ var parchment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! parchment */ "./node_modules/parchment/dist/parchment.js");

var config = {
  scope: parchment__WEBPACK_IMPORTED_MODULE_0__.Scope.BLOCK,
  whitelist: ['right', 'center', 'justify']
};
var AlignAttribute = new parchment__WEBPACK_IMPORTED_MODULE_0__.Attributor('align', 'align', config);
var AlignClass = new parchment__WEBPACK_IMPORTED_MODULE_0__.ClassAttributor('align', 'ql-align', config);
var AlignStyle = new parchment__WEBPACK_IMPORTED_MODULE_0__.StyleAttributor('align', 'text-align', config);


/***/ }),

/***/ "./node_modules/quill/formats/background.js":
/*!**************************************************!*\
  !*** ./node_modules/quill/formats/background.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BackgroundClass: () => (/* binding */ BackgroundClass),
/* harmony export */   BackgroundStyle: () => (/* binding */ BackgroundStyle)
/* harmony export */ });
/* harmony import */ var parchment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! parchment */ "./node_modules/parchment/dist/parchment.js");
/* harmony import */ var _color_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./color.js */ "./node_modules/quill/formats/color.js");


var BackgroundClass = new parchment__WEBPACK_IMPORTED_MODULE_1__.ClassAttributor('background', 'ql-bg', {
  scope: parchment__WEBPACK_IMPORTED_MODULE_1__.Scope.INLINE
});
var BackgroundStyle = new _color_js__WEBPACK_IMPORTED_MODULE_0__.ColorAttributor('background', 'background-color', {
  scope: parchment__WEBPACK_IMPORTED_MODULE_1__.Scope.INLINE
});


/***/ }),

/***/ "./node_modules/quill/formats/blockquote.js":
/*!**************************************************!*\
  !*** ./node_modules/quill/formats/blockquote.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var _blots_block_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../blots/block.js */ "./node_modules/quill/blots/block.js");


var Blockquote = /*#__PURE__*/function (_Block) {
  function Blockquote() {
    return _Block.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(Blockquote, _Block);
  return Blockquote;
}(_blots_block_js__WEBPACK_IMPORTED_MODULE_1__["default"]);
Blockquote.blotName = 'blockquote';
Blockquote.tagName = 'blockquote';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Blockquote);

/***/ }),

/***/ "./node_modules/quill/formats/bold.js":
/*!********************************************!*\
  !*** ./node_modules/quill/formats/bold.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var _blots_inline_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../blots/inline.js */ "./node_modules/quill/blots/inline.js");


var Bold = /*#__PURE__*/function (_Inline) {
  function Bold() {
    return _Inline.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(Bold, _Inline);
  Bold.create = function create() {
    return _Inline.create.call(this);
  };
  Bold.formats = function formats() {
    return true;
  };
  var _proto = Bold.prototype;
  _proto.optimize = function optimize(context) {
    _Inline.prototype.optimize.call(this, context);
    if (this.domNode.tagName !== this.statics.tagName[0]) {
      this.replaceWith(this.statics.blotName);
    }
  };
  return Bold;
}(_blots_inline_js__WEBPACK_IMPORTED_MODULE_1__["default"]);
Bold.blotName = 'bold';
Bold.tagName = ['STRONG', 'B'];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Bold);

/***/ }),

/***/ "./node_modules/quill/formats/code.js":
/*!********************************************!*\
  !*** ./node_modules/quill/formats/code.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Code: () => (/* binding */ Code),
/* harmony export */   CodeBlockContainer: () => (/* binding */ CodeBlockContainer),
/* harmony export */   "default": () => (/* binding */ CodeBlock)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var _blots_block_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../blots/block.js */ "./node_modules/quill/blots/block.js");
/* harmony import */ var _blots_break_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../blots/break.js */ "./node_modules/quill/blots/break.js");
/* harmony import */ var _blots_cursor_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../blots/cursor.js */ "./node_modules/quill/blots/cursor.js");
/* harmony import */ var _blots_inline_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../blots/inline.js */ "./node_modules/quill/blots/inline.js");
/* harmony import */ var _blots_text_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../blots/text.js */ "./node_modules/quill/blots/text.js");
/* harmony import */ var _blots_container_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../blots/container.js */ "./node_modules/quill/blots/container.js");
/* harmony import */ var _core_quill_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../core/quill.js */ "./node_modules/quill/core/quill.js");








var CodeBlockContainer = /*#__PURE__*/function (_Container) {
  function CodeBlockContainer() {
    return _Container.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(CodeBlockContainer, _Container);
  CodeBlockContainer.create = function create(value) {
    var domNode = _Container.create.call(this, value);
    domNode.setAttribute('spellcheck', 'false');
    return domNode;
  };
  var _proto = CodeBlockContainer.prototype;
  _proto.code = function code(index, length) {
    return this.children
    // @ts-expect-error
    .map(function (child) {
      return child.length() <= 1 ? '' : child.domNode.innerText;
    }).join('\n').slice(index, index + length);
  };
  _proto.html = function html(index, length) {
    // `\n`s are needed in order to support empty lines at the beginning and the end.
    // https://html.spec.whatwg.org/multipage/syntax.html#element-restrictions
    return "<pre>\n" + (0,_blots_text_js__WEBPACK_IMPORTED_MODULE_5__.escapeText)(this.code(index, length)) + "\n</pre>";
  };
  return CodeBlockContainer;
}(_blots_container_js__WEBPACK_IMPORTED_MODULE_6__["default"]);
var CodeBlock = /*#__PURE__*/function (_Block) {
  function CodeBlock() {
    return _Block.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(CodeBlock, _Block);
  CodeBlock.register = function register() {
    _core_quill_js__WEBPACK_IMPORTED_MODULE_7__["default"].register(CodeBlockContainer);
  };
  return CodeBlock;
}(_blots_block_js__WEBPACK_IMPORTED_MODULE_1__["default"]);
CodeBlock.TAB = '  ';
var Code = /*#__PURE__*/function (_Inline) {
  function Code() {
    return _Inline.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(Code, _Inline);
  return Code;
}(_blots_inline_js__WEBPACK_IMPORTED_MODULE_4__["default"]);
Code.blotName = 'code';
Code.tagName = 'CODE';
CodeBlock.blotName = 'code-block';
CodeBlock.className = 'ql-code-block';
CodeBlock.tagName = 'DIV';
CodeBlockContainer.blotName = 'code-block-container';
CodeBlockContainer.className = 'ql-code-block-container';
CodeBlockContainer.tagName = 'DIV';
CodeBlockContainer.allowedChildren = [CodeBlock];
CodeBlock.allowedChildren = [_blots_text_js__WEBPACK_IMPORTED_MODULE_5__["default"], _blots_break_js__WEBPACK_IMPORTED_MODULE_2__["default"], _blots_cursor_js__WEBPACK_IMPORTED_MODULE_3__["default"]];
CodeBlock.requiredContainer = CodeBlockContainer;


/***/ }),

/***/ "./node_modules/quill/formats/color.js":
/*!*********************************************!*\
  !*** ./node_modules/quill/formats/color.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ColorAttributor: () => (/* binding */ ColorAttributor),
/* harmony export */   ColorClass: () => (/* binding */ ColorClass),
/* harmony export */   ColorStyle: () => (/* binding */ ColorStyle)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var parchment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! parchment */ "./node_modules/parchment/dist/parchment.js");


var ColorAttributor = /*#__PURE__*/function (_StyleAttributor) {
  function ColorAttributor() {
    return _StyleAttributor.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(ColorAttributor, _StyleAttributor);
  var _proto = ColorAttributor.prototype;
  _proto.value = function value(domNode) {
    var value = _StyleAttributor.prototype.value.call(this, domNode);
    if (!value.startsWith('rgb(')) return value;
    value = value.replace(/^[^\d]+/, '').replace(/[^\d]+$/, '');
    var hex = value.split(',').map(function (component) {
      return ("00" + parseInt(component, 10).toString(16)).slice(-2);
    }).join('');
    return "#" + hex;
  };
  return ColorAttributor;
}(parchment__WEBPACK_IMPORTED_MODULE_1__.StyleAttributor);
var ColorClass = new parchment__WEBPACK_IMPORTED_MODULE_1__.ClassAttributor('color', 'ql-color', {
  scope: parchment__WEBPACK_IMPORTED_MODULE_1__.Scope.INLINE
});
var ColorStyle = new ColorAttributor('color', 'color', {
  scope: parchment__WEBPACK_IMPORTED_MODULE_1__.Scope.INLINE
});


/***/ }),

/***/ "./node_modules/quill/formats/direction.js":
/*!*************************************************!*\
  !*** ./node_modules/quill/formats/direction.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DirectionAttribute: () => (/* binding */ DirectionAttribute),
/* harmony export */   DirectionClass: () => (/* binding */ DirectionClass),
/* harmony export */   DirectionStyle: () => (/* binding */ DirectionStyle)
/* harmony export */ });
/* harmony import */ var parchment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! parchment */ "./node_modules/parchment/dist/parchment.js");

var config = {
  scope: parchment__WEBPACK_IMPORTED_MODULE_0__.Scope.BLOCK,
  whitelist: ['rtl']
};
var DirectionAttribute = new parchment__WEBPACK_IMPORTED_MODULE_0__.Attributor('direction', 'dir', config);
var DirectionClass = new parchment__WEBPACK_IMPORTED_MODULE_0__.ClassAttributor('direction', 'ql-direction', config);
var DirectionStyle = new parchment__WEBPACK_IMPORTED_MODULE_0__.StyleAttributor('direction', 'direction', config);


/***/ }),

/***/ "./node_modules/quill/formats/font.js":
/*!********************************************!*\
  !*** ./node_modules/quill/formats/font.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FontClass: () => (/* binding */ FontClass),
/* harmony export */   FontStyle: () => (/* binding */ FontStyle)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var parchment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! parchment */ "./node_modules/parchment/dist/parchment.js");


var config = {
  scope: parchment__WEBPACK_IMPORTED_MODULE_1__.Scope.INLINE,
  whitelist: ['serif', 'monospace']
};
var FontClass = new parchment__WEBPACK_IMPORTED_MODULE_1__.ClassAttributor('font', 'ql-font', config);
var FontStyleAttributor = /*#__PURE__*/function (_StyleAttributor) {
  function FontStyleAttributor() {
    return _StyleAttributor.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(FontStyleAttributor, _StyleAttributor);
  var _proto = FontStyleAttributor.prototype;
  _proto.value = function value(node) {
    return _StyleAttributor.prototype.value.call(this, node).replace(/["']/g, '');
  };
  return FontStyleAttributor;
}(parchment__WEBPACK_IMPORTED_MODULE_1__.StyleAttributor);
var FontStyle = new FontStyleAttributor('font', 'font-family', config);


/***/ }),

/***/ "./node_modules/quill/formats/formula.js":
/*!***********************************************!*\
  !*** ./node_modules/quill/formats/formula.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var _blots_embed_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../blots/embed.js */ "./node_modules/quill/blots/embed.js");


var Formula = /*#__PURE__*/function (_Embed) {
  function Formula() {
    return _Embed.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(Formula, _Embed);
  Formula.create = function create(value) {
    // @ts-expect-error
    if (window.katex == null) {
      throw new Error('Formula module requires KaTeX.');
    }
    var node = _Embed.create.call(this, value);
    if (typeof value === 'string') {
      // @ts-expect-error
      window.katex.render(value, node, {
        throwOnError: false,
        errorColor: '#f00'
      });
      node.setAttribute('data-value', value);
    }
    return node;
  };
  Formula.value = function value(domNode) {
    return domNode.getAttribute('data-value');
  };
  var _proto = Formula.prototype;
  _proto.html = function html() {
    var _this$value = this.value(),
      formula = _this$value.formula;
    return "<span>" + formula + "</span>";
  };
  return Formula;
}(_blots_embed_js__WEBPACK_IMPORTED_MODULE_1__["default"]);
Formula.blotName = 'formula';
Formula.className = 'ql-formula';
Formula.tagName = 'SPAN';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Formula);

/***/ }),

/***/ "./node_modules/quill/formats/header.js":
/*!**********************************************!*\
  !*** ./node_modules/quill/formats/header.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var _blots_block_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../blots/block.js */ "./node_modules/quill/blots/block.js");


var Header = /*#__PURE__*/function (_Block) {
  function Header() {
    return _Block.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(Header, _Block);
  Header.formats = function formats(domNode) {
    return this.tagName.indexOf(domNode.tagName) + 1;
  };
  return Header;
}(_blots_block_js__WEBPACK_IMPORTED_MODULE_1__["default"]);
Header.blotName = 'header';
Header.tagName = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Header);

/***/ }),

/***/ "./node_modules/quill/formats/image.js":
/*!*********************************************!*\
  !*** ./node_modules/quill/formats/image.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var parchment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! parchment */ "./node_modules/parchment/dist/parchment.js");
/* harmony import */ var _link_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./link.js */ "./node_modules/quill/formats/link.js");



var ATTRIBUTES = ['alt', 'height', 'width'];
var Image = /*#__PURE__*/function (_EmbedBlot) {
  function Image() {
    return _EmbedBlot.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(Image, _EmbedBlot);
  Image.create = function create(value) {
    var node = _EmbedBlot.create.call(this, value);
    if (typeof value === 'string') {
      node.setAttribute('src', this.sanitize(value));
    }
    return node;
  };
  Image.formats = function formats(domNode) {
    return ATTRIBUTES.reduce(function (formats, attribute) {
      if (domNode.hasAttribute(attribute)) {
        formats[attribute] = domNode.getAttribute(attribute);
      }
      return formats;
    }, {});
  };
  Image.match = function match(url) {
    return /\.(jpe?g|gif|png)$/.test(url) || /^data:image\/.+;base64/.test(url);
  };
  Image.sanitize = function sanitize(url) {
    return (0,_link_js__WEBPACK_IMPORTED_MODULE_1__.sanitize)(url, ['http', 'https', 'data']) ? url : '//:0';
  };
  Image.value = function value(domNode) {
    return domNode.getAttribute('src');
  };
  var _proto = Image.prototype;
  _proto.format = function format(name, value) {
    if (ATTRIBUTES.indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name);
      }
    } else {
      _EmbedBlot.prototype.format.call(this, name, value);
    }
  };
  return Image;
}(parchment__WEBPACK_IMPORTED_MODULE_2__.EmbedBlot);
Image.blotName = 'image';
Image.tagName = 'IMG';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Image);

/***/ }),

/***/ "./node_modules/quill/formats/indent.js":
/*!**********************************************!*\
  !*** ./node_modules/quill/formats/indent.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var parchment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! parchment */ "./node_modules/parchment/dist/parchment.js");


var IndentAttributor = /*#__PURE__*/function (_ClassAttributor) {
  function IndentAttributor() {
    return _ClassAttributor.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(IndentAttributor, _ClassAttributor);
  var _proto = IndentAttributor.prototype;
  _proto.add = function add(node, value) {
    var normalizedValue = 0;
    if (value === '+1' || value === '-1') {
      var indent = this.value(node) || 0;
      normalizedValue = value === '+1' ? indent + 1 : indent - 1;
    } else if (typeof value === 'number') {
      normalizedValue = value;
    }
    if (normalizedValue === 0) {
      this.remove(node);
      return true;
    }
    return _ClassAttributor.prototype.add.call(this, node, normalizedValue.toString());
  };
  _proto.canAdd = function canAdd(node, value) {
    return _ClassAttributor.prototype.canAdd.call(this, node, value) || _ClassAttributor.prototype.canAdd.call(this, node, parseInt(value, 10));
  };
  _proto.value = function value(node) {
    return parseInt(_ClassAttributor.prototype.value.call(this, node), 10) || undefined; // Don't return NaN
  };
  return IndentAttributor;
}(parchment__WEBPACK_IMPORTED_MODULE_1__.ClassAttributor);
var IndentClass = new IndentAttributor('indent', 'ql-indent', {
  scope: parchment__WEBPACK_IMPORTED_MODULE_1__.Scope.BLOCK,
  // @ts-expect-error
  whitelist: [1, 2, 3, 4, 5, 6, 7, 8]
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (IndentClass);

/***/ }),

/***/ "./node_modules/quill/formats/italic.js":
/*!**********************************************!*\
  !*** ./node_modules/quill/formats/italic.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var _bold_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./bold.js */ "./node_modules/quill/formats/bold.js");


var Italic = /*#__PURE__*/function (_Bold) {
  function Italic() {
    return _Bold.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(Italic, _Bold);
  return Italic;
}(_bold_js__WEBPACK_IMPORTED_MODULE_1__["default"]);
Italic.blotName = 'italic';
Italic.tagName = ['EM', 'I'];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Italic);

/***/ }),

/***/ "./node_modules/quill/formats/link.js":
/*!********************************************!*\
  !*** ./node_modules/quill/formats/link.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Link),
/* harmony export */   sanitize: () => (/* binding */ _sanitize)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var _blots_inline_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../blots/inline.js */ "./node_modules/quill/blots/inline.js");


var Link = /*#__PURE__*/function (_Inline) {
  function Link() {
    return _Inline.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(Link, _Inline);
  Link.create = function create(value) {
    var node = _Inline.create.call(this, value);
    node.setAttribute('href', this.sanitize(value));
    node.setAttribute('rel', 'noopener noreferrer');
    node.setAttribute('target', '_blank');
    return node;
  };
  Link.formats = function formats(domNode) {
    return domNode.getAttribute('href');
  };
  Link.sanitize = function sanitize(url) {
    return _sanitize(url, this.PROTOCOL_WHITELIST) ? url : this.SANITIZED_URL;
  };
  var _proto = Link.prototype;
  _proto.format = function format(name, value) {
    if (name !== this.statics.blotName || !value) {
      _Inline.prototype.format.call(this, name, value);
    } else {
      // @ts-expect-error
      this.domNode.setAttribute('href', this.constructor.sanitize(value));
    }
  };
  return Link;
}(_blots_inline_js__WEBPACK_IMPORTED_MODULE_1__["default"]);
Link.blotName = 'link';
Link.tagName = 'A';
Link.SANITIZED_URL = 'about:blank';
Link.PROTOCOL_WHITELIST = ['http', 'https', 'mailto', 'tel', 'sms'];
function _sanitize(url, protocols) {
  var anchor = document.createElement('a');
  anchor.href = url;
  var protocol = anchor.href.slice(0, anchor.href.indexOf(':'));
  return protocols.indexOf(protocol) > -1;
}


/***/ }),

/***/ "./node_modules/quill/formats/list.js":
/*!********************************************!*\
  !*** ./node_modules/quill/formats/list.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ListContainer: () => (/* binding */ ListContainer),
/* harmony export */   "default": () => (/* binding */ ListItem)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var _blots_block_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../blots/block.js */ "./node_modules/quill/blots/block.js");
/* harmony import */ var _blots_container_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../blots/container.js */ "./node_modules/quill/blots/container.js");
/* harmony import */ var _core_quill_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../core/quill.js */ "./node_modules/quill/core/quill.js");




var ListContainer = /*#__PURE__*/function (_Container) {
  function ListContainer() {
    return _Container.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(ListContainer, _Container);
  return ListContainer;
}(_blots_container_js__WEBPACK_IMPORTED_MODULE_2__["default"]);
ListContainer.blotName = 'list-container';
ListContainer.tagName = 'OL';
var ListItem = /*#__PURE__*/function (_Block) {
  function ListItem(scroll, domNode) {
    var _this;
    _this = _Block.call(this, scroll, domNode) || this;
    var ui = domNode.ownerDocument.createElement('span');
    var listEventHandler = function listEventHandler(e) {
      if (!scroll.isEnabled()) return;
      var format = _this.statics.formats(domNode, scroll);
      if (format === 'checked') {
        _this.format('list', 'unchecked');
        e.preventDefault();
      } else if (format === 'unchecked') {
        _this.format('list', 'checked');
        e.preventDefault();
      }
    };
    ui.addEventListener('mousedown', listEventHandler);
    ui.addEventListener('touchstart', listEventHandler);
    _this.attachUI(ui);
    return _this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(ListItem, _Block);
  ListItem.create = function create(value) {
    var node = _Block.create.call(this);
    node.setAttribute('data-list', value);
    return node;
  };
  ListItem.formats = function formats(domNode) {
    return domNode.getAttribute('data-list') || undefined;
  };
  ListItem.register = function register() {
    _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].register(ListContainer);
  };
  var _proto = ListItem.prototype;
  _proto.format = function format(name, value) {
    if (name === this.statics.blotName && value) {
      this.domNode.setAttribute('data-list', value);
    } else {
      _Block.prototype.format.call(this, name, value);
    }
  };
  return ListItem;
}(_blots_block_js__WEBPACK_IMPORTED_MODULE_1__["default"]);
ListItem.blotName = 'list';
ListItem.tagName = 'LI';
ListContainer.allowedChildren = [ListItem];
ListItem.requiredContainer = ListContainer;


/***/ }),

/***/ "./node_modules/quill/formats/script.js":
/*!**********************************************!*\
  !*** ./node_modules/quill/formats/script.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var _blots_inline_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../blots/inline.js */ "./node_modules/quill/blots/inline.js");


var Script = /*#__PURE__*/function (_Inline) {
  function Script() {
    return _Inline.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(Script, _Inline);
  Script.create = function create(value) {
    if (value === 'super') {
      return document.createElement('sup');
    }
    if (value === 'sub') {
      return document.createElement('sub');
    }
    return _Inline.create.call(this, value);
  };
  Script.formats = function formats(domNode) {
    if (domNode.tagName === 'SUB') return 'sub';
    if (domNode.tagName === 'SUP') return 'super';
    return undefined;
  };
  return Script;
}(_blots_inline_js__WEBPACK_IMPORTED_MODULE_1__["default"]);
Script.blotName = 'script';
Script.tagName = ['SUB', 'SUP'];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Script);

/***/ }),

/***/ "./node_modules/quill/formats/size.js":
/*!********************************************!*\
  !*** ./node_modules/quill/formats/size.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SizeClass: () => (/* binding */ SizeClass),
/* harmony export */   SizeStyle: () => (/* binding */ SizeStyle)
/* harmony export */ });
/* harmony import */ var parchment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! parchment */ "./node_modules/parchment/dist/parchment.js");

var SizeClass = new parchment__WEBPACK_IMPORTED_MODULE_0__.ClassAttributor('size', 'ql-size', {
  scope: parchment__WEBPACK_IMPORTED_MODULE_0__.Scope.INLINE,
  whitelist: ['small', 'large', 'huge']
});
var SizeStyle = new parchment__WEBPACK_IMPORTED_MODULE_0__.StyleAttributor('size', 'font-size', {
  scope: parchment__WEBPACK_IMPORTED_MODULE_0__.Scope.INLINE,
  whitelist: ['10px', '18px', '32px']
});


/***/ }),

/***/ "./node_modules/quill/formats/strike.js":
/*!**********************************************!*\
  !*** ./node_modules/quill/formats/strike.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var _bold_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./bold.js */ "./node_modules/quill/formats/bold.js");


var Strike = /*#__PURE__*/function (_Bold) {
  function Strike() {
    return _Bold.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(Strike, _Bold);
  return Strike;
}(_bold_js__WEBPACK_IMPORTED_MODULE_1__["default"]);
Strike.blotName = 'strike';
Strike.tagName = ['S', 'STRIKE'];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Strike);

/***/ }),

/***/ "./node_modules/quill/formats/table.js":
/*!*********************************************!*\
  !*** ./node_modules/quill/formats/table.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TableBody: () => (/* binding */ TableBody),
/* harmony export */   TableCell: () => (/* binding */ TableCell),
/* harmony export */   TableContainer: () => (/* binding */ TableContainer),
/* harmony export */   TableRow: () => (/* binding */ TableRow),
/* harmony export */   tableId: () => (/* binding */ tableId)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var _blots_block_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../blots/block.js */ "./node_modules/quill/blots/block.js");
/* harmony import */ var _blots_container_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../blots/container.js */ "./node_modules/quill/blots/container.js");



var TableCell = /*#__PURE__*/function (_Block) {
  function TableCell() {
    return _Block.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(TableCell, _Block);
  TableCell.create = function create(value) {
    var node = _Block.create.call(this);
    if (value) {
      node.setAttribute('data-row', value);
    } else {
      node.setAttribute('data-row', tableId());
    }
    return node;
  };
  TableCell.formats = function formats(domNode) {
    if (domNode.hasAttribute('data-row')) {
      return domNode.getAttribute('data-row');
    }
    return undefined;
  };
  var _proto = TableCell.prototype;
  _proto.cellOffset = function cellOffset() {
    if (this.parent) {
      return this.parent.children.indexOf(this);
    }
    return -1;
  };
  _proto.format = function format(name, value) {
    if (name === TableCell.blotName && value) {
      this.domNode.setAttribute('data-row', value);
    } else {
      _Block.prototype.format.call(this, name, value);
    }
  };
  _proto.row = function row() {
    return this.parent;
  };
  _proto.rowOffset = function rowOffset() {
    if (this.row()) {
      return this.row().rowOffset();
    }
    return -1;
  };
  _proto.table = function table() {
    return this.row() && this.row().table();
  };
  return TableCell;
}(_blots_block_js__WEBPACK_IMPORTED_MODULE_1__["default"]);
TableCell.blotName = 'table';
TableCell.tagName = 'TD';
var TableRow = /*#__PURE__*/function (_Container) {
  function TableRow() {
    return _Container.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(TableRow, _Container);
  var _proto2 = TableRow.prototype;
  _proto2.checkMerge = function checkMerge() {
    // @ts-expect-error
    if (_Container.prototype.checkMerge.call(this) && this.next.children.head != null) {
      // @ts-expect-error
      var thisHead = this.children.head.formats();
      // @ts-expect-error
      var thisTail = this.children.tail.formats();
      // @ts-expect-error
      var nextHead = this.next.children.head.formats();
      // @ts-expect-error
      var nextTail = this.next.children.tail.formats();
      return thisHead.table === thisTail.table && thisHead.table === nextHead.table && thisHead.table === nextTail.table;
    }
    return false;
  };
  _proto2.optimize = function optimize(context) {
    var _this = this;
    _Container.prototype.optimize.call(this, context);
    this.children.forEach(function (child) {
      if (child.next == null) return;
      var childFormats = child.formats();
      var nextFormats = child.next.formats();
      if (childFormats.table !== nextFormats.table) {
        var next = _this.splitAfter(child);
        if (next) {
          // @ts-expect-error TODO: parameters of optimize() should be a optional
          next.optimize();
        }
        // We might be able to merge with prev now
        if (_this.prev) {
          // @ts-expect-error TODO: parameters of optimize() should be a optional
          _this.prev.optimize();
        }
      }
    });
  };
  _proto2.rowOffset = function rowOffset() {
    if (this.parent) {
      return this.parent.children.indexOf(this);
    }
    return -1;
  };
  _proto2.table = function table() {
    return this.parent && this.parent.parent;
  };
  return TableRow;
}(_blots_container_js__WEBPACK_IMPORTED_MODULE_2__["default"]);
TableRow.blotName = 'table-row';
TableRow.tagName = 'TR';
var TableBody = /*#__PURE__*/function (_Container2) {
  function TableBody() {
    return _Container2.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(TableBody, _Container2);
  return TableBody;
}(_blots_container_js__WEBPACK_IMPORTED_MODULE_2__["default"]);
TableBody.blotName = 'table-body';
TableBody.tagName = 'TBODY';
var TableContainer = /*#__PURE__*/function (_Container3) {
  function TableContainer() {
    return _Container3.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(TableContainer, _Container3);
  var _proto3 = TableContainer.prototype;
  _proto3.balanceCells = function balanceCells() {
    var _this2 = this;
    var rows = this.descendants(TableRow);
    var maxColumns = rows.reduce(function (max, row) {
      return Math.max(row.children.length, max);
    }, 0);
    rows.forEach(function (row) {
      new Array(maxColumns - row.children.length).fill(0).forEach(function () {
        var value;
        if (row.children.head != null) {
          value = TableCell.formats(row.children.head.domNode);
        }
        var blot = _this2.scroll.create(TableCell.blotName, value);
        row.appendChild(blot);
        // @ts-expect-error TODO: parameters of optimize() should be a optional
        blot.optimize(); // Add break blot
      });
    });
  };
  _proto3.cells = function cells(column) {
    return this.rows().map(function (row) {
      return row.children.at(column);
    });
  };
  _proto3.deleteColumn = function deleteColumn(index) {
    // @ts-expect-error
    var _this$descendant = this.descendant(TableBody),
      body = _this$descendant[0];
    if (body == null || body.children.head == null) return;
    body.children.forEach(function (row) {
      var cell = row.children.at(index);
      if (cell != null) {
        cell.remove();
      }
    });
  };
  _proto3.insertColumn = function insertColumn(index) {
    var _this3 = this;
    // @ts-expect-error
    var _this$descendant2 = this.descendant(TableBody),
      body = _this$descendant2[0];
    if (body == null || body.children.head == null) return;
    body.children.forEach(function (row) {
      var ref = row.children.at(index);
      // @ts-expect-error
      var value = TableCell.formats(row.children.head.domNode);
      var cell = _this3.scroll.create(TableCell.blotName, value);
      row.insertBefore(cell, ref);
    });
  };
  _proto3.insertRow = function insertRow(index) {
    var _this4 = this;
    // @ts-expect-error
    var _this$descendant3 = this.descendant(TableBody),
      body = _this$descendant3[0];
    if (body == null || body.children.head == null) return;
    var id = tableId();
    var row = this.scroll.create(TableRow.blotName);
    body.children.head.children.forEach(function () {
      var cell = _this4.scroll.create(TableCell.blotName, id);
      row.appendChild(cell);
    });
    var ref = body.children.at(index);
    body.insertBefore(row, ref);
  };
  _proto3.rows = function rows() {
    var body = this.children.head;
    if (body == null) return [];
    return body.children.map(function (row) {
      return row;
    });
  };
  return TableContainer;
}(_blots_container_js__WEBPACK_IMPORTED_MODULE_2__["default"]);
TableContainer.blotName = 'table-container';
TableContainer.tagName = 'TABLE';
TableContainer.allowedChildren = [TableBody];
TableBody.requiredContainer = TableContainer;
TableBody.allowedChildren = [TableRow];
TableRow.requiredContainer = TableBody;
TableRow.allowedChildren = [TableCell];
TableCell.requiredContainer = TableRow;
function tableId() {
  var id = Math.random().toString(36).slice(2, 6);
  return "row-" + id;
}


/***/ }),

/***/ "./node_modules/quill/formats/underline.js":
/*!*************************************************!*\
  !*** ./node_modules/quill/formats/underline.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var _blots_inline_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../blots/inline.js */ "./node_modules/quill/blots/inline.js");


var Underline = /*#__PURE__*/function (_Inline) {
  function Underline() {
    return _Inline.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(Underline, _Inline);
  return Underline;
}(_blots_inline_js__WEBPACK_IMPORTED_MODULE_1__["default"]);
Underline.blotName = 'underline';
Underline.tagName = 'U';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Underline);

/***/ }),

/***/ "./node_modules/quill/formats/video.js":
/*!*********************************************!*\
  !*** ./node_modules/quill/formats/video.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var _blots_block_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../blots/block.js */ "./node_modules/quill/blots/block.js");
/* harmony import */ var _link_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./link.js */ "./node_modules/quill/formats/link.js");



var ATTRIBUTES = ['height', 'width'];
var Video = /*#__PURE__*/function (_BlockEmbed) {
  function Video() {
    return _BlockEmbed.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(Video, _BlockEmbed);
  Video.create = function create(value) {
    var node = _BlockEmbed.create.call(this, value);
    node.setAttribute('frameborder', '0');
    node.setAttribute('allowfullscreen', 'true');
    node.setAttribute('src', this.sanitize(value));
    return node;
  };
  Video.formats = function formats(domNode) {
    return ATTRIBUTES.reduce(function (formats, attribute) {
      if (domNode.hasAttribute(attribute)) {
        formats[attribute] = domNode.getAttribute(attribute);
      }
      return formats;
    }, {});
  };
  Video.sanitize = function sanitize(url) {
    return _link_js__WEBPACK_IMPORTED_MODULE_2__["default"].sanitize(url);
  };
  Video.value = function value(domNode) {
    return domNode.getAttribute('src');
  };
  var _proto = Video.prototype;
  _proto.format = function format(name, value) {
    if (ATTRIBUTES.indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name);
      }
    } else {
      _BlockEmbed.prototype.format.call(this, name, value);
    }
  };
  _proto.html = function html() {
    var _this$value = this.value(),
      video = _this$value.video;
    return "<a href=\"" + video + "\">" + video + "</a>";
  };
  return Video;
}(_blots_block_js__WEBPACK_IMPORTED_MODULE_1__.BlockEmbed);
Video.blotName = 'video';
Video.className = 'ql-video';
Video.tagName = 'IFRAME';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Video);

/***/ }),

/***/ "./node_modules/quill/modules/clipboard.js":
/*!*************************************************!*\
  !*** ./node_modules/quill/modules/clipboard.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Clipboard),
/* harmony export */   matchAttributor: () => (/* binding */ matchAttributor),
/* harmony export */   matchBlot: () => (/* binding */ matchBlot),
/* harmony export */   matchNewline: () => (/* binding */ matchNewline),
/* harmony export */   matchText: () => (/* binding */ matchText),
/* harmony export */   traverse: () => (/* binding */ traverse)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var parchment__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! parchment */ "./node_modules/parchment/dist/parchment.js");
/* harmony import */ var quill_delta__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! quill-delta */ "./node_modules/quill-delta/dist/Delta.js");
/* harmony import */ var _blots_block_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../blots/block.js */ "./node_modules/quill/blots/block.js");
/* harmony import */ var _core_logger_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../core/logger.js */ "./node_modules/quill/core/logger.js");
/* harmony import */ var _core_module_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../core/module.js */ "./node_modules/quill/core/module.js");
/* harmony import */ var _core_quill_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../core/quill.js */ "./node_modules/quill/core/quill.js");
/* harmony import */ var _formats_align_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../formats/align.js */ "./node_modules/quill/formats/align.js");
/* harmony import */ var _formats_background_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../formats/background.js */ "./node_modules/quill/formats/background.js");
/* harmony import */ var _formats_code_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../formats/code.js */ "./node_modules/quill/formats/code.js");
/* harmony import */ var _formats_color_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../formats/color.js */ "./node_modules/quill/formats/color.js");
/* harmony import */ var _formats_direction_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../formats/direction.js */ "./node_modules/quill/formats/direction.js");
/* harmony import */ var _formats_font_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../formats/font.js */ "./node_modules/quill/formats/font.js");
/* harmony import */ var _formats_size_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../formats/size.js */ "./node_modules/quill/formats/size.js");
/* harmony import */ var _keyboard_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./keyboard.js */ "./node_modules/quill/modules/keyboard.js");
/* harmony import */ var _normalizeExternalHTML_index_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./normalizeExternalHTML/index.js */ "./node_modules/quill/modules/normalizeExternalHTML/index.js");

















var debug = (0,_core_logger_js__WEBPACK_IMPORTED_MODULE_4__["default"])('quill:clipboard');
var CLIPBOARD_CONFIG = [[Node.TEXT_NODE, matchText], [Node.TEXT_NODE, matchNewline], ['br', matchBreak], [Node.ELEMENT_NODE, matchNewline], [Node.ELEMENT_NODE, matchBlot], [Node.ELEMENT_NODE, matchAttributor], [Node.ELEMENT_NODE, matchStyles], ['li', matchIndent], ['ol, ul', matchList], ['pre', matchCodeBlock], ['tr', matchTable], ['b', createMatchAlias('bold')], ['i', createMatchAlias('italic')], ['strike', createMatchAlias('strike')], ['style', matchIgnore]];
var ATTRIBUTE_ATTRIBUTORS = [_formats_align_js__WEBPACK_IMPORTED_MODULE_7__.AlignAttribute, _formats_direction_js__WEBPACK_IMPORTED_MODULE_11__.DirectionAttribute].reduce(function (memo, attr) {
  memo[attr.keyName] = attr;
  return memo;
}, {});
var STYLE_ATTRIBUTORS = [_formats_align_js__WEBPACK_IMPORTED_MODULE_7__.AlignStyle, _formats_background_js__WEBPACK_IMPORTED_MODULE_8__.BackgroundStyle, _formats_color_js__WEBPACK_IMPORTED_MODULE_10__.ColorStyle, _formats_direction_js__WEBPACK_IMPORTED_MODULE_11__.DirectionStyle, _formats_font_js__WEBPACK_IMPORTED_MODULE_12__.FontStyle, _formats_size_js__WEBPACK_IMPORTED_MODULE_13__.SizeStyle].reduce(function (memo, attr) {
  memo[attr.keyName] = attr;
  return memo;
}, {});
var Clipboard = /*#__PURE__*/function (_Module) {
  function Clipboard(quill, options) {
    var _this$options$matcher;
    var _this;
    _this = _Module.call(this, quill, options) || this;
    _this.quill.root.addEventListener('copy', function (e) {
      return _this.onCaptureCopy(e, false);
    });
    _this.quill.root.addEventListener('cut', function (e) {
      return _this.onCaptureCopy(e, true);
    });
    _this.quill.root.addEventListener('paste', _this.onCapturePaste.bind(_this));
    _this.matchers = [];
    CLIPBOARD_CONFIG.concat((_this$options$matcher = _this.options.matchers) != null ? _this$options$matcher : []).forEach(function (_ref) {
      var selector = _ref[0],
        matcher = _ref[1];
      _this.addMatcher(selector, matcher);
    });
    return _this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__["default"])(Clipboard, _Module);
  var _proto = Clipboard.prototype;
  _proto.addMatcher = function addMatcher(selector, matcher) {
    this.matchers.push([selector, matcher]);
  };
  _proto.convert = function convert(_ref2) {
    var html = _ref2.html,
      text = _ref2.text;
    var formats = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (formats[_formats_code_js__WEBPACK_IMPORTED_MODULE_9__["default"].blotName]) {
      var _Delta$insert;
      return new quill_delta__WEBPACK_IMPORTED_MODULE_2__().insert(text || '', (_Delta$insert = {}, _Delta$insert[_formats_code_js__WEBPACK_IMPORTED_MODULE_9__["default"].blotName] = formats[_formats_code_js__WEBPACK_IMPORTED_MODULE_9__["default"].blotName], _Delta$insert));
    }
    if (!html) {
      return new quill_delta__WEBPACK_IMPORTED_MODULE_2__().insert(text || '', formats);
    }
    var delta = this.convertHTML(html);
    // Remove trailing newline
    if (deltaEndsWith(delta, '\n') && (delta.ops[delta.ops.length - 1].attributes == null || formats.table)) {
      return delta.compose(new quill_delta__WEBPACK_IMPORTED_MODULE_2__().retain(delta.length() - 1)["delete"](1));
    }
    return delta;
  };
  _proto.normalizeHTML = function normalizeHTML(doc) {
    (0,_normalizeExternalHTML_index_js__WEBPACK_IMPORTED_MODULE_15__["default"])(doc);
  };
  _proto.convertHTML = function convertHTML(html) {
    var doc = new DOMParser().parseFromString(html, 'text/html');
    this.normalizeHTML(doc);
    var container = doc.body;
    var nodeMatches = new WeakMap();
    var _this$prepareMatching = this.prepareMatching(container, nodeMatches),
      elementMatchers = _this$prepareMatching[0],
      textMatchers = _this$prepareMatching[1];
    return traverse(this.quill.scroll, container, elementMatchers, textMatchers, nodeMatches);
  };
  _proto.dangerouslyPasteHTML = function dangerouslyPasteHTML(index, html) {
    var source = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _core_quill_js__WEBPACK_IMPORTED_MODULE_6__["default"].sources.API;
    if (typeof index === 'string') {
      var delta = this.convert({
        html: index,
        text: ''
      });
      // @ts-expect-error
      this.quill.setContents(delta, html);
      this.quill.setSelection(0, _core_quill_js__WEBPACK_IMPORTED_MODULE_6__["default"].sources.SILENT);
    } else {
      var paste = this.convert({
        html: html,
        text: ''
      });
      this.quill.updateContents(new quill_delta__WEBPACK_IMPORTED_MODULE_2__().retain(index).concat(paste), source);
      this.quill.setSelection(index + paste.length(), _core_quill_js__WEBPACK_IMPORTED_MODULE_6__["default"].sources.SILENT);
    }
  };
  _proto.onCaptureCopy = function onCaptureCopy(e) {
    var _e$clipboardData, _e$clipboardData2;
    var isCut = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    if (e.defaultPrevented) return;
    e.preventDefault();
    var _this$quill$selection = this.quill.selection.getRange(),
      range = _this$quill$selection[0];
    if (range == null) return;
    var _this$onCopy = this.onCopy(range, isCut),
      html = _this$onCopy.html,
      text = _this$onCopy.text;
    (_e$clipboardData = e.clipboardData) == null || _e$clipboardData.setData('text/plain', text);
    (_e$clipboardData2 = e.clipboardData) == null || _e$clipboardData2.setData('text/html', html);
    if (isCut) {
      (0,_keyboard_js__WEBPACK_IMPORTED_MODULE_14__.deleteRange)({
        range: range,
        quill: this.quill
      });
    }
  }

  /*
   * https://www.iana.org/assignments/media-types/text/uri-list
   */;
  _proto.normalizeURIList = function normalizeURIList(urlList) {
    return urlList.split(/\r?\n/)
    // Ignore all comments
    .filter(function (url) {
      return url[0] !== '#';
    }).join('\n');
  };
  _proto.onCapturePaste = function onCapturePaste(e) {
    var _e$clipboardData3, _e$clipboardData4, _e$clipboardData6;
    if (e.defaultPrevented || !this.quill.isEnabled()) return;
    e.preventDefault();
    var range = this.quill.getSelection(true);
    if (range == null) return;
    var html = (_e$clipboardData3 = e.clipboardData) == null ? void 0 : _e$clipboardData3.getData('text/html');
    var text = (_e$clipboardData4 = e.clipboardData) == null ? void 0 : _e$clipboardData4.getData('text/plain');
    if (!html && !text) {
      var _e$clipboardData5;
      var urlList = (_e$clipboardData5 = e.clipboardData) == null ? void 0 : _e$clipboardData5.getData('text/uri-list');
      if (urlList) {
        text = this.normalizeURIList(urlList);
      }
    }
    var files = Array.from(((_e$clipboardData6 = e.clipboardData) == null ? void 0 : _e$clipboardData6.files) || []);
    if (!html && files.length > 0) {
      this.quill.uploader.upload(range, files);
      return;
    }
    if (html && files.length > 0) {
      var _doc$body$firstElemen;
      var doc = new DOMParser().parseFromString(html, 'text/html');
      if (doc.body.childElementCount === 1 && ((_doc$body$firstElemen = doc.body.firstElementChild) == null ? void 0 : _doc$body$firstElemen.tagName) === 'IMG') {
        this.quill.uploader.upload(range, files);
        return;
      }
    }
    this.onPaste(range, {
      html: html,
      text: text
    });
  };
  _proto.onCopy = function onCopy(range) {
    var text = this.quill.getText(range);
    var html = this.quill.getSemanticHTML(range);
    return {
      html: html,
      text: text
    };
  };
  _proto.onPaste = function onPaste(range, _ref3) {
    var text = _ref3.text,
      html = _ref3.html;
    var formats = this.quill.getFormat(range.index);
    var pastedDelta = this.convert({
      text: text,
      html: html
    }, formats);
    debug.log('onPaste', pastedDelta, {
      text: text,
      html: html
    });
    var delta = new quill_delta__WEBPACK_IMPORTED_MODULE_2__().retain(range.index)["delete"](range.length).concat(pastedDelta);
    this.quill.updateContents(delta, _core_quill_js__WEBPACK_IMPORTED_MODULE_6__["default"].sources.USER);
    // range.length contributes to delta.length()
    this.quill.setSelection(delta.length() - range.length, _core_quill_js__WEBPACK_IMPORTED_MODULE_6__["default"].sources.SILENT);
    this.quill.scrollSelectionIntoView();
  };
  _proto.prepareMatching = function prepareMatching(container, nodeMatches) {
    var elementMatchers = [];
    var textMatchers = [];
    this.matchers.forEach(function (pair) {
      var selector = pair[0],
        matcher = pair[1];
      switch (selector) {
        case Node.TEXT_NODE:
          textMatchers.push(matcher);
          break;
        case Node.ELEMENT_NODE:
          elementMatchers.push(matcher);
          break;
        default:
          Array.from(container.querySelectorAll(selector)).forEach(function (node) {
            if (nodeMatches.has(node)) {
              var matches = nodeMatches.get(node);
              matches == null || matches.push(matcher);
            } else {
              nodeMatches.set(node, [matcher]);
            }
          });
          break;
      }
    });
    return [elementMatchers, textMatchers];
  };
  return Clipboard;
}(_core_module_js__WEBPACK_IMPORTED_MODULE_5__["default"]);
Clipboard.DEFAULTS = {
  matchers: []
};
function applyFormat(delta, format, value, scroll) {
  if (!scroll.query(format)) {
    return delta;
  }
  return delta.reduce(function (newDelta, op) {
    var _ref6;
    if (!op.insert) return newDelta;
    if (op.attributes && op.attributes[format]) {
      return newDelta.push(op);
    }
    var formats = value ? (_ref6 = {}, _ref6[format] = value, _ref6) : {};
    return newDelta.insert(op.insert, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, formats, op.attributes));
  }, new quill_delta__WEBPACK_IMPORTED_MODULE_2__());
}
function deltaEndsWith(delta, text) {
  var endText = '';
  for (var i = delta.ops.length - 1; i >= 0 && endText.length < text.length; --i // eslint-disable-line no-plusplus
  ) {
    var op = delta.ops[i];
    if (typeof op.insert !== 'string') break;
    endText = op.insert + endText;
  }
  return endText.slice(-1 * text.length) === text;
}
function isLine(node, scroll) {
  if (!(node instanceof Element)) return false;
  var match = scroll.query(node);
  // @ts-expect-error
  if (match && match.prototype instanceof parchment__WEBPACK_IMPORTED_MODULE_16__.EmbedBlot) return false;
  return ['address', 'article', 'blockquote', 'canvas', 'dd', 'div', 'dl', 'dt', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'iframe', 'li', 'main', 'nav', 'ol', 'output', 'p', 'pre', 'section', 'table', 'td', 'tr', 'ul', 'video'].includes(node.tagName.toLowerCase());
}
function isBetweenInlineElements(node, scroll) {
  return node.previousElementSibling && node.nextElementSibling && !isLine(node.previousElementSibling, scroll) && !isLine(node.nextElementSibling, scroll);
}
var preNodes = new WeakMap();
function isPre(node) {
  if (node == null) return false;
  if (!preNodes.has(node)) {
    // @ts-expect-error
    if (node.tagName === 'PRE') {
      preNodes.set(node, true);
    } else {
      preNodes.set(node, isPre(node.parentNode));
    }
  }
  return preNodes.get(node);
}
function traverse(scroll, node, elementMatchers, textMatchers, nodeMatches) {
  // Post-order
  if (node.nodeType === node.TEXT_NODE) {
    return textMatchers.reduce(function (delta, matcher) {
      return matcher(node, delta, scroll);
    }, new quill_delta__WEBPACK_IMPORTED_MODULE_2__());
  }
  if (node.nodeType === node.ELEMENT_NODE) {
    return Array.from(node.childNodes || []).reduce(function (delta, childNode) {
      var childrenDelta = traverse(scroll, childNode, elementMatchers, textMatchers, nodeMatches);
      if (childNode.nodeType === node.ELEMENT_NODE) {
        childrenDelta = elementMatchers.reduce(function (reducedDelta, matcher) {
          return matcher(childNode, reducedDelta, scroll);
        }, childrenDelta);
        childrenDelta = (nodeMatches.get(childNode) || []).reduce(function (reducedDelta, matcher) {
          return matcher(childNode, reducedDelta, scroll);
        }, childrenDelta);
      }
      return delta.concat(childrenDelta);
    }, new quill_delta__WEBPACK_IMPORTED_MODULE_2__());
  }
  return new quill_delta__WEBPACK_IMPORTED_MODULE_2__();
}
function createMatchAlias(format) {
  return function (_node, delta, scroll) {
    return applyFormat(delta, format, true, scroll);
  };
}
function matchAttributor(node, delta, scroll) {
  var attributes = parchment__WEBPACK_IMPORTED_MODULE_16__.Attributor.keys(node);
  var classes = parchment__WEBPACK_IMPORTED_MODULE_16__.ClassAttributor.keys(node);
  var styles = parchment__WEBPACK_IMPORTED_MODULE_16__.StyleAttributor.keys(node);
  var formats = {};
  attributes.concat(classes).concat(styles).forEach(function (name) {
    var attr = scroll.query(name, parchment__WEBPACK_IMPORTED_MODULE_16__.Scope.ATTRIBUTE);
    if (attr != null) {
      formats[attr.attrName] = attr.value(node);
      if (formats[attr.attrName]) return;
    }
    attr = ATTRIBUTE_ATTRIBUTORS[name];
    if (attr != null && (attr.attrName === name || attr.keyName === name)) {
      formats[attr.attrName] = attr.value(node) || undefined;
    }
    attr = STYLE_ATTRIBUTORS[name];
    if (attr != null && (attr.attrName === name || attr.keyName === name)) {
      attr = STYLE_ATTRIBUTORS[name];
      formats[attr.attrName] = attr.value(node) || undefined;
    }
  });
  return Object.entries(formats).reduce(function (newDelta, _ref4) {
    var name = _ref4[0],
      value = _ref4[1];
    return applyFormat(newDelta, name, value, scroll);
  }, delta);
}
function matchBlot(node, delta, scroll) {
  var match = scroll.query(node);
  if (match == null) return delta;
  // @ts-expect-error
  if (match.prototype instanceof parchment__WEBPACK_IMPORTED_MODULE_16__.EmbedBlot) {
    var embed = {};
    // @ts-expect-error
    var value = match.value(node);
    if (value != null) {
      // @ts-expect-error
      embed[match.blotName] = value;
      // @ts-expect-error
      return new quill_delta__WEBPACK_IMPORTED_MODULE_2__().insert(embed, match.formats(node, scroll));
    }
  } else {
    // @ts-expect-error
    if (match.prototype instanceof parchment__WEBPACK_IMPORTED_MODULE_16__.BlockBlot && !deltaEndsWith(delta, '\n')) {
      delta.insert('\n');
    }
    if ('blotName' in match && 'formats' in match && typeof match.formats === 'function') {
      return applyFormat(delta, match.blotName, match.formats(node, scroll), scroll);
    }
  }
  return delta;
}
function matchBreak(node, delta) {
  if (!deltaEndsWith(delta, '\n')) {
    delta.insert('\n');
  }
  return delta;
}
function matchCodeBlock(node, delta, scroll) {
  var match = scroll.query('code-block');
  var language = match && 'formats' in match && typeof match.formats === 'function' ? match.formats(node, scroll) : true;
  return applyFormat(delta, 'code-block', language, scroll);
}
function matchIgnore() {
  return new quill_delta__WEBPACK_IMPORTED_MODULE_2__();
}
function matchIndent(node, delta, scroll) {
  var match = scroll.query(node);
  if (match == null ||
  // @ts-expect-error
  match.blotName !== 'list' || !deltaEndsWith(delta, '\n')) {
    return delta;
  }
  var indent = -1;
  var parent = node.parentNode;
  while (parent != null) {
    // @ts-expect-error
    if (['OL', 'UL'].includes(parent.tagName)) {
      indent += 1;
    }
    parent = parent.parentNode;
  }
  if (indent <= 0) return delta;
  return delta.reduce(function (composed, op) {
    if (!op.insert) return composed;
    if (op.attributes && typeof op.attributes.indent === 'number') {
      return composed.push(op);
    }
    return composed.insert(op.insert, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
      indent: indent
    }, op.attributes || {}));
  }, new quill_delta__WEBPACK_IMPORTED_MODULE_2__());
}
function matchList(node, delta, scroll) {
  var element = node;
  var list = element.tagName === 'OL' ? 'ordered' : 'bullet';
  var checkedAttr = element.getAttribute('data-checked');
  if (checkedAttr) {
    list = checkedAttr === 'true' ? 'checked' : 'unchecked';
  }
  return applyFormat(delta, 'list', list, scroll);
}
function matchNewline(node, delta, scroll) {
  if (!deltaEndsWith(delta, '\n')) {
    if (isLine(node, scroll) && (node.childNodes.length > 0 || node instanceof HTMLParagraphElement)) {
      return delta.insert('\n');
    }
    if (delta.length() > 0 && node.nextSibling) {
      var nextSibling = node.nextSibling;
      while (nextSibling != null) {
        if (isLine(nextSibling, scroll)) {
          return delta.insert('\n');
        }
        var match = scroll.query(nextSibling);
        // @ts-expect-error
        if (match && match.prototype instanceof _blots_block_js__WEBPACK_IMPORTED_MODULE_3__.BlockEmbed) {
          return delta.insert('\n');
        }
        nextSibling = nextSibling.firstChild;
      }
    }
  }
  return delta;
}
function matchStyles(node, delta, scroll) {
  var _style$fontWeight;
  var formats = {};
  var style = node.style || {};
  if (style.fontStyle === 'italic') {
    formats.italic = true;
  }
  if (style.textDecoration === 'underline') {
    formats.underline = true;
  }
  if (style.textDecoration === 'line-through') {
    formats.strike = true;
  }
  if ((_style$fontWeight = style.fontWeight) != null && _style$fontWeight.startsWith('bold') ||
  // @ts-expect-error Fix me later
  parseInt(style.fontWeight, 10) >= 700) {
    formats.bold = true;
  }
  delta = Object.entries(formats).reduce(function (newDelta, _ref5) {
    var name = _ref5[0],
      value = _ref5[1];
    return applyFormat(newDelta, name, value, scroll);
  }, delta);
  // @ts-expect-error
  if (parseFloat(style.textIndent || 0) > 0) {
    // Could be 0.5in
    return new quill_delta__WEBPACK_IMPORTED_MODULE_2__().insert('\t').concat(delta);
  }
  return delta;
}
function matchTable(node, delta, scroll) {
  var _node$parentElement, _node$parentElement2;
  var table = ((_node$parentElement = node.parentElement) == null ? void 0 : _node$parentElement.tagName) === 'TABLE' ? node.parentElement : (_node$parentElement2 = node.parentElement) == null ? void 0 : _node$parentElement2.parentElement;
  if (table != null) {
    var rows = Array.from(table.querySelectorAll('tr'));
    var row = rows.indexOf(node) + 1;
    return applyFormat(delta, 'table', row, scroll);
  }
  return delta;
}
function matchText(node, delta, scroll) {
  var _node$parentElement3;
  // @ts-expect-error
  var text = node.data;
  // Word represents empty line with <o:p>&nbsp;</o:p>
  if (((_node$parentElement3 = node.parentElement) == null ? void 0 : _node$parentElement3.tagName) === 'O:P') {
    return delta.insert(text.trim());
  }
  if (!isPre(node)) {
    if (text.trim().length === 0 && text.includes('\n') && !isBetweenInlineElements(node, scroll)) {
      return delta;
    }
    // convert all non-nbsp whitespace into regular space
    text = text.replace(/[^\S\u00a0]/g, ' ');
    // collapse consecutive spaces into one
    text = text.replace(/ {2,}/g, ' ');
    if (node.previousSibling == null && node.parentElement != null && isLine(node.parentElement, scroll) || node.previousSibling instanceof Element && isLine(node.previousSibling, scroll)) {
      // block structure means we don't need leading space
      text = text.replace(/^ /, '');
    }
    if (node.nextSibling == null && node.parentElement != null && isLine(node.parentElement, scroll) || node.nextSibling instanceof Element && isLine(node.nextSibling, scroll)) {
      // block structure means we don't need trailing space
      text = text.replace(/ $/, '');
    }
    // done removing whitespace and can normalize all to regular space
    text = text.replaceAll("\xA0", ' ');
  }
  return delta.insert(text);
}


/***/ }),

/***/ "./node_modules/quill/modules/history.js":
/*!***********************************************!*\
  !*** ./node_modules/quill/modules/history.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ History),
/* harmony export */   getLastChangeIndex: () => (/* binding */ getLastChangeIndex)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var parchment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! parchment */ "./node_modules/parchment/dist/parchment.js");
/* harmony import */ var _core_module_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/module.js */ "./node_modules/quill/core/module.js");
/* harmony import */ var _core_quill_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/quill.js */ "./node_modules/quill/core/quill.js");




var History = /*#__PURE__*/function (_Module) {
  function History(quill, options) {
    var _this;
    _this = _Module.call(this, quill, options) || this;
    _this.lastRecorded = 0;
    _this.ignoreChange = false;
    _this.stack = {
      undo: [],
      redo: []
    };
    _this.currentRange = null;
    _this.quill.on(_core_quill_js__WEBPACK_IMPORTED_MODULE_2__["default"].events.EDITOR_CHANGE, function (eventName, value, oldValue, source) {
      if (eventName === _core_quill_js__WEBPACK_IMPORTED_MODULE_2__["default"].events.SELECTION_CHANGE) {
        if (value && source !== _core_quill_js__WEBPACK_IMPORTED_MODULE_2__["default"].sources.SILENT) {
          _this.currentRange = value;
        }
      } else if (eventName === _core_quill_js__WEBPACK_IMPORTED_MODULE_2__["default"].events.TEXT_CHANGE) {
        if (!_this.ignoreChange) {
          if (!_this.options.userOnly || source === _core_quill_js__WEBPACK_IMPORTED_MODULE_2__["default"].sources.USER) {
            _this.record(value, oldValue);
          } else {
            _this.transform(value);
          }
        }
        _this.currentRange = transformRange(_this.currentRange, value);
      }
    });
    _this.quill.keyboard.addBinding({
      key: 'z',
      shortKey: true
    }, _this.undo.bind(_this));
    _this.quill.keyboard.addBinding({
      key: ['z', 'Z'],
      shortKey: true,
      shiftKey: true
    }, _this.redo.bind(_this));
    if (/Win/i.test(navigator.platform)) {
      _this.quill.keyboard.addBinding({
        key: 'y',
        shortKey: true
      }, _this.redo.bind(_this));
    }
    _this.quill.root.addEventListener('beforeinput', function (event) {
      if (event.inputType === 'historyUndo') {
        _this.undo();
        event.preventDefault();
      } else if (event.inputType === 'historyRedo') {
        _this.redo();
        event.preventDefault();
      }
    });
    return _this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(History, _Module);
  var _proto = History.prototype;
  _proto.change = function change(source, dest) {
    if (this.stack[source].length === 0) return;
    var item = this.stack[source].pop();
    if (!item) return;
    var base = this.quill.getContents();
    var inverseDelta = item.delta.invert(base);
    this.stack[dest].push({
      delta: inverseDelta,
      range: transformRange(item.range, inverseDelta)
    });
    this.lastRecorded = 0;
    this.ignoreChange = true;
    this.quill.updateContents(item.delta, _core_quill_js__WEBPACK_IMPORTED_MODULE_2__["default"].sources.USER);
    this.ignoreChange = false;
    this.restoreSelection(item);
  };
  _proto.clear = function clear() {
    this.stack = {
      undo: [],
      redo: []
    };
  };
  _proto.cutoff = function cutoff() {
    this.lastRecorded = 0;
  };
  _proto.record = function record(changeDelta, oldDelta) {
    if (changeDelta.ops.length === 0) return;
    this.stack.redo = [];
    var undoDelta = changeDelta.invert(oldDelta);
    var undoRange = this.currentRange;
    var timestamp = Date.now();
    if (
    // @ts-expect-error Fix me later
    this.lastRecorded + this.options.delay > timestamp && this.stack.undo.length > 0) {
      var item = this.stack.undo.pop();
      if (item) {
        undoDelta = undoDelta.compose(item.delta);
        undoRange = item.range;
      }
    } else {
      this.lastRecorded = timestamp;
    }
    if (undoDelta.length() === 0) return;
    this.stack.undo.push({
      delta: undoDelta,
      range: undoRange
    });
    // @ts-expect-error Fix me later
    if (this.stack.undo.length > this.options.maxStack) {
      this.stack.undo.shift();
    }
  };
  _proto.redo = function redo() {
    this.change('redo', 'undo');
  };
  _proto.transform = function transform(delta) {
    transformStack(this.stack.undo, delta);
    transformStack(this.stack.redo, delta);
  };
  _proto.undo = function undo() {
    this.change('undo', 'redo');
  };
  _proto.restoreSelection = function restoreSelection(stackItem) {
    if (stackItem.range) {
      this.quill.setSelection(stackItem.range, _core_quill_js__WEBPACK_IMPORTED_MODULE_2__["default"].sources.USER);
    } else {
      var index = getLastChangeIndex(this.quill.scroll, stackItem.delta);
      this.quill.setSelection(index, _core_quill_js__WEBPACK_IMPORTED_MODULE_2__["default"].sources.USER);
    }
  };
  return History;
}(_core_module_js__WEBPACK_IMPORTED_MODULE_1__["default"]);
History.DEFAULTS = {
  delay: 1000,
  maxStack: 100,
  userOnly: false
};
function transformStack(stack, delta) {
  var remoteDelta = delta;
  for (var i = stack.length - 1; i >= 0; i -= 1) {
    var oldItem = stack[i];
    stack[i] = {
      delta: remoteDelta.transform(oldItem.delta, true),
      range: oldItem.range && transformRange(oldItem.range, remoteDelta)
    };
    remoteDelta = oldItem.delta.transform(remoteDelta);
    if (stack[i].delta.length() === 0) {
      stack.splice(i, 1);
    }
  }
}
function endsWithNewlineChange(scroll, delta) {
  var lastOp = delta.ops[delta.ops.length - 1];
  if (lastOp == null) return false;
  if (lastOp.insert != null) {
    return typeof lastOp.insert === 'string' && lastOp.insert.endsWith('\n');
  }
  if (lastOp.attributes != null) {
    return Object.keys(lastOp.attributes).some(function (attr) {
      return scroll.query(attr, parchment__WEBPACK_IMPORTED_MODULE_3__.Scope.BLOCK) != null;
    });
  }
  return false;
}
function getLastChangeIndex(scroll, delta) {
  var deleteLength = delta.reduce(function (length, op) {
    return length + (op["delete"] || 0);
  }, 0);
  var changeIndex = delta.length() - deleteLength;
  if (endsWithNewlineChange(scroll, delta)) {
    changeIndex -= 1;
  }
  return changeIndex;
}
function transformRange(range, delta) {
  if (!range) return range;
  var start = delta.transformPosition(range.index);
  var end = delta.transformPosition(range.index + range.length);
  return {
    index: start,
    length: end - start
  };
}


/***/ }),

/***/ "./node_modules/quill/modules/input.js":
/*!*********************************************!*\
  !*** ./node_modules/quill/modules/input.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var quill_delta__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! quill-delta */ "./node_modules/quill-delta/dist/Delta.js");
/* harmony import */ var _core_module_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/module.js */ "./node_modules/quill/core/module.js");
/* harmony import */ var _core_quill_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../core/quill.js */ "./node_modules/quill/core/quill.js");
/* harmony import */ var _keyboard_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./keyboard.js */ "./node_modules/quill/modules/keyboard.js");





var INSERT_TYPES = ['insertText', 'insertReplacementText'];
var Input = /*#__PURE__*/function (_Module) {
  function Input(quill, options) {
    var _this;
    _this = _Module.call(this, quill, options) || this;
    quill.root.addEventListener('beforeinput', function (event) {
      _this.handleBeforeInput(event);
    });

    // Gboard with English input on Android triggers `compositionstart` sometimes even
    // users are not going to type anything.
    if (!/Android/i.test(navigator.userAgent)) {
      quill.on(_core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].events.COMPOSITION_BEFORE_START, function () {
        _this.handleCompositionStart();
      });
    }
    return _this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(Input, _Module);
  var _proto = Input.prototype;
  _proto.deleteRange = function deleteRange(range) {
    (0,_keyboard_js__WEBPACK_IMPORTED_MODULE_4__.deleteRange)({
      range: range,
      quill: this.quill
    });
  };
  _proto.replaceText = function replaceText(range) {
    var text = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    if (range.length === 0) return false;
    if (text) {
      // Follow the native behavior that inherits the formats of the first character
      var formats = this.quill.getFormat(range.index, 1);
      this.deleteRange(range);
      this.quill.updateContents(new quill_delta__WEBPACK_IMPORTED_MODULE_1__().retain(range.index).insert(text, formats), _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.USER);
    } else {
      this.deleteRange(range);
    }
    this.quill.setSelection(range.index + text.length, 0, _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.SILENT);
    return true;
  };
  _proto.handleBeforeInput = function handleBeforeInput(event) {
    if (this.quill.composition.isComposing || event.defaultPrevented || !INSERT_TYPES.includes(event.inputType)) {
      return;
    }
    var staticRange = event.getTargetRanges ? event.getTargetRanges()[0] : null;
    if (!staticRange || staticRange.collapsed === true) {
      return;
    }
    var text = getPlainTextFromInputEvent(event);
    if (text == null) {
      return;
    }
    var normalized = this.quill.selection.normalizeNative(staticRange);
    var range = normalized ? this.quill.selection.normalizedToRange(normalized) : null;
    if (range && this.replaceText(range, text)) {
      event.preventDefault();
    }
  };
  _proto.handleCompositionStart = function handleCompositionStart() {
    var range = this.quill.getSelection();
    if (range) {
      this.replaceText(range);
    }
  };
  return Input;
}(_core_module_js__WEBPACK_IMPORTED_MODULE_2__["default"]);
function getPlainTextFromInputEvent(event) {
  var _event$dataTransfer;
  // When `inputType` is "insertText":
  // - `event.data` should be string (Safari uses `event.dataTransfer`).
  // - `event.dataTransfer` should be null.
  // When `inputType` is "insertReplacementText":
  // - `event.data` should be null.
  // - `event.dataTransfer` should contain "text/plain" data.

  if (typeof event.data === 'string') {
    return event.data;
  }
  if ((_event$dataTransfer = event.dataTransfer) != null && _event$dataTransfer.types.includes('text/plain')) {
    return event.dataTransfer.getData('text/plain');
  }
  return null;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Input);

/***/ }),

/***/ "./node_modules/quill/modules/keyboard.js":
/*!************************************************!*\
  !*** ./node_modules/quill/modules/keyboard.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SHORTKEY: () => (/* binding */ SHORTKEY),
/* harmony export */   "default": () => (/* binding */ Keyboard),
/* harmony export */   deleteRange: () => (/* binding */ deleteRange),
/* harmony export */   normalize: () => (/* binding */ normalize)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/isEqual.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/cloneDeep.js");
/* harmony import */ var quill_delta__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! quill-delta */ "./node_modules/quill-delta/dist/Delta.js");
/* harmony import */ var parchment__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! parchment */ "./node_modules/parchment/dist/parchment.js");
/* harmony import */ var _core_quill_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../core/quill.js */ "./node_modules/quill/core/quill.js");
/* harmony import */ var _core_logger_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../core/logger.js */ "./node_modules/quill/core/logger.js");
/* harmony import */ var _core_module_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../core/module.js */ "./node_modules/quill/core/module.js");








var debug = (0,_core_logger_js__WEBPACK_IMPORTED_MODULE_4__["default"])('quill:keyboard');
var SHORTKEY = /Mac/i.test(navigator.platform) ? 'metaKey' : 'ctrlKey';
var Keyboard = /*#__PURE__*/function (_Module) {
  function Keyboard(quill, options) {
    var _this;
    _this = _Module.call(this, quill, options) || this;
    _this.bindings = {};
    // @ts-expect-error Fix me later
    Object.keys(_this.options.bindings).forEach(function (name) {
      // @ts-expect-error Fix me later
      if (_this.options.bindings[name]) {
        // @ts-expect-error Fix me later
        _this.addBinding(_this.options.bindings[name]);
      }
    });
    _this.addBinding({
      key: 'Enter',
      shiftKey: null
    }, _this.handleEnter);
    _this.addBinding({
      key: 'Enter',
      metaKey: null,
      ctrlKey: null,
      altKey: null
    }, function () {});
    if (/Firefox/i.test(navigator.userAgent)) {
      // Need to handle delete and backspace for Firefox in the general case #1171
      _this.addBinding({
        key: 'Backspace'
      }, {
        collapsed: true
      }, _this.handleBackspace);
      _this.addBinding({
        key: 'Delete'
      }, {
        collapsed: true
      }, _this.handleDelete);
    } else {
      _this.addBinding({
        key: 'Backspace'
      }, {
        collapsed: true,
        prefix: /^.?$/
      }, _this.handleBackspace);
      _this.addBinding({
        key: 'Delete'
      }, {
        collapsed: true,
        suffix: /^.?$/
      }, _this.handleDelete);
    }
    _this.addBinding({
      key: 'Backspace'
    }, {
      collapsed: false
    }, _this.handleDeleteRange);
    _this.addBinding({
      key: 'Delete'
    }, {
      collapsed: false
    }, _this.handleDeleteRange);
    _this.addBinding({
      key: 'Backspace',
      altKey: null,
      ctrlKey: null,
      metaKey: null,
      shiftKey: null
    }, {
      collapsed: true,
      offset: 0
    }, _this.handleBackspace);
    _this.listen();
    return _this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__["default"])(Keyboard, _Module);
  Keyboard.match = function match(evt, binding) {
    if (['altKey', 'ctrlKey', 'metaKey', 'shiftKey'].some(function (key) {
      return !!binding[key] !== evt[key] && binding[key] !== null;
    })) {
      return false;
    }
    return binding.key === evt.key || binding.key === evt.which;
  };
  var _proto = Keyboard.prototype;
  _proto.addBinding = function addBinding(keyBinding) {
    var _this2 = this;
    var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var handler = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var binding = normalize(keyBinding);
    if (binding == null) {
      debug.warn('Attempted to add invalid keyboard binding', binding);
      return;
    }
    if (typeof context === 'function') {
      context = {
        handler: context
      };
    }
    if (typeof handler === 'function') {
      handler = {
        handler: handler
      };
    }
    var keys = Array.isArray(binding.key) ? binding.key : [binding.key];
    keys.forEach(function (key) {
      var singleBinding = (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, binding, {
        key: key
      }, context, handler);
      _this2.bindings[singleBinding.key] = _this2.bindings[singleBinding.key] || [];
      _this2.bindings[singleBinding.key].push(singleBinding);
    });
  };
  _proto.listen = function listen() {
    var _this3 = this;
    this.quill.root.addEventListener('keydown', function (evt) {
      if (evt.defaultPrevented || evt.isComposing) return;

      // evt.isComposing is false when pressing Enter/Backspace when composing in Safari
      // https://bugs.webkit.org/show_bug.cgi?id=165004
      var isComposing = evt.keyCode === 229 && (evt.key === 'Enter' || evt.key === 'Backspace');
      if (isComposing) return;
      var bindings = (_this3.bindings[evt.key] || []).concat(_this3.bindings[evt.which] || []);
      var matches = bindings.filter(function (binding) {
        return Keyboard.match(evt, binding);
      });
      if (matches.length === 0) return;
      // @ts-expect-error
      var blot = _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].find(evt.target, true);
      if (blot && blot.scroll !== _this3.quill.scroll) return;
      var range = _this3.quill.getSelection();
      if (range == null || !_this3.quill.hasFocus()) return;
      var _this3$quill$getLine = _this3.quill.getLine(range.index),
        line = _this3$quill$getLine[0],
        offset = _this3$quill$getLine[1];
      var _this3$quill$getLeaf = _this3.quill.getLeaf(range.index),
        leafStart = _this3$quill$getLeaf[0],
        offsetStart = _this3$quill$getLeaf[1];
      var _ref3 = range.length === 0 ? [leafStart, offsetStart] : _this3.quill.getLeaf(range.index + range.length),
        leafEnd = _ref3[0],
        offsetEnd = _ref3[1];
      var prefixText = leafStart instanceof parchment__WEBPACK_IMPORTED_MODULE_6__.TextBlot ? leafStart.value().slice(0, offsetStart) : '';
      var suffixText = leafEnd instanceof parchment__WEBPACK_IMPORTED_MODULE_6__.TextBlot ? leafEnd.value().slice(offsetEnd) : '';
      var curContext = {
        collapsed: range.length === 0,
        // @ts-expect-error Fix me later
        empty: range.length === 0 && line.length() <= 1,
        format: _this3.quill.getFormat(range),
        line: line,
        offset: offset,
        prefix: prefixText,
        suffix: suffixText,
        event: evt
      };
      var prevented = matches.some(function (binding) {
        if (binding.collapsed != null && binding.collapsed !== curContext.collapsed) {
          return false;
        }
        if (binding.empty != null && binding.empty !== curContext.empty) {
          return false;
        }
        if (binding.offset != null && binding.offset !== curContext.offset) {
          return false;
        }
        if (Array.isArray(binding.format)) {
          // any format is present
          if (binding.format.every(function (name) {
            return curContext.format[name] == null;
          })) {
            return false;
          }
        } else if (typeof binding.format === 'object') {
          // all formats must match
          if (!Object.keys(binding.format).every(function (name) {
            // @ts-expect-error Fix me later
            if (binding.format[name] === true) return curContext.format[name] != null;
            // @ts-expect-error Fix me later
            if (binding.format[name] === false) return curContext.format[name] == null;
            // @ts-expect-error Fix me later
            return (0,lodash_es__WEBPACK_IMPORTED_MODULE_7__["default"])(binding.format[name], curContext.format[name]);
          })) {
            return false;
          }
        }
        if (binding.prefix != null && !binding.prefix.test(curContext.prefix)) {
          return false;
        }
        if (binding.suffix != null && !binding.suffix.test(curContext.suffix)) {
          return false;
        }
        // @ts-expect-error Fix me later
        return binding.handler.call(_this3, range, curContext, binding) !== true;
      });
      if (prevented) {
        evt.preventDefault();
      }
    });
  };
  _proto.handleBackspace = function handleBackspace(range, context) {
    // Check for astral symbols
    var length = /[\uD800-\uDBFF][\uDC00-\uDFFF]$/.test(context.prefix) ? 2 : 1;
    if (range.index === 0 || this.quill.getLength() <= 1) return;
    var formats = {};
    var _this$quill$getLine = this.quill.getLine(range.index),
      line = _this$quill$getLine[0];
    var delta = new quill_delta__WEBPACK_IMPORTED_MODULE_2__().retain(range.index - length)["delete"](length);
    if (context.offset === 0) {
      // Always deleting newline here, length always 1
      var _this$quill$getLine2 = this.quill.getLine(range.index - 1),
        prev = _this$quill$getLine2[0];
      if (prev) {
        var isPrevLineEmpty = prev.statics.blotName === 'block' && prev.length() <= 1;
        if (!isPrevLineEmpty) {
          // @ts-expect-error Fix me later
          var curFormats = line.formats();
          var prevFormats = this.quill.getFormat(range.index - 1, 1);
          formats = quill_delta__WEBPACK_IMPORTED_MODULE_2__.AttributeMap.diff(curFormats, prevFormats) || {};
          if (Object.keys(formats).length > 0) {
            // line.length() - 1 targets \n in line, another -1 for newline being deleted
            var formatDelta = new quill_delta__WEBPACK_IMPORTED_MODULE_2__()
            // @ts-expect-error Fix me later
            .retain(range.index + line.length() - 2).retain(1, formats);
            delta = delta.compose(formatDelta);
          }
        }
      }
    }
    this.quill.updateContents(delta, _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.USER);
    this.quill.focus();
  };
  _proto.handleDelete = function handleDelete(range, context) {
    // Check for astral symbols
    var length = /^[\uD800-\uDBFF][\uDC00-\uDFFF]/.test(context.suffix) ? 2 : 1;
    if (range.index >= this.quill.getLength() - length) return;
    var formats = {};
    var _this$quill$getLine3 = this.quill.getLine(range.index),
      line = _this$quill$getLine3[0];
    var delta = new quill_delta__WEBPACK_IMPORTED_MODULE_2__().retain(range.index)["delete"](length);
    // @ts-expect-error Fix me later
    if (context.offset >= line.length() - 1) {
      var _this$quill$getLine4 = this.quill.getLine(range.index + 1),
        next = _this$quill$getLine4[0];
      if (next) {
        // @ts-expect-error Fix me later
        var curFormats = line.formats();
        var nextFormats = this.quill.getFormat(range.index, 1);
        formats = quill_delta__WEBPACK_IMPORTED_MODULE_2__.AttributeMap.diff(curFormats, nextFormats) || {};
        if (Object.keys(formats).length > 0) {
          delta = delta.retain(next.length() - 1).retain(1, formats);
        }
      }
    }
    this.quill.updateContents(delta, _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.USER);
    this.quill.focus();
  };
  _proto.handleDeleteRange = function handleDeleteRange(range) {
    deleteRange({
      range: range,
      quill: this.quill
    });
    this.quill.focus();
  };
  _proto.handleEnter = function handleEnter(range, context) {
    var _this4 = this;
    var lineFormats = Object.keys(context.format).reduce(function (formats, format) {
      if (_this4.quill.scroll.query(format, parchment__WEBPACK_IMPORTED_MODULE_6__.Scope.BLOCK) && !Array.isArray(context.format[format])) {
        formats[format] = context.format[format];
      }
      return formats;
    }, {});
    var delta = new quill_delta__WEBPACK_IMPORTED_MODULE_2__().retain(range.index)["delete"](range.length).insert('\n', lineFormats);
    this.quill.updateContents(delta, _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.USER);
    this.quill.setSelection(range.index + 1, _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.SILENT);
    this.quill.focus();
  };
  return Keyboard;
}(_core_module_js__WEBPACK_IMPORTED_MODULE_5__["default"]);
var defaultOptions = {
  bindings: {
    bold: makeFormatHandler('bold'),
    italic: makeFormatHandler('italic'),
    underline: makeFormatHandler('underline'),
    indent: {
      // highlight tab or tab at beginning of list, indent or blockquote
      key: 'Tab',
      format: ['blockquote', 'indent', 'list'],
      handler: function handler(range, context) {
        if (context.collapsed && context.offset !== 0) return true;
        this.quill.format('indent', '+1', _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.USER);
        return false;
      }
    },
    outdent: {
      key: 'Tab',
      shiftKey: true,
      format: ['blockquote', 'indent', 'list'],
      // highlight tab or tab at beginning of list, indent or blockquote
      handler: function handler(range, context) {
        if (context.collapsed && context.offset !== 0) return true;
        this.quill.format('indent', '-1', _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.USER);
        return false;
      }
    },
    'outdent backspace': {
      key: 'Backspace',
      collapsed: true,
      shiftKey: null,
      metaKey: null,
      ctrlKey: null,
      altKey: null,
      format: ['indent', 'list'],
      offset: 0,
      handler: function handler(range, context) {
        if (context.format.indent != null) {
          this.quill.format('indent', '-1', _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.USER);
        } else if (context.format.list != null) {
          this.quill.format('list', false, _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.USER);
        }
      }
    },
    'indent code-block': makeCodeBlockHandler(true),
    'outdent code-block': makeCodeBlockHandler(false),
    'remove tab': {
      key: 'Tab',
      shiftKey: true,
      collapsed: true,
      prefix: /\t$/,
      handler: function handler(range) {
        this.quill.deleteText(range.index - 1, 1, _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.USER);
      }
    },
    tab: {
      key: 'Tab',
      handler: function handler(range, context) {
        if (context.format.table) return true;
        this.quill.history.cutoff();
        var delta = new quill_delta__WEBPACK_IMPORTED_MODULE_2__().retain(range.index)["delete"](range.length).insert('\t');
        this.quill.updateContents(delta, _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.USER);
        this.quill.history.cutoff();
        this.quill.setSelection(range.index + 1, _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.SILENT);
        return false;
      }
    },
    'blockquote empty enter': {
      key: 'Enter',
      collapsed: true,
      format: ['blockquote'],
      empty: true,
      handler: function handler() {
        this.quill.format('blockquote', false, _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.USER);
      }
    },
    'list empty enter': {
      key: 'Enter',
      collapsed: true,
      format: ['list'],
      empty: true,
      handler: function handler(range, context) {
        var formats = {
          list: false
        };
        if (context.format.indent) {
          formats.indent = false;
        }
        this.quill.formatLine(range.index, range.length, formats, _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.USER);
      }
    },
    'checklist enter': {
      key: 'Enter',
      collapsed: true,
      format: {
        list: 'checked'
      },
      handler: function handler(range) {
        var _this$quill$getLine5 = this.quill.getLine(range.index),
          line = _this$quill$getLine5[0],
          offset = _this$quill$getLine5[1];
        var formats = (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, line.formats(), {
          list: 'checked'
        });
        var delta = new quill_delta__WEBPACK_IMPORTED_MODULE_2__().retain(range.index).insert('\n', formats)
        // @ts-expect-error Fix me later
        .retain(line.length() - offset - 1).retain(1, {
          list: 'unchecked'
        });
        this.quill.updateContents(delta, _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.USER);
        this.quill.setSelection(range.index + 1, _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.SILENT);
        this.quill.scrollSelectionIntoView();
      }
    },
    'header enter': {
      key: 'Enter',
      collapsed: true,
      format: ['header'],
      suffix: /^$/,
      handler: function handler(range, context) {
        var _this$quill$getLine6 = this.quill.getLine(range.index),
          line = _this$quill$getLine6[0],
          offset = _this$quill$getLine6[1];
        var delta = new quill_delta__WEBPACK_IMPORTED_MODULE_2__().retain(range.index).insert('\n', context.format)
        // @ts-expect-error Fix me later
        .retain(line.length() - offset - 1).retain(1, {
          header: null
        });
        this.quill.updateContents(delta, _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.USER);
        this.quill.setSelection(range.index + 1, _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.SILENT);
        this.quill.scrollSelectionIntoView();
      }
    },
    'table backspace': {
      key: 'Backspace',
      format: ['table'],
      collapsed: true,
      offset: 0,
      handler: function handler() {}
    },
    'table delete': {
      key: 'Delete',
      format: ['table'],
      collapsed: true,
      suffix: /^$/,
      handler: function handler() {}
    },
    'table enter': {
      key: 'Enter',
      shiftKey: null,
      format: ['table'],
      handler: function handler(range) {
        var module = this.quill.getModule('table');
        if (module) {
          // @ts-expect-error
          var _module$getTable = module.getTable(range),
            table = _module$getTable[0],
            row = _module$getTable[1],
            cell = _module$getTable[2],
            offset = _module$getTable[3];
          var shift = tableSide(table, row, cell, offset);
          if (shift == null) return;
          var index = table.offset();
          if (shift < 0) {
            var delta = new quill_delta__WEBPACK_IMPORTED_MODULE_2__().retain(index).insert('\n');
            this.quill.updateContents(delta, _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.USER);
            this.quill.setSelection(range.index + 1, range.length, _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.SILENT);
          } else if (shift > 0) {
            index += table.length();
            var _delta = new quill_delta__WEBPACK_IMPORTED_MODULE_2__().retain(index).insert('\n');
            this.quill.updateContents(_delta, _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.USER);
            this.quill.setSelection(index, _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.USER);
          }
        }
      }
    },
    'table tab': {
      key: 'Tab',
      shiftKey: null,
      format: ['table'],
      handler: function handler(range, context) {
        var event = context.event,
          cell = context.line;
        var offset = cell.offset(this.quill.scroll);
        if (event.shiftKey) {
          this.quill.setSelection(offset - 1, _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.USER);
        } else {
          this.quill.setSelection(offset + cell.length(), _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.USER);
        }
      }
    },
    'list autofill': {
      key: ' ',
      shiftKey: null,
      collapsed: true,
      format: {
        'code-block': false,
        blockquote: false,
        table: false
      },
      prefix: /^\s*?(\d+\.|-|\*|\[ ?\]|\[x\])$/,
      handler: function handler(range, context) {
        if (this.quill.scroll.query('list') == null) return true;
        var length = context.prefix.length;
        var _this$quill$getLine7 = this.quill.getLine(range.index),
          line = _this$quill$getLine7[0],
          offset = _this$quill$getLine7[1];
        if (offset > length) return true;
        var value;
        switch (context.prefix.trim()) {
          case '[]':
          case '[ ]':
            value = 'unchecked';
            break;
          case '[x]':
            value = 'checked';
            break;
          case '-':
          case '*':
            value = 'bullet';
            break;
          default:
            value = 'ordered';
        }
        this.quill.insertText(range.index, ' ', _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.USER);
        this.quill.history.cutoff();
        var delta = new quill_delta__WEBPACK_IMPORTED_MODULE_2__().retain(range.index - offset)["delete"](length + 1)
        // @ts-expect-error Fix me later
        .retain(line.length() - 2 - offset).retain(1, {
          list: value
        });
        this.quill.updateContents(delta, _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.USER);
        this.quill.history.cutoff();
        this.quill.setSelection(range.index - length, _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.SILENT);
        return false;
      }
    },
    'code exit': {
      key: 'Enter',
      collapsed: true,
      format: ['code-block'],
      prefix: /^$/,
      suffix: /^\s*$/,
      handler: function handler(range) {
        var _this$quill$getLine8 = this.quill.getLine(range.index),
          line = _this$quill$getLine8[0],
          offset = _this$quill$getLine8[1];
        var numLines = 2;
        var cur = line;
        while (cur != null && cur.length() <= 1 && cur.formats()['code-block']) {
          // @ts-expect-error
          cur = cur.prev;
          numLines -= 1;
          // Requisite prev lines are empty
          if (numLines <= 0) {
            var delta = new quill_delta__WEBPACK_IMPORTED_MODULE_2__()
            // @ts-expect-error Fix me later
            .retain(range.index + line.length() - offset - 2).retain(1, {
              'code-block': null
            })["delete"](1);
            this.quill.updateContents(delta, _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.USER);
            this.quill.setSelection(range.index - 1, _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.SILENT);
            return false;
          }
        }
        return true;
      }
    },
    'embed left': makeEmbedArrowHandler('ArrowLeft', false),
    'embed left shift': makeEmbedArrowHandler('ArrowLeft', true),
    'embed right': makeEmbedArrowHandler('ArrowRight', false),
    'embed right shift': makeEmbedArrowHandler('ArrowRight', true),
    'table down': makeTableArrowHandler(false),
    'table up': makeTableArrowHandler(true)
  }
};
Keyboard.DEFAULTS = defaultOptions;
function makeCodeBlockHandler(indent) {
  return {
    key: 'Tab',
    shiftKey: !indent,
    format: {
      'code-block': true
    },
    handler: function handler(range, _ref) {
      var event = _ref.event;
      var CodeBlock = this.quill.scroll.query('code-block');
      // @ts-expect-error
      var TAB = CodeBlock.TAB;
      if (range.length === 0 && !event.shiftKey) {
        this.quill.insertText(range.index, TAB, _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.USER);
        this.quill.setSelection(range.index + TAB.length, _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.SILENT);
        return;
      }
      var lines = range.length === 0 ? this.quill.getLines(range.index, 1) : this.quill.getLines(range);
      var index = range.index,
        length = range.length;
      lines.forEach(function (line, i) {
        if (indent) {
          line.insertAt(0, TAB);
          if (i === 0) {
            index += TAB.length;
          } else {
            length += TAB.length;
          }
          // @ts-expect-error Fix me later
        } else if (line.domNode.textContent.startsWith(TAB)) {
          line.deleteAt(0, TAB.length);
          if (i === 0) {
            index -= TAB.length;
          } else {
            length -= TAB.length;
          }
        }
      });
      this.quill.update(_core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.USER);
      this.quill.setSelection(index, length, _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.SILENT);
    }
  };
}
function makeEmbedArrowHandler(key, shiftKey) {
  var _ref4;
  var where = key === 'ArrowLeft' ? 'prefix' : 'suffix';
  return _ref4 = {
    key: key,
    shiftKey: shiftKey,
    altKey: null
  }, _ref4[where] = /^$/, _ref4.handler = function handler(range) {
    var index = range.index;
    if (key === 'ArrowRight') {
      index += range.length + 1;
    }
    var _this$quill$getLeaf = this.quill.getLeaf(index),
      leaf = _this$quill$getLeaf[0];
    if (!(leaf instanceof parchment__WEBPACK_IMPORTED_MODULE_6__.EmbedBlot)) return true;
    if (key === 'ArrowLeft') {
      if (shiftKey) {
        this.quill.setSelection(range.index - 1, range.length + 1, _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.USER);
      } else {
        this.quill.setSelection(range.index - 1, _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.USER);
      }
    } else if (shiftKey) {
      this.quill.setSelection(range.index, range.length + 1, _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.USER);
    } else {
      this.quill.setSelection(range.index + range.length + 1, _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.USER);
    }
    return false;
  }, _ref4;
}
function makeFormatHandler(format) {
  return {
    key: format[0],
    shortKey: true,
    handler: function handler(range, context) {
      this.quill.format(format, !context.format[format], _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.USER);
    }
  };
}
function makeTableArrowHandler(up) {
  return {
    key: up ? 'ArrowUp' : 'ArrowDown',
    collapsed: true,
    format: ['table'],
    handler: function handler(range, context) {
      // TODO move to table module
      var key = up ? 'prev' : 'next';
      var cell = context.line;
      var targetRow = cell.parent[key];
      if (targetRow != null) {
        if (targetRow.statics.blotName === 'table-row') {
          // @ts-expect-error
          var targetCell = targetRow.children.head;
          var cur = cell;
          while (cur.prev != null) {
            // @ts-expect-error
            cur = cur.prev;
            targetCell = targetCell.next;
          }
          var index = targetCell.offset(this.quill.scroll) + Math.min(context.offset, targetCell.length() - 1);
          this.quill.setSelection(index, 0, _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.USER);
        }
      } else {
        // @ts-expect-error
        var targetLine = cell.table()[key];
        if (targetLine != null) {
          if (up) {
            this.quill.setSelection(targetLine.offset(this.quill.scroll) + targetLine.length() - 1, 0, _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.USER);
          } else {
            this.quill.setSelection(targetLine.offset(this.quill.scroll), 0, _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.USER);
          }
        }
      }
      return false;
    }
  };
}
function normalize(binding) {
  if (typeof binding === 'string' || typeof binding === 'number') {
    binding = {
      key: binding
    };
  } else if (typeof binding === 'object') {
    binding = (0,lodash_es__WEBPACK_IMPORTED_MODULE_8__["default"])(binding);
  } else {
    return null;
  }
  if (binding.shortKey) {
    binding[SHORTKEY] = binding.shortKey;
    delete binding.shortKey;
  }
  return binding;
}

// TODO: Move into quill.ts or editor.ts
function deleteRange(_ref2) {
  var quill = _ref2.quill,
    range = _ref2.range;
  var lines = quill.getLines(range);
  var formats = {};
  if (lines.length > 1) {
    var firstFormats = lines[0].formats();
    var lastFormats = lines[lines.length - 1].formats();
    formats = quill_delta__WEBPACK_IMPORTED_MODULE_2__.AttributeMap.diff(lastFormats, firstFormats) || {};
  }
  quill.deleteText(range, _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.USER);
  if (Object.keys(formats).length > 0) {
    quill.formatLine(range.index, 1, formats, _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.USER);
  }
  quill.setSelection(range.index, _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.SILENT);
}
function tableSide(_table, row, cell, offset) {
  if (row.prev == null && row.next == null) {
    if (cell.prev == null && cell.next == null) {
      return offset === 0 ? -1 : 1;
    }
    return cell.prev == null ? -1 : 1;
  }
  if (row.prev == null) {
    return -1;
  }
  if (row.next == null) {
    return 1;
  }
  return null;
}


/***/ }),

/***/ "./node_modules/quill/modules/normalizeExternalHTML/index.js":
/*!*******************************************************************!*\
  !*** ./node_modules/quill/modules/normalizeExternalHTML/index.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _normalizers_googleDocs_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./normalizers/googleDocs.js */ "./node_modules/quill/modules/normalizeExternalHTML/normalizers/googleDocs.js");
/* harmony import */ var _normalizers_msWord_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./normalizers/msWord.js */ "./node_modules/quill/modules/normalizeExternalHTML/normalizers/msWord.js");


var NORMALIZERS = [_normalizers_msWord_js__WEBPACK_IMPORTED_MODULE_1__["default"], _normalizers_googleDocs_js__WEBPACK_IMPORTED_MODULE_0__["default"]];
var normalizeExternalHTML = function normalizeExternalHTML(doc) {
  if (doc.documentElement) {
    NORMALIZERS.forEach(function (normalize) {
      normalize(doc);
    });
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (normalizeExternalHTML);

/***/ }),

/***/ "./node_modules/quill/modules/normalizeExternalHTML/normalizers/googleDocs.js":
/*!************************************************************************************!*\
  !*** ./node_modules/quill/modules/normalizeExternalHTML/normalizers/googleDocs.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ normalize)
/* harmony export */ });
var normalWeightRegexp = /font-weight:\s*normal/;
var blockTagNames = ['P', 'OL', 'UL'];
var isBlockElement = function isBlockElement(element) {
  return element && blockTagNames.includes(element.tagName);
};
var normalizeEmptyLines = function normalizeEmptyLines(doc) {
  Array.from(doc.querySelectorAll('br')).filter(function (br) {
    return isBlockElement(br.previousElementSibling) && isBlockElement(br.nextElementSibling);
  }).forEach(function (br) {
    var _br$parentNode;
    (_br$parentNode = br.parentNode) == null || _br$parentNode.removeChild(br);
  });
};
var normalizeFontWeight = function normalizeFontWeight(doc) {
  Array.from(doc.querySelectorAll('b[style*="font-weight"]')).filter(function (node) {
    var _node$getAttribute;
    return (_node$getAttribute = node.getAttribute('style')) == null ? void 0 : _node$getAttribute.match(normalWeightRegexp);
  }).forEach(function (node) {
    var _node$parentNode;
    var fragment = doc.createDocumentFragment();
    fragment.append.apply(fragment, node.childNodes);
    (_node$parentNode = node.parentNode) == null || _node$parentNode.replaceChild(fragment, node);
  });
};
function normalize(doc) {
  if (doc.querySelector('[id^="docs-internal-guid-"]')) {
    normalizeFontWeight(doc);
    normalizeEmptyLines(doc);
  }
}

/***/ }),

/***/ "./node_modules/quill/modules/normalizeExternalHTML/normalizers/msWord.js":
/*!********************************************************************************!*\
  !*** ./node_modules/quill/modules/normalizeExternalHTML/normalizers/msWord.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ normalize)
/* harmony export */ });
var ignoreRegexp = /\bmso-list:[^;]*ignore/i;
var idRegexp = /\bmso-list:[^;]*\bl(\d+)/i;
var indentRegexp = /\bmso-list:[^;]*\blevel(\d+)/i;
var parseListItem = function parseListItem(element, html) {
  var style = element.getAttribute('style');
  var idMatch = style == null ? void 0 : style.match(idRegexp);
  if (!idMatch) {
    return null;
  }
  var id = Number(idMatch[1]);
  var indentMatch = style == null ? void 0 : style.match(indentRegexp);
  var indent = indentMatch ? Number(indentMatch[1]) : 1;
  var typeRegexp = new RegExp("@list l" + id + ":level" + indent + "\\s*\\{[^\\}]*mso-level-number-format:\\s*([\\w-]+)", 'i');
  var typeMatch = html.match(typeRegexp);
  var type = typeMatch && typeMatch[1] === 'bullet' ? 'bullet' : 'ordered';
  return {
    id: id,
    indent: indent,
    type: type,
    element: element
  };
};

// list items are represented as `p` tags with styles like `mso-list: l0 level1` where:
// 1. "0" in "l0" means the list item id;
// 2. "1" in "level1" means the indent level, starting from 1.
var normalizeListItem = function normalizeListItem(doc) {
  var msoList = Array.from(doc.querySelectorAll('[style*=mso-list]'));
  var ignored = [];
  var others = [];
  msoList.forEach(function (node) {
    var shouldIgnore = (node.getAttribute('style') || '').match(ignoreRegexp);
    if (shouldIgnore) {
      ignored.push(node);
    } else {
      others.push(node);
    }
  });

  // Each list item contains a marker wrapped with "mso-list: Ignore".
  ignored.forEach(function (node) {
    var _node$parentNode;
    return (_node$parentNode = node.parentNode) == null ? void 0 : _node$parentNode.removeChild(node);
  });

  // The list stype is not defined inline with the tag, instead, it's in the
  // style tag so we need to pass the html as a string.
  var html = doc.documentElement.innerHTML;
  var listItems = others.map(function (element) {
    return parseListItem(element, html);
  }).filter(function (parsed) {
    return parsed;
  });
  var _loop = function _loop() {
    var _childListItems$;
    var childListItems = [];
    var current = listItems.shift();
    // Group continuous items into the same group (aka "ul")
    while (current) {
      var _listItems$;
      childListItems.push(current);
      current = listItems.length && ((_listItems$ = listItems[0]) == null ? void 0 : _listItems$.element) === current.element.nextElementSibling &&
      // Different id means the next item doesn't belong to this group.
      listItems[0].id === current.id ? listItems.shift() : null;
    }
    var ul = document.createElement('ul');
    childListItems.forEach(function (listItem) {
      var li = document.createElement('li');
      li.setAttribute('data-list', listItem.type);
      if (listItem.indent > 1) {
        li.setAttribute('class', "ql-indent-" + (listItem.indent - 1));
      }
      li.innerHTML = listItem.element.innerHTML;
      ul.appendChild(li);
    });
    var element = (_childListItems$ = childListItems[0]) == null ? void 0 : _childListItems$.element;
    var _ref2 = element != null ? element : {},
      parentNode = _ref2.parentNode;
    if (element) {
      parentNode == null || parentNode.replaceChild(ul, element);
    }
    childListItems.slice(1).forEach(function (_ref) {
      var e = _ref.element;
      parentNode == null || parentNode.removeChild(e);
    });
  };
  while (listItems.length) {
    _loop();
  }
};
function normalize(doc) {
  if (doc.documentElement.getAttribute('xmlns:w') === 'urn:schemas-microsoft-com:office:word') {
    normalizeListItem(doc);
  }
}

/***/ }),

/***/ "./node_modules/quill/modules/syntax.js":
/*!**********************************************!*\
  !*** ./node_modules/quill/modules/syntax.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CodeBlock: () => (/* binding */ SyntaxCodeBlock),
/* harmony export */   CodeToken: () => (/* binding */ CodeToken),
/* harmony export */   "default": () => (/* binding */ Syntax)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var quill_delta__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! quill-delta */ "./node_modules/quill-delta/dist/Delta.js");
/* harmony import */ var parchment__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! parchment */ "./node_modules/parchment/dist/parchment.js");
/* harmony import */ var _blots_inline_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../blots/inline.js */ "./node_modules/quill/blots/inline.js");
/* harmony import */ var _core_quill_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../core/quill.js */ "./node_modules/quill/core/quill.js");
/* harmony import */ var _core_module_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../core/module.js */ "./node_modules/quill/core/module.js");
/* harmony import */ var _blots_block_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../blots/block.js */ "./node_modules/quill/blots/block.js");
/* harmony import */ var _blots_break_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../blots/break.js */ "./node_modules/quill/blots/break.js");
/* harmony import */ var _blots_cursor_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../blots/cursor.js */ "./node_modules/quill/blots/cursor.js");
/* harmony import */ var _blots_text_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../blots/text.js */ "./node_modules/quill/blots/text.js");
/* harmony import */ var _formats_code_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../formats/code.js */ "./node_modules/quill/formats/code.js");
/* harmony import */ var _clipboard_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./clipboard.js */ "./node_modules/quill/modules/clipboard.js");












var TokenAttributor = new parchment__WEBPACK_IMPORTED_MODULE_11__.ClassAttributor('code-token', 'hljs', {
  scope: parchment__WEBPACK_IMPORTED_MODULE_11__.Scope.INLINE
});
var CodeToken = /*#__PURE__*/function (_Inline) {
  function CodeToken(scroll, domNode, value) {
    var _this;
    // @ts-expect-error
    _this = _Inline.call(this, scroll, domNode, value) || this;
    TokenAttributor.add(_this.domNode, value);
    return _this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(CodeToken, _Inline);
  CodeToken.formats = function formats(node, scroll) {
    while (node != null && node !== scroll.domNode) {
      if (node.classList && node.classList.contains(_formats_code_js__WEBPACK_IMPORTED_MODULE_9__["default"].className)) {
        // @ts-expect-error
        return _Inline.formats.call(this, node, scroll);
      }
      // @ts-expect-error
      node = node.parentNode;
    }
    return undefined;
  };
  var _proto = CodeToken.prototype;
  _proto.format = function format(_format, value) {
    if (_format !== CodeToken.blotName) {
      _Inline.prototype.format.call(this, _format, value);
    } else if (value) {
      TokenAttributor.add(this.domNode, value);
    } else {
      TokenAttributor.remove(this.domNode);
      this.domNode.classList.remove(this.statics.className);
    }
  };
  _proto.optimize = function optimize() {
    // @ts-expect-error
    _Inline.prototype.optimize.apply(this, arguments);
    if (!TokenAttributor.value(this.domNode)) {
      this.unwrap();
    }
  };
  return CodeToken;
}(_blots_inline_js__WEBPACK_IMPORTED_MODULE_2__["default"]);
CodeToken.blotName = 'code-token';
CodeToken.className = 'ql-token';
var SyntaxCodeBlock = /*#__PURE__*/function (_CodeBlock) {
  function SyntaxCodeBlock() {
    return _CodeBlock.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(SyntaxCodeBlock, _CodeBlock);
  SyntaxCodeBlock.create = function create(value) {
    var domNode = _CodeBlock.create.call(this, value);
    if (typeof value === 'string') {
      domNode.setAttribute('data-language', value);
    }
    return domNode;
  };
  SyntaxCodeBlock.formats = function formats(domNode) {
    // @ts-expect-error
    return domNode.getAttribute('data-language') || 'plain';
  };
  SyntaxCodeBlock.register = function register() {} // Syntax module will register
  ;
  var _proto2 = SyntaxCodeBlock.prototype;
  _proto2.format = function format(name, value) {
    if (name === this.statics.blotName && value) {
      // @ts-expect-error
      this.domNode.setAttribute('data-language', value);
    } else {
      _CodeBlock.prototype.format.call(this, name, value);
    }
  };
  _proto2.replaceWith = function replaceWith(name, value) {
    this.formatAt(0, this.length(), CodeToken.blotName, false);
    return _CodeBlock.prototype.replaceWith.call(this, name, value);
  };
  return SyntaxCodeBlock;
}(_formats_code_js__WEBPACK_IMPORTED_MODULE_9__["default"]);
var SyntaxCodeBlockContainer = /*#__PURE__*/function (_CodeBlockContainer) {
  function SyntaxCodeBlockContainer() {
    return _CodeBlockContainer.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(SyntaxCodeBlockContainer, _CodeBlockContainer);
  var _proto3 = SyntaxCodeBlockContainer.prototype;
  _proto3.attach = function attach() {
    _CodeBlockContainer.prototype.attach.call(this);
    this.forceNext = false;
    // @ts-expect-error
    this.scroll.emitMount(this);
  };
  _proto3.format = function format(name, value) {
    if (name === SyntaxCodeBlock.blotName) {
      this.forceNext = true;
      this.children.forEach(function (child) {
        // @ts-expect-error
        child.format(name, value);
      });
    }
  };
  _proto3.formatAt = function formatAt(index, length, name, value) {
    if (name === SyntaxCodeBlock.blotName) {
      this.forceNext = true;
    }
    _CodeBlockContainer.prototype.formatAt.call(this, index, length, name, value);
  };
  _proto3.highlight = function highlight(_highlight) {
    var _this2 = this;
    var forced = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    if (this.children.head == null) return;
    var nodes = Array.from(this.domNode.childNodes).filter(function (node) {
      return node !== _this2.uiNode;
    });
    var text = nodes.map(function (node) {
      return node.textContent;
    }).join('\n') + "\n";
    var language = SyntaxCodeBlock.formats(this.children.head.domNode);
    if (forced || this.forceNext || this.cachedText !== text) {
      if (text.trim().length > 0 || this.cachedText == null) {
        var oldDelta = this.children.reduce(function (delta, child) {
          // @ts-expect-error
          return delta.concat((0,_blots_block_js__WEBPACK_IMPORTED_MODULE_5__.blockDelta)(child, false));
        }, new quill_delta__WEBPACK_IMPORTED_MODULE_1__());
        var delta = _highlight(text, language);
        oldDelta.diff(delta).reduce(function (index, _ref) {
          var retain = _ref.retain,
            attributes = _ref.attributes;
          // Should be all retains
          if (!retain) return index;
          if (attributes) {
            Object.keys(attributes).forEach(function (format) {
              if ([SyntaxCodeBlock.blotName, CodeToken.blotName].includes(format)) {
                // @ts-expect-error
                _this2.formatAt(index, retain, format, attributes[format]);
              }
            });
          }
          // @ts-expect-error
          return index + retain;
        }, 0);
      }
      this.cachedText = text;
      this.forceNext = false;
    }
  };
  _proto3.html = function html(index, length) {
    var _this$children$find = this.children.find(index),
      codeBlock = _this$children$find[0];
    var language = codeBlock ? SyntaxCodeBlock.formats(codeBlock.domNode) : 'plain';
    return "<pre data-language=\"" + language + "\">\n" + (0,_blots_text_js__WEBPACK_IMPORTED_MODULE_8__.escapeText)(this.code(index, length)) + "\n</pre>";
  };
  _proto3.optimize = function optimize(context) {
    _CodeBlockContainer.prototype.optimize.call(this, context);
    if (this.parent != null && this.children.head != null && this.uiNode != null) {
      var language = SyntaxCodeBlock.formats(this.children.head.domNode);
      // @ts-expect-error
      if (language !== this.uiNode.value) {
        // @ts-expect-error
        this.uiNode.value = language;
      }
    }
  };
  return SyntaxCodeBlockContainer;
}(_formats_code_js__WEBPACK_IMPORTED_MODULE_9__.CodeBlockContainer);
SyntaxCodeBlockContainer.allowedChildren = [SyntaxCodeBlock];
SyntaxCodeBlock.requiredContainer = SyntaxCodeBlockContainer;
SyntaxCodeBlock.allowedChildren = [CodeToken, _blots_cursor_js__WEBPACK_IMPORTED_MODULE_7__["default"], _blots_text_js__WEBPACK_IMPORTED_MODULE_8__["default"], _blots_break_js__WEBPACK_IMPORTED_MODULE_6__["default"]];
var highlight = function highlight(lib, language, text) {
  if (typeof lib.versionString === 'string') {
    var majorVersion = lib.versionString.split('.')[0];
    if (parseInt(majorVersion, 10) >= 11) {
      return lib.highlight(text, {
        language: language
      }).value;
    }
  }
  return lib.highlight(language, text).value;
};
var Syntax = /*#__PURE__*/function (_Module) {
  function Syntax(quill, options) {
    var _this3;
    _this3 = _Module.call(this, quill, options) || this;
    if (_this3.options.hljs == null) {
      throw new Error('Syntax module requires highlight.js. Please include the library on the page before Quill.');
    }
    // @ts-expect-error Fix me later
    _this3.languages = _this3.options.languages.reduce(function (memo, _ref2) {
      var key = _ref2.key;
      memo[key] = true;
      return memo;
    }, {});
    _this3.highlightBlot = _this3.highlightBlot.bind(_this3);
    _this3.initListener();
    _this3.initTimer();
    return _this3;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(Syntax, _Module);
  Syntax.register = function register() {
    _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].register(CodeToken, true);
    _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].register(SyntaxCodeBlock, true);
    _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].register(SyntaxCodeBlockContainer, true);
  };
  var _proto4 = Syntax.prototype;
  _proto4.initListener = function initListener() {
    var _this4 = this;
    this.quill.on(_core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].events.SCROLL_BLOT_MOUNT, function (blot) {
      if (!(blot instanceof SyntaxCodeBlockContainer)) return;
      var select = _this4.quill.root.ownerDocument.createElement('select');
      // @ts-expect-error Fix me later
      _this4.options.languages.forEach(function (_ref3) {
        var key = _ref3.key,
          label = _ref3.label;
        var option = select.ownerDocument.createElement('option');
        option.textContent = label;
        option.setAttribute('value', key);
        select.appendChild(option);
      });
      select.addEventListener('change', function () {
        blot.format(SyntaxCodeBlock.blotName, select.value);
        _this4.quill.root.focus(); // Prevent scrolling
        _this4.highlight(blot, true);
      });
      if (blot.uiNode == null) {
        blot.attachUI(select);
        if (blot.children.head) {
          select.value = SyntaxCodeBlock.formats(blot.children.head.domNode);
        }
      }
    });
  };
  _proto4.initTimer = function initTimer() {
    var _this5 = this;
    var timer = null;
    this.quill.on(_core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].events.SCROLL_OPTIMIZE, function () {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(function () {
        _this5.highlight();
        timer = null;
      }, _this5.options.interval);
    });
  };
  _proto4.highlight = function highlight() {
    var _this6 = this;
    var blot = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    if (this.quill.selection.composing) return;
    this.quill.update(_core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.USER);
    var range = this.quill.getSelection();
    var blots = blot == null ? this.quill.scroll.descendants(SyntaxCodeBlockContainer) : [blot];
    blots.forEach(function (container) {
      container.highlight(_this6.highlightBlot, force);
    });
    this.quill.update(_core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.SILENT);
    if (range != null) {
      this.quill.setSelection(range, _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.SILENT);
    }
  };
  _proto4.highlightBlot = function highlightBlot(text) {
    var language = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'plain';
    language = this.languages[language] ? language : 'plain';
    if (language === 'plain') {
      return (0,_blots_text_js__WEBPACK_IMPORTED_MODULE_8__.escapeText)(text).split('\n').reduce(function (delta, line, i) {
        if (i !== 0) {
          var _delta$insert;
          delta.insert('\n', (_delta$insert = {}, _delta$insert[_formats_code_js__WEBPACK_IMPORTED_MODULE_9__["default"].blotName] = language, _delta$insert));
        }
        return delta.insert(line);
      }, new quill_delta__WEBPACK_IMPORTED_MODULE_1__());
    }
    var container = this.quill.root.ownerDocument.createElement('div');
    container.classList.add(_formats_code_js__WEBPACK_IMPORTED_MODULE_9__["default"].className);
    container.innerHTML = highlight(this.options.hljs, language, text);
    return (0,_clipboard_js__WEBPACK_IMPORTED_MODULE_10__.traverse)(this.quill.scroll, container, [function (node, delta) {
      // @ts-expect-error
      var value = TokenAttributor.value(node);
      if (value) {
        var _Delta$retain;
        return delta.compose(new quill_delta__WEBPACK_IMPORTED_MODULE_1__().retain(delta.length(), (_Delta$retain = {}, _Delta$retain[CodeToken.blotName] = value, _Delta$retain)));
      }
      return delta;
    }], [function (node, delta) {
      // @ts-expect-error
      return node.data.split('\n').reduce(function (memo, nodeText, i) {
        var _memo$insert;
        if (i !== 0) memo.insert('\n', (_memo$insert = {}, _memo$insert[_formats_code_js__WEBPACK_IMPORTED_MODULE_9__["default"].blotName] = language, _memo$insert));
        return memo.insert(nodeText);
      }, delta);
    }], new WeakMap());
  };
  return Syntax;
}(_core_module_js__WEBPACK_IMPORTED_MODULE_4__["default"]);
Syntax.DEFAULTS = {
  hljs: function () {
    return window.hljs;
  }(),
  interval: 1000,
  languages: [{
    key: 'plain',
    label: 'Plain'
  }, {
    key: 'bash',
    label: 'Bash'
  }, {
    key: 'cpp',
    label: 'C++'
  }, {
    key: 'cs',
    label: 'C#'
  }, {
    key: 'css',
    label: 'CSS'
  }, {
    key: 'diff',
    label: 'Diff'
  }, {
    key: 'xml',
    label: 'HTML/XML'
  }, {
    key: 'java',
    label: 'Java'
  }, {
    key: 'javascript',
    label: 'JavaScript'
  }, {
    key: 'markdown',
    label: 'Markdown'
  }, {
    key: 'php',
    label: 'PHP'
  }, {
    key: 'python',
    label: 'Python'
  }, {
    key: 'ruby',
    label: 'Ruby'
  }, {
    key: 'sql',
    label: 'SQL'
  }]
};


/***/ }),

/***/ "./node_modules/quill/modules/table.js":
/*!*********************************************!*\
  !*** ./node_modules/quill/modules/table.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var quill_delta__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! quill-delta */ "./node_modules/quill-delta/dist/Delta.js");
/* harmony import */ var _core_quill_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/quill.js */ "./node_modules/quill/core/quill.js");
/* harmony import */ var _core_module_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../core/module.js */ "./node_modules/quill/core/module.js");
/* harmony import */ var _formats_table_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../formats/table.js */ "./node_modules/quill/formats/table.js");





var Table = /*#__PURE__*/function (_Module) {
  function Table() {
    var _this;
    _this = _Module.apply(this, arguments) || this;
    _this.listenBalanceCells();
    return _this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(Table, _Module);
  Table.register = function register() {
    _core_quill_js__WEBPACK_IMPORTED_MODULE_2__["default"].register(_formats_table_js__WEBPACK_IMPORTED_MODULE_4__.TableCell);
    _core_quill_js__WEBPACK_IMPORTED_MODULE_2__["default"].register(_formats_table_js__WEBPACK_IMPORTED_MODULE_4__.TableRow);
    _core_quill_js__WEBPACK_IMPORTED_MODULE_2__["default"].register(_formats_table_js__WEBPACK_IMPORTED_MODULE_4__.TableBody);
    _core_quill_js__WEBPACK_IMPORTED_MODULE_2__["default"].register(_formats_table_js__WEBPACK_IMPORTED_MODULE_4__.TableContainer);
  };
  var _proto = Table.prototype;
  _proto.balanceTables = function balanceTables() {
    this.quill.scroll.descendants(_formats_table_js__WEBPACK_IMPORTED_MODULE_4__.TableContainer).forEach(function (table) {
      table.balanceCells();
    });
  };
  _proto.deleteColumn = function deleteColumn() {
    var _this$getTable = this.getTable(),
      table = _this$getTable[0],
      cell = _this$getTable[2];
    if (cell == null) return;
    // @ts-expect-error
    table.deleteColumn(cell.cellOffset());
    this.quill.update(_core_quill_js__WEBPACK_IMPORTED_MODULE_2__["default"].sources.USER);
  };
  _proto.deleteRow = function deleteRow() {
    var _this$getTable2 = this.getTable(),
      row = _this$getTable2[1];
    if (row == null) return;
    row.remove();
    this.quill.update(_core_quill_js__WEBPACK_IMPORTED_MODULE_2__["default"].sources.USER);
  };
  _proto.deleteTable = function deleteTable() {
    var _this$getTable3 = this.getTable(),
      table = _this$getTable3[0];
    if (table == null) return;
    // @ts-expect-error
    var offset = table.offset();
    // @ts-expect-error
    table.remove();
    this.quill.update(_core_quill_js__WEBPACK_IMPORTED_MODULE_2__["default"].sources.USER);
    this.quill.setSelection(offset, _core_quill_js__WEBPACK_IMPORTED_MODULE_2__["default"].sources.SILENT);
  };
  _proto.getTable = function getTable() {
    var range = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.quill.getSelection();
    if (range == null) return [null, null, null, -1];
    var _this$quill$getLine = this.quill.getLine(range.index),
      cell = _this$quill$getLine[0],
      offset = _this$quill$getLine[1];
    if (cell == null || cell.statics.blotName !== _formats_table_js__WEBPACK_IMPORTED_MODULE_4__.TableCell.blotName) {
      return [null, null, null, -1];
    }
    var row = cell.parent;
    var table = row.parent.parent;
    // @ts-expect-error
    return [table, row, cell, offset];
  };
  _proto.insertColumn = function insertColumn(offset) {
    var range = this.quill.getSelection();
    if (!range) return;
    var _this$getTable4 = this.getTable(range),
      table = _this$getTable4[0],
      row = _this$getTable4[1],
      cell = _this$getTable4[2];
    if (cell == null) return;
    var column = cell.cellOffset();
    table.insertColumn(column + offset);
    this.quill.update(_core_quill_js__WEBPACK_IMPORTED_MODULE_2__["default"].sources.USER);
    var shift = row.rowOffset();
    if (offset === 0) {
      shift += 1;
    }
    this.quill.setSelection(range.index + shift, range.length, _core_quill_js__WEBPACK_IMPORTED_MODULE_2__["default"].sources.SILENT);
  };
  _proto.insertColumnLeft = function insertColumnLeft() {
    this.insertColumn(0);
  };
  _proto.insertColumnRight = function insertColumnRight() {
    this.insertColumn(1);
  };
  _proto.insertRow = function insertRow(offset) {
    var range = this.quill.getSelection();
    if (!range) return;
    var _this$getTable5 = this.getTable(range),
      table = _this$getTable5[0],
      row = _this$getTable5[1],
      cell = _this$getTable5[2];
    if (cell == null) return;
    var index = row.rowOffset();
    table.insertRow(index + offset);
    this.quill.update(_core_quill_js__WEBPACK_IMPORTED_MODULE_2__["default"].sources.USER);
    if (offset > 0) {
      this.quill.setSelection(range, _core_quill_js__WEBPACK_IMPORTED_MODULE_2__["default"].sources.SILENT);
    } else {
      this.quill.setSelection(range.index + row.children.length, range.length, _core_quill_js__WEBPACK_IMPORTED_MODULE_2__["default"].sources.SILENT);
    }
  };
  _proto.insertRowAbove = function insertRowAbove() {
    this.insertRow(0);
  };
  _proto.insertRowBelow = function insertRowBelow() {
    this.insertRow(1);
  };
  _proto.insertTable = function insertTable(rows, columns) {
    var range = this.quill.getSelection();
    if (range == null) return;
    var delta = new Array(rows).fill(0).reduce(function (memo) {
      var text = new Array(columns).fill('\n').join('');
      return memo.insert(text, {
        table: (0,_formats_table_js__WEBPACK_IMPORTED_MODULE_4__.tableId)()
      });
    }, new quill_delta__WEBPACK_IMPORTED_MODULE_1__().retain(range.index));
    this.quill.updateContents(delta, _core_quill_js__WEBPACK_IMPORTED_MODULE_2__["default"].sources.USER);
    this.quill.setSelection(range.index, _core_quill_js__WEBPACK_IMPORTED_MODULE_2__["default"].sources.SILENT);
    this.balanceTables();
  };
  _proto.listenBalanceCells = function listenBalanceCells() {
    var _this2 = this;
    this.quill.on(_core_quill_js__WEBPACK_IMPORTED_MODULE_2__["default"].events.SCROLL_OPTIMIZE, function (mutations) {
      mutations.some(function (mutation) {
        if (['TD', 'TR', 'TBODY', 'TABLE'].includes(mutation.target.tagName)) {
          _this2.quill.once(_core_quill_js__WEBPACK_IMPORTED_MODULE_2__["default"].events.TEXT_CHANGE, function (delta, old, source) {
            if (source !== _core_quill_js__WEBPACK_IMPORTED_MODULE_2__["default"].sources.USER) return;
            _this2.balanceTables();
          });
          return true;
        }
        return false;
      });
    });
  };
  return Table;
}(_core_module_js__WEBPACK_IMPORTED_MODULE_3__["default"]);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Table);

/***/ }),

/***/ "./node_modules/quill/modules/toolbar.js":
/*!***********************************************!*\
  !*** ./node_modules/quill/modules/toolbar.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addControls: () => (/* binding */ addControls),
/* harmony export */   "default": () => (/* binding */ Toolbar)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js");
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var quill_delta__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! quill-delta */ "./node_modules/quill-delta/dist/Delta.js");
/* harmony import */ var parchment__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! parchment */ "./node_modules/parchment/dist/parchment.js");
/* harmony import */ var _core_quill_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../core/quill.js */ "./node_modules/quill/core/quill.js");
/* harmony import */ var _core_logger_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../core/logger.js */ "./node_modules/quill/core/logger.js");
/* harmony import */ var _core_module_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../core/module.js */ "./node_modules/quill/core/module.js");







var debug = (0,_core_logger_js__WEBPACK_IMPORTED_MODULE_4__["default"])('quill:toolbar');
var Toolbar = /*#__PURE__*/function (_Module) {
  function Toolbar(quill, options) {
    var _this;
    _this = _Module.call(this, quill, options) || this;
    if (Array.isArray(_this.options.container)) {
      var _quill$container;
      var container = document.createElement('div');
      container.setAttribute('role', 'toolbar');
      addControls(container, _this.options.container);
      (_quill$container = quill.container) == null || (_quill$container = _quill$container.parentNode) == null || _quill$container.insertBefore(container, quill.container);
      _this.container = container;
    } else if (typeof _this.options.container === 'string') {
      _this.container = document.querySelector(_this.options.container);
    } else {
      _this.container = _this.options.container;
    }
    if (!(_this.container instanceof HTMLElement)) {
      debug.error('Container required for toolbar', _this.options);
      return (0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0__["default"])(_this);
    }
    _this.container.classList.add('ql-toolbar');
    _this.controls = [];
    _this.handlers = {};
    if (_this.options.handlers) {
      Object.keys(_this.options.handlers).forEach(function (format) {
        var _this$options$handler;
        var handler = (_this$options$handler = _this.options.handlers) == null ? void 0 : _this$options$handler[format];
        if (handler) {
          _this.addHandler(format, handler);
        }
      });
    }
    Array.from(_this.container.querySelectorAll('button, select')).forEach(function (input) {
      // @ts-expect-error
      _this.attach(input);
    });
    _this.quill.on(_core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].events.EDITOR_CHANGE, function () {
      var _this$quill$selection = _this.quill.selection.getRange(),
        range = _this$quill$selection[0]; // quill.getSelection triggers update
      _this.update(range);
    });
    return _this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__["default"])(Toolbar, _Module);
  var _proto = Toolbar.prototype;
  _proto.addHandler = function addHandler(format, handler) {
    this.handlers[format] = handler;
  };
  _proto.attach = function attach(input) {
    var _this2 = this;
    var format = Array.from(input.classList).find(function (className) {
      return className.indexOf('ql-') === 0;
    });
    if (!format) return;
    format = format.slice('ql-'.length);
    if (input.tagName === 'BUTTON') {
      input.setAttribute('type', 'button');
    }
    if (this.handlers[format] == null && this.quill.scroll.query(format) == null) {
      debug.warn('ignoring attaching to nonexistent format', format, input);
      return;
    }
    var eventName = input.tagName === 'SELECT' ? 'change' : 'click';
    input.addEventListener(eventName, function (e) {
      var value;
      if (input.tagName === 'SELECT') {
        // @ts-expect-error
        if (input.selectedIndex < 0) return;
        // @ts-expect-error
        var selected = input.options[input.selectedIndex];
        if (selected.hasAttribute('selected')) {
          value = false;
        } else {
          value = selected.value || false;
        }
      } else {
        if (input.classList.contains('ql-active')) {
          value = false;
        } else {
          // @ts-expect-error
          value = input.value || !input.hasAttribute('value');
        }
        e.preventDefault();
      }
      _this2.quill.focus();
      var _this2$quill$selectio = _this2.quill.selection.getRange(),
        range = _this2$quill$selectio[0];
      if (_this2.handlers[format] != null) {
        _this2.handlers[format].call(_this2, value);
      } else if (
      // @ts-expect-error
      _this2.quill.scroll.query(format).prototype instanceof parchment__WEBPACK_IMPORTED_MODULE_6__.EmbedBlot) {
        var _Delta$retain$delete$;
        value = prompt("Enter " + format); // eslint-disable-line no-alert
        if (!value) return;
        _this2.quill.updateContents(new quill_delta__WEBPACK_IMPORTED_MODULE_2__()
        // @ts-expect-error Fix me later
        .retain(range.index)
        // @ts-expect-error Fix me later
        ["delete"](range.length).insert((_Delta$retain$delete$ = {}, _Delta$retain$delete$[format] = value, _Delta$retain$delete$)), _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.USER);
      } else {
        _this2.quill.format(format, value, _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.USER);
      }
      _this2.update(range);
    });
    this.controls.push([format, input]);
  };
  _proto.update = function update(range) {
    var formats = range == null ? {} : this.quill.getFormat(range);
    this.controls.forEach(function (pair) {
      var format = pair[0],
        input = pair[1];
      if (input.tagName === 'SELECT') {
        var option = null;
        if (range == null) {
          option = null;
        } else if (formats[format] == null) {
          option = input.querySelector('option[selected]');
        } else if (!Array.isArray(formats[format])) {
          var value = formats[format];
          if (typeof value === 'string') {
            value = value.replace(/"/g, '\\"');
          }
          option = input.querySelector("option[value=\"" + value + "\"]");
        }
        if (option == null) {
          // @ts-expect-error TODO fix me later
          input.value = ''; // TODO make configurable?
          // @ts-expect-error TODO fix me later
          input.selectedIndex = -1;
        } else {
          option.selected = true;
        }
      } else if (range == null) {
        input.classList.remove('ql-active');
        input.setAttribute('aria-pressed', 'false');
      } else if (input.hasAttribute('value')) {
        // both being null should match (default values)
        // '1' should match with 1 (headers)
        var _value = formats[format];
        var isActive = _value === input.getAttribute('value') || _value != null && _value.toString() === input.getAttribute('value') || _value == null && !input.getAttribute('value');
        input.classList.toggle('ql-active', isActive);
        input.setAttribute('aria-pressed', isActive.toString());
      } else {
        var _isActive = formats[format] != null;
        input.classList.toggle('ql-active', _isActive);
        input.setAttribute('aria-pressed', _isActive.toString());
      }
    });
  };
  return Toolbar;
}(_core_module_js__WEBPACK_IMPORTED_MODULE_5__["default"]);
Toolbar.DEFAULTS = {};
function addButton(container, format, value) {
  var input = document.createElement('button');
  input.setAttribute('type', 'button');
  input.classList.add("ql-" + format);
  input.setAttribute('aria-pressed', 'false');
  if (value != null) {
    input.value = value;
    input.setAttribute('aria-label', format + ": " + value);
  } else {
    input.setAttribute('aria-label', format);
  }
  container.appendChild(input);
}
function addControls(container, groups) {
  if (!Array.isArray(groups[0])) {
    // @ts-expect-error
    groups = [groups];
  }
  groups.forEach(function (controls) {
    var group = document.createElement('span');
    group.classList.add('ql-formats');
    controls.forEach(function (control) {
      if (typeof control === 'string') {
        addButton(group, control);
      } else {
        var format = Object.keys(control)[0];
        var value = control[format];
        if (Array.isArray(value)) {
          addSelect(group, format, value);
        } else {
          addButton(group, format, value);
        }
      }
    });
    container.appendChild(group);
  });
}
function addSelect(container, format, values) {
  var input = document.createElement('select');
  input.classList.add("ql-" + format);
  values.forEach(function (value) {
    var option = document.createElement('option');
    if (value !== false) {
      option.setAttribute('value', String(value));
    } else {
      option.setAttribute('selected', 'selected');
    }
    input.appendChild(option);
  });
  container.appendChild(input);
}
Toolbar.DEFAULTS = {
  container: null,
  handlers: {
    clean: function clean() {
      var _this3 = this;
      var range = this.quill.getSelection();
      if (range == null) return;
      if (range.length === 0) {
        var formats = this.quill.getFormat();
        Object.keys(formats).forEach(function (name) {
          // Clean functionality in existing apps only clean inline formats
          if (_this3.quill.scroll.query(name, parchment__WEBPACK_IMPORTED_MODULE_6__.Scope.INLINE) != null) {
            _this3.quill.format(name, false, _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.USER);
          }
        });
      } else {
        this.quill.removeFormat(range.index, range.length, _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.USER);
      }
    },
    direction: function direction(value) {
      var _this$quill$getFormat = this.quill.getFormat(),
        align = _this$quill$getFormat.align;
      if (value === 'rtl' && align == null) {
        this.quill.format('align', 'right', _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.USER);
      } else if (!value && align === 'right') {
        this.quill.format('align', false, _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.USER);
      }
      this.quill.format('direction', value, _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.USER);
    },
    indent: function indent(value) {
      var range = this.quill.getSelection();
      // @ts-expect-error
      var formats = this.quill.getFormat(range);
      // @ts-expect-error
      var indent = parseInt(formats.indent || 0, 10);
      if (value === '+1' || value === '-1') {
        var modifier = value === '+1' ? 1 : -1;
        if (formats.direction === 'rtl') modifier *= -1;
        this.quill.format('indent', indent + modifier, _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.USER);
      }
    },
    link: function link(value) {
      if (value === true) {
        value = prompt('Enter link URL:'); // eslint-disable-line no-alert
      }
      this.quill.format('link', value, _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.USER);
    },
    list: function list(value) {
      var range = this.quill.getSelection();
      // @ts-expect-error
      var formats = this.quill.getFormat(range);
      if (value === 'check') {
        if (formats.list === 'checked' || formats.list === 'unchecked') {
          this.quill.format('list', false, _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.USER);
        } else {
          this.quill.format('list', 'unchecked', _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.USER);
        }
      } else {
        this.quill.format('list', value, _core_quill_js__WEBPACK_IMPORTED_MODULE_3__["default"].sources.USER);
      }
    }
  }
};


/***/ }),

/***/ "./node_modules/quill/modules/uiNode.js":
/*!**********************************************!*\
  !*** ./node_modules/quill/modules/uiNode.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TTL_FOR_VALID_SELECTION_CHANGE: () => (/* binding */ TTL_FOR_VALID_SELECTION_CHANGE),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var parchment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! parchment */ "./node_modules/parchment/dist/parchment.js");
/* harmony import */ var _core_module_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/module.js */ "./node_modules/quill/core/module.js");
/* harmony import */ var _core_quill_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/quill.js */ "./node_modules/quill/core/quill.js");




var isMac = /Mac/i.test(navigator.platform);

// Export for testing
var TTL_FOR_VALID_SELECTION_CHANGE = 100;

// A loose check to determine if the shortcut can move the caret before a UI node:
// <ANY_PARENT>[CARET]<div class="ql-ui"></div>[CONTENT]</ANY_PARENT>
var canMoveCaretBeforeUINode = function canMoveCaretBeforeUINode(event) {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' ||
  // RTL scripts or moving from the end of the previous line
  event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'Home') {
    return true;
  }
  if (isMac && event.key === 'a' && event.ctrlKey === true) {
    return true;
  }
  return false;
};
var UINode = /*#__PURE__*/function (_Module) {
  function UINode(quill, options) {
    var _this;
    _this = _Module.call(this, quill, options) || this;
    _this.isListening = false;
    _this.selectionChangeDeadline = 0;
    _this.handleArrowKeys();
    _this.handleNavigationShortcuts();
    return _this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(UINode, _Module);
  var _proto = UINode.prototype;
  _proto.handleArrowKeys = function handleArrowKeys() {
    this.quill.keyboard.addBinding({
      key: ['ArrowLeft', 'ArrowRight'],
      offset: 0,
      shiftKey: null,
      handler: function handler(range, _ref) {
        var line = _ref.line,
          event = _ref.event;
        if (!(line instanceof parchment__WEBPACK_IMPORTED_MODULE_3__.ParentBlot) || !line.uiNode) {
          return true;
        }
        var isRTL = getComputedStyle(line.domNode)['direction'] === 'rtl';
        if (isRTL && event.key !== 'ArrowRight' || !isRTL && event.key !== 'ArrowLeft') {
          return true;
        }
        this.quill.setSelection(range.index - 1, range.length + (event.shiftKey ? 1 : 0), _core_quill_js__WEBPACK_IMPORTED_MODULE_2__["default"].sources.USER);
        return false;
      }
    });
  };
  _proto.handleNavigationShortcuts = function handleNavigationShortcuts() {
    var _this2 = this;
    this.quill.root.addEventListener('keydown', function (event) {
      if (!event.defaultPrevented && canMoveCaretBeforeUINode(event)) {
        _this2.ensureListeningToSelectionChange();
      }
    });
  }

  /**
   * We only listen to the `selectionchange` event when
   * there is an intention of moving the caret to the beginning using shortcuts.
   * This is primarily implemented to prevent infinite loops, as we are changing
   * the selection within the handler of a `selectionchange` event.
   */;
  _proto.ensureListeningToSelectionChange = function ensureListeningToSelectionChange() {
    var _this3 = this;
    this.selectionChangeDeadline = Date.now() + TTL_FOR_VALID_SELECTION_CHANGE;
    if (this.isListening) return;
    this.isListening = true;
    var listener = function listener() {
      _this3.isListening = false;
      if (Date.now() <= _this3.selectionChangeDeadline) {
        _this3.handleSelectionChange();
      }
    };
    document.addEventListener('selectionchange', listener, {
      once: true
    });
  };
  _proto.handleSelectionChange = function handleSelectionChange() {
    var selection = document.getSelection();
    if (!selection) return;
    var range = selection.getRangeAt(0);
    if (range.collapsed !== true || range.startOffset !== 0) return;
    var line = this.quill.scroll.find(range.startContainer);
    if (!(line instanceof parchment__WEBPACK_IMPORTED_MODULE_3__.ParentBlot) || !line.uiNode) return;
    var newRange = document.createRange();
    newRange.setStartAfter(line.uiNode);
    newRange.setEndAfter(line.uiNode);
    selection.removeAllRanges();
    selection.addRange(newRange);
  };
  return UINode;
}(_core_module_js__WEBPACK_IMPORTED_MODULE_1__["default"]);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (UINode);

/***/ }),

/***/ "./node_modules/quill/modules/uploader.js":
/*!************************************************!*\
  !*** ./node_modules/quill/modules/uploader.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var quill_delta__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! quill-delta */ "./node_modules/quill-delta/dist/Delta.js");
/* harmony import */ var _core_emitter_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/emitter.js */ "./node_modules/quill/core/emitter.js");
/* harmony import */ var _core_module_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../core/module.js */ "./node_modules/quill/core/module.js");




var Uploader = /*#__PURE__*/function (_Module) {
  function Uploader(quill, options) {
    var _this;
    _this = _Module.call(this, quill, options) || this;
    quill.root.addEventListener('drop', function (e) {
      e.preventDefault();
      var _native = null;
      if (document.caretRangeFromPoint) {
        _native = document.caretRangeFromPoint(e.clientX, e.clientY);
        // @ts-expect-error
      } else if (document.caretPositionFromPoint) {
        // @ts-expect-error
        var position = document.caretPositionFromPoint(e.clientX, e.clientY);
        _native = document.createRange();
        _native.setStart(position.offsetNode, position.offset);
        _native.setEnd(position.offsetNode, position.offset);
      }
      var normalized = _native && quill.selection.normalizeNative(_native);
      if (normalized) {
        var _e$dataTransfer;
        var range = quill.selection.normalizedToRange(normalized);
        if ((_e$dataTransfer = e.dataTransfer) != null && _e$dataTransfer.files) {
          _this.upload(range, e.dataTransfer.files);
        }
      }
    });
    return _this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(Uploader, _Module);
  var _proto = Uploader.prototype;
  _proto.upload = function upload(range, files) {
    var _this2 = this;
    var uploads = [];
    Array.from(files).forEach(function (file) {
      var _this2$options$mimety;
      if (file && (_this2$options$mimety = _this2.options.mimetypes) != null && _this2$options$mimety.includes(file.type)) {
        uploads.push(file);
      }
    });
    if (uploads.length > 0) {
      // @ts-expect-error Fix me later
      this.options.handler.call(this, range, uploads);
    }
  };
  return Uploader;
}(_core_module_js__WEBPACK_IMPORTED_MODULE_3__["default"]);
Uploader.DEFAULTS = {
  mimetypes: ['image/png', 'image/jpeg'],
  handler: function handler(range, files) {
    var _this3 = this;
    if (!this.quill.scroll.query('image')) {
      return;
    }
    var promises = files.map(function (file) {
      return new Promise(function (resolve) {
        var reader = new FileReader();
        reader.onload = function () {
          resolve(reader.result);
        };
        reader.readAsDataURL(file);
      });
    });
    Promise.all(promises).then(function (images) {
      var update = images.reduce(function (delta, image) {
        return delta.insert({
          image: image
        });
      }, new quill_delta__WEBPACK_IMPORTED_MODULE_1__().retain(range.index)["delete"](range.length));
      _this3.quill.updateContents(update, _core_emitter_js__WEBPACK_IMPORTED_MODULE_2__["default"].sources.USER);
      _this3.quill.setSelection(range.index + images.length, _core_emitter_js__WEBPACK_IMPORTED_MODULE_2__["default"].sources.SILENT);
    });
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Uploader);

/***/ }),

/***/ "./node_modules/quill/quill.js":
/*!*************************************!*\
  !*** ./node_modules/quill/quill.js ***!
  \*************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AttributeMap: () => (/* reexport safe */ _core_js__WEBPACK_IMPORTED_MODULE_0__.AttributeMap),
/* harmony export */   Delta: () => (/* reexport safe */ _core_js__WEBPACK_IMPORTED_MODULE_0__.Delta),
/* harmony export */   Module: () => (/* reexport safe */ _core_js__WEBPACK_IMPORTED_MODULE_0__.Module),
/* harmony export */   Op: () => (/* reexport safe */ _core_js__WEBPACK_IMPORTED_MODULE_0__.Op),
/* harmony export */   OpIterator: () => (/* reexport safe */ _core_js__WEBPACK_IMPORTED_MODULE_0__.OpIterator),
/* harmony export */   Parchment: () => (/* reexport safe */ _core_js__WEBPACK_IMPORTED_MODULE_0__.Parchment),
/* harmony export */   Range: () => (/* reexport safe */ _core_js__WEBPACK_IMPORTED_MODULE_0__.Range),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core.js */ "./node_modules/quill/core.js");
/* harmony import */ var _formats_align_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./formats/align.js */ "./node_modules/quill/formats/align.js");
/* harmony import */ var _formats_direction_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./formats/direction.js */ "./node_modules/quill/formats/direction.js");
/* harmony import */ var _formats_indent_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./formats/indent.js */ "./node_modules/quill/formats/indent.js");
/* harmony import */ var _formats_blockquote_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./formats/blockquote.js */ "./node_modules/quill/formats/blockquote.js");
/* harmony import */ var _formats_header_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./formats/header.js */ "./node_modules/quill/formats/header.js");
/* harmony import */ var _formats_list_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./formats/list.js */ "./node_modules/quill/formats/list.js");
/* harmony import */ var _formats_background_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./formats/background.js */ "./node_modules/quill/formats/background.js");
/* harmony import */ var _formats_color_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./formats/color.js */ "./node_modules/quill/formats/color.js");
/* harmony import */ var _formats_font_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./formats/font.js */ "./node_modules/quill/formats/font.js");
/* harmony import */ var _formats_size_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./formats/size.js */ "./node_modules/quill/formats/size.js");
/* harmony import */ var _formats_bold_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./formats/bold.js */ "./node_modules/quill/formats/bold.js");
/* harmony import */ var _formats_italic_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./formats/italic.js */ "./node_modules/quill/formats/italic.js");
/* harmony import */ var _formats_link_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./formats/link.js */ "./node_modules/quill/formats/link.js");
/* harmony import */ var _formats_script_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./formats/script.js */ "./node_modules/quill/formats/script.js");
/* harmony import */ var _formats_strike_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./formats/strike.js */ "./node_modules/quill/formats/strike.js");
/* harmony import */ var _formats_underline_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./formats/underline.js */ "./node_modules/quill/formats/underline.js");
/* harmony import */ var _formats_formula_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./formats/formula.js */ "./node_modules/quill/formats/formula.js");
/* harmony import */ var _formats_image_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./formats/image.js */ "./node_modules/quill/formats/image.js");
/* harmony import */ var _formats_video_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./formats/video.js */ "./node_modules/quill/formats/video.js");
/* harmony import */ var _formats_code_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./formats/code.js */ "./node_modules/quill/formats/code.js");
/* harmony import */ var _modules_syntax_js__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./modules/syntax.js */ "./node_modules/quill/modules/syntax.js");
/* harmony import */ var _modules_table_js__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./modules/table.js */ "./node_modules/quill/modules/table.js");
/* harmony import */ var _modules_toolbar_js__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./modules/toolbar.js */ "./node_modules/quill/modules/toolbar.js");
/* harmony import */ var _ui_icons_js__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./ui/icons.js */ "./node_modules/quill/ui/icons.js");
/* harmony import */ var _ui_picker_js__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./ui/picker.js */ "./node_modules/quill/ui/picker.js");
/* harmony import */ var _ui_color_picker_js__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./ui/color-picker.js */ "./node_modules/quill/ui/color-picker.js");
/* harmony import */ var _ui_icon_picker_js__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./ui/icon-picker.js */ "./node_modules/quill/ui/icon-picker.js");
/* harmony import */ var _ui_tooltip_js__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./ui/tooltip.js */ "./node_modules/quill/ui/tooltip.js");
/* harmony import */ var _themes_bubble_js__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ./themes/bubble.js */ "./node_modules/quill/themes/bubble.js");
/* harmony import */ var _themes_snow_js__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ./themes/snow.js */ "./node_modules/quill/themes/snow.js");































_core_js__WEBPACK_IMPORTED_MODULE_0__["default"].register({
  'attributors/attribute/direction': _formats_direction_js__WEBPACK_IMPORTED_MODULE_2__.DirectionAttribute,
  'attributors/class/align': _formats_align_js__WEBPACK_IMPORTED_MODULE_1__.AlignClass,
  'attributors/class/background': _formats_background_js__WEBPACK_IMPORTED_MODULE_7__.BackgroundClass,
  'attributors/class/color': _formats_color_js__WEBPACK_IMPORTED_MODULE_8__.ColorClass,
  'attributors/class/direction': _formats_direction_js__WEBPACK_IMPORTED_MODULE_2__.DirectionClass,
  'attributors/class/font': _formats_font_js__WEBPACK_IMPORTED_MODULE_9__.FontClass,
  'attributors/class/size': _formats_size_js__WEBPACK_IMPORTED_MODULE_10__.SizeClass,
  'attributors/style/align': _formats_align_js__WEBPACK_IMPORTED_MODULE_1__.AlignStyle,
  'attributors/style/background': _formats_background_js__WEBPACK_IMPORTED_MODULE_7__.BackgroundStyle,
  'attributors/style/color': _formats_color_js__WEBPACK_IMPORTED_MODULE_8__.ColorStyle,
  'attributors/style/direction': _formats_direction_js__WEBPACK_IMPORTED_MODULE_2__.DirectionStyle,
  'attributors/style/font': _formats_font_js__WEBPACK_IMPORTED_MODULE_9__.FontStyle,
  'attributors/style/size': _formats_size_js__WEBPACK_IMPORTED_MODULE_10__.SizeStyle
}, true);
_core_js__WEBPACK_IMPORTED_MODULE_0__["default"].register({
  'formats/align': _formats_align_js__WEBPACK_IMPORTED_MODULE_1__.AlignClass,
  'formats/direction': _formats_direction_js__WEBPACK_IMPORTED_MODULE_2__.DirectionClass,
  'formats/indent': _formats_indent_js__WEBPACK_IMPORTED_MODULE_3__["default"],
  'formats/background': _formats_background_js__WEBPACK_IMPORTED_MODULE_7__.BackgroundStyle,
  'formats/color': _formats_color_js__WEBPACK_IMPORTED_MODULE_8__.ColorStyle,
  'formats/font': _formats_font_js__WEBPACK_IMPORTED_MODULE_9__.FontClass,
  'formats/size': _formats_size_js__WEBPACK_IMPORTED_MODULE_10__.SizeClass,
  'formats/blockquote': _formats_blockquote_js__WEBPACK_IMPORTED_MODULE_4__["default"],
  'formats/code-block': _formats_code_js__WEBPACK_IMPORTED_MODULE_20__["default"],
  'formats/header': _formats_header_js__WEBPACK_IMPORTED_MODULE_5__["default"],
  'formats/list': _formats_list_js__WEBPACK_IMPORTED_MODULE_6__["default"],
  'formats/bold': _formats_bold_js__WEBPACK_IMPORTED_MODULE_11__["default"],
  'formats/code': _formats_code_js__WEBPACK_IMPORTED_MODULE_20__.Code,
  'formats/italic': _formats_italic_js__WEBPACK_IMPORTED_MODULE_12__["default"],
  'formats/link': _formats_link_js__WEBPACK_IMPORTED_MODULE_13__["default"],
  'formats/script': _formats_script_js__WEBPACK_IMPORTED_MODULE_14__["default"],
  'formats/strike': _formats_strike_js__WEBPACK_IMPORTED_MODULE_15__["default"],
  'formats/underline': _formats_underline_js__WEBPACK_IMPORTED_MODULE_16__["default"],
  'formats/formula': _formats_formula_js__WEBPACK_IMPORTED_MODULE_17__["default"],
  'formats/image': _formats_image_js__WEBPACK_IMPORTED_MODULE_18__["default"],
  'formats/video': _formats_video_js__WEBPACK_IMPORTED_MODULE_19__["default"],
  'modules/syntax': _modules_syntax_js__WEBPACK_IMPORTED_MODULE_21__["default"],
  'modules/table': _modules_table_js__WEBPACK_IMPORTED_MODULE_22__["default"],
  'modules/toolbar': _modules_toolbar_js__WEBPACK_IMPORTED_MODULE_23__["default"],
  'themes/bubble': _themes_bubble_js__WEBPACK_IMPORTED_MODULE_29__["default"],
  'themes/snow': _themes_snow_js__WEBPACK_IMPORTED_MODULE_30__["default"],
  'ui/icons': _ui_icons_js__WEBPACK_IMPORTED_MODULE_24__["default"],
  'ui/picker': _ui_picker_js__WEBPACK_IMPORTED_MODULE_25__["default"],
  'ui/icon-picker': _ui_icon_picker_js__WEBPACK_IMPORTED_MODULE_27__["default"],
  'ui/color-picker': _ui_color_picker_js__WEBPACK_IMPORTED_MODULE_26__["default"],
  'ui/tooltip': _ui_tooltip_js__WEBPACK_IMPORTED_MODULE_28__["default"]
}, true);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_core_js__WEBPACK_IMPORTED_MODULE_0__["default"]);

/***/ }),

/***/ "./node_modules/quill/themes/base.js":
/*!*******************************************!*\
  !*** ./node_modules/quill/themes/base.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BaseTooltip: () => (/* binding */ BaseTooltip),
/* harmony export */   "default": () => (/* binding */ BaseTheme)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/merge.js");
/* harmony import */ var _core_emitter_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/emitter.js */ "./node_modules/quill/core/emitter.js");
/* harmony import */ var _core_theme_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/theme.js */ "./node_modules/quill/core/theme.js");
/* harmony import */ var _ui_color_picker_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../ui/color-picker.js */ "./node_modules/quill/ui/color-picker.js");
/* harmony import */ var _ui_icon_picker_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../ui/icon-picker.js */ "./node_modules/quill/ui/icon-picker.js");
/* harmony import */ var _ui_picker_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../ui/picker.js */ "./node_modules/quill/ui/picker.js");
/* harmony import */ var _ui_tooltip_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../ui/tooltip.js */ "./node_modules/quill/ui/tooltip.js");








var ALIGNS = [false, 'center', 'right', 'justify'];
var COLORS = ['#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff', '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff', '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2', '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466'];
var FONTS = [false, 'serif', 'monospace'];
var HEADERS = ['1', '2', '3', false];
var SIZES = ['small', false, 'large', 'huge'];
var BaseTheme = /*#__PURE__*/function (_Theme) {
  function BaseTheme(quill, options) {
    var _this;
    _this = _Theme.call(this, quill, options) || this;
    var _listener = function listener(e) {
      if (!document.body.contains(quill.root)) {
        document.body.removeEventListener('click', _listener);
        return;
      }
      if (_this.tooltip != null &&
      // @ts-expect-error
      !_this.tooltip.root.contains(e.target) &&
      // @ts-expect-error
      document.activeElement !== _this.tooltip.textbox && !_this.quill.hasFocus()) {
        _this.tooltip.hide();
      }
      if (_this.pickers != null) {
        _this.pickers.forEach(function (picker) {
          // @ts-expect-error
          if (!picker.container.contains(e.target)) {
            picker.close();
          }
        });
      }
    };
    quill.emitter.listenDOM('click', document.body, _listener);
    return _this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(BaseTheme, _Theme);
  var _proto = BaseTheme.prototype;
  _proto.addModule = function addModule(name) {
    var module = _Theme.prototype.addModule.call(this, name);
    if (name === 'toolbar') {
      // @ts-expect-error
      this.extendToolbar(module);
    }
    return module;
  };
  _proto.buildButtons = function buildButtons(buttons, icons) {
    Array.from(buttons).forEach(function (button) {
      var className = button.getAttribute('class') || '';
      className.split(/\s+/).forEach(function (name) {
        if (!name.startsWith('ql-')) return;
        name = name.slice('ql-'.length);
        if (icons[name] == null) return;
        if (name === 'direction') {
          // @ts-expect-error
          button.innerHTML = icons[name][''] + icons[name].rtl;
        } else if (typeof icons[name] === 'string') {
          // @ts-expect-error
          button.innerHTML = icons[name];
        } else {
          // @ts-expect-error
          var value = button.value || '';
          // @ts-expect-error
          if (value != null && icons[name][value]) {
            // @ts-expect-error
            button.innerHTML = icons[name][value];
          }
        }
      });
    });
  };
  _proto.buildPickers = function buildPickers(selects, icons) {
    var _this2 = this;
    this.pickers = Array.from(selects).map(function (select) {
      if (select.classList.contains('ql-align')) {
        if (select.querySelector('option') == null) {
          fillSelect(select, ALIGNS);
        }
        if (typeof icons.align === 'object') {
          return new _ui_icon_picker_js__WEBPACK_IMPORTED_MODULE_4__["default"](select, icons.align);
        }
      }
      if (select.classList.contains('ql-background') || select.classList.contains('ql-color')) {
        var format = select.classList.contains('ql-background') ? 'background' : 'color';
        if (select.querySelector('option') == null) {
          fillSelect(select, COLORS, format === 'background' ? '#ffffff' : '#000000');
        }
        return new _ui_color_picker_js__WEBPACK_IMPORTED_MODULE_3__["default"](select, icons[format]);
      }
      if (select.querySelector('option') == null) {
        if (select.classList.contains('ql-font')) {
          fillSelect(select, FONTS);
        } else if (select.classList.contains('ql-header')) {
          fillSelect(select, HEADERS);
        } else if (select.classList.contains('ql-size')) {
          fillSelect(select, SIZES);
        }
      }
      return new _ui_picker_js__WEBPACK_IMPORTED_MODULE_5__["default"](select);
    });
    var update = function update() {
      _this2.pickers.forEach(function (picker) {
        picker.update();
      });
    };
    this.quill.on(_core_emitter_js__WEBPACK_IMPORTED_MODULE_1__["default"].events.EDITOR_CHANGE, update);
  };
  return BaseTheme;
}(_core_theme_js__WEBPACK_IMPORTED_MODULE_2__["default"]);
BaseTheme.DEFAULTS = (0,lodash_es__WEBPACK_IMPORTED_MODULE_7__["default"])({}, _core_theme_js__WEBPACK_IMPORTED_MODULE_2__["default"].DEFAULTS, {
  modules: {
    toolbar: {
      handlers: {
        formula: function formula() {
          this.quill.theme.tooltip.edit('formula');
        },
        image: function image() {
          var _this3 = this;
          var fileInput = this.container.querySelector('input.ql-image[type=file]');
          if (fileInput == null) {
            fileInput = document.createElement('input');
            fileInput.setAttribute('type', 'file');
            fileInput.setAttribute('accept', this.quill.uploader.options.mimetypes.join(', '));
            fileInput.classList.add('ql-image');
            fileInput.addEventListener('change', function () {
              var range = _this3.quill.getSelection(true);
              _this3.quill.uploader.upload(range, fileInput.files);
              fileInput.value = '';
            });
            this.container.appendChild(fileInput);
          }
          fileInput.click();
        },
        video: function video() {
          this.quill.theme.tooltip.edit('video');
        }
      }
    }
  }
});
var BaseTooltip = /*#__PURE__*/function (_Tooltip) {
  function BaseTooltip(quill, boundsContainer) {
    var _this4;
    _this4 = _Tooltip.call(this, quill, boundsContainer) || this;
    _this4.textbox = _this4.root.querySelector('input[type="text"]');
    _this4.listen();
    return _this4;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(BaseTooltip, _Tooltip);
  var _proto2 = BaseTooltip.prototype;
  _proto2.listen = function listen() {
    var _this5 = this;
    // @ts-expect-error Fix me later
    this.textbox.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        _this5.save();
        event.preventDefault();
      } else if (event.key === 'Escape') {
        _this5.cancel();
        event.preventDefault();
      }
    });
  };
  _proto2.cancel = function cancel() {
    this.hide();
    this.restoreFocus();
  };
  _proto2.edit = function edit() {
    var mode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'link';
    var preview = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    this.root.classList.remove('ql-hidden');
    this.root.classList.add('ql-editing');
    if (this.textbox == null) return;
    if (preview != null) {
      this.textbox.value = preview;
    } else if (mode !== this.root.getAttribute('data-mode')) {
      this.textbox.value = '';
    }
    var bounds = this.quill.getBounds(this.quill.selection.savedRange);
    if (bounds != null) {
      this.position(bounds);
    }
    this.textbox.select();
    this.textbox.setAttribute('placeholder', this.textbox.getAttribute("data-" + mode) || '');
    this.root.setAttribute('data-mode', mode);
  };
  _proto2.restoreFocus = function restoreFocus() {
    this.quill.focus({
      preventScroll: true
    });
  };
  _proto2.save = function save() {
    // @ts-expect-error Fix me later
    var value = this.textbox.value;
    switch (this.root.getAttribute('data-mode')) {
      case 'link':
        {
          var scrollTop = this.quill.root.scrollTop;
          if (this.linkRange) {
            this.quill.formatText(this.linkRange, 'link', value, _core_emitter_js__WEBPACK_IMPORTED_MODULE_1__["default"].sources.USER);
            delete this.linkRange;
          } else {
            this.restoreFocus();
            this.quill.format('link', value, _core_emitter_js__WEBPACK_IMPORTED_MODULE_1__["default"].sources.USER);
          }
          this.quill.root.scrollTop = scrollTop;
          break;
        }
      case 'video':
        {
          value = extractVideoUrl(value);
        }
      // eslint-disable-next-line no-fallthrough
      case 'formula':
        {
          if (!value) break;
          var range = this.quill.getSelection(true);
          if (range != null) {
            var index = range.index + range.length;
            this.quill.insertEmbed(index,
            // @ts-expect-error Fix me later
            this.root.getAttribute('data-mode'), value, _core_emitter_js__WEBPACK_IMPORTED_MODULE_1__["default"].sources.USER);
            if (this.root.getAttribute('data-mode') === 'formula') {
              this.quill.insertText(index + 1, ' ', _core_emitter_js__WEBPACK_IMPORTED_MODULE_1__["default"].sources.USER);
            }
            this.quill.setSelection(index + 2, _core_emitter_js__WEBPACK_IMPORTED_MODULE_1__["default"].sources.USER);
          }
          break;
        }
      default:
    }
    // @ts-expect-error Fix me later
    this.textbox.value = '';
    this.hide();
  };
  return BaseTooltip;
}(_ui_tooltip_js__WEBPACK_IMPORTED_MODULE_6__["default"]);
function extractVideoUrl(url) {
  var match = url.match(/^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtube\.com\/watch.*v=([a-zA-Z0-9_-]+)/) || url.match(/^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (match) {
    return (match[1] || 'https') + "://www.youtube.com/embed/" + match[2] + "?showinfo=0";
  }
  // eslint-disable-next-line no-cond-assign
  if (match = url.match(/^(?:(https?):\/\/)?(?:www\.)?vimeo\.com\/(\d+)/)) {
    return (match[1] || 'https') + "://player.vimeo.com/video/" + match[2] + "/";
  }
  return url;
}
function fillSelect(select, values) {
  var defaultValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  values.forEach(function (value) {
    var option = document.createElement('option');
    if (value === defaultValue) {
      option.setAttribute('selected', 'selected');
    } else {
      option.setAttribute('value', String(value));
    }
    select.appendChild(option);
  });
}


/***/ }),

/***/ "./node_modules/quill/themes/bubble.js":
/*!*********************************************!*\
  !*** ./node_modules/quill/themes/bubble.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BubbleTooltip: () => (/* binding */ BubbleTooltip),
/* harmony export */   "default": () => (/* binding */ BubbleTheme)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/merge.js");
/* harmony import */ var _core_emitter_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/emitter.js */ "./node_modules/quill/core/emitter.js");
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./base.js */ "./node_modules/quill/themes/base.js");
/* harmony import */ var _core_selection_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../core/selection.js */ "./node_modules/quill/core/selection.js");
/* harmony import */ var _ui_icons_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../ui/icons.js */ "./node_modules/quill/ui/icons.js");
/* harmony import */ var _core_quill_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../core/quill.js */ "./node_modules/quill/core/quill.js");







var TOOLBAR_CONFIG = [['bold', 'italic', 'link'], [{
  header: 1
}, {
  header: 2
}, 'blockquote']];
var BubbleTooltip = /*#__PURE__*/function (_BaseTooltip) {
  function BubbleTooltip(quill, bounds) {
    var _this;
    _this = _BaseTooltip.call(this, quill, bounds) || this;
    _this.quill.on(_core_emitter_js__WEBPACK_IMPORTED_MODULE_1__["default"].events.EDITOR_CHANGE, function (type, range, oldRange, source) {
      if (type !== _core_emitter_js__WEBPACK_IMPORTED_MODULE_1__["default"].events.SELECTION_CHANGE) return;
      if (range != null && range.length > 0 && source === _core_emitter_js__WEBPACK_IMPORTED_MODULE_1__["default"].sources.USER) {
        _this.show();
        // Lock our width so we will expand beyond our offsetParent boundaries
        _this.root.style.left = '0px';
        _this.root.style.width = '';
        _this.root.style.width = _this.root.offsetWidth + "px";
        var lines = _this.quill.getLines(range.index, range.length);
        if (lines.length === 1) {
          var _bounds = _this.quill.getBounds(range);
          if (_bounds != null) {
            _this.position(_bounds);
          }
        } else {
          var lastLine = lines[lines.length - 1];
          var index = _this.quill.getIndex(lastLine);
          var length = Math.min(lastLine.length() - 1, range.index + range.length - index);
          var indexBounds = _this.quill.getBounds(new _core_selection_js__WEBPACK_IMPORTED_MODULE_3__.Range(index, length));
          if (indexBounds != null) {
            _this.position(indexBounds);
          }
        }
      } else if (document.activeElement !== _this.textbox && _this.quill.hasFocus()) {
        _this.hide();
      }
    });
    return _this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(BubbleTooltip, _BaseTooltip);
  var _proto = BubbleTooltip.prototype;
  _proto.listen = function listen() {
    var _this2 = this;
    _BaseTooltip.prototype.listen.call(this);
    // @ts-expect-error Fix me later
    this.root.querySelector('.ql-close').addEventListener('click', function () {
      _this2.root.classList.remove('ql-editing');
    });
    this.quill.on(_core_emitter_js__WEBPACK_IMPORTED_MODULE_1__["default"].events.SCROLL_OPTIMIZE, function () {
      // Let selection be restored by toolbar handlers before repositioning
      setTimeout(function () {
        if (_this2.root.classList.contains('ql-hidden')) return;
        var range = _this2.quill.getSelection();
        if (range != null) {
          var bounds = _this2.quill.getBounds(range);
          if (bounds != null) {
            _this2.position(bounds);
          }
        }
      }, 1);
    });
  };
  _proto.cancel = function cancel() {
    this.show();
  };
  _proto.position = function position(reference) {
    var shift = _BaseTooltip.prototype.position.call(this, reference);
    var arrow = this.root.querySelector('.ql-tooltip-arrow');
    // @ts-expect-error
    arrow.style.marginLeft = '';
    if (shift !== 0) {
      // @ts-expect-error
      arrow.style.marginLeft = -1 * shift - arrow.offsetWidth / 2 + "px";
    }
    return shift;
  };
  return BubbleTooltip;
}(_base_js__WEBPACK_IMPORTED_MODULE_2__.BaseTooltip);
BubbleTooltip.TEMPLATE = ['<span class="ql-tooltip-arrow"></span>', '<div class="ql-tooltip-editor">', '<input type="text" data-formula="e=mc^2" data-link="https://quilljs.com" data-video="Embed URL">', '<a class="ql-close"></a>', '</div>'].join('');
var BubbleTheme = /*#__PURE__*/function (_BaseTheme) {
  function BubbleTheme(quill, options) {
    var _this3;
    if (options.modules.toolbar != null && options.modules.toolbar.container == null) {
      options.modules.toolbar.container = TOOLBAR_CONFIG;
    }
    _this3 = _BaseTheme.call(this, quill, options) || this;
    _this3.quill.container.classList.add('ql-bubble');
    return _this3;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(BubbleTheme, _BaseTheme);
  var _proto2 = BubbleTheme.prototype;
  _proto2.extendToolbar = function extendToolbar(toolbar) {
    // @ts-expect-error
    this.tooltip = new BubbleTooltip(this.quill, this.options.bounds);
    if (toolbar.container != null) {
      this.tooltip.root.appendChild(toolbar.container);
      this.buildButtons(toolbar.container.querySelectorAll('button'), _ui_icons_js__WEBPACK_IMPORTED_MODULE_4__["default"]);
      this.buildPickers(toolbar.container.querySelectorAll('select'), _ui_icons_js__WEBPACK_IMPORTED_MODULE_4__["default"]);
    }
  };
  return BubbleTheme;
}(_base_js__WEBPACK_IMPORTED_MODULE_2__["default"]);
BubbleTheme.DEFAULTS = (0,lodash_es__WEBPACK_IMPORTED_MODULE_6__["default"])({}, _base_js__WEBPACK_IMPORTED_MODULE_2__["default"].DEFAULTS, {
  modules: {
    toolbar: {
      handlers: {
        link: function link(value) {
          if (!value) {
            this.quill.format('link', false, _core_quill_js__WEBPACK_IMPORTED_MODULE_5__["default"].sources.USER);
          } else {
            // @ts-expect-error
            this.quill.theme.tooltip.edit();
          }
        }
      }
    }
  }
});


/***/ }),

/***/ "./node_modules/quill/themes/snow.js":
/*!*******************************************!*\
  !*** ./node_modules/quill/themes/snow.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/merge.js");
/* harmony import */ var _core_emitter_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/emitter.js */ "./node_modules/quill/core/emitter.js");
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./base.js */ "./node_modules/quill/themes/base.js");
/* harmony import */ var _formats_link_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../formats/link.js */ "./node_modules/quill/formats/link.js");
/* harmony import */ var _core_selection_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../core/selection.js */ "./node_modules/quill/core/selection.js");
/* harmony import */ var _ui_icons_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../ui/icons.js */ "./node_modules/quill/ui/icons.js");
/* harmony import */ var _core_quill_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../core/quill.js */ "./node_modules/quill/core/quill.js");








var TOOLBAR_CONFIG = [[{
  header: ['1', '2', '3', false]
}], ['bold', 'italic', 'underline', 'link'], [{
  list: 'ordered'
}, {
  list: 'bullet'
}], ['clean']];
var SnowTooltip = /*#__PURE__*/function (_BaseTooltip) {
  function SnowTooltip() {
    var _this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _BaseTooltip.call.apply(_BaseTooltip, [this].concat(args)) || this;
    _this.preview = _this.root.querySelector('a.ql-preview');
    return _this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(SnowTooltip, _BaseTooltip);
  var _proto = SnowTooltip.prototype;
  _proto.listen = function listen() {
    var _this2 = this;
    _BaseTooltip.prototype.listen.call(this);
    // @ts-expect-error Fix me later
    this.root.querySelector('a.ql-action').addEventListener('click', function (event) {
      if (_this2.root.classList.contains('ql-editing')) {
        _this2.save();
      } else {
        // @ts-expect-error Fix me later
        _this2.edit('link', _this2.preview.textContent);
      }
      event.preventDefault();
    });
    // @ts-expect-error Fix me later
    this.root.querySelector('a.ql-remove').addEventListener('click', function (event) {
      if (_this2.linkRange != null) {
        var range = _this2.linkRange;
        _this2.restoreFocus();
        _this2.quill.formatText(range, 'link', false, _core_emitter_js__WEBPACK_IMPORTED_MODULE_1__["default"].sources.USER);
        delete _this2.linkRange;
      }
      event.preventDefault();
      _this2.hide();
    });
    this.quill.on(_core_emitter_js__WEBPACK_IMPORTED_MODULE_1__["default"].events.SELECTION_CHANGE, function (range, oldRange, source) {
      if (range == null) return;
      if (range.length === 0 && source === _core_emitter_js__WEBPACK_IMPORTED_MODULE_1__["default"].sources.USER) {
        var _this2$quill$scroll$d = _this2.quill.scroll.descendant(_formats_link_js__WEBPACK_IMPORTED_MODULE_3__["default"], range.index),
          link = _this2$quill$scroll$d[0],
          offset = _this2$quill$scroll$d[1];
        if (link != null) {
          _this2.linkRange = new _core_selection_js__WEBPACK_IMPORTED_MODULE_4__.Range(range.index - offset, link.length());
          var preview = _formats_link_js__WEBPACK_IMPORTED_MODULE_3__["default"].formats(link.domNode);
          // @ts-expect-error Fix me later
          _this2.preview.textContent = preview;
          // @ts-expect-error Fix me later
          _this2.preview.setAttribute('href', preview);
          _this2.show();
          var bounds = _this2.quill.getBounds(_this2.linkRange);
          if (bounds != null) {
            _this2.position(bounds);
          }
          return;
        }
      } else {
        delete _this2.linkRange;
      }
      _this2.hide();
    });
  };
  _proto.show = function show() {
    _BaseTooltip.prototype.show.call(this);
    this.root.removeAttribute('data-mode');
  };
  return SnowTooltip;
}(_base_js__WEBPACK_IMPORTED_MODULE_2__.BaseTooltip);
SnowTooltip.TEMPLATE = ['<a class="ql-preview" rel="noopener noreferrer" target="_blank" href="about:blank"></a>', '<input type="text" data-formula="e=mc^2" data-link="https://quilljs.com" data-video="Embed URL">', '<a class="ql-action"></a>', '<a class="ql-remove"></a>'].join('');
var SnowTheme = /*#__PURE__*/function (_BaseTheme) {
  function SnowTheme(quill, options) {
    var _this3;
    if (options.modules.toolbar != null && options.modules.toolbar.container == null) {
      options.modules.toolbar.container = TOOLBAR_CONFIG;
    }
    _this3 = _BaseTheme.call(this, quill, options) || this;
    _this3.quill.container.classList.add('ql-snow');
    return _this3;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(SnowTheme, _BaseTheme);
  var _proto2 = SnowTheme.prototype;
  _proto2.extendToolbar = function extendToolbar(toolbar) {
    if (toolbar.container != null) {
      toolbar.container.classList.add('ql-snow');
      this.buildButtons(toolbar.container.querySelectorAll('button'), _ui_icons_js__WEBPACK_IMPORTED_MODULE_5__["default"]);
      this.buildPickers(toolbar.container.querySelectorAll('select'), _ui_icons_js__WEBPACK_IMPORTED_MODULE_5__["default"]);
      // @ts-expect-error
      this.tooltip = new SnowTooltip(this.quill, this.options.bounds);
      if (toolbar.container.querySelector('.ql-link')) {
        this.quill.keyboard.addBinding({
          key: 'k',
          shortKey: true
        }, function (_range, context) {
          toolbar.handlers.link.call(toolbar, !context.format.link);
        });
      }
    }
  };
  return SnowTheme;
}(_base_js__WEBPACK_IMPORTED_MODULE_2__["default"]);
SnowTheme.DEFAULTS = (0,lodash_es__WEBPACK_IMPORTED_MODULE_7__["default"])({}, _base_js__WEBPACK_IMPORTED_MODULE_2__["default"].DEFAULTS, {
  modules: {
    toolbar: {
      handlers: {
        link: function link(value) {
          if (value) {
            var range = this.quill.getSelection();
            if (range == null || range.length === 0) return;
            var preview = this.quill.getText(range);
            if (/^\S+@\S+\.\S+$/.test(preview) && preview.indexOf('mailto:') !== 0) {
              preview = "mailto:" + preview;
            }
            // @ts-expect-error
            var tooltip = this.quill.theme.tooltip;
            tooltip.edit('link', preview);
          } else {
            this.quill.format('link', false, _core_quill_js__WEBPACK_IMPORTED_MODULE_6__["default"].sources.USER);
          }
        }
      }
    }
  }
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SnowTheme);

/***/ }),

/***/ "./node_modules/quill/ui/color-picker.js":
/*!***********************************************!*\
  !*** ./node_modules/quill/ui/color-picker.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var _picker_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./picker.js */ "./node_modules/quill/ui/picker.js");


var ColorPicker = /*#__PURE__*/function (_Picker) {
  function ColorPicker(select, label) {
    var _this;
    _this = _Picker.call(this, select) || this;
    _this.label.innerHTML = label;
    _this.container.classList.add('ql-color-picker');
    Array.from(_this.container.querySelectorAll('.ql-picker-item')).slice(0, 7).forEach(function (item) {
      item.classList.add('ql-primary');
    });
    return _this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(ColorPicker, _Picker);
  var _proto = ColorPicker.prototype;
  _proto.buildItem = function buildItem(option) {
    var item = _Picker.prototype.buildItem.call(this, option);
    item.style.backgroundColor = option.getAttribute('value') || '';
    return item;
  };
  _proto.selectItem = function selectItem(item, trigger) {
    _Picker.prototype.selectItem.call(this, item, trigger);
    var colorLabel = this.label.querySelector('.ql-color-label');
    var value = item ? item.getAttribute('data-value') || '' : '';
    if (colorLabel) {
      if (colorLabel.tagName === 'line') {
        colorLabel.style.stroke = value;
      } else {
        colorLabel.style.fill = value;
      }
    }
  };
  return ColorPicker;
}(_picker_js__WEBPACK_IMPORTED_MODULE_1__["default"]);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ColorPicker);

/***/ }),

/***/ "./node_modules/quill/ui/icon-picker.js":
/*!**********************************************!*\
  !*** ./node_modules/quill/ui/icon-picker.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var _picker_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./picker.js */ "./node_modules/quill/ui/picker.js");


var IconPicker = /*#__PURE__*/function (_Picker) {
  function IconPicker(select, icons) {
    var _this;
    _this = _Picker.call(this, select) || this;
    _this.container.classList.add('ql-icon-picker');
    Array.from(_this.container.querySelectorAll('.ql-picker-item')).forEach(function (item) {
      item.innerHTML = icons[item.getAttribute('data-value') || ''];
    });
    _this.defaultItem = _this.container.querySelector('.ql-selected');
    _this.selectItem(_this.defaultItem);
    return _this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(IconPicker, _Picker);
  var _proto = IconPicker.prototype;
  _proto.selectItem = function selectItem(target, trigger) {
    _Picker.prototype.selectItem.call(this, target, trigger);
    var item = target || this.defaultItem;
    if (item != null) {
      if (this.label.innerHTML === item.innerHTML) return;
      this.label.innerHTML = item.innerHTML;
    }
  };
  return IconPicker;
}(_picker_js__WEBPACK_IMPORTED_MODULE_1__["default"]);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (IconPicker);

/***/ }),

/***/ "./node_modules/quill/ui/icons.js":
/*!****************************************!*\
  !*** ./node_modules/quill/ui/icons.js ***!
  \****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var alignLeftIcon = "<svg viewbox=\"0 0 18 18\"><line class=\"ql-stroke\" x1=\"3\" x2=\"15\" y1=\"9\" y2=\"9\"/><line class=\"ql-stroke\" x1=\"3\" x2=\"13\" y1=\"14\" y2=\"14\"/><line class=\"ql-stroke\" x1=\"3\" x2=\"9\" y1=\"4\" y2=\"4\"/></svg>";
var alignCenterIcon = "<svg viewbox=\"0 0 18 18\"><line class=\"ql-stroke\" x1=\"15\" x2=\"3\" y1=\"9\" y2=\"9\"/><line class=\"ql-stroke\" x1=\"14\" x2=\"4\" y1=\"14\" y2=\"14\"/><line class=\"ql-stroke\" x1=\"12\" x2=\"6\" y1=\"4\" y2=\"4\"/></svg>";
var alignRightIcon = "<svg viewbox=\"0 0 18 18\"><line class=\"ql-stroke\" x1=\"15\" x2=\"3\" y1=\"9\" y2=\"9\"/><line class=\"ql-stroke\" x1=\"15\" x2=\"5\" y1=\"14\" y2=\"14\"/><line class=\"ql-stroke\" x1=\"15\" x2=\"9\" y1=\"4\" y2=\"4\"/></svg>";
var alignJustifyIcon = "<svg viewbox=\"0 0 18 18\"><line class=\"ql-stroke\" x1=\"15\" x2=\"3\" y1=\"9\" y2=\"9\"/><line class=\"ql-stroke\" x1=\"15\" x2=\"3\" y1=\"14\" y2=\"14\"/><line class=\"ql-stroke\" x1=\"15\" x2=\"3\" y1=\"4\" y2=\"4\"/></svg>";
var backgroundIcon = "<svg viewbox=\"0 0 18 18\"><g class=\"ql-fill ql-color-label\"><polygon points=\"6 6.868 6 6 5 6 5 7 5.942 7 6 6.868\"/><rect height=\"1\" width=\"1\" x=\"4\" y=\"4\"/><polygon points=\"6.817 5 6 5 6 6 6.38 6 6.817 5\"/><rect height=\"1\" width=\"1\" x=\"2\" y=\"6\"/><rect height=\"1\" width=\"1\" x=\"3\" y=\"5\"/><rect height=\"1\" width=\"1\" x=\"4\" y=\"7\"/><polygon points=\"4 11.439 4 11 3 11 3 12 3.755 12 4 11.439\"/><rect height=\"1\" width=\"1\" x=\"2\" y=\"12\"/><rect height=\"1\" width=\"1\" x=\"2\" y=\"9\"/><rect height=\"1\" width=\"1\" x=\"2\" y=\"15\"/><polygon points=\"4.63 10 4 10 4 11 4.192 11 4.63 10\"/><rect height=\"1\" width=\"1\" x=\"3\" y=\"8\"/><path d=\"M10.832,4.2L11,4.582V4H10.708A1.948,1.948,0,0,1,10.832,4.2Z\"/><path d=\"M7,4.582L7.168,4.2A1.929,1.929,0,0,1,7.292,4H7V4.582Z\"/><path d=\"M8,13H7.683l-0.351.8a1.933,1.933,0,0,1-.124.2H8V13Z\"/><rect height=\"1\" width=\"1\" x=\"12\" y=\"2\"/><rect height=\"1\" width=\"1\" x=\"11\" y=\"3\"/><path d=\"M9,3H8V3.282A1.985,1.985,0,0,1,9,3Z\"/><rect height=\"1\" width=\"1\" x=\"2\" y=\"3\"/><rect height=\"1\" width=\"1\" x=\"6\" y=\"2\"/><rect height=\"1\" width=\"1\" x=\"3\" y=\"2\"/><rect height=\"1\" width=\"1\" x=\"5\" y=\"3\"/><rect height=\"1\" width=\"1\" x=\"9\" y=\"2\"/><rect height=\"1\" width=\"1\" x=\"15\" y=\"14\"/><polygon points=\"13.447 10.174 13.469 10.225 13.472 10.232 13.808 11 14 11 14 10 13.37 10 13.447 10.174\"/><rect height=\"1\" width=\"1\" x=\"13\" y=\"7\"/><rect height=\"1\" width=\"1\" x=\"15\" y=\"5\"/><rect height=\"1\" width=\"1\" x=\"14\" y=\"6\"/><rect height=\"1\" width=\"1\" x=\"15\" y=\"8\"/><rect height=\"1\" width=\"1\" x=\"14\" y=\"9\"/><path d=\"M3.775,14H3v1H4V14.314A1.97,1.97,0,0,1,3.775,14Z\"/><rect height=\"1\" width=\"1\" x=\"14\" y=\"3\"/><polygon points=\"12 6.868 12 6 11.62 6 12 6.868\"/><rect height=\"1\" width=\"1\" x=\"15\" y=\"2\"/><rect height=\"1\" width=\"1\" x=\"12\" y=\"5\"/><rect height=\"1\" width=\"1\" x=\"13\" y=\"4\"/><polygon points=\"12.933 9 13 9 13 8 12.495 8 12.933 9\"/><rect height=\"1\" width=\"1\" x=\"9\" y=\"14\"/><rect height=\"1\" width=\"1\" x=\"8\" y=\"15\"/><path d=\"M6,14.926V15H7V14.316A1.993,1.993,0,0,1,6,14.926Z\"/><rect height=\"1\" width=\"1\" x=\"5\" y=\"15\"/><path d=\"M10.668,13.8L10.317,13H10v1h0.792A1.947,1.947,0,0,1,10.668,13.8Z\"/><rect height=\"1\" width=\"1\" x=\"11\" y=\"15\"/><path d=\"M14.332,12.2a1.99,1.99,0,0,1,.166.8H15V12H14.245Z\"/><rect height=\"1\" width=\"1\" x=\"14\" y=\"15\"/><rect height=\"1\" width=\"1\" x=\"15\" y=\"11\"/></g><polyline class=\"ql-stroke\" points=\"5.5 13 9 5 12.5 13\"/><line class=\"ql-stroke\" x1=\"11.63\" x2=\"6.38\" y1=\"11\" y2=\"11\"/></svg>";
var blockquoteIcon = "<svg viewbox=\"0 0 18 18\"><rect class=\"ql-fill ql-stroke\" height=\"3\" width=\"3\" x=\"4\" y=\"5\"/><rect class=\"ql-fill ql-stroke\" height=\"3\" width=\"3\" x=\"11\" y=\"5\"/><path class=\"ql-even ql-fill ql-stroke\" d=\"M7,8c0,4.031-3,5-3,5\"/><path class=\"ql-even ql-fill ql-stroke\" d=\"M14,8c0,4.031-3,5-3,5\"/></svg>";
var boldIcon = "<svg viewbox=\"0 0 18 18\"><path class=\"ql-stroke\" d=\"M5,4H9.5A2.5,2.5,0,0,1,12,6.5v0A2.5,2.5,0,0,1,9.5,9H5A0,0,0,0,1,5,9V4A0,0,0,0,1,5,4Z\"/><path class=\"ql-stroke\" d=\"M5,9h5.5A2.5,2.5,0,0,1,13,11.5v0A2.5,2.5,0,0,1,10.5,14H5a0,0,0,0,1,0,0V9A0,0,0,0,1,5,9Z\"/></svg>";
var cleanIcon = "<svg class=\"\" viewbox=\"0 0 18 18\"><line class=\"ql-stroke\" x1=\"5\" x2=\"13\" y1=\"3\" y2=\"3\"/><line class=\"ql-stroke\" x1=\"6\" x2=\"9.35\" y1=\"12\" y2=\"3\"/><line class=\"ql-stroke\" x1=\"11\" x2=\"15\" y1=\"11\" y2=\"15\"/><line class=\"ql-stroke\" x1=\"15\" x2=\"11\" y1=\"11\" y2=\"15\"/><rect class=\"ql-fill\" height=\"1\" rx=\"0.5\" ry=\"0.5\" width=\"7\" x=\"2\" y=\"14\"/></svg>";
var codeIcon = "<svg viewbox=\"0 0 18 18\"><polyline class=\"ql-even ql-stroke\" points=\"5 7 3 9 5 11\"/><polyline class=\"ql-even ql-stroke\" points=\"13 7 15 9 13 11\"/><line class=\"ql-stroke\" x1=\"10\" x2=\"8\" y1=\"5\" y2=\"13\"/></svg>";
var colorIcon = "<svg viewbox=\"0 0 18 18\"><line class=\"ql-color-label ql-stroke ql-transparent\" x1=\"3\" x2=\"15\" y1=\"15\" y2=\"15\"/><polyline class=\"ql-stroke\" points=\"5.5 11 9 3 12.5 11\"/><line class=\"ql-stroke\" x1=\"11.63\" x2=\"6.38\" y1=\"9\" y2=\"9\"/></svg>";
var directionLeftToRightIcon = "<svg viewbox=\"0 0 18 18\"><polygon class=\"ql-stroke ql-fill\" points=\"3 11 5 9 3 7 3 11\"/><line class=\"ql-stroke ql-fill\" x1=\"15\" x2=\"11\" y1=\"4\" y2=\"4\"/><path class=\"ql-fill\" d=\"M11,3a3,3,0,0,0,0,6h1V3H11Z\"/><rect class=\"ql-fill\" height=\"11\" width=\"1\" x=\"11\" y=\"4\"/><rect class=\"ql-fill\" height=\"11\" width=\"1\" x=\"13\" y=\"4\"/></svg>";
var directionRightToLeftIcon = "<svg viewbox=\"0 0 18 18\"><polygon class=\"ql-stroke ql-fill\" points=\"15 12 13 10 15 8 15 12\"/><line class=\"ql-stroke ql-fill\" x1=\"9\" x2=\"5\" y1=\"4\" y2=\"4\"/><path class=\"ql-fill\" d=\"M5,3A3,3,0,0,0,5,9H6V3H5Z\"/><rect class=\"ql-fill\" height=\"11\" width=\"1\" x=\"5\" y=\"4\"/><rect class=\"ql-fill\" height=\"11\" width=\"1\" x=\"7\" y=\"4\"/></svg>";
var formulaIcon = "<svg viewbox=\"0 0 18 18\"><path class=\"ql-fill\" d=\"M11.759,2.482a2.561,2.561,0,0,0-3.53.607A7.656,7.656,0,0,0,6.8,6.2C6.109,9.188,5.275,14.677,4.15,14.927a1.545,1.545,0,0,0-1.3-.933A0.922,0.922,0,0,0,2,15.036S1.954,16,4.119,16s3.091-2.691,3.7-5.553c0.177-.826.36-1.726,0.554-2.6L8.775,6.2c0.381-1.421.807-2.521,1.306-2.676a1.014,1.014,0,0,0,1.02.56A0.966,0.966,0,0,0,11.759,2.482Z\"/><rect class=\"ql-fill\" height=\"1.6\" rx=\"0.8\" ry=\"0.8\" width=\"5\" x=\"5.15\" y=\"6.2\"/><path class=\"ql-fill\" d=\"M13.663,12.027a1.662,1.662,0,0,1,.266-0.276q0.193,0.069.456,0.138a2.1,2.1,0,0,0,.535.069,1.075,1.075,0,0,0,.767-0.3,1.044,1.044,0,0,0,.314-0.8,0.84,0.84,0,0,0-.238-0.619,0.8,0.8,0,0,0-.594-0.239,1.154,1.154,0,0,0-.781.3,4.607,4.607,0,0,0-.781,1q-0.091.15-.218,0.346l-0.246.38c-0.068-.288-0.137-0.582-0.212-0.885-0.459-1.847-2.494-.984-2.941-0.8-0.482.2-.353,0.647-0.094,0.529a0.869,0.869,0,0,1,1.281.585c0.217,0.751.377,1.436,0.527,2.038a5.688,5.688,0,0,1-.362.467,2.69,2.69,0,0,1-.264.271q-0.221-.08-0.471-0.147a2.029,2.029,0,0,0-.522-0.066,1.079,1.079,0,0,0-.768.3A1.058,1.058,0,0,0,9,15.131a0.82,0.82,0,0,0,.832.852,1.134,1.134,0,0,0,.787-0.3,5.11,5.11,0,0,0,.776-0.993q0.141-.219.215-0.34c0.046-.076.122-0.194,0.223-0.346a2.786,2.786,0,0,0,.918,1.726,2.582,2.582,0,0,0,2.376-.185c0.317-.181.212-0.565,0-0.494A0.807,0.807,0,0,1,14.176,15a5.159,5.159,0,0,1-.913-2.446l0,0Q13.487,12.24,13.663,12.027Z\"/></svg>";
var headerIcon = "<svg viewBox=\"0 0 18 18\"><path class=\"ql-fill\" d=\"M10,4V14a1,1,0,0,1-2,0V10H3v4a1,1,0,0,1-2,0V4A1,1,0,0,1,3,4V8H8V4a1,1,0,0,1,2,0Zm6.06787,9.209H14.98975V7.59863a.54085.54085,0,0,0-.605-.60547h-.62744a1.01119,1.01119,0,0,0-.748.29688L11.645,8.56641a.5435.5435,0,0,0-.022.8584l.28613.30762a.53861.53861,0,0,0,.84717.0332l.09912-.08789a1.2137,1.2137,0,0,0,.2417-.35254h.02246s-.01123.30859-.01123.60547V13.209H12.041a.54085.54085,0,0,0-.605.60547v.43945a.54085.54085,0,0,0,.605.60547h4.02686a.54085.54085,0,0,0,.605-.60547v-.43945A.54085.54085,0,0,0,16.06787,13.209Z\"/></svg>";
var header2Icon = "<svg viewBox=\"0 0 18 18\"><path class=\"ql-fill\" d=\"M16.73975,13.81445v.43945a.54085.54085,0,0,1-.605.60547H11.855a.58392.58392,0,0,1-.64893-.60547V14.0127c0-2.90527,3.39941-3.42187,3.39941-4.55469a.77675.77675,0,0,0-.84717-.78125,1.17684,1.17684,0,0,0-.83594.38477c-.2749.26367-.561.374-.85791.13184l-.4292-.34082c-.30811-.24219-.38525-.51758-.1543-.81445a2.97155,2.97155,0,0,1,2.45361-1.17676,2.45393,2.45393,0,0,1,2.68408,2.40918c0,2.45312-3.1792,2.92676-3.27832,3.93848h2.79443A.54085.54085,0,0,1,16.73975,13.81445ZM9,3A.99974.99974,0,0,0,8,4V8H3V4A1,1,0,0,0,1,4V14a1,1,0,0,0,2,0V10H8v4a1,1,0,0,0,2,0V4A.99974.99974,0,0,0,9,3Z\"/></svg>";
var header3Icon = "<svg viewBox=\"0 0 18 18\"><path class=\"ql-fill\" d=\"M16.65186,12.30664a2.6742,2.6742,0,0,1-2.915,2.68457,3.96592,3.96592,0,0,1-2.25537-.6709.56007.56007,0,0,1-.13232-.83594L11.64648,13c.209-.34082.48389-.36328.82471-.1543a2.32654,2.32654,0,0,0,1.12256.33008c.71484,0,1.12207-.35156,1.12207-.78125,0-.61523-.61621-.86816-1.46338-.86816H13.2085a.65159.65159,0,0,1-.68213-.41895l-.05518-.10937a.67114.67114,0,0,1,.14307-.78125l.71533-.86914a8.55289,8.55289,0,0,1,.68213-.7373V8.58887a3.93913,3.93913,0,0,1-.748.05469H11.9873a.54085.54085,0,0,1-.605-.60547V7.59863a.54085.54085,0,0,1,.605-.60547h3.75146a.53773.53773,0,0,1,.60547.59375v.17676a1.03723,1.03723,0,0,1-.27539.748L14.74854,10.0293A2.31132,2.31132,0,0,1,16.65186,12.30664ZM9,3A.99974.99974,0,0,0,8,4V8H3V4A1,1,0,0,0,1,4V14a1,1,0,0,0,2,0V10H8v4a1,1,0,0,0,2,0V4A.99974.99974,0,0,0,9,3Z\"/></svg>";
var header4Icon = "<svg viewBox=\"0 0 18 18\"><path class=\"ql-fill\" d=\"M10,4V14a1,1,0,0,1-2,0V10H3v4a1,1,0,0,1-2,0V4A1,1,0,0,1,3,4V8H8V4a1,1,0,0,1,2,0Zm7.05371,7.96582v.38477c0,.39648-.165.60547-.46191.60547h-.47314v1.29785a.54085.54085,0,0,1-.605.60547h-.69336a.54085.54085,0,0,1-.605-.60547V12.95605H11.333a.5412.5412,0,0,1-.60547-.60547v-.15332a1.199,1.199,0,0,1,.22021-.748l2.56348-4.05957a.7819.7819,0,0,1,.72607-.39648h1.27637a.54085.54085,0,0,1,.605.60547v3.7627h.33008A.54055.54055,0,0,1,17.05371,11.96582ZM14.28125,8.7207h-.022a4.18969,4.18969,0,0,1-.38525.81348l-1.188,1.80469v.02246h1.5293V9.60059A7.04058,7.04058,0,0,1,14.28125,8.7207Z\"/></svg>";
var header5Icon = "<svg viewBox=\"0 0 18 18\"><path class=\"ql-fill\" d=\"M16.74023,12.18555a2.75131,2.75131,0,0,1-2.91553,2.80566,3.908,3.908,0,0,1-2.25537-.68164.54809.54809,0,0,1-.13184-.8252L11.73438,13c.209-.34082.48389-.36328.8252-.1543a2.23757,2.23757,0,0,0,1.1001.33008,1.01827,1.01827,0,0,0,1.1001-.96777c0-.61621-.53906-.97949-1.25439-.97949a2.15554,2.15554,0,0,0-.64893.09961,1.15209,1.15209,0,0,1-.814.01074l-.12109-.04395a.64116.64116,0,0,1-.45117-.71484l.231-3.00391a.56666.56666,0,0,1,.62744-.583H15.541a.54085.54085,0,0,1,.605.60547v.43945a.54085.54085,0,0,1-.605.60547H13.41748l-.04395.72559a1.29306,1.29306,0,0,1-.04395.30859h.022a2.39776,2.39776,0,0,1,.57227-.07715A2.53266,2.53266,0,0,1,16.74023,12.18555ZM9,3A.99974.99974,0,0,0,8,4V8H3V4A1,1,0,0,0,1,4V14a1,1,0,0,0,2,0V10H8v4a1,1,0,0,0,2,0V4A.99974.99974,0,0,0,9,3Z\"/></svg>";
var header6Icon = "<svg viewBox=\"0 0 18 18\"><path class=\"ql-fill\" d=\"M14.51758,9.64453a1.85627,1.85627,0,0,0-1.24316.38477H13.252a1.73532,1.73532,0,0,1,1.72754-1.4082,2.66491,2.66491,0,0,1,.5498.06641c.35254.05469.57227.01074.70508-.40723l.16406-.5166a.53393.53393,0,0,0-.373-.75977,4.83723,4.83723,0,0,0-1.17773-.14258c-2.43164,0-3.7627,2.17773-3.7627,4.43359,0,2.47559,1.60645,3.69629,3.19043,3.69629A2.70585,2.70585,0,0,0,16.96,12.19727,2.43861,2.43861,0,0,0,14.51758,9.64453Zm-.23047,3.58691c-.67187,0-1.22168-.81445-1.22168-1.45215,0-.47363.30762-.583.72559-.583.96875,0,1.27734.59375,1.27734,1.12207A.82182.82182,0,0,1,14.28711,13.23145ZM10,4V14a1,1,0,0,1-2,0V10H3v4a1,1,0,0,1-2,0V4A1,1,0,0,1,3,4V8H8V4a1,1,0,0,1,2,0Z\"/></svg>";
var italicIcon = "<svg viewbox=\"0 0 18 18\"><line class=\"ql-stroke\" x1=\"7\" x2=\"13\" y1=\"4\" y2=\"4\"/><line class=\"ql-stroke\" x1=\"5\" x2=\"11\" y1=\"14\" y2=\"14\"/><line class=\"ql-stroke\" x1=\"8\" x2=\"10\" y1=\"14\" y2=\"4\"/></svg>";
var imageIcon = "<svg viewbox=\"0 0 18 18\"><rect class=\"ql-stroke\" height=\"10\" width=\"12\" x=\"3\" y=\"4\"/><circle class=\"ql-fill\" cx=\"6\" cy=\"7\" r=\"1\"/><polyline class=\"ql-even ql-fill\" points=\"5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12\"/></svg>";
var indentIcon = "<svg viewbox=\"0 0 18 18\"><line class=\"ql-stroke\" x1=\"3\" x2=\"15\" y1=\"14\" y2=\"14\"/><line class=\"ql-stroke\" x1=\"3\" x2=\"15\" y1=\"4\" y2=\"4\"/><line class=\"ql-stroke\" x1=\"9\" x2=\"15\" y1=\"9\" y2=\"9\"/><polyline class=\"ql-fill ql-stroke\" points=\"3 7 3 11 5 9 3 7\"/></svg>";
var outdentIcon = "<svg viewbox=\"0 0 18 18\"><line class=\"ql-stroke\" x1=\"3\" x2=\"15\" y1=\"14\" y2=\"14\"/><line class=\"ql-stroke\" x1=\"3\" x2=\"15\" y1=\"4\" y2=\"4\"/><line class=\"ql-stroke\" x1=\"9\" x2=\"15\" y1=\"9\" y2=\"9\"/><polyline class=\"ql-stroke\" points=\"5 7 5 11 3 9 5 7\"/></svg>";
var linkIcon = "<svg viewbox=\"0 0 18 18\"><line class=\"ql-stroke\" x1=\"7\" x2=\"11\" y1=\"7\" y2=\"11\"/><path class=\"ql-even ql-stroke\" d=\"M8.9,4.577a3.476,3.476,0,0,1,.36,4.679A3.476,3.476,0,0,1,4.577,8.9C3.185,7.5,2.035,6.4,4.217,4.217S7.5,3.185,8.9,4.577Z\"/><path class=\"ql-even ql-stroke\" d=\"M13.423,9.1a3.476,3.476,0,0,0-4.679-.36,3.476,3.476,0,0,0,.36,4.679c1.392,1.392,2.5,2.542,4.679.36S14.815,10.5,13.423,9.1Z\"/></svg>";
var listBulletIcon = "<svg viewbox=\"0 0 18 18\"><line class=\"ql-stroke\" x1=\"6\" x2=\"15\" y1=\"4\" y2=\"4\"/><line class=\"ql-stroke\" x1=\"6\" x2=\"15\" y1=\"9\" y2=\"9\"/><line class=\"ql-stroke\" x1=\"6\" x2=\"15\" y1=\"14\" y2=\"14\"/><line class=\"ql-stroke\" x1=\"3\" x2=\"3\" y1=\"4\" y2=\"4\"/><line class=\"ql-stroke\" x1=\"3\" x2=\"3\" y1=\"9\" y2=\"9\"/><line class=\"ql-stroke\" x1=\"3\" x2=\"3\" y1=\"14\" y2=\"14\"/></svg>";
var listCheckIcon = "<svg class=\"\" viewbox=\"0 0 18 18\"><line class=\"ql-stroke\" x1=\"9\" x2=\"15\" y1=\"4\" y2=\"4\"/><polyline class=\"ql-stroke\" points=\"3 4 4 5 6 3\"/><line class=\"ql-stroke\" x1=\"9\" x2=\"15\" y1=\"14\" y2=\"14\"/><polyline class=\"ql-stroke\" points=\"3 14 4 15 6 13\"/><line class=\"ql-stroke\" x1=\"9\" x2=\"15\" y1=\"9\" y2=\"9\"/><polyline class=\"ql-stroke\" points=\"3 9 4 10 6 8\"/></svg>";
var listOrderedIcon = "<svg viewbox=\"0 0 18 18\"><line class=\"ql-stroke\" x1=\"7\" x2=\"15\" y1=\"4\" y2=\"4\"/><line class=\"ql-stroke\" x1=\"7\" x2=\"15\" y1=\"9\" y2=\"9\"/><line class=\"ql-stroke\" x1=\"7\" x2=\"15\" y1=\"14\" y2=\"14\"/><line class=\"ql-stroke ql-thin\" x1=\"2.5\" x2=\"4.5\" y1=\"5.5\" y2=\"5.5\"/><path class=\"ql-fill\" d=\"M3.5,6A0.5,0.5,0,0,1,3,5.5V3.085l-0.276.138A0.5,0.5,0,0,1,2.053,3c-0.124-.247-0.023-0.324.224-0.447l1-.5A0.5,0.5,0,0,1,4,2.5v3A0.5,0.5,0,0,1,3.5,6Z\"/><path class=\"ql-stroke ql-thin\" d=\"M4.5,10.5h-2c0-.234,1.85-1.076,1.85-2.234A0.959,0.959,0,0,0,2.5,8.156\"/><path class=\"ql-stroke ql-thin\" d=\"M2.5,14.846a0.959,0.959,0,0,0,1.85-.109A0.7,0.7,0,0,0,3.75,14a0.688,0.688,0,0,0,.6-0.736,0.959,0.959,0,0,0-1.85-.109\"/></svg>";
var subscriptIcon = "<svg viewbox=\"0 0 18 18\"><path class=\"ql-fill\" d=\"M15.5,15H13.861a3.858,3.858,0,0,0,1.914-2.975,1.8,1.8,0,0,0-1.6-1.751A1.921,1.921,0,0,0,12.021,11.7a0.50013,0.50013,0,1,0,.957.291h0a0.914,0.914,0,0,1,1.053-.725,0.81,0.81,0,0,1,.744.762c0,1.076-1.16971,1.86982-1.93971,2.43082A1.45639,1.45639,0,0,0,12,15.5a0.5,0.5,0,0,0,.5.5h3A0.5,0.5,0,0,0,15.5,15Z\"/><path class=\"ql-fill\" d=\"M9.65,5.241a1,1,0,0,0-1.409.108L6,7.964,3.759,5.349A1,1,0,0,0,2.192,6.59178Q2.21541,6.6213,2.241,6.649L4.684,9.5,2.241,12.35A1,1,0,0,0,3.71,13.70722q0.02557-.02768.049-0.05722L6,11.036,8.241,13.65a1,1,0,1,0,1.567-1.24277Q9.78459,12.3777,9.759,12.35L7.316,9.5,9.759,6.651A1,1,0,0,0,9.65,5.241Z\"/></svg>";
var superscriptIcon = "<svg viewbox=\"0 0 18 18\"><path class=\"ql-fill\" d=\"M15.5,7H13.861a4.015,4.015,0,0,0,1.914-2.975,1.8,1.8,0,0,0-1.6-1.751A1.922,1.922,0,0,0,12.021,3.7a0.5,0.5,0,1,0,.957.291,0.917,0.917,0,0,1,1.053-.725,0.81,0.81,0,0,1,.744.762c0,1.077-1.164,1.925-1.934,2.486A1.423,1.423,0,0,0,12,7.5a0.5,0.5,0,0,0,.5.5h3A0.5,0.5,0,0,0,15.5,7Z\"/><path class=\"ql-fill\" d=\"M9.651,5.241a1,1,0,0,0-1.41.108L6,7.964,3.759,5.349a1,1,0,1,0-1.519,1.3L4.683,9.5,2.241,12.35a1,1,0,1,0,1.519,1.3L6,11.036,8.241,13.65a1,1,0,0,0,1.519-1.3L7.317,9.5,9.759,6.651A1,1,0,0,0,9.651,5.241Z\"/></svg>";
var strikeIcon = "<svg viewbox=\"0 0 18 18\"><line class=\"ql-stroke ql-thin\" x1=\"15.5\" x2=\"2.5\" y1=\"8.5\" y2=\"9.5\"/><path class=\"ql-fill\" d=\"M9.007,8C6.542,7.791,6,7.519,6,6.5,6,5.792,7.283,5,9,5c1.571,0,2.765.679,2.969,1.309a1,1,0,0,0,1.9-.617C13.356,4.106,11.354,3,9,3,6.2,3,4,4.538,4,6.5a3.2,3.2,0,0,0,.5,1.843Z\"/><path class=\"ql-fill\" d=\"M8.984,10C11.457,10.208,12,10.479,12,11.5c0,0.708-1.283,1.5-3,1.5-1.571,0-2.765-.679-2.969-1.309a1,1,0,1,0-1.9.617C4.644,13.894,6.646,15,9,15c2.8,0,5-1.538,5-3.5a3.2,3.2,0,0,0-.5-1.843Z\"/></svg>";
var tableIcon = "<svg viewbox=\"0 0 18 18\"><rect class=\"ql-stroke\" height=\"12\" width=\"12\" x=\"3\" y=\"3\"/><rect class=\"ql-fill\" height=\"2\" width=\"3\" x=\"5\" y=\"5\"/><rect class=\"ql-fill\" height=\"2\" width=\"4\" x=\"9\" y=\"5\"/><g class=\"ql-fill ql-transparent\"><rect height=\"2\" width=\"3\" x=\"5\" y=\"8\"/><rect height=\"2\" width=\"4\" x=\"9\" y=\"8\"/><rect height=\"2\" width=\"3\" x=\"5\" y=\"11\"/><rect height=\"2\" width=\"4\" x=\"9\" y=\"11\"/></g></svg>";
var underlineIcon = "<svg viewbox=\"0 0 18 18\"><path class=\"ql-stroke\" d=\"M5,3V9a4.012,4.012,0,0,0,4,4H9a4.012,4.012,0,0,0,4-4V3\"/><rect class=\"ql-fill\" height=\"1\" rx=\"0.5\" ry=\"0.5\" width=\"12\" x=\"3\" y=\"15\"/></svg>";
var videoIcon = "<svg viewbox=\"0 0 18 18\"><rect class=\"ql-stroke\" height=\"12\" width=\"12\" x=\"3\" y=\"3\"/><rect class=\"ql-fill\" height=\"12\" width=\"1\" x=\"5\" y=\"3\"/><rect class=\"ql-fill\" height=\"12\" width=\"1\" x=\"12\" y=\"3\"/><rect class=\"ql-fill\" height=\"2\" width=\"8\" x=\"5\" y=\"8\"/><rect class=\"ql-fill\" height=\"1\" width=\"3\" x=\"3\" y=\"5\"/><rect class=\"ql-fill\" height=\"1\" width=\"3\" x=\"3\" y=\"7\"/><rect class=\"ql-fill\" height=\"1\" width=\"3\" x=\"3\" y=\"10\"/><rect class=\"ql-fill\" height=\"1\" width=\"3\" x=\"3\" y=\"12\"/><rect class=\"ql-fill\" height=\"1\" width=\"3\" x=\"12\" y=\"5\"/><rect class=\"ql-fill\" height=\"1\" width=\"3\" x=\"12\" y=\"7\"/><rect class=\"ql-fill\" height=\"1\" width=\"3\" x=\"12\" y=\"10\"/><rect class=\"ql-fill\" height=\"1\" width=\"3\" x=\"12\" y=\"12\"/></svg>";
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  align: {
    '': alignLeftIcon,
    center: alignCenterIcon,
    right: alignRightIcon,
    justify: alignJustifyIcon
  },
  background: backgroundIcon,
  blockquote: blockquoteIcon,
  bold: boldIcon,
  clean: cleanIcon,
  code: codeIcon,
  'code-block': codeIcon,
  color: colorIcon,
  direction: {
    '': directionLeftToRightIcon,
    rtl: directionRightToLeftIcon
  },
  formula: formulaIcon,
  header: {
    '1': headerIcon,
    '2': header2Icon,
    '3': header3Icon,
    '4': header4Icon,
    '5': header5Icon,
    '6': header6Icon
  },
  italic: italicIcon,
  image: imageIcon,
  indent: {
    '+1': indentIcon,
    '-1': outdentIcon
  },
  link: linkIcon,
  list: {
    bullet: listBulletIcon,
    check: listCheckIcon,
    ordered: listOrderedIcon
  },
  script: {
    sub: subscriptIcon,
    "super": superscriptIcon
  },
  strike: strikeIcon,
  table: tableIcon,
  underline: underlineIcon,
  video: videoIcon
});

/***/ }),

/***/ "./node_modules/quill/ui/picker.js":
/*!*****************************************!*\
  !*** ./node_modules/quill/ui/picker.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var DropdownIcon = "<svg viewbox=\"0 0 18 18\"><polygon class=\"ql-stroke\" points=\"7 11 9 13 11 11 7 11\"/><polygon class=\"ql-stroke\" points=\"7 7 9 5 11 7 7 7\"/></svg>";
var optionsCounter = 0;
function toggleAriaAttribute(element, attribute) {
  element.setAttribute(attribute, "" + !(element.getAttribute(attribute) === 'true'));
}
var Picker = /*#__PURE__*/function () {
  function Picker(select) {
    var _this = this;
    this.select = select;
    this.container = document.createElement('span');
    this.buildPicker();
    this.select.style.display = 'none';
    // @ts-expect-error Fix me later
    this.select.parentNode.insertBefore(this.container, this.select);
    this.label.addEventListener('mousedown', function () {
      _this.togglePicker();
    });
    this.label.addEventListener('keydown', function (event) {
      switch (event.key) {
        case 'Enter':
          _this.togglePicker();
          break;
        case 'Escape':
          _this.escape();
          event.preventDefault();
          break;
        default:
      }
    });
    this.select.addEventListener('change', this.update.bind(this));
  }
  var _proto = Picker.prototype;
  _proto.togglePicker = function togglePicker() {
    this.container.classList.toggle('ql-expanded');
    // Toggle aria-expanded and aria-hidden to make the picker accessible
    toggleAriaAttribute(this.label, 'aria-expanded');
    // @ts-expect-error
    toggleAriaAttribute(this.options, 'aria-hidden');
  };
  _proto.buildItem = function buildItem(option) {
    var _this2 = this;
    var item = document.createElement('span');
    // @ts-expect-error
    item.tabIndex = '0';
    item.setAttribute('role', 'button');
    item.classList.add('ql-picker-item');
    var value = option.getAttribute('value');
    if (value) {
      item.setAttribute('data-value', value);
    }
    if (option.textContent) {
      item.setAttribute('data-label', option.textContent);
    }
    item.addEventListener('click', function () {
      _this2.selectItem(item, true);
    });
    item.addEventListener('keydown', function (event) {
      switch (event.key) {
        case 'Enter':
          _this2.selectItem(item, true);
          event.preventDefault();
          break;
        case 'Escape':
          _this2.escape();
          event.preventDefault();
          break;
        default:
      }
    });
    return item;
  };
  _proto.buildLabel = function buildLabel() {
    var label = document.createElement('span');
    label.classList.add('ql-picker-label');
    label.innerHTML = DropdownIcon;
    // @ts-expect-error
    label.tabIndex = '0';
    label.setAttribute('role', 'button');
    label.setAttribute('aria-expanded', 'false');
    this.container.appendChild(label);
    return label;
  };
  _proto.buildOptions = function buildOptions() {
    var _this3 = this;
    var options = document.createElement('span');
    options.classList.add('ql-picker-options');

    // Don't want screen readers to read this until options are visible
    options.setAttribute('aria-hidden', 'true');
    // @ts-expect-error
    options.tabIndex = '-1';

    // Need a unique id for aria-controls
    options.id = "ql-picker-options-" + optionsCounter;
    optionsCounter += 1;
    this.label.setAttribute('aria-controls', options.id);

    // @ts-expect-error
    this.options = options;
    Array.from(this.select.options).forEach(function (option) {
      var item = _this3.buildItem(option);
      options.appendChild(item);
      if (option.selected === true) {
        _this3.selectItem(item);
      }
    });
    this.container.appendChild(options);
  };
  _proto.buildPicker = function buildPicker() {
    var _this4 = this;
    Array.from(this.select.attributes).forEach(function (item) {
      _this4.container.setAttribute(item.name, item.value);
    });
    this.container.classList.add('ql-picker');
    this.label = this.buildLabel();
    this.buildOptions();
  };
  _proto.escape = function escape() {
    var _this5 = this;
    // Close menu and return focus to trigger label
    this.close();
    // Need setTimeout for accessibility to ensure that the browser executes
    // focus on the next process thread and after any DOM content changes
    setTimeout(function () {
      return _this5.label.focus();
    }, 1);
  };
  _proto.close = function close() {
    this.container.classList.remove('ql-expanded');
    this.label.setAttribute('aria-expanded', 'false');
    // @ts-expect-error
    this.options.setAttribute('aria-hidden', 'true');
  };
  _proto.selectItem = function selectItem(item) {
    var trigger = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var selected = this.container.querySelector('.ql-selected');
    if (item === selected) return;
    if (selected != null) {
      selected.classList.remove('ql-selected');
    }
    if (item == null) return;
    item.classList.add('ql-selected');
    // @ts-expect-error Fix me later
    this.select.selectedIndex = Array.from(item.parentNode.children).indexOf(item);
    if (item.hasAttribute('data-value')) {
      // @ts-expect-error Fix me later
      this.label.setAttribute('data-value', item.getAttribute('data-value'));
    } else {
      this.label.removeAttribute('data-value');
    }
    if (item.hasAttribute('data-label')) {
      // @ts-expect-error Fix me later
      this.label.setAttribute('data-label', item.getAttribute('data-label'));
    } else {
      this.label.removeAttribute('data-label');
    }
    if (trigger) {
      this.select.dispatchEvent(new Event('change'));
      this.close();
    }
  };
  _proto.update = function update() {
    var option;
    if (this.select.selectedIndex > -1) {
      var item =
      // @ts-expect-error Fix me later
      this.container.querySelector('.ql-picker-options').children[this.select.selectedIndex];
      option = this.select.options[this.select.selectedIndex];
      // @ts-expect-error
      this.selectItem(item);
    } else {
      this.selectItem(null);
    }
    var isActive = option != null && option !== this.select.querySelector('option[selected]');
    this.label.classList.toggle('ql-active', isActive);
  };
  return Picker;
}();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Picker);

/***/ }),

/***/ "./node_modules/quill/ui/tooltip.js":
/*!******************************************!*\
  !*** ./node_modules/quill/ui/tooltip.js ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var isScrollable = function isScrollable(el) {
  var _getComputedStyle = getComputedStyle(el, null),
    overflowY = _getComputedStyle.overflowY;
  return overflowY !== 'visible' && overflowY !== 'clip';
};
var Tooltip = /*#__PURE__*/function () {
  function Tooltip(quill, boundsContainer) {
    var _this = this;
    this.quill = quill;
    this.boundsContainer = boundsContainer || document.body;
    this.root = quill.addContainer('ql-tooltip');
    // @ts-expect-error
    this.root.innerHTML = this.constructor.TEMPLATE;
    if (isScrollable(this.quill.root)) {
      this.quill.root.addEventListener('scroll', function () {
        _this.root.style.marginTop = -1 * _this.quill.root.scrollTop + "px";
      });
    }
    this.hide();
  }
  var _proto = Tooltip.prototype;
  _proto.hide = function hide() {
    this.root.classList.add('ql-hidden');
  };
  _proto.position = function position(reference) {
    var left = reference.left + reference.width / 2 - this.root.offsetWidth / 2;
    // root.scrollTop should be 0 if scrollContainer !== root
    var top = reference.bottom + this.quill.root.scrollTop;
    this.root.style.left = left + "px";
    this.root.style.top = top + "px";
    this.root.classList.remove('ql-flip');
    var containerBounds = this.boundsContainer.getBoundingClientRect();
    var rootBounds = this.root.getBoundingClientRect();
    var shift = 0;
    if (rootBounds.right > containerBounds.right) {
      shift = containerBounds.right - rootBounds.right;
      this.root.style.left = left + shift + "px";
    }
    if (rootBounds.left < containerBounds.left) {
      shift = containerBounds.left - rootBounds.left;
      this.root.style.left = left + shift + "px";
    }
    if (rootBounds.bottom > containerBounds.bottom) {
      var height = rootBounds.bottom - rootBounds.top;
      var verticalShift = reference.bottom - reference.top + height;
      this.root.style.top = top - verticalShift + "px";
      this.root.classList.add('ql-flip');
    }
    return shift;
  };
  _proto.show = function show() {
    this.root.classList.remove('ql-editing');
    this.root.classList.remove('ql-hidden');
  };
  return Tooltip;
}();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Tooltip);

/***/ }),

/***/ "./node_modules/eventemitter3/index.mjs":
/*!**********************************************!*\
  !*** ./node_modules/eventemitter3/index.mjs ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EventEmitter: () => (/* reexport default export from named module */ _index_js__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.js */ "./node_modules/eventemitter3/index.js");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_index_js__WEBPACK_IMPORTED_MODULE_0__);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!******************!*\
  !*** ./admin.ts ***!
  \******************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/common */ "./src/common/index.ts");
/* harmony import */ var _src_admin__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/admin */ "./src/admin/index.ts");


})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=admin.js.map