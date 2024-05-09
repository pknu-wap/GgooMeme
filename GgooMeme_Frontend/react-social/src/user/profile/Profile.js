import React, { Component } from 'react';
import './Profile.css';

class Profile extends Component {
    constructor(props) {
        super(props);
        console.log(props);
    }
    render() {
        return (
            <div className="profile-container">
                <div className="container">
                    <div className="profile-info">
                        <div className="profile-avatar">
                            { 
                                this.props.currentUser && this.props.currentUser.imageUrl ? (
                                    <img src={this.props.currentUser.imageUrl} alt={this.props.currentUser.name}/>
                                ) : (
                                    <div className="text-avatar">
                                        <span>{this.props.currentUser && this.props.currentUser.name ? this.props.currentUser.name : ""}</span>
                                    </div>
                                )
                            }
                        </div>
                        <div className="profile-name">
                           <h2>{this.props.currentUser && this.props.currentUser.name ? this.props.currentUser.name : "avatar"}님, 안녕하세요</h2>
                           <p className="profile-email">{this.props.currentUser && this.props.currentUser.email ? this.props.currentUser.email : ""}</p>
                        </div>
                    </div>
                </div>    
            </div>
        );
    }
}

export default Profile