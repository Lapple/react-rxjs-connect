import { Component, createElement } from 'react';

const EMPTY_LIST = [];

export default function connect(WrappedComponent, observablesToPropsMap) {
    const subscriptions = Object.keys(observablesToPropsMap).map(propertyName => {
        return {
            propertyName,
            observable: observablesToPropsMap[propertyName]
        };
    });

    class Connect extends Component {
        constructor(props) {
            super(props);

            this.state = {};
            this.readings = EMPTY_LIST;

            // Wait until the component is mounted before attempting to
            // subscribe to observables.
            this.subscribeRequest = requestAnimationFrame(() => {
                this.subscribe(subscriptions);
            });
        }
        componentWillUnmount() {
            cancelAnimationFrame(this.subscribeRequest);
            this.unsubscribe();
        }
        subscribe(subscriptions) {
            this.readings = subscriptions.map(subscription => {
                const { propertyName, observable } = subscription;

                return observable.subscribe(value => {
                    this.setState({
                        [propertyName]: value
                    });
                });
            });
        }
        unsubscribe() {
            this.readings.forEach(reading => reading.dispose());
        }
        render() {
            const observableProps = subscriptions.reduce((props, { propertyName }) => {
                props[propertyName] = this.state[propertyName];
                return props;
            }, {});

            const props = Object.assign({}, this.props, observableProps);

            if (Component.isPrototypeOf(WrappedComponent)) {
                return createElement(WrappedComponent, props);
            } else {
                return WrappedComponent(props);
            }
        }
    };

    Connect.displayName = `RxConnect(${getDisplayName(WrappedComponent)})`;

    return Connect;
};

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
