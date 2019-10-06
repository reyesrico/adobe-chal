import React, { Component } from 'react';
import { indexOf, reduce, sortBy } from 'lodash';
import file from './leads[1][1][1]';
import './App.css';

class App extends Component {
  state = {
    identicalRecords: 0
  }

  deDuplicate = () => {
    const { identicalRecords } = this.state;
    let log = [];

    if (identicalRecords === 0) {
      return { records: file.leads, log };
    } 

    const records = reduce(file.leads, (acc, record) => {
      if (!acc.length) {
        log.push(`Registering record: ${this.displayRecord(record)}`);
        acc.push(record);
      } else {
        const ids = acc.filter(r => r._id === record._id);
        const emails = acc.filter(r => r.email === record.email);

        if (ids.length < identicalRecords && emails.length < identicalRecords) {
          log.push(`Registering record: ${this.displayRecord(record)}`);
          acc.push(record);
        } else {
          const min = sortBy([...ids, ...emails], r => r.entryDate)[0];
          const index = indexOf(acc, min);
          if (min && record.entryDate > min.entryDate) {
            //acc[index] = record;  // Swap 
            log.push(`Taking out record: ${this.displayRecord(min)}`);
            acc.splice(index, 1);   // Take out and place where it belongs the record
            log.push(`Registering record: ${this.displayRecord(record)}`);
            acc.push(record);
          }
        }
      }
      return acc;
    }, []);

    return { records, log };
  }

  displayRecord = record => {
    return `${record._id}: ${record.email} (${record.firstName} ${record.lastName})
      Date: ${record.entryDate}`;
  }
  
  isTakingOutLog = info => {
    return info.includes('Taking out');
  }

  renderLog = log => {
    return log.length && (
      <div>
        <h2 className="app__log-title">Log</h2>
        <div className="app__log">
        { log.map((info, index) => <div class={`app_log-record ${this.isTakingOutLog(info) ? 'app__warning' : ''}`} key={index}>{info}</div>) }
        </div>
      </div>
    );
  }

  render() {
    const { identicalRecords } = this.state;
    const { records, log } = this.deDuplicate();

    return (
      <div className="app">
        <h3>
          <span>Select # of identical records: </span>
          <select value={identicalRecords} onChange={event => this.setState({ identicalRecords: event.target.value })}>
            <option value="0">Original</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </h3>
        <hr />
        <h2 className="app__record-title">Records</h2>
        <div className="app__records">
        {
          records.map((record, index) => {
            return (
              <div className="app__record" key={index}>
                <div class="app__id">Id: {record._id} </div>
                <div class="app__email">Email: {record.email} </div>
                <div>First Name: {record.firstName} </div>
                <div>Last Name: {record.lastName} </div>
                <div>Address: {record.address} </div>
                <div>Date: {record.entryDate}</div>
              </div>
            )
          })
        }
        </div>
        <hr />
        { this.renderLog(log) }
      </div>
    );
  }
}

export default App;
