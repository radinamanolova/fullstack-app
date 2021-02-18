import React, { Component } from "react";
import { connect } from "react-redux";
import { postNewMessage } from "../store/actions/messages";

class MessageForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            message: ""
        };
    }

    handleNewMessage = event => {
       event.preventDefault();
       this.props.postNewMessage(this.state.message);
       this.setState({ message: "" });
       this.props.history.push("/");
    };

    render(){
        return(
            <form onSubmit={this.handleNewMessage}>
                {this.props.errors.message && (
                    <div className="alert alert-danger">
                        {this.props.errors.message}
                    </div>
                )}
                <label htmlFor="newMessage">New Messsage:</label>
                <input 
                    type="text" 
                    autoComplete="off"
                    id="newMessage"
                    className="form-control" 
                    value={this.state.message} 
                    onChange={e => this.setState({ message: e.target.value })} 
                />
                <button className="btn btn-success" type="submit">
                    Add new message
                </button>
            </form>
        );
    }
}

function mapStateToProps(state){
    return{
        errors: state.errors
    };
}

export default connect(mapStateToProps, { postNewMessage })(MessageForm);