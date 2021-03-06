import React, { Component } from 'react';
import Team from '../containers/Team';
import Board from '../containers/Board';
import Task from '../containers/TaskView';
import User from './UserView';

export default class Content extends Component {
  drawChild() {
    switch (this.props.activeTab.type) {
      case 'board':
        return (<Board />);
      case 'task':
        return (<Task id={this.props.activeTab.id} />);
      case 'user':
        return (<User />);
      default:
        return (<Team />);
    }
  }

  render() {
    return this.drawChild();
  }
}
