import React, { Component } from 'react';
import axios from 'axios';
import './body.css';
import wait from '../images/WaitPlease.gif'
export default class Body extends Component {
    constructor(){
        super();
        this.state={
            input:'',
            data:[],
            name:'',
            isWait:true,
            isData:false,
            total:0,
            info:''
        }
        this.sendRequest = this.sendRequest.bind(this);
        this.makeTable = this.makeTable.bind(this);
        this.clear = this.clear.bind(this);
    }
    sendRequest(){
        /* Send the request to server and receive response */
        this.clear();
        this.setState({
            isWait:false
        });
        axios.get(`http://localhost:4000/station?id=${this.state.input}`).then(
            (response)=>{
                this.makeTable(response.data.data,response.data.uName,response.data.info);
            }
        ).
        catch(
            (error)=>{
                alert('Try again');
                this.setState({
                   isWait:true
                });
            }
        );
    }
    makeTable(val,name,info){
        var tbArr = [];
        val.forEach((value,index)=>{
            tbArr.push(<td>{value}</td>);
            if((index+1)%10==0){
              tbArr.push(<tr></tr>);
            }
        });
        this.setState({
            data:tbArr,
            name:name,
            isWait:true,
            isData:true,
            total:val.length,
            info:info
        });
    }
    clear(){
        this.setState({
            data:[],
            name:'',
            isWait:true,
            input:'',
            isData:false,
            total:0
        });
    }
    render() {
        return (
            <div className="body-sec">
                {
                this.state.isWait===false &&
                <div className="waiting">
                    <img src={wait}></img>
                </div>
                }
                <div className="header">
                    <p>Uri Online Judge: Solve Counter</p>
                </div>
                <div className="part-one">
                     <div className="left">
                         <button>Share</button>
                         <button onClick={this.clear}>Clear</button>
                     </div>
                     <div className="right">
                          <input type="text" value={this.state.input} placeholder="Profile Id"  onChange={(e)=>{
                              //update the state value after every change into input.
                              this.setState({
                                 input:e.target.value
                              });
                          }}></input>
                          <button onClick={this.sendRequest}>Search</button>
                     </div>
                </div>
                { this.state.isData===true &&
                <div className="part-two">
                     <div className="display-content">
                         <div className="name-sec">
                             <span className="info-sec">
                             <h2>Profile Name : <b style={{color:'#F5EEF8'}}>{unescape(this.state.name)}</b></h2>
                              <h2>|</h2>
                             <h2>Total Solved : <b style={{color:'#F5EEF8'}}>{this.state.total}</b></h2>
                             </span>
                         </div>
                         <div className="data-sec">
                             <table>
                                 <thead>
                                     <tr>
                                      <td colspan="10">Solved Id</td>
                                     </tr>
                                 </thead>
                                <tbody>
                                  {this.state.data}
                                </tbody>
                             </table>
                         </div>
                     </div>
                </div>
                }
            </div>
        )
    }
}
