import React, { Component } from 'react';
import { withTheme } from '../core/theming';

const GH = require('react-native-gesture-handler');
const Animated = require('react-native-reanimated').default;

const { PanGestureHandler, State } = GH;

const {
  set,
  cond,
  eq,
  greaterThan,
  add,
  multiply,
  spring,
  startClock,
  and,
  divide,
  stopClock,
  clockRunning,
  sub,
  lessThan,
  defined,
  Value,
  Clock,
  event,
} = Animated;
function runSpring(clock, value, velocity, dest) {
  const state = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0),
  };
  const config = {
    damping: 15,
    mass: 0.7,
    stiffness: 221.6,
    overshootClamping: false,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
    toValue: new Value(0),
  };
  return [
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.velocity, velocity),
      set(state.position, value),
      set(config.toValue, dest),
      startClock(clock),
    ]),
    spring(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position,
  ];
}
class BottomSheetBehaviour extends Component {
  constructor(props) {
    super(props);
    this.contentHeight = new Value(0);
    const TOSS_SEC = 0.1;
    // const props.snapPoints = props.snapPoints.map(i => -i);
    const middlesOfSnapPoints = [];
    const reverted
    for (let i = 1; i < props.snapPoints.length; i++) {
      middlesOfSnapPoints.push(
        divide(add(props.snapPoints[i - 1] + props.snapPoints[i]), 2)
      );
    }
    const dragY = new Value(0);
    const state = new Value(-1);
    const dragVY = new Value(0);
    this._onGestureEvent = event([
      { nativeEvent: { translationY: dragY, velocityY: dragVY, state } },
    ]);
    const transY = new Value(this.props.snapPoints[this.props.initialPoint]);
    const prevDragY = new Value(0);
    const clock = new Clock();
    const destPoint = add(transY, multiply(TOSS_SEC, dragVY));

    const prepareCurrentSnapPoint = (i = 0) =>
      i + 1 === props.snapPoints.length
        ? props.snapPoints[i]
        : cond(
            lessThan(destPoint, middlesOfSnapPoints[i]),
            props.snapPoints[i],
            prepareCurrentSnapPoint(i + 1)
          );
    const snapPoint = prepareCurrentSnapPoint();
    const calledInCurrentBatch = new Value(0);
    this._transY = cond(
      eq(state, State.ACTIVE),
      [
        stopClock(clock),
        set(
          transY,
          cond(
            lessThan(transY, props.snapPoints[0]),
            props.snapPoints[0],
            add(transY, sub(dragY, prevDragY))
          )
        ),
        set(prevDragY, dragY),
        cond(
          lessThan(transY, props.snapPoints[0]),
          [
            cond(calledInCurrentBatch, 0, [set(calledInCurrentBatch, 1)]),
            props.snapPoints[0],
          ],
          transY
        ),
      ],
      [
        set(prevDragY, 0),
        set(
          transY,
          cond(
            and(defined(transY), greaterThan(transY, props.snapPoints[0])),
            runSpring(clock, transY, dragVY, snapPoint),
            props.snapPoints[0]
          )
        ),
      ]
    );
  }
  render() {
    const { children, containerStyle: style, ...rest } = this.props;
    return (
      <PanGestureHandler
        {...rest}
        onGestureEvent={this._onGestureEvent}
        onHandlerStateChange={this._onGestureEvent}
      >
        <Animated.View
          onLayout={Animated.event([
            { nativeEvent: {
              layout: {
                height: this.contentHeight
              }
            }}
          ])}
          style={[{ transform: [{ translateY: this._transY }], position: 'absolute', right:0 , left: 0, bottom: 0, zIndex: 10 }, style]}
        >
          {children}
        </Animated.View>
      </PanGestureHandler>
    );
  }
}

export default withTheme(BottomSheetBehaviour);
