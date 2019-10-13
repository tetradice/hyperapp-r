# Hyperapp-R

Hyperapp-R is fork from [Hyperapp V2](https://github.com/jorgebucaran/hyperapp).

(Version note: Hyperapp-R 2.0.3 = Hyperapp 2.0.2)

## Features

- 99% backword compatibility -- Libraries and middleware for Hyperapp V2 can be used in Hyperapp-R as well
- Return of functions from Hyperapp V1
    - Ressurection of DOM event handlers -- oncreate, onupdate, onremove, ondestroy
    - Ressurection of style attribute by string -- `<div style="margin-top: 10em;"></div>`
- TypeScript full support
- Small change
    - Distribution package uses Common JS format instead of ES Module (This will avoid errors when using tools like jest)

## Install

```sh
# for NPM
$ npm install --save-dev hyperapp-r

# for Yarn
$ yarn add -D hyperapp-r
```

The related library can be installed as follows.

```sh
# for NPM
$ npm install --save-dev @hyperapp-r/events

# for Yarn
$ yarn add -D @hyperapp-r/events
```

## Start Guide

All you have to do after installation is replace `hyperapp` with `hyperapp-r`.

```js
// Before:
import { app, h } from "hyperapp-r"
import { preventDefault } from "@hyperapp/events"

// After:
import { app, h } from "hyperapp-r"
import { preventDefault } from "@hyperapp-r/events"
```

`hyperapp-r` and `@hyperapp-r/xxx` has the same interface as hyperapp V2. So if you replace the module name, it will work exactly the same.

If you are using a library for hyperapp V2, you can leave the name as it is. The library for hyperapp V2 works the same way in Hyperapp-R.

```js
import { app, h } from "hyperapp-r"
import { component } from "hyperapp-component" // As it is
```

## Additional functions

### Lifecycle Events (Return from Hyperapp V1)

As with V1, You can be notified when elements managed by the virtual DOM are created, updated or removed via lifecycle events. Use them for animation, data fetching, wrapping third-party libraries, cleaning up resources, etc.

Note that lifecycle events are attached to virtual DOM nodes, not to components. Consider adding a key to ensure that the event is attached to a specific DOM element, rather than a recycled one.

In addition, as an original function of Hyperapp-R, it is possible to set an event with another name.

- oncreate -> created
- onupdate -> updated
- onremove -> removing
- ondestroy -> destroyed

This is because in Hyperapp-R, you can use Action in event handlers such as `onclick` or `onchange`, but you cannot use Action in lifecycle events such as `oncreate` or `onupdate`, and you can use only functions that receive DOM elements. In other words, it is not possible to update State or execute Effect in lifecycle events.

#### oncreate (alias: created)

This event is fired after the element is created and attached to the DOM. Use it to manipulate the DOM node directly, make a network request, create a slide/fade in animation, etc.

```jsx
import { h } from "hyperapp-r"

export const Textbox = ({ placeholder }) => (
  <input
    type="text"
    placeholder={placeholder}
    oncreate={element => element.focus()}
  />
)
```

#### onupdate (alias: updated)

This event is fired every time we update the element attributes. Use <samp>oldAttributes</samp> inside the event handler to check if any attributes changed or not.

```jsx
import { h } from "hyperapp-r"

export const Textbox = ({ placeholder }) => (
  <input
    type="text"
    placeholder={placeholder}
    onupdate={(element, oldAttributes) => {
      if (oldAttributes.placeholder !== placeholder) {
        // Handle changes here!
      }
    }}
  />
)
```

#### onremove (alias: removing)

This event is fired before the element is removed from the DOM. Use it to create slide/fade out animations. Call <samp>done</samp> inside the function to remove the element. This event is not called in its child elements.

```jsx
import { h } from "hyperapp-r"

export const MessageWithFadeout = ({ title }) => (
  <div onremove={(element, done) => fadeout(element).then(done)}>
    <h1>{title}</h1>
  </div>
)
```

#### ondestroy (alias: destroyed)

This event is fired after the element has been removed from the DOM, either directly or as a result of a parent being removed. Use it for invalidating timers, canceling a network request, removing global events listeners, etc.

```jsx
import { h } from "hyperapp-r"

export const Camera = ({ onerror }) => (
  <video
    poster="loading.png"
    oncreate={element => {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(stream => (element.srcObject = stream))
        .catch(onerror)
    }}
    ondestroy={element => element.srcObject.getTracks()[0].stop()}
  />
)
```

### Style attribute by string (Return from Hyperapp V1)

As with V1, the style attribute value can be specified as a string.

```jsx
// Standard
<div style={{color: "red", textAlign: "center"}} />

// It is an error in Hyperapp V2, but it is accepted in Hyperapp-R
<div style="color: red; text-align: center;" />      
```


## TypeScript Support

Hyperapp-R has full support for TypeScript.

```tsx
import { Action, EffectRunner, Dispatchable, Effect, app, h } from "hyperapp-r";

type State = number;

// Action without payload - Action<State>
const Decrement1: Action<State> = (state) => (state - 1);

// Action with payload - Action<State, Payload>
const Increment: Action<State, number> = (state, value) => (state + value);

// Return other Action
const Increment1: Action<State> = (state) => ([Increment, 1]);

// Effect Runner - EffectRunner<State, NextPayload, Props>
const TimeoutRunner: EffectRunner<State, void, {delay: number, action: Dispatchable<State>}> = (dispatch, props) => {
  setTimeout(() => dispatch(props.action));
}

// Effect
const timeout = (action: Dispatchable<State>, delay: number): Effect<State> => [TimeoutRunner, {delay: delay, action: action}]

// Action with Effect
const DelayedIncrement1: Action<State> = (state) => ([state, timeout(Increment1, 1000)]);

// app
app<State>({
    init: 0
  , view: (state) => (
      <div>
        <h2>{state}</h2>
        <button onclick={Decrement1}>-1</button>
        <button onclick={Increment1}>+1</button>
        <button onclick={DelayedIncrement1}>Delayed +1</button>
      </div>
    )
  , node: document.getElementById("app")!
});
```


