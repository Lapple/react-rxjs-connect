# React-RxJS connect

Wraps React components and renders them with latest values from RxJS observables:

```js
import React from 'react';
import connect from 'react-rxjs-connect';

import unreadMessages from '../observables/unread-messages';

class MessageCounter extends React.Component {
    render() {
        return <div className='message-counter'>
            { this.props.count }
        </div>;
    }
}

export default connect(MessageCounter, {
    count: unreadMessages.map(messages => messages.length)
});
```

### API

#### `connect(Component, observablesToPropsMap)`

Returns a wrapped component, that maps observable values to `Component` props. The keys on
`observablesToPropsMap` object are target prop names, while corresponding values are the
subscribed observables.

```js
const ConnectedComponent = connect(Component, { propName: observable });
```
